/**
 * TuneQuest Local Storage Service
 * Provides type-safe persistence and initialization for frontend-only state.
 */

export const STORAGE_KEYS = {
  USERS: 'tunequest_users',
  CURRENT_USER: 'tunequest_current_user',
  AUTH: 'tunequest_auth',
  TRANSACTIONS: 'tunequest_transactions',
  LIKED_SONGS: 'tunequest_liked_songs',
  RECENTLY_PLAYED: 'tunequest_recently_played',
  QUIZ_PROGRESS: 'tunequest_quiz_progress',
  THEME: 'tunequest_theme',
} as const;

export const POINTS = {
  QUIZ_CORRECT: 10,
  REFERRER_BONUS: 100,
  REFERRED_USER_BONUS: 50,
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[TuneQuest Storage] Error parsing key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[TuneQuest Storage] Error saving key "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[TuneQuest Storage] Error removing key "${key}":`, error);
  }
}
