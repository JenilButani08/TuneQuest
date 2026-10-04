// TuneQuest Core TypeScript Types

export type SubscriptionTier = 'free' | 'premium' | 'premium_expiring' | 'expired';

export interface User {
  id: string;
  fullName?: string;
  username: string;
  displayName: string;
  email: string;
  password?: string;
  avatarUrl: string;
  avatar?: string;
  bio?: string;
  level: number;
  xp: number;
  xpToNextLevel?: number;
  tunePoints: number;
  streak: number;
  streakActiveToday?: boolean;
  streakCalendar?: {
    day: string;
    dayShort: string;
    completed: boolean;
    isToday: boolean;
  }[];
  favoriteGenres: string[];
  subscription?: {
    tier: SubscriptionTier;
    expiresAt?: string;
    features: string[];
  };
  stats?: {
    quizzesCompleted: number;
    correctAnswers: number;
    accuracyPercent: number;
    songsPlayed: number;
    playlistsCreated: number;
    timeListenedMinutes: number;
    friendsReferred?: number;
  };
  referralCode: string;
  referredBy?: string | null;
  premiumDiscount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  coverImage: string;
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
  releaseDate: string;
  isLiked?: boolean;
  plays?: number;
  triviaSnippet?: string;
  lyricsPreview?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarImage: string;
  bannerImage: string;
  bio: string;
  genres: string[];
  monthlyListeners: number;
  followers: number;
  isFollowed?: boolean;
  topSongIds: string[];
  albumIds: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverImage: string;
  releaseYear: number;
  genre: string;
  songIds: string[];
  totalTracks: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  ownerId: string;
  ownerName: string;
  songIds: string[];
  isPublic: boolean;
  isLiked?: boolean;
  createdAt: string;
}

export type QuizCategoryType =
  | 'guess-song'
  | 'guess-artist'
  | 'album-challenge'
  | 'music-history'
  | 'genre-challenge'
  | 'lyrics-challenge'
  | 'audio-challenge'
  | 'trending-music'
  | 'user-preferences';

export interface QuizCategory {
  id: QuizCategoryType;
  name: string;
  description: string;
  iconName: string;
  accentColor: string;
  questionCount: number;
  rewardPoints: number;
  rewardXp: number;
  timeLimitSeconds: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Master';
  badge: string;
}

export interface QuizOption {
  id: string;
  text: string;
  artistAvatar?: string;
}

export interface QuizQuestion {
  id: string;
  categoryId: QuizCategoryType;
  question: string;
  snippet?: string; // audio preview or lyric preview
  albumArtwork?: string;
  audioPreviewUrl?: string; // playable audio snippet
  options: QuizOption[];
  correctOptionId?: string; // only present in mock/response validation, not exposed client-side in production
  explanation?: string;
}

export interface QuizAttempt {
  attemptId: string;
  quizId: string;
  categoryId: QuizCategoryType;
  userId: string;
  startedAt: string;
  timeLimitSeconds: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  answers: {
    questionId: string;
    selectedOptionId: string;
    answeredAt: string;
    timeTakenSeconds: number;
  }[];
}

export interface QuizResult {
  attemptId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  tunePointsEarned: number;
  xpEarned: number;
  streakDays: number;
  newLevel?: number;
  newTunePointsBalance: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unlockedAchievement?: Achievement;
  breakdown: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export type TransactionType =
  | 'REFERRAL_BONUS'
  | 'REFERRED_USER_BONUS'
  | 'QUIZ_REWARD'
  | 'DAILY_CHALLENGE'
  | 'REWARD_REDEMPTION'
  | 'STREAK_REWARD'
  | 'ACHIEVEMENT_REWARD'
  | 'quiz_reward'
  | 'daily_streak'
  | 'achievement'
  | 'referral'
  | 'redemption'
  | 'bonus';

export interface PointTransaction {
  id: string;
  userId?: string;
  type: TransactionType;
  amount: number; // positive for earned, negative for spent
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  metadata?: Record<string, any>;
}

export interface ReferralStats {
  referralCode: string;
  friendsReferred: number;
  successfulReferrals: number;
  pointsEarned: number;
  friendRewardAmount: number; // e.g. 50 TP
  userRewardAmount: number;   // e.g. 100 TP
}

export interface ReferralHistoryItem {
  id: string;
  friendDisplayName: string;
  joinedDate: string;
  rewardPoints: number;
  status: 'completed' | 'pending';
}

export interface Wallet {
  balance: number;
  thisWeekEarned: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  currencyName: string; // 'TunePoints'
  currencySymbol: string; // 'TP'
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  costPoints: number;
  durationDays?: number;
  category: 'premium' | 'cosmetic' | 'boost' | 'merch';
  icon: string;
  popular?: boolean;
  unlockedFeatures: string[];
  bannerGradient: string;
  stock?: number;
}

export interface RedemptionResult {
  success: boolean;
  transactionId: string;
  rewardId: string;
  rewardTitle: string;
  pointsDeducted: number;
  remainingBalance: number;
  message: string;
  activatedUntil?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quiz' | 'listening' | 'streak' | 'points' | 'level';
  rewardPoints: number;
  rewardXp: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  progressPercent: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  quizScore: number;
  tunePoints: number;
  streak: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export type LeaderboardTimeframe = 'weekly' | 'monthly' | 'all-time' | 'friends';
