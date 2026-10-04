import { Song, Artist, Achievement } from '../../types';
import { mockSongs } from '../../mock/songs';
import { mockArtists } from '../../mock/artists';
import { mockGenres, mockActivities, GenreItem, ActivityMoodItem } from '../../mock/genres';
import { mockAchievements } from '../../mock/achievements';
import { mockCurrentUser } from '../../mock/users';
import { getStorageItem, STORAGE_KEYS } from '../../utils/storage';

export interface DailyChallengePreview {
  id: string;
  title: string;
  subtitle: string;
  categoryName: string;
  questionCount: number;
  timeLimitSeconds: number;
  rewardPoints: number;
  rewardXp: number;
  completedQuestions: number;
  isStarted: boolean;
}

export interface UserHomeProgress {
  level: number;
  levelTitle: string;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  tunePoints: number;
  thisWeekEarned: number;
  recentAchievements: Achievement[];
}

export interface HomeData {
  greeting: string;
  featuredSong: Song;
  continueListening: (Song & { progressPercent: number })[];
  dailyChallenge: DailyChallengePreview;
  recommendations: Song[];
  trending: Song[];
  popularArtists: Artist[];
  moods: ActivityMoodItem[];
  genres: GenreItem[];
  userProgress?: UserHomeProgress;
}

class HomeService {
  private cache: HomeData | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_TTL = 30000; // 30 seconds

  public getGreeting(name?: string): string {
    const hour = new Date().getHours();
    let timeGreeting = 'Good evening';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';

    return name ? `${timeGreeting}, ${name}` : timeGreeting;
  }

  public async getHomeData(user?: typeof mockCurrentUser | null): Promise<HomeData> {
    const now = Date.now();
    const name = user?.fullName || user?.displayName;
    if (this.cache && now - this.lastFetchTime < this.CACHE_TTL) {
      return {
        ...this.cache,
        greeting: this.getGreeting(name),
      };
    }

    // Simulate realistic async fetch
    await new Promise((r) => setTimeout(r, 120));

    // Highlight top master studio tracks and global hits
    const featuredSong = mockSongs.find((s) => s.id === 'song-31') || mockSongs[0]; // Kesariya

    // Continue listening songs from localStorage recently played, or fallback to curated list
    let continueListening: (Song & { progressPercent: number })[] = [];
    try {
      const recent = getStorageItem<Song[]>(STORAGE_KEYS.RECENTLY_PLAYED, []);
      if (recent && recent.length > 0) {
        continueListening = recent.slice(0, 6).map((s, idx) => ({
          ...s,
          progressPercent: Math.max(25, 90 - idx * 12),
        }));
      }
    } catch {}

    if (continueListening.length === 0) {
      continueListening = [
        { ...(mockSongs.find((s) => s.id === 'song-31') || mockSongs[0]), progressPercent: 64 }, // Kesariya
        { ...(mockSongs.find((s) => s.id === 'song-faded') || mockSongs[1]), progressPercent: 88 }, // Faded
        { ...(mockSongs.find((s) => s.id === 'song-60') || mockSongs[2]), progressPercent: 42 }, // Starboy
        { ...(mockSongs.find((s) => s.id === 'song-64') || mockSongs[3]), progressPercent: 75 }, // Perfect
        { ...(mockSongs.find((s) => s.id === 'song-63') || mockSongs[4]), progressPercent: 50 }, // Shape of You
        { ...(mockSongs.find((s) => s.id === 'song-arz-kiya-hai') || mockSongs[5]), progressPercent: 30 }, // Arz Kiya Hai
      ];
    }

    const trending = [...mockSongs].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 12);
    const recommendations = mockSongs.slice(0, 14);
    const popularArtists = mockArtists.slice(0, 8);
    const moods = mockActivities.slice(0, 7);
    const genres = mockGenres.slice(0, 8);

    const dailyChallenge: DailyChallengePreview = {
      id: 'daily-challenge-today',
      title: 'Can you identify the artist?',
      subtitle: 'Think you know your music? Put your ear to the test with iconic riffs and vocal cues.',
      categoryName: "Today's Challenge",
      questionCount: 10,
      timeLimitSeconds: 60,
      rewardPoints: 100,
      rewardXp: 50,
      completedQuestions: 6,
      isStarted: true,
    };

    const userProgress: UserHomeProgress | undefined = user
      ? {
          level: user.level || 7,
          levelTitle: 'Music Explorer',
          xp: user.xp || 1240,
          xpToNextLevel: user.xpToNextLevel || 2000,
          streakDays: user.streak || 7,
          tunePoints: user.tunePoints || 1240,
          thisWeekEarned: 320,
          recentAchievements: mockAchievements.filter((a) => a.isUnlocked).slice(0, 3),
        }
      : undefined;

    const data: HomeData = {
      greeting: this.getGreeting(user?.displayName),
      featuredSong,
      continueListening,
      dailyChallenge,
      recommendations,
      trending,
      popularArtists,
      moods,
      genres,
      userProgress,
    };

    this.cache = data;
    this.lastFetchTime = now;
    return data;
  }

  public invalidateCache(): void {
    this.cache = null;
    this.lastFetchTime = 0;
  }
}

export const homeService = new HomeService();
