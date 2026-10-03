import usersJson from './users.json';
import signupsJson from './signups.json';
import songsJson from './songs.json';
import albumsJson from './albums.json';
import artistsJson from './artists.json';
import playlistsJson from './playlists.json';
import genresJson from './genres.json';
import quizzesJson from './quizzes.json';
import rewardsJson from './rewards.json';
import leaderboardJson from './leaderboard.json';
import achievementsJson from './achievements.json';
import referralsJson from './referrals.json';
import homeDataJson from './homeData.json';
import appConfigJson from './appConfig.json';
import landingDataJson from './landingData.json';

import { User } from '../types';

export interface SignUpRecord {
  signupId: string;
  userId: string;
  email: string;
  fullName: string;
  username: string;
  role?: string;
  signupDate: string;
  referralCodeUsed: string | null;
  startingPoints: number;
  authProvider: string;
  status: 'verified' | 'pending';
}

const STORAGE_KEYS = {
  USERS: 'tunequest_json_users',
  SIGNUPS: 'tunequest_json_signups',
  CURRENT_USER: 'tunequest_json_current_user',
  PLAYLISTS: 'tunequest_json_playlists',
  LIKED_SONGS: 'tunequest_json_liked_songs',
  WALLET: 'tunequest_json_wallet',
  TRANSACTIONS: 'tunequest_json_transactions',
};

class JsonStorageService {
  // 1. Initial Static Data Read
  public readonly defaultUsers = usersJson;
  public readonly defaultSignups = signupsJson as SignUpRecord[];
  public readonly songs = songsJson;
  public readonly albums = albumsJson;
  public readonly artists = artistsJson;
  public readonly defaultPlaylists = playlistsJson;
  public readonly genres = genresJson;
  public readonly quizzes = quizzesJson;
  public readonly rewards = rewardsJson;
  public readonly leaderboard = leaderboardJson;
  public readonly achievements = achievementsJson;
  public readonly referrals = referralsJson;
  public readonly homeData = homeDataJson;
  public readonly appConfig = appConfigJson;
  public readonly landingData = landingDataJson;

  /**
   * Get all registered users (combines users.json seed with persistent JSON records)
   */
  public getRegisteredUsers(): any[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading stored users JSON:', e);
    }
    // Default from users.json
    return usersJson.registeredUsers;
  }

  /**
   * Get all sign-up events in JSON format
   */
  public getSignups(): SignUpRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SIGNUPS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading stored signups JSON:', e);
    }
    return signupsJson as SignUpRecord[];
  }

  /**
   * Register a new user and save their sign-up data in JSON format
   */
  public saveSignUp(user: User, rawPasswordHint?: string): SignUpRecord {
    const users = this.getRegisteredUsers();
    const signups = this.getSignups();

    const signupRecord: SignUpRecord = {
      signupId: `sgn_${Date.now()}`,
      userId: user.id,
      email: user.email,
      fullName: user.displayName,
      username: user.username,
      role: 'user',
      signupDate: new Date().toISOString(),
      referralCodeUsed: null,
      startingPoints: user.tunePoints || 0,
      authProvider: 'credentials',
      status: 'verified',
    };

    const userEntry = {
      ...user,
      passwordHint: rawPasswordHint || 'demo123',
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // Save to users list
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = userEntry;
    } else {
      users.push(userEntry);
    }

    // Save to signups list
    signups.unshift(signupRecord);

    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users, null, 2));
      localStorage.setItem(STORAGE_KEYS.SIGNUPS, JSON.stringify(signups, null, 2));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user, null, 2));
    } catch (e) {
      console.error('Failed to write user to localStorage JSON:', e);
    }

    return signupRecord;
  }

  /**
   * Find user by email or username from the registered JSON accounts
   */
  public findUser(identifier: string): any | null {
    const users = this.getRegisteredUsers();
    const clean = identifier.trim().toLowerCase();
    return users.find((u) => u.email?.toLowerCase() === clean || u.username?.toLowerCase() === clean) || null;
  }

  /**
   * Update active user profile and sync to JSON store
   */
  public updateStoredUser(userId: string, partial: Partial<User>): User | null {
    const users = this.getRegisteredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index >= 0) {
      users[index] = { ...users[index], ...partial };
      try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users, null, 2));
      } catch (e) {
        console.error('Failed to sync updated user JSON:', e);
      }
      return users[index] as User;
    }
    return null;
  }

  /**
   * Export the entire application state and all 14 datasets as a unified JSON snapshot
   */
  public exportFullDatabase(): Record<string, any> {
    return {
      exportedAt: new Date().toISOString(),
      version: appConfigJson.version,
      appName: appConfigJson.appName,
      collections: {
        users: this.getRegisteredUsers(),
        signups: this.getSignups(),
        songs: this.songs,
        albums: this.albums,
        artists: this.artists,
        playlists: this.defaultPlaylists,
        genres: this.genres,
        quizzes: this.quizzes,
        rewards: this.rewards,
        leaderboard: this.leaderboard,
        achievements: this.achievements,
        referrals: this.referrals,
        homeData: this.homeData,
        landingData: this.landingData,
        appConfig: this.appConfig,
      },
    };
  }

  /**
   * Trigger a client-side download of the entire app JSON database
   */
  public downloadDatabaseJsonFile(filename = 'tunequest_database.json'): void {
    const data = this.exportFullDatabase();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Reset local storage modifications and restore pure JSON file defaults
   */
  public resetToPureDefaults(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
}

export const jsonStorageService = new JsonStorageService();
