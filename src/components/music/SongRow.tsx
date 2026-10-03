import React from 'react';
import { Play, Pause, Heart, Plus, Clock } from 'lucide-react';
import { Song } from '../../types';
import { usePlayerStore } from '../../store/playerStore';

export interface SongRowProps {
  song: Song;
  index: number;
  playlistContext?: Song[];
  onAddToPlaylist?: (song: Song) => void;
  showAlbum?: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  playlistContext,
  onAddToPlaylist,
  showAlbum = true,
}) => {
  const { currentSong, isPlaying, playSong, pause, toggleLikeCurrent } = usePlayerStore();
  const isCurrent = currentSong?.id === song.id;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent && isPlaying) {
      pause();
    } else {
      playSong(song, playlistContext);
    }
  };

  return (
    <div
      onClick={handlePlayToggle}
      className={`group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer select-none ${
        isCurrent
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-surface-secondary border border-transparent'
      }`}
    >
      {/* Index or Equalizer or Play overlay */}
      <div className="w-8 flex items-center justify-center flex-shrink-0 text-xs font-mono text-text-muted">
        {isCurrent && isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-0.5 h-3 bg-primary rounded-full animate-bounce" />
            <span className="w-0.5 h-4 bg-primary-hover rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="w-0.5 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]" />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <Play className="w-4 h-4 text-primary fill-current hidden group-hover:block" />
          </>
        )}
      </div>

      {/* Album Artwork */}
      <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-border shadow-sm">
        <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
      </div>

      {/* Title & Artist */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>
          {song.title}
        </p>
        <p className="text-xs text-text-secondary truncate mt-0.5">{song.artist}</p>
      </div>

      {/* Album Name (hidden on small screens) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 pr-4">
          <p className="text-xs text-text-secondary truncate">{song.album}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
        {onAddToPlaylist && (
          <button
            onClick={() => onAddToPlaylist(song)}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-secondary opacity-0 group-hover:opacity-100 transition-opacity"
            title="Add to Playlist"
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
          className={`p-1.5 rounded-lg transition-colors ${
            song.isLiked ? 'text-danger' : 'text-text-muted hover:text-text-primary sm:opacity-0 sm:group-hover:opacity-100'
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
};
