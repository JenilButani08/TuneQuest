import { ReferralStats, ReferralHistoryItem, User, PointTransaction } from '../../types';
import { STORAGE_KEYS, getStorageItem, POINTS } from '../../utils/storage';
import { authService } from '../auth/authService';

class ReferralService {
  /**
   * Fetches the logged in user's active referral code
   */
  public async getMyReferralCode(): Promise<string> {
    const user = await authService.getCurrentUser();
    return user?.referralCode || 'TUNE-A7K92X';
  }

  /**
   * Validates a referral code during signup UX
   */
  public async validateCode(code: string): Promise<{ valid: boolean; message: string; referrerName?: string }> {
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      return { valid: false, message: 'Please enter a referral code.' };
    }

    await new Promise((r) => setTimeout(r, 150));

    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    const referrer = users.find((u) => u.referralCode?.toUpperCase() === cleanCode);

    if (referrer) {
      return {
        valid: true,
        message: `Valid referral code from ${referrer.displayName}! You will receive +50 TunePoints.`,
        referrerName: referrer.displayName,
      };
    }

    // Format check for demo codes
    if (cleanCode === 'TUNE-A7K92X' || cleanCode === 'TUNE-DEMO26' || /^TUNE-[A-Z0-9]{6}$/.test(cleanCode)) {
      return {
        valid: true,
        message: 'Valid referral code! You will receive +50 TunePoints upon registration.',
        referrerName: 'TuneQuest Member',
      };
    }

    return {
      valid: false,
      message: 'Referral code not found or invalid format.',
    };
  }

  /**
   * Returns referral performance statistics computed from localStorage
   */
  public async getReferralStats(): Promise<ReferralStats> {
    const currentUser = await authService.getCurrentUser();
    const referralCode = currentUser?.referralCode || 'TUNE-A7K92X';

    if (!currentUser) {
      return {
        referralCode,
        friendsReferred: 0,
        successfulReferrals: 0,
        pointsEarned: 0,
        friendRewardAmount: POINTS.REFERRED_USER_BONUS,
        userRewardAmount: POINTS.REFERRER_BONUS,
      };
    }

    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    const referredUsers = users.filter(
      (u) => u.referredBy === currentUser.id || u.referredBy === referralCode
    );

    const transactions = getStorageItem<PointTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const referralTx = transactions.filter(
      (t) => t.userId === currentUser.id && t.type === 'REFERRAL_BONUS'
    );

    const bonusFromTx = referralTx.reduce((sum, t) => sum + t.amount, 0);

    const totalFriends = Math.max(
      referredUsers.length,
      currentUser.stats?.friendsReferred || (currentUser.id === 'usr_music_explorer_01' ? 4 : 0)
    );
    const pointsEarned = bonusFromTx || totalFriends * POINTS.REFERRER_BONUS;

    return {
      referralCode,
      friendsReferred: totalFriends,
      successfulReferrals: totalFriends,
      pointsEarned,
      friendRewardAmount: POINTS.REFERRED_USER_BONUS,
      userRewardAmount: POINTS.REFERRER_BONUS,
    };
  }

  /**
   * Returns referral history list from localStorage
   */
  public async getReferralHistory(): Promise<ReferralHistoryItem[]> {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) return [];

    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    const referredUsers = users.filter(
      (u) => u.referredBy === currentUser.id || u.referredBy === currentUser.referralCode
    );

    const history: ReferralHistoryItem[] = referredUsers.map((u) => ({
      id: `ref-${u.id}`,
      friendDisplayName: u.fullName || u.displayName,
      joinedDate: u.createdAt,
      rewardPoints: POINTS.REFERRER_BONUS,
      status: 'completed',
    }));

    // If explorer demo user, include default history entries
    if (currentUser.id === 'usr_music_explorer_01' && history.length === 0) {
      return [
        {
          id: 'ref-001',
          friendDisplayName: 'Sam K.',
          joinedDate: '2025-01-18',
          rewardPoints: 100,
          status: 'completed',
        },
        {
          id: 'ref-002',
          friendDisplayName: 'Alex M.',
          joinedDate: '2025-01-24',
          rewardPoints: 100,
          status: 'completed',
        },
        {
          id: 'ref-003',
          friendDisplayName: 'Jordan P.',
          joinedDate: '2025-02-02',
          rewardPoints: 100,
          status: 'completed',
        },
        {
          id: 'ref-004',
          friendDisplayName: 'Elena R.',
          joinedDate: '2025-02-14',
          rewardPoints: 100,
          status: 'completed',
        },
      ];
    }

    return history;
  }

  /**
   * Generates formatted share message
   */
  public getShareMessage(code: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tunequest.app';
    return `Join me on TuneQuest and earn 50 TunePoints! Use my referral code: ${code} or sign up here: ${origin}/register?ref=${code}`;
  }
}

export const referralService = new ReferralService();
