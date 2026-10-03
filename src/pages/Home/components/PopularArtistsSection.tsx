import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Artist } from '../../../types';

export interface PopularArtistsSectionProps {
  artists: Artist[];
}

const formatFollowers = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${Math.round(count / 1000)}k`;
  return `${count}`;
};

export const PopularArtistsSection: React.FC<PopularArtistsSectionProps> = ({ artists }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!artists || artists.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Popular Artists
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Creators defining the sound of TuneQuest.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            to="/browse"
            className="text-xs font-semibold text-primary hover:underline ml-2"
          >
            See all →
          </Link>
        </div>
      </div>

      {/* Circular Artist Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
        tabIndex={0}
        aria-label="Popular artists"
      >
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="group flex-shrink-0 flex flex-col items-center text-center cursor-pointer select-none w-28 sm:w-36 snap-start"
          >
            {/* Circular Portrait Image */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 border-2 border-border group-hover:border-primary/60 transition-all duration-300 shadow-soft-sm group-hover:shadow-soft-md group-hover:scale-105">
              <img
                src={artist.avatarImage}
                alt={artist.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Name & Details */}
            <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate max-w-full">
              {artist.name}
            </h3>
            <p className="text-[11px] text-text-secondary truncate max-w-full mt-0.5">
              {artist.genres[0] || 'Artist'}
            </p>
            <span className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5 font-mono">
              <Users className="w-2.5 h-2.5" /> {formatFollowers(artist.monthlyListeners)} listeners
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
