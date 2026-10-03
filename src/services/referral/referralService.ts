import { ReferralStats, ReferralHistoryItem } from '../../types';
import { apiClient } from '../api/apiClient';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

// Valid mock referral codes for the demo
const MOCK_VALID_CODES = new Set([
  'TUNE-A7K92X',
  'TUNE-M4P81Q',
  'TUNE-X9B42K',
  'TUNE-VIP2025',
]);

let runtimeReferralStats: ReferralStats = {
  referralCode: 'TUNE-A7K92X',
  friendsReferred: 5,
  successfulReferrals: 4,
  pointsEarned: 400,
  friendRewardAmount: 50,
  userRewardAmount: 100,
};

let runtimeReferralHistory: ReferralHistoryItem[] = [
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

class ReferralService {
  /**
   * Fetches the logged in user's active referral code
   */
  public async getMyReferralCode(): Promise<string> {
    if (IS_DEMO_MODE) {
      return runtimeReferralStats.referralCode;
    }
    const res = await apiClient.get<{ referralCode: string }>('/referrals/me');
    return res.referralCode;
  }

  /**
   * Validates a referral code during signup UX
   * In Production: Server validates code against active accounts and anti-abuse policies
   */
  public async validateCode(code: string): Promise<{ valid: boolean; message: string; referrerName?: string }> {
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      return { valid: false, message: 'Please enter a referral code.' };
    }

    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 200));

      // Matches format TUNE-XXXXXX or registered mock codes
      const isValid = MOCK_VALID_CODES.has(cleanCode) || /^TUNE-[A-Z0-9]{6}$/.test(cleanCode);

      if (isValid) {
        return {
          valid: true,
          message: 'Valid referral code! You will receive +50 TunePoints upon registration.',
          referrerName: 'TuneQuest Explorer',
        };
      } else {
        return {
          valid: false,
          message: 'Referral code not found or invalid format.',
        };
      }
    }

    return await apiClient.post<{ valid: boolean; message: string }>('/referrals/validate', { code: cleanCode });
  }

  /**
   * Returns referral performance statistics
   */
  public async getReferralStats(): Promise<ReferralStats> {
    if (IS_DEMO_MODE) {
      return { ...runtimeReferralStats };
    }
    return await apiClient.get<ReferralStats>('/referrals/stats');
  }

  /**
   * Returns referral history list (anonymized friend names for privacy)
   */
  public async getReferralHistory(): Promise<ReferralHistoryItem[]> {
    if (IS_DEMO_MODE) {
      return [...runtimeReferralHistory];
    }
    return await apiClient.get<ReferralHistoryItem[]>('/referrals/history');
  }

  /**
   * Generates formatted share message
   */
  public getShareMessage(code: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tunequest.app';
    return `Join me on TuneQuest and earn 50 TunePoints! Use my referral code: ${code} or sign up here: ${origin}/register?ref=${code}`;
  }

  /**
   * Shares via Web Share API or falls back to clipboard copy
   */
  public async shareReferral(code: string): Promise<'shared' | 'copied'> {
    const text = this.getShareMessage(code);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tunequest.app';
    const url = `${origin}/register?ref=${code}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join TuneQuest — Gamified Music Streaming',
          text,
          url,
        });
        return 'shared';
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // If share cancelled or errored, fallback to copy
          await navigator.clipboard.writeText(url);
          return 'copied';
        }
        return 'shared';
      }
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url);
    return 'copied';
  }

  /**
   * Server simulation when a referred user signs up
   */
  public async recordReferralCompleted(code: string, newUserName: string): Promise<void> {
    if (IS_DEMO_MODE) {
      runtimeReferralStats.friendsReferred += 1;
      runtimeReferralStats.successfulReferrals += 1;
      runtimeReferralStats.pointsEarned += 100;

      runtimeReferralHistory = [
        {
          id: `ref-${Date.now()}`,
          friendDisplayName: newUserName,
          joinedDate: new Date().toISOString().split('T')[0],
          rewardPoints: 100,
          status: 'completed',
        },
        ...runtimeReferralHistory,
      ];
    }
  }
}

export const referralService = new ReferralService();
