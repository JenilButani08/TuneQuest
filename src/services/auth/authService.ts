import { User } from '../../types';
import { mockCurrentUser } from '../../mock/users';
import { apiClient } from '../api/apiClient';
import { referralService } from '../referral/referralService';
import { rewardService } from '../rewards/rewardService';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  referralCode?: string;
  username?: string;
  displayName?: string;
  favoriteGenres?: string[];
}

export interface AuthResponse {
  user: User;
  referralRewardApplied?: boolean;
}

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

import { jsonStorageService } from '../../data/jsonStorageService';

class AuthService {
  /**
   * Log into TuneQuest
   * Checks registered accounts in the JSON data store first.
   */
  public async login(credentials: LoginCredentials): Promise<User> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 350));
      // First check if this user exists in our JSON registered accounts
      const existingAccount = jsonStorageService.findUser(credentials.email);
      let user: User;

      if (existingAccount) {
        user = existingAccount as User;
      } else {
        user = {
          ...mockCurrentUser,
          email: credentials.email || mockCurrentUser.email,
          displayName: credentials.email.split('@')[0] || mockCurrentUser.displayName,
        };
      }
      sessionStorage.setItem('tunequest_session_active', 'true');
      return user;
    }

    return mockCurrentUser;
  }

  /**
   * Register a new user account
   * Production flow:
   * 1. Submits { fullName, email, password, referralCode }
   * 2. Backend validates referral code atomically
   * 3. Backend awards +50 TP to new user and +100 TP to referrer
   * 4. Backend returns user with HttpOnly session cookie
   */
  public async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 450));

      const cleanReferral = payload.referralCode?.trim().toUpperCase();
      let referralValid = false;

      if (cleanReferral) {
        const validation = await referralService.validateCode(cleanReferral);
        referralValid = validation.valid;
      }

      const startingPoints = referralValid ? 50 : 0;
      const derivedUsername = payload.username || payload.fullName.toLowerCase().replace(/\s+/g, '_') || `user_${Date.now()}`;
      const derivedDisplayName = payload.fullName.trim() || payload.displayName || 'Music Adventurer';

      const newUser: User = {
        ...mockCurrentUser,
        id: `usr_${Date.now()}`,
        username: derivedUsername,
        displayName: derivedDisplayName,
        email: payload.email,
        level: 1,
        xp: 0,
        xpToNextLevel: 500,
        tunePoints: startingPoints,
        streak: 1,
        referralCode: `TUNE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        favoriteGenres: payload.favoriteGenres || ['Synthwave', 'Indie Pop'],
        stats: {
          quizzesCompleted: 0,
          correctAnswers: 0,
          accuracyPercent: 0,
          songsPlayed: 0,
          playlistsCreated: 0,
          timeListenedMinutes: 0,
          friendsReferred: 0,
        },
      };

      // Persist user account and sign-up transaction directly into JSON storage
      jsonStorageService.saveSignUp(newUser, payload.password);

      sessionStorage.setItem('tunequest_session_active', 'true');

      // If valid referral code applied, simulate backend awarding points to both parties
      if (referralValid && cleanReferral) {
        await referralService.recordReferralCompleted(cleanReferral, derivedDisplayName);
        await rewardService.recordPointReward(
          50,
          'Welcome referral bonus: Joined using referral code',
          'REFERRED_USER_BONUS'
        );
      }

      return {
        user: newUser,
        referralRewardApplied: referralValid,
      };
    }

    return {
      user: mockCurrentUser,
      referralRewardApplied: false,
    };
  }

  /**
   * Log out current session
   * In Production: Calls POST /api/auth/logout to invalidate server session and clear HttpOnly cookie.
   */
  public async logout(): Promise<void> {
    if (IS_DEMO_MODE) {
      sessionStorage.setItem('tunequest_session_active', 'false');
      return;
    }

    await apiClient.post('/auth/logout');
  }

  /**
   * Verify and fetch current authenticated user session
   */
  public async getCurrentUser(): Promise<User | null> {
    const isSessionActive = sessionStorage.getItem('tunequest_session_active');
    if (isSessionActive === 'false') {
      return null;
    }

    if (IS_DEMO_MODE) {
      return mockCurrentUser;
    }

    try {
      const res = await apiClient.get<{ user: User }>('/auth/me');
      return res.user;
    } catch {
      return null;
    }
  }

  /**
   * Request password reset link
   */
  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 350));
      return {
        success: true,
        message: `Password reset instructions have been dispatched to ${email}`,
      };
    }

    return await apiClient.post('/auth/forgot-password', { email });
  }
}

export const authService = new AuthService();
