import { Wallet, PointTransaction, Reward, RedemptionResult } from '../../types';
import rewardsJson from '../../data/rewards.json';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../../utils/storage';
import { authService } from '../auth/authService';

export const ALL_REWARDS: Reward[] = [
  {
    id: 'rew-disc-10',
    title: '10% Premium Discount',
    description: 'Get an instant 10% discount on any TuneQuest premium subscription plan.',
    costPoints: 100,
    category: 'premium',
    icon: 'Zap',
    unlockedFeatures: [
      '10% OFF any premium plan',
      'Immediate activation',
      'Stackable with student perks',
    ],
    bannerGradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'rew-disc-20',
    title: '20% Premium Discount',
    description: 'Get a generous 20% discount on any TuneQuest premium subscription pass.',
    costPoints: 200,
    popular: true,
    category: 'premium',
    icon: 'Sparkles',
    unlockedFeatures: [
      '20% OFF any premium plan',
      'Immediate activation',
      'Priority streaming bitrate',
    ],
    bannerGradient: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'rew-disc-30',
    title: '30% Premium Discount',
    description: 'Our highest tier discount: 30% OFF premium access for dedicated trivia masters.',
    costPoints: 300,
    category: 'premium',
    icon: 'Crown',
    unlockedFeatures: [
      '30% OFF any premium plan',
      'Immediate activation',
      'VIP badge status',
    ],
    bannerGradient: 'from-fuchsia-600 to-pink-600',
  },
  ...(rewardsJson.rewards as Reward[]),
];

class RewardService {
  /**
   * Retrieves the wallet balance and stats for the active user from localStorage
   */
  public async getWallet(): Promise<Wallet> {
    const currentUser = await authService.getCurrentUser();
    const balance = currentUser ? currentUser.tunePoints : 0;
    const transactions = await this.getTransactions();

    let lifetimeEarned = 0;
    let lifetimeRedeemed = 0;
    let thisWeekEarned = 0;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const tx of transactions) {
      if (tx.amount > 0) {
        lifetimeEarned += tx.amount;
        const txTime = new Date(tx.timestamp).getTime();
        if (txTime >= oneWeekAgo) {
          thisWeekEarned += tx.amount;
        }
      } else if (tx.amount < 0) {
        lifetimeRedeemed += Math.abs(tx.amount);
      }
    }

    return {
      balance,
      thisWeekEarned: thisWeekEarned || (currentUser?.level ? currentUser.level * 40 : 0),
      lifetimeEarned: lifetimeEarned || balance,
      lifetimeRedeemed,
      currencyName: 'TunePoints',
      currencySymbol: 'TP',
    };
  }

  /**
   * Gets point transactions for the active user from localStorage
   */
  public async getTransactions(): Promise<PointTransaction[]> {
    const currentUser = await authService.getCurrentUser();
    const allTx = getStorageItem<PointTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);

    if (!currentUser) return [];

    // Filter by user ID (or fallback to legacy items without userId for primary user)
    const userTx = allTx.filter((t) => t.userId === currentUser.id || (!t.userId && currentUser.id === 'usr_music_explorer_01'));

    return userTx.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Gets all available rewards in the store
   */
  public async getRewards(): Promise<Reward[]> {
    return ALL_REWARDS;
  }

  /**
   * Redeems a reward for the active user, deducts points, and updates discount/state in localStorage
   */
  public async redeemReward(rewardId: string): Promise<RedemptionResult> {
    await new Promise((r) => setTimeout(r, 300));
    const currentUser = await authService.getCurrentUser();

    if (!currentUser) {
      throw new Error('Please sign in to redeem rewards.');
    }

    const reward = ALL_REWARDS.find((rw) => rw.id === rewardId);
    if (!reward) {
      throw new Error('Reward not found or no longer available.');
    }

    if (currentUser.tunePoints < reward.costPoints) {
      throw new Error('Not enough TunePoints. Keep playing quizzes to earn more TP!');
    }

    // 1. Deduct points from user
    const newBalance = await authService.updateUserPoints(currentUser.id, -reward.costPoints);

    // 2. Check and apply premium discount
    let discountPercent = 0;
    if (reward.id === 'rew-disc-10' || reward.title.includes('10%')) discountPercent = 10;
    else if (reward.id === 'rew-disc-20' || reward.title.includes('20%')) discountPercent = 20;
    else if (reward.id === 'rew-disc-30' || reward.title.includes('30%')) discountPercent = 30;

    if (discountPercent > 0) {
      await authService.setPremiumDiscount(currentUser.id, discountPercent);
    }

    // 3. Record transaction in localStorage
    const allTx = getStorageItem<PointTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const newTx: PointTransaction = {
      id: `tx-red-${Date.now()}`,
      userId: currentUser.id,
      type: 'REWARD_REDEMPTION',
      amount: -reward.costPoints,
      description: `Redeemed ${reward.title}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };

    allTx.unshift(newTx);
    setStorageItem(STORAGE_KEYS.TRANSACTIONS, allTx);

    return {
      success: true,
      transactionId: newTx.id,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsDeducted: reward.costPoints,
      remainingBalance: newBalance,
      message: `Congratulations! ${reward.title} has been successfully activated on your account.`,
      activatedUntil: reward.durationDays
        ? new Date(Date.now() + reward.durationDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    };
  }

  /**
   * Add point rewards (from quizzes, daily challenges, referrals) to localStorage
   */
  public async recordPointReward(
    points: number,
    reason: string,
    type: PointTransaction['type'] = 'QUIZ_REWARD',
    targetUserId?: string
  ): Promise<void> {
    const currentUser = await authService.getCurrentUser();
    const userId = targetUserId || currentUser?.id;
    if (!userId) return;

    await authService.updateUserPoints(userId, points);

    const allTx = getStorageItem<PointTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const tx: PointTransaction = {
      id: `tx-earn-${Date.now()}`,
      userId,
      type,
      amount: points,
      description: reason,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };

    allTx.unshift(tx);
    setStorageItem(STORAGE_KEYS.TRANSACTIONS, allTx);
  }
}

export const rewardService = new RewardService();
