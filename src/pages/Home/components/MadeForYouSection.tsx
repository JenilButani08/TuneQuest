import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { Song } from '../../../types';
import { MusicCard } from '../../../components/music/MusicCard';
import { Button } from '../../../components/ui/Button';

export interface MadeForYouSectionProps {
  songs: Song[];
  hasListeningHistory: boolean;
}

export const MadeForYouSection: React.FC<MadeForYouSectionProps> = ({
  songs,
  hasListeningHistory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Made for you
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Music curated around your taste and genre preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasListeningHistory && songs.length > 0 && (
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
          )}

          <Link
            to="/browse"
            className="text-xs font-semibold text-primary hover:underline ml-2"
          >
            See all →
          </Link>
        </div>
      </div>

      {/* Content: Carousel OR Empty State */}
      {!hasListeningHistory || songs.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-2xl bg-surface border border-border text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            Start listening to help us personalize your recommendations
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            As you stream tracks and like songs, TuneQuest discovers your favorite tempos, genres, and artists.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={() => navigate('/browse')}>
              Explore Music
            </Button>
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
          tabIndex={0}
          aria-label="Made for you recommendations"
        >
          {songs.map((song) => (
            <div key={song.id} className="flex-shrink-0 w-44 sm:w-52 snap-start">
              <MusicCard item={song} type="song" playlistContext={songs} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
