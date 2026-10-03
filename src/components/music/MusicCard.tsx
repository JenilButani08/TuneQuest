import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Song, Album, Playlist } from '../../types';
import { usePlayerStore } from '../../store/playerStore';

export interface MusicCardProps {
  item: Song | Album | Playlist;
  type: 'song' | 'album' | 'playlist';
  onClick?: () => void;
  playlistContext?: Song[];
}

export const MusicCard: React.FC<MusicCardProps> = ({
  item,
  type,
  onClick,
  playlistContext,
}) => {
  const { currentSong, isPlaying, playSong, pause } = usePlayerStore();
  const isCurrentSong = type === 'song' && currentSong?.id === (item as Song).id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'song') {
      const song = item as Song;
      if (isCurrentSong && isPlaying) {
        pause();
      } else {
        playSong(song, playlistContext);
      }
    } else if (onClick) {
      onClick();
    }
  };

  const getTitle = () => item.title;
  const getSubtitle = () => {
    if (type === 'song') return (item as Song).artist;
    if (type === 'album') return `${(item as Album).artist} • ${(item as Album).releaseYear}`;
    return (item as Playlist).description || 'Curated Playlist';
  };

  return (
    <div
      onClick={onClick}
      className="group bg-surface hover:bg-surface-secondary border border-border p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 relative flex flex-col shadow-soft-sm hover:shadow-soft-md"
    >
      {/* Artwork Box */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 border border-border shadow-sm">
        <img
          src={item.coverImage}
          alt={getTitle()}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Play Button Overlay */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-soft-md transition-all duration-300 ${
            isCurrentSong && isPlaying
              ? 'opacity-100 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          aria-label={isCurrentSong && isPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Details */}
      <h4 className={`font-semibold text-sm truncate ${isCurrentSong ? 'text-primary' : 'text-text-primary'}`}>
        {getTitle()}
      </h4>
      <p className="text-xs text-text-secondary truncate mt-1">{getSubtitle()}</p>
    </div>
  );
};
