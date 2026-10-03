import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Plus, Sparkles, Clock, Music2 } from 'lucide-react';
import { Song } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { usePlayerStore } from '../../../store/playerStore';

export interface HeroSectionProps {
  greeting: string;
  featuredSong: Song;
  playlistContext: Song[];
  isAuthenticated: boolean;
  onOpenChallenge: () => void;
  onAddToPlaylist?: (song: Song) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  greeting,
  featuredSong,
  playlistContext,
  isAuthenticated,
  onOpenChallenge,
  onAddToPlaylist,
}) => {
  const { currentSong, isPlaying, playSong, pause, toggleLikeCurrent } = usePlayerStore();
  const navigate = useNavigate();

  const isCurrent = currentSong?.id === featuredSong.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handlePlayToggle = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      playSong(featuredSong, playlistContext);
    }
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-surface border border-border p-6 sm:p-10 lg:p-12 shadow-soft-md transition-colors">
      {/* Subtle Background Glow from Album Artwork (Non-neon, subtle warm aura) */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none -mr-20 -mt-20"
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Editorial Headline & Actions (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-5 text-left"
        >
          {/* Eyebrow Greeting */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary border border-border text-xs font-semibold text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="uppercase tracking-wider text-[11px] font-bold text-text-primary">
              {greeting}
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
              Your next favorite song <br className="hidden sm:inline" />
              is <span className="text-primary">waiting</span>.
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
              Discover music picked around your taste, mood, and listening habits. Stream curated tracks, test your ear in daily challenges, and earn TunePoints.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlayToggle}
              className="font-bold px-6 shadow-soft-sm cursor-pointer"
            >
              {isCurrentlyPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current mr-2" /> Pause Track
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current mr-2" /> Start Listening
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onOpenChallenge}
              className="font-semibold px-5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-2 text-warning" /> Today's Challenge
            </Button>

            {!isAuthenticated && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/register')}
                className="font-semibold text-text-secondary hover:text-text-primary"
              >
                Create Account →
              </Button>
            )}
          </div>

          {/* Supporting Snippet */}
          <p className="text-xs text-text-muted pt-1">
            Earn 10 TunePoints for every correct quiz answer.
          </p>
        </motion.div>

        {/* Right Column: Large High-Resolution Album Artwork & Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
          className="lg:col-span-5"
        >
          <div className="bg-surface-secondary/70 border border-border rounded-2xl p-4 sm:p-5 shadow-soft-sm group">
            {/* Artwork Container */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 border border-border shadow-soft-sm">
              <img
                src={featuredSong.coverImage}
                alt={featuredSong.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />

              {/* Floating Large Play Overlay Button */}
              <button
                onClick={handlePlayToggle}
                aria-label={isCurrentlyPlaying ? 'Pause song' : 'Play song'}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-soft-md transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isCurrentlyPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </button>
            </div>

            {/* Song Information & Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Featured
                  </span>
                  <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDuration(featuredSong.duration)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-text-primary truncate">
                  {featuredSong.title}
                </h3>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  {featuredSong.artist} • <span className="text-text-muted">{featuredSong.album}</span>
                </p>
              </div>

              {/* Like and Add Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {onAddToPlaylist && (
                  <button
                    onClick={() => onAddToPlaylist(featuredSong)}
                    className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                    title="Add to playlist"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={async () => {
                    if (isCurrent) {
                      await toggleLikeCurrent();
                    }
                  }}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    featuredSong.isLiked
                      ? 'text-danger hover:bg-danger/10'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface'
                  }`}
                  title={featuredSong.isLiked ? 'Liked' : 'Like'}
                >
                  <Heart className={`w-4 h-4 ${featuredSong.isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Contextual Trivia Snippet */}
            {featuredSong.triviaSnippet && (
              <div className="mt-3.5 pt-3 border-t border-border/80 flex items-start gap-2 text-xs text-text-secondary leading-snug">
                <Music2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{featuredSong.triviaSnippet}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
