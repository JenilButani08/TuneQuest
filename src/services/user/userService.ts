import { LeaderboardEntry, LeaderboardTimeframe, Achievement } from '../../types';
import { mockLeaderboardData } from '../../mock/leaderboard';
import { mockAchievements } from '../../mock/achievements';
import { apiClient } from '../api/apiClient';

const IS_DEMO_MODE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE) !== 'false';

let runtimeAchievements = [...mockAchievements];

class LeaderboardService {
  public async getLeaderboard(timeframe: LeaderboardTimeframe = 'weekly'): Promise<LeaderboardEntry[]> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 120));
      return mockLeaderboardData[timeframe] || mockLeaderboardData.weekly;
    }
    return await apiClient.get<LeaderboardEntry[]>(`/leaderboard?timeframe=${timeframe}`);
  }
}

class AchievementService {
  public async getAchievements(): Promise<Achievement[]> {
    if (IS_DEMO_MODE) {
      return [...runtimeAchievements];
    }
    return await apiClient.get<Achievement[]>('/achievements');
  }

  public async claimAchievement(id: string): Promise<Achievement> {
    if (IS_DEMO_MODE) {
      runtimeAchievements = runtimeAchievements.map((ach) =>
        ach.id === id ? { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString() } : ach
      );
      return runtimeAchievements.find((a) => a.id === id)!;
    }
    return await apiClient.post<Achievement>(`/achievements/${id}/claim`);
  }
}

class AnalyticsService {
  public trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    const isAnalyticsEnabled = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_ANALYTICS === 'true';
    if (!isAnalyticsEnabled) {
      // In development, log event unobtrusively
      // console.debug(`[TuneQuest Analytics] ${eventName}`, properties);
      return;
    }

    try {
      // Production tracking hook (Mixpanel, PostHog, Plausible, etc.)
      navigator.sendBeacon?.('/api/analytics', JSON.stringify({ eventName, properties, timestamp: Date.now() }));
    } catch {
      // Silent catch to prevent analytics failures from affecting user flow
    }
  }
}

export const leaderboardService = new LeaderboardService();
export const achievementService = new AchievementService();
export const analyticsService = new AnalyticsService();
