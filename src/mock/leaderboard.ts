import { LeaderboardEntry, LeaderboardTimeframe } from '../types';
import leaderboardJson from '../data/leaderboard.json';

export const mockLeaderboardData: Record<LeaderboardTimeframe, LeaderboardEntry[]> = leaderboardJson as Record<
  LeaderboardTimeframe,
  LeaderboardEntry[]
>;
