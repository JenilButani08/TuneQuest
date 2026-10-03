import React from 'react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

export const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, nextTrack, toggleLikeCurrent, setIsExpandedMobile } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="md:hidden fixed bottom-14 left-2 right-2 z-30 select-none">
      <div
        onClick={() => setIsExpandedMobile(true)}
        className="bg-surface/95 border border-border rounded-2xl p-2.5 flex items-center gap-3 shadow-soft-lg cursor-pointer active:scale-98 transition-all backdrop-blur-xl"
      >
        <img
          src={currentSong.coverImage}
          alt={currentSong.title}
          className={`w-11 h-11 rounded-xl object-cover border border-border ${
            isPlaying ? 'ring-2 ring-primary/60' : ''
          }`}
        />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-text-primary truncate">{currentSong.title}</p>
          <p className="text-[11px] text-text-secondary truncate">{currentSong.artist}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={toggleLikeCurrent}
            className={`p-2 rounded-full ${currentSong.isLiked ? 'text-danger' : 'text-text-muted hover:text-text-primary'}`}
          >
            <Heart className={`w-4 h-4 ${currentSong.isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-soft-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-text-secondary hover:text-text-primary"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
