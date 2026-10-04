import { create } from 'zustand';
import { Wallet, PointTransaction, Reward, RedemptionResult } from '../types';
import { rewardService } from '../services/rewards/rewardService';
import { useAuthStore } from './authStore';

interface WalletState {
  wallet: Wallet;
  transactions: PointTransaction[];
  rewards: Reward[];
  isLoading: boolean;
  isRedeeming: boolean;
  error: string | null;

  fetchWalletData: () => Promise<void>;
  redeemReward: (rewardId: string) => Promise<RedemptionResult>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: {
    balance: 0,
    thisWeekEarned: 0,
    lifetimeEarned: 0,
    lifetimeRedeemed: 0,
    currencyName: 'TunePoints',
    currencySymbol: 'TP',
  },
  transactions: [],
  rewards: [],
  isLoading: false,
  isRedeeming: false,
  error: null,

  fetchWalletData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [wallet, transactions, rewards] = await Promise.all([
        rewardService.getWallet(),
        rewardService.getTransactions(),
        rewardService.getRewards(),
      ]);
      set({ wallet, transactions, rewards, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch wallet info', isLoading: false });
    }
  },

  redeemReward: async (rewardId: string) => {
    set({ isRedeeming: true, error: null });
    try {
      const result = await rewardService.redeemReward(rewardId);
      // Refresh wallet & transactions
      await get().fetchWalletData();
      // Also sync user in authStore so navbar and profile reflect updated points and discount
      useAuthStore.getState().checkAuth();
      set({ isRedeeming: false });
      return result;
    } catch (err: any) {
      set({ isRedeeming: false, error: err.message || 'Redemption failed' });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
