import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { usePlayerStore } from '../../store/playerStore';
import { homeService, HomeData } from '../../services/home/homeService';
import { Song } from '../../types';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { AddToPlaylistModal } from '../../components/music/AddToPlaylistModal';

// Redesigned Home Page Sections
import { HeroSection } from './components/HeroSection';
import { QuickActions } from './components/QuickActions';
import { ContinueListeningSection } from './components/ContinueListeningSection';
import { DailyChallengeBanner } from './components/DailyChallengeBanner';
import { MadeForYouSection } from './components/MadeForYouSection';
import { TrendingSection } from './components/TrendingSection';
import { PopularArtistsSection } from './components/PopularArtistsSection';
import { MoodGenreSection } from './components/MoodGenreSection';
import { RewardsReferralSection } from './components/RewardsReferralSection';
import { ProgressAchievementsSection } from './components/ProgressAchievementsSection';
import { HomeFooter } from './components/HomeFooter';

export const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { wallet } = useWalletStore();
  const { playSong } = usePlayerStore();
  const navigate = useNavigate();

  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const homePayload = await homeService.getHomeData(user);
      setData(homePayload);
    } catch (err: any) {
      console.error('Failed to load home data', err);
      setError('We could not load your music recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // Loading Skeleton State (Section 35)
  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-12 sm:space-y-16 animate-pulse">
        {/* Hero Skeleton */}
        <div className="rounded-3xl bg-surface border border-border p-8 sm:p-12 h-96 flex flex-col justify-between">
          <div className="space-y-3 max-w-lg">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-12 w-3/4 rounded-2xl" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>

        {/* Carousel Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-60 rounded-lg" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-48 h-56 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State (Section 37)
  if (error && !data) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-surface border border-border text-center space-y-4 shadow-soft-md">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Music Stream Unavailable</h3>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {error}
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={fetchHomeData}
          className="cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-12 sm:space-y-16 lg:space-y-20 transition-colors">
      {/* 1. HERO SECTION (Editorial Music Showcase) */}
      <HeroSection
        greeting={data.greeting}
        featuredSong={data.featuredSong}
        playlistContext={data.trending}
        isAuthenticated={isAuthenticated}
        onOpenChallenge={() => navigate('/quiz/daily')}
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 2. QUICK ACTION CARDS */}
      <QuickActions
        onContinueListening={() => {
          if (data.continueListening.length > 0) {
            playSong(data.continueListening[0], data.continueListening);
          } else {
            navigate('/browse');
          }
        }}
        onDailyChallenge={() => navigate('/quiz/daily')}
        onRewards={() => navigate('/rewards')}
        onReferrals={() => navigate('/referrals')}
        lastPlayedTitle={data.continueListening[0]?.title}
        pointsBalance={wallet.balance}
      />

      {/* 3. CONTINUE LISTENING CAROUSEL */}
      {data.continueListening.length > 0 && (
        <ContinueListeningSection tracks={data.continueListening} />
      )}

      {/* 4. DAILY MUSIC CHALLENGE BANNER */}
      <DailyChallengeBanner
        challenge={data.dailyChallenge}
        streakDays={user?.streak || 7}
      />

      {/* 5. MADE FOR YOU (Personalized Music Carousel) */}
      <MadeForYouSection
        songs={data.recommendations}
        hasListeningHistory={isAuthenticated}
      />

      {/* 6. TRENDING NOW (Ranked Music Chart Grid) */}
      <TrendingSection
        songs={data.trending}
        onAddToPlaylist={(song) => setSelectedSongForPlaylist(song)}
      />

      {/* 7. POPULAR ARTISTS (Circular Portraits) */}
      <PopularArtistsSection artists={data.popularArtists} />

      {/* 8. MOOD & GENRE DISCOVERY */}
      <MoodGenreSection moods={data.moods} genres={data.genres} />

      {/* 9. TUNEPOINTS + REFERRAL PROMOTION & SUBTLE PREMIUM BANNER */}
      <RewardsReferralSection
        pointsBalance={wallet.balance}
        thisWeekEarned={data.userProgress?.thisWeekEarned || 320}
        referralCode={user?.referralCode || 'TUNE-A7K92X'}
      />

      {/* 10. USER PROGRESSION & RECENT ACHIEVEMENTS (Authenticated) */}
      {isAuthenticated && data.userProgress && (
        <ProgressAchievementsSection progress={data.userProgress} />
      )}

      {/* 11. POLISHED 4-COLUMN FOOTER */}
      <HomeFooter />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        song={selectedSongForPlaylist}
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
      />
    </div>
  );
};
