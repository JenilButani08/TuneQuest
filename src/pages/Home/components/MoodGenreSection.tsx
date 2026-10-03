import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass } from 'lucide-react';
import { ActivityMoodItem, GenreItem } from '../../../mock/genres';

export interface MoodGenreSectionProps {
  moods: ActivityMoodItem[];
  genres: GenreItem[];
}

export const MoodGenreSection: React.FC<MoodGenreSectionProps> = ({ moods, genres }) => {
  const navigate = useNavigate();

  return (
    <section className="space-y-8">
      {/* 1. Mood Discovery */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Discover by Mood
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Handcrafted soundscapes designed to match your activity and vibe.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {moods.slice(0, 4).map((mood) => (
            <div
              key={mood.id}
              onClick={() => navigate('/browse')}
              className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden cursor-pointer border border-border shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
            >
              {/* Background Image */}
              <img
                src={mood.image}
                alt={mood.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle Darkening Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Text Information */}
              <div className="absolute inset-0 p-3.5 flex flex-col justify-end text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                  {mood.tag}
                </span>
                <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
                  {mood.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Genre Discovery Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" /> Popular Genres
          </h3>
          <button
            onClick={() => navigate('/browse')}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            All Genres →
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => navigate(`/browse?genre=${encodeURIComponent(genre.name)}`)}
              className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-secondary border border-border hover:border-primary/40 text-xs font-semibold text-text-primary transition-all duration-150 cursor-pointer shadow-soft-sm active:scale-95"
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
