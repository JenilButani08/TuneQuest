import { create } from 'zustand';
import { Reward } from '../types';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  toasts: ToastItem[];
  isMobileNavOpen: boolean;
  isQueueOpen: boolean;
  isCreatePlaylistOpen: boolean;
  activeRedemptionReward: Reward | null;

  // Actions
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  setMobileNavOpen: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;
  setCreatePlaylistOpen: (open: boolean) => void;
  openRedemptionModal: (reward: Reward) => void;
  closeRedemptionModal: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  isMobileNavOpen: false,
  isQueueOpen: false,
  isCreatePlaylistOpen: false,
  activeRedemptionReward: null,

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { ...toast, id, duration: toast.duration || 4000 };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setQueueOpen: (open) => set({ isQueueOpen: open }),
  setCreatePlaylistOpen: (open) => set({ isCreatePlaylistOpen: open }),
  openRedemptionModal: (reward) => set({ activeRedemptionReward: reward }),
  closeRedemptionModal: () => set({ activeRedemptionReward: null }),
}));
