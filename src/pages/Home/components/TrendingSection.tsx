import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart, Plus, Clock } from 'lucide-react';
import { Song } from '../../../types';
import { usePlayerStore } from '../../../store/playerStore';

export interface TrendingSectionProps {
  songs: Song[];
  onAddToPlaylist?: (song: Song) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const TrendingSection: React.FC<TrendingSectionProps> = ({ songs, onAddToPlaylist }) => {
  const { currentSong, isPlaying, playSong, pause, toggleLikeCurrent } = usePlayerStore();

  const displaySongs = songs.slice(0, 8);

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Trending now
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            What listeners across TuneQuest are playing today.
          </p>
        </div>

        <Link
          to="/browse"
          className="text-xs font-semibold text-primary hover:underline ml-2"
        >
          See all →
        </Link>
      </div>

      {/* 2-Column Ranked List Grid (Editorial Chart Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
        {displaySongs.map((song, index) => {
          const isCurrent = currentSong?.id === song.id;
          const isCurrentlyPlaying = isCurrent && isPlaying;
          const rankFormatted = String(index + 1).padStart(2, '0');

          const handlePlayClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isCurrentlyPlaying) {
              pause();
            } else {
              playSong(song, songs);
            }
          };

          return (
            <div
              key={song.id}
              onClick={handlePlayClick}
              className={`group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl transition-all duration-150 cursor-pointer select-none border ${
                isCurrent
                  ? 'bg-primary/10 border-primary/30 shadow-soft-sm'
                  : 'bg-surface hover:bg-surface-secondary border-border hover:border-border/80'
              }`}
            >
              {/* Ranking Number */}
              <span className="w-6 text-center font-mono font-bold text-xs text-text-muted group-hover:text-primary transition-colors flex-shrink-0">
                {rankFormatted}
              </span>

              {/* Artwork Container */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-border shadow-sm">
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Play overlay button */}
                <div
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4 text-white fill-current" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  )}
                </div>
              </div>

              {/* Title & Artist */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-semibold truncate ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>
                  {song.title}
                </h3>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  {song.artist}
                </p>
              </div>

              {/* Action Buttons & Duration */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {onAddToPlaylist && (
                  <button
                    onClick={() => onAddToPlaylist(song)}
                    className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    song.isLiked
                      ? 'text-danger'
                      : 'text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100'
                  }`}
                  title={song.isLiked ? 'Liked' : 'Like'}
                >
                  <Heart className={`w-4 h-4 ${song.isLiked ? 'fill-current' : ''}`} />
                </button>

                <span className="font-mono text-xs text-text-muted w-10 text-right">
                  {formatDuration(song.duration)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
