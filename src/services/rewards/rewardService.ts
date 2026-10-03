import { Wallet, PointTransaction, Reward, RedemptionResult } from '../../types';
import { mockWallet, mockTransactions, mockRewards } from '../../mock/rewards';
import { apiClient } from '../api/apiClient';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

// Stateful mock in-memory ledger
let runtimeWallet: Wallet = { ...mockWallet };
let runtimeTransactions: PointTransaction[] = [...mockTransactions];

class RewardService {
  public async getWallet(): Promise<Wallet> {
    if (IS_DEMO_MODE) {
      return { ...runtimeWallet };
    }
    return await apiClient.get<Wallet>('/wallet');
  }

  public async getTransactions(): Promise<PointTransaction[]> {
    if (IS_DEMO_MODE) {
      return [...runtimeTransactions];
    }
    return await apiClient.get<PointTransaction[]>('/wallet/transactions');
  }

  public async getRewards(): Promise<Reward[]> {
    if (IS_DEMO_MODE) {
      return [...mockRewards];
    }
    return await apiClient.get<Reward[]>('/rewards');
  }

  /**
   * Redeems a reward
   * Security architecture: Atomic validation on backend prevents double-spending and ensures non-negative balance.
   */
  public async redeemReward(rewardId: string): Promise<RedemptionResult> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 450));
      const reward = mockRewards.find((rw) => rw.id === rewardId);
      if (!reward) {
        throw new Error('Reward not found or no longer available.');
      }

      if (runtimeWallet.balance < reward.costPoints) {
        throw new Error(`Insufficient TunePoints. You need ${reward.costPoints - runtimeWallet.balance} more TP to redeem this item.`);
      }

      // Deduct atomically
      runtimeWallet.balance -= reward.costPoints;
      runtimeWallet.lifetimeRedeemed += reward.costPoints;

      const newTx: PointTransaction = {
        id: `tx-red-${Date.now()}`,
        type: 'redemption',
        amount: -reward.costPoints,
        description: `Redeemed ${reward.title}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };

      runtimeTransactions = [newTx, ...runtimeTransactions];

      return {
        success: true,
        transactionId: newTx.id,
        rewardId: reward.id,
        rewardTitle: reward.title,
        pointsDeducted: reward.costPoints,
        remainingBalance: runtimeWallet.balance,
        message: `Congratulations! ${reward.title} has been successfully activated on your account.`,
        activatedUntil: reward.durationDays
          ? new Date(Date.now() + reward.durationDays * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      };
    }

    return await apiClient.post<RedemptionResult>(`/rewards/${rewardId}/redeem`);
  }

  /**
   * Internal/Server point crediting
   */
  public async recordPointReward(
    points: number,
    reason: string,
    type: PointTransaction['type'] = 'QUIZ_REWARD'
  ): Promise<void> {
    if (IS_DEMO_MODE) {
      runtimeWallet.balance += points;
      runtimeWallet.thisWeekEarned += points;
      runtimeWallet.lifetimeEarned += points;

      const tx: PointTransaction = {
        id: `tx-earn-${Date.now()}`,
        type,
        amount: points,
        description: reason,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };
      runtimeTransactions = [tx, ...runtimeTransactions];
      return;
    }

    // Handled purely on backend in production
  }
}

export const rewardService = new RewardService();
