import { User, PointTransaction } from '../../types';
import { jsonStorageService } from '../../data/jsonStorageService';
import usersJson from '../../data/users.json';
import rewardsJson from '../../data/rewards.json';
import {
  STORAGE_KEYS,
  POINTS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from '../../utils/storage';

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

// Predefined demo accounts
const DEMO_ACCOUNTS: User[] = [
  {
    ...(usersJson.currentUser as User),
    id: 'usr_music_explorer_01',
    fullName: 'Alex Rivers',
    displayName: 'Alex Rivers',
    username: 'MusicExplorer',
    email: 'explorer@tunequest.app',
    password: 'TuneQuestDemo2026!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Music adventurer & trivia collector. Finding beats from synthwave to Bollywood.',
    tunePoints: 1240,
    level: 7,
    xp: 1240,
    xpToNextLevel: 2000,
    streak: 7,
    referralCode: 'TUNE-A7K92X',
    premiumDiscount: 0,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_college_01',
    fullName: 'Demo Student',
    displayName: 'Demo Student',
    username: 'DemoUser',
    email: 'demo@tunequest.com',
    password: 'demo123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    bio: 'TuneQuest college project test account.',
    level: 3,
    xp: 450,
    xpToNextLevel: 1000,
    tunePoints: 350,
    streak: 3,
    streakActiveToday: true,
    streakCalendar: [
      { day: 'Monday', dayShort: 'Mon', completed: true, isToday: false },
      { day: 'Tuesday', dayShort: 'Tue', completed: true, isToday: false },
      { day: 'Wednesday', dayShort: 'Wed', completed: true, isToday: true },
      { day: 'Thursday', dayShort: 'Thu', completed: false, isToday: false },
      { day: 'Friday', dayShort: 'Fri', completed: false, isToday: false },
      { day: 'Saturday', dayShort: 'Sat', completed: false, isToday: false },
      { day: 'Sunday', dayShort: 'Sun', completed: false, isToday: false },
    ],
    favoriteGenres: ['Lo-fi Chill', 'Indie Pop', 'Synthwave'],
    subscription: {
      tier: 'free',
      features: ['Standard Audio (160kbps)', 'Unlimited Quizzes', 'Earn TunePoints'],
    },
    stats: {
      quizzesCompleted: 12,
      correctAnswers: 58,
      accuracyPercent: 80,
      songsPlayed: 45,
      playlistsCreated: 2,
      timeListenedMinutes: 320,
      friendsReferred: 1,
    },
    referralCode: 'TUNE-DEMO26',
    premiumDiscount: 0,
    createdAt: '2026-01-01T12:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

class AuthService {
  /**
   * Initializes default mock data into localStorage if empty
   */
  public initLocalStorage(): void {
    if (typeof window === 'undefined') return;

    // 1. Initialize Users
    const existingUsers = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    if (!existingUsers || existingUsers.length === 0) {
      setStorageItem(STORAGE_KEYS.USERS, DEMO_ACCOUNTS);
    } else {
      // Ensure demo accounts exist
      let updated = false;
      const userList = [...existingUsers];
      for (const demo of DEMO_ACCOUNTS) {
        if (!userList.some((u) => u.email.toLowerCase() === demo.email.toLowerCase())) {
          userList.push(demo);
          updated = true;
        }
      }
      if (updated) {
        setStorageItem(STORAGE_KEYS.USERS, userList);
      }
    }

    // 2. Initialize Transactions
    const existingTx = getStorageItem<PointTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    if (!existingTx || existingTx.length === 0) {
      const initialTransactions: PointTransaction[] = (rewardsJson.transactions as PointTransaction[]).map((t) => ({
        ...t,
        userId: 'usr_music_explorer_01',
      }));
      // Add demo transactions for demo student
      initialTransactions.push({
        id: 'tx-demo-001',
        userId: 'usr_demo_college_01',
        type: 'QUIZ_REWARD',
        amount: 50,
        description: 'Completed Daily Quiz Challenge',
        timestamp: new Date().toISOString(),
        status: 'completed',
      });
      setStorageItem(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
    }

    // 3. Initialize active session default if none set
    const authState = getStorageItem<{ isAuthenticated: boolean; userId: string | null }>(STORAGE_KEYS.AUTH, {
      isAuthenticated: true,
      userId: DEMO_ACCOUNTS[0].id,
    });
    if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
      setStorageItem(STORAGE_KEYS.AUTH, authState);
      setStorageItem(STORAGE_KEYS.CURRENT_USER, DEMO_ACCOUNTS[0]);
    }
  }

  /**
   * Log into TuneQuest using localStorage
   */
  public async login(credentials: LoginCredentials): Promise<User> {
    await new Promise((r) => setTimeout(r, 250));
    this.initLocalStorage();

    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, DEMO_ACCOUNTS);
    const cleanEmail = credentials.email.trim().toLowerCase();

    const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!matchedUser) {
      throw new Error('Invalid email or password.');
    }

    // Password verification for frontend demo
    if (credentials.password) {
      const isDemoPass = credentials.password === 'demo123' || credentials.password === 'TuneQuestDemo2026!';
      const isSavedPass = matchedUser.password && matchedUser.password === credentials.password;
      if (!isDemoPass && !isSavedPass) {
        throw new Error('Invalid email or password.');
      }
    }

    // Set current active user and auth state in localStorage
    setStorageItem(STORAGE_KEYS.CURRENT_USER, matchedUser);
    setStorageItem(STORAGE_KEYS.AUTH, {
      isAuthenticated: true,
      userId: matchedUser.id,
    });

    return matchedUser;
  }

  /**
   * Register a new user in localStorage
   */
  public async register(payload: RegisterPayload): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 350));
    this.initLocalStorage();

    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, DEMO_ACCOUNTS);
    const cleanEmail = payload.email.trim().toLowerCase();

    // Check email uniqueness
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    // Referral code processing
    const cleanReferral = payload.referralCode?.trim().toUpperCase();
    let referralValid = false;
    let referrerUser: User | null = null;

    if (cleanReferral) {
      referrerUser = users.find((u) => u.referralCode?.toUpperCase() === cleanReferral) || null;
      if (referrerUser) {
        referralValid = true;
      } else if (cleanReferral === 'TUNE-A7K92X' || cleanReferral === 'TUNE-DEMO26' || cleanReferral.startsWith('TUNE-')) {
        referralValid = true;
      } else {
        throw new Error('Invalid referral code.');
      }
    }

    const startingPoints = referralValid ? POINTS.REFERRED_USER_BONUS : 0;
    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const derivedUsername =
      payload.username ||
      payload.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16) ||
      `user_${Date.now()}`;
    const generatedReferralCode = `TUNE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newUser: User = {
      id: newUserId,
      fullName: payload.fullName.trim(),
      displayName: payload.fullName.trim(),
      username: derivedUsername,
      email: cleanEmail,
      password: payload.password || 'demo123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'New TuneQuest Explorer 🎧 Ready to listen, play and earn.',
      level: 1,
      xp: 0,
      xpToNextLevel: 500,
      tunePoints: startingPoints,
      streak: 1,
      streakActiveToday: true,
      streakCalendar: [
        { day: 'Monday', dayShort: 'Mon', completed: true, isToday: true },
        { day: 'Tuesday', dayShort: 'Tue', completed: false, isToday: false },
        { day: 'Wednesday', dayShort: 'Wed', completed: false, isToday: false },
        { day: 'Thursday', dayShort: 'Thu', completed: false, isToday: false },
        { day: 'Friday', dayShort: 'Fri', completed: false, isToday: false },
        { day: 'Saturday', dayShort: 'Sat', completed: false, isToday: false },
        { day: 'Sunday', dayShort: 'Sun', completed: false, isToday: false },
      ],
      favoriteGenres: payload.favoriteGenres || ['Synthwave', 'Indie Pop'],
      subscription: {
        tier: 'free',
        features: ['Standard Audio (160kbps)', 'Unlimited Quizzes', 'Earn TunePoints'],
      },
      stats: {
        quizzesCompleted: 0,
        correctAnswers: 0,
        accuracyPercent: 0,
        songsPlayed: 0,
        playlistsCreated: 0,
        timeListenedMinutes: 0,
        friendsReferred: 0,
      },
      referralCode: generatedReferralCode,
      referredBy: referrerUser ? referrerUser.id : cleanReferral || null,
      premiumDiscount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save user to users array
    users.push(newUser);
    setStorageItem(STORAGE_KEYS.USERS, users);

    // Apply points to referrer if applicable
    const transactions = getStorageItem<PointTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);

    if (referralValid) {
      // Transaction for new user
      transactions.unshift({
        id: `tx-ref-new-${Date.now()}`,
        userId: newUser.id,
        type: 'REFERRED_USER_BONUS',
        amount: POINTS.REFERRED_USER_BONUS,
        description: 'Welcome referral bonus: Joined using referral code',
        timestamp: new Date().toISOString(),
        status: 'completed',
      });

      // Bonus for referrer
      if (referrerUser) {
        referrerUser.tunePoints = (referrerUser.tunePoints || 0) + POINTS.REFERRER_BONUS;
        referrerUser.stats = {
          ...referrerUser.stats!,
          friendsReferred: (referrerUser.stats?.friendsReferred || 0) + 1,
        };
        // Update referrer in users list
        const refIndex = users.findIndex((u) => u.id === referrerUser!.id);
        if (refIndex >= 0) {
          users[refIndex] = referrerUser;
          setStorageItem(STORAGE_KEYS.USERS, users);
        }

        transactions.unshift({
          id: `tx-ref-bonus-${Date.now()}`,
          userId: referrerUser.id,
          type: 'REFERRAL_BONUS',
          amount: POINTS.REFERRER_BONUS,
          description: `Referral bonus: ${newUser.fullName} joined TuneQuest`,
          timestamp: new Date().toISOString(),
          status: 'completed',
        });
      }
    }

    setStorageItem(STORAGE_KEYS.TRANSACTIONS, transactions);

    // Set as current active user
    setStorageItem(STORAGE_KEYS.CURRENT_USER, newUser);
    setStorageItem(STORAGE_KEYS.AUTH, {
      isAuthenticated: true,
      userId: newUser.id,
    });

    // Also sync to jsonStorageService for unified exports
    try {
      jsonStorageService.saveSignUp(newUser, payload.password);
    } catch (e) {
      console.warn('jsonStorageService sync notice:', e);
    }

    return {
      user: newUser,
      referralRewardApplied: referralValid,
    };
  }

  /**
   * Log out current session
   * Keeps user account in localStorage, just terminates active session
   */
  public async logout(): Promise<void> {
    removeStorageItem(STORAGE_KEYS.CURRENT_USER);
    setStorageItem(STORAGE_KEYS.AUTH, {
      isAuthenticated: false,
      userId: null,
    });
  }

  /**
   * Verify and fetch current authenticated user from localStorage
   */
  public async getCurrentUser(): Promise<User | null> {
    this.initLocalStorage();
    const authState = getStorageItem<{ isAuthenticated: boolean; userId: string | null }>(STORAGE_KEYS.AUTH, {
      isAuthenticated: false,
      userId: null,
    });

    if (!authState.isAuthenticated || !authState.userId) {
      return null;
    }

    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, DEMO_ACCOUNTS);
    const user = users.find((u) => u.id === authState.userId);

    if (user) {
      setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }

    return null;
  }

  /**
   * Update profile fields (Full Name, Username, Bio, Avatar)
   */
  public async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    this.initLocalStorage();
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, DEMO_ACCOUNTS);
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      throw new Error('User not found.');
    }

    // Protected fields that cannot be manually edited through profile
    const safeUpdates = {
      ...updates,
      fullName: updates.fullName || updates.displayName || users[index].fullName,
      displayName: updates.displayName || updates.fullName || users[index].displayName,
      updatedAt: new Date().toISOString(),
    };

    delete (safeUpdates as any).id;
    delete (safeUpdates as any).tunePoints;
    delete (safeUpdates as any).xp;
    delete (safeUpdates as any).level;
    delete (safeUpdates as any).streak;
    delete (safeUpdates as any).referralCode;

    users[index] = {
      ...users[index],
      ...safeUpdates,
    };

    setStorageItem(STORAGE_KEYS.USERS, users);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, users[index]);

    return users[index];
  }

  /**
   * Add/deduct TunePoints and sync across all stores
   */
  public async updateUserPoints(userId: string, pointsDelta: number): Promise<number> {
    this.initLocalStorage();
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, DEMO_ACCOUNTS);
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return 0;
    }

    const currentPoints = users[index].tunePoints || 0;
    const newBalance = Math.max(0, currentPoints + pointsDelta);
    users[index].tunePoints = newBalance;
    users[index].updatedAt = new Date().toISOString();

    setStorageItem(STORAGE_KEYS.USERS, users);

    const currentUser = getStorageItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser && currentUser.id === userId) {
      currentUser.tunePoints = newBalance;
      setStorageItem(STORAGE_KEYS.CURRENT_USER, currentUser);
    }

    return newBalance;
  }

  /**
   * Update premium discount for a user
   */
  public async setPremiumDiscount(userId: string, discountPercent: number): Promise<void> {
    this.initLocalStorage();
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, DEMO_ACCOUNTS);
    const index = users.findIndex((u) => u.id === userId);

    if (index !== -1) {
      users[index].premiumDiscount = Math.max(users[index].premiumDiscount || 0, discountPercent);
      users[index].updatedAt = new Date().toISOString();
      setStorageItem(STORAGE_KEYS.USERS, users);

      const currentUser = getStorageItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
      if (currentUser && currentUser.id === userId) {
        currentUser.premiumDiscount = users[index].premiumDiscount;
        setStorageItem(STORAGE_KEYS.CURRENT_USER, currentUser);
      }
    }
  }

  /**
   * Request password reset link (simulated for frontend)
   */
  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}`,
    };
  }

  /**
   * Reset all TuneQuest demo data to defaults
   */
  public resetAllDemoData(): void {
    if (typeof window === 'undefined') return;
    removeStorageItem(STORAGE_KEYS.USERS);
    removeStorageItem(STORAGE_KEYS.CURRENT_USER);
    removeStorageItem(STORAGE_KEYS.AUTH);
    removeStorageItem(STORAGE_KEYS.TRANSACTIONS);
    removeStorageItem(STORAGE_KEYS.LIKED_SONGS);
    removeStorageItem(STORAGE_KEYS.RECENTLY_PLAYED);
    removeStorageItem(STORAGE_KEYS.QUIZ_PROGRESS);
    sessionStorage.clear();
    this.initLocalStorage();
  }
}

export const authService = new AuthService();
