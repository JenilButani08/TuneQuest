import { create } from 'zustand';
import { User } from '../types';
import { authService, LoginCredentials, RegisterPayload } from '../services/auth/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  checkAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; referralRewardApplied?: boolean }>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  updateProfile: (updated: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (err: any) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Invalid email or password.', isLoading: false });
      return false;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(payload);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
      return { success: true, referralRewardApplied: response.referralRewardApplied };
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      return { success: false };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updated) => {
    const current = get().user;
    if (current) {
      const nextUser = { ...current, ...updated };
      set({ user: nextUser });
      authService.updateProfile(current.id, updated).catch(() => {});
    }
  },

  updateProfile: async (updated) => {
    const current = get().user;
    if (!current) return false;
    try {
      const updatedUser = await authService.updateProfile(current.id, updated);
      set({ user: updatedUser });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Unable to save profile.' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
