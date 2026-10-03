import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Song } from '../../../types';
import { usePlayerStore } from '../../../store/playerStore';

export interface ContinueListeningItem extends Song {
  progressPercent: number;
}

export interface ContinueListeningSectionProps {
  tracks: ContinueListeningItem[];
}

export const ContinueListeningSection: React.FC<ContinueListeningSectionProps> = ({ tracks }) => {
  const { currentSong, isPlaying, playSong, pause } = usePlayerStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!tracks || tracks.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Continue Listening
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Pick up right where you left off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Carousel Left/Right Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/history"
            className="text-xs font-semibold text-primary hover:underline ml-2"
          >
            See all →
          </Link>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
        tabIndex={0}
        aria-label="Continue listening tracks"
      >
        {tracks.map((song) => {
          const isCurrent = currentSong?.id === song.id;
          const isCurrentlyPlaying = isCurrent && isPlaying;

          const handlePlayClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isCurrentlyPlaying) {
              pause();
            } else {
              playSong(song, tracks);
            }
          };

          return (
            <div
              key={song.id}
              onClick={handlePlayClick}
              className="group flex-shrink-0 w-44 sm:w-52 bg-surface hover:bg-surface-secondary border border-border rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-pointer shadow-soft-sm hover:shadow-soft-md snap-start select-none"
            >
              {/* Artwork Box */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 border border-border shadow-sm">
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Play Button */}
                <button
                  onClick={handlePlayClick}
                  aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                  className={`absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-soft-md transition-all duration-200 cursor-pointer ${
                    isCurrentlyPlaying
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Title & Artist */}
              <h3 className={`text-sm font-bold truncate ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>
                {song.title}
              </h3>
              <p className="text-xs text-text-secondary truncate mt-0.5">
                {song.artist}
              </p>

              {/* Progress Bar (e.g. 62% finished) */}
              <div className="mt-3 pt-2 border-t border-border/80">
                <div className="flex items-center justify-between text-[10px] text-text-muted mb-1 font-mono">
                  <span>Progress</span>
                  <span>{song.progressPercent}%</span>
                </div>
                <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${song.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
