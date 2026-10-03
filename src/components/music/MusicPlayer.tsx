import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useUIStore } from '../../store/uiStore';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    queue,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLikeCurrent,
    setIsExpandedMobile,
    useFallbackSynth,
  } = usePlayerStore();

  const { isQueueOpen, setQueueOpen } = useUIStore();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentSong) return null;

  return (
    <>
      {/* Desktop Player Bar (hidden on mobile, visible md+) */}
      <footer className="hidden md:flex fixed bottom-0 left-0 right-0 z-40 h-24 bg-surface/95 backdrop-blur-2xl border-t border-border px-6 items-center justify-between select-none shadow-soft-lg">
        {/* Left: Current Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
          <div className="relative group flex-shrink-0">
            <img
              src={currentSong.coverImage}
              alt={currentSong.title}
              className={`w-14 h-14 rounded-xl object-cover border border-border shadow-sm ${
                isPlaying ? 'ring-2 ring-primary/60' : ''
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center gap-0.5">
                <span className="w-1 h-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-6 bg-primary-hover rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-3 bg-primary rounded-full animate-bounce" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate hover:underline cursor-pointer">
              {currentSong.title}
            </p>
            <p className="text-xs text-text-secondary truncate hover:text-text-primary cursor-pointer">
              {currentSong.artist}
            </p>
            {useFallbackSynth && (
              <span className="inline-flex items-center gap-1 text-[10px] text-primary font-medium mt-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Synthesized
              </span>
            )}
          </div>

          <button
            onClick={toggleLikeCurrent}
            className={`p-2 rounded-full hover:bg-surface-secondary transition-colors ${
              currentSong.isLiked ? 'text-danger' : 'text-text-muted hover:text-text-primary'
            }`}
            title={currentSong.isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${currentSong.isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-2 max-w-xl w-2/4 px-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-lg transition-colors ${
                shuffle ? 'text-primary' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-soft-sm cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={cycleRepeat}
              className={`p-1.5 rounded-lg transition-colors ${
                repeat !== 'off' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
              }`}
              title={`Repeat: ${repeat}`}
            >
              {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="w-full flex items-center gap-3 text-xs text-text-secondary">
            <span className="w-9 text-right font-mono">{formatTime(currentTime)}</span>
            <div className="relative flex-1 group py-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-secondary rounded-lg appearance-none cursor-pointer group-hover:h-2 transition-all accent-primary"
              />
            </div>
            <span className="w-9 text-left font-mono">{formatTime(duration || currentSong.duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Queue */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
          <div
            className="relative flex items-center gap-2"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={toggleMute}
              className="p-2 text-text-muted hover:text-text-primary transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-danger" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1.5 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <button
            onClick={() => setQueueOpen(!isQueueOpen)}
            className={`p-2 rounded-xl transition-colors ${
              isQueueOpen ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
            title="Play Queue"
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Slide-out Queue Panel */}
      {isQueueOpen && (
        <div className="hidden md:block fixed right-6 bottom-28 w-80 max-h-96 bg-surface rounded-2xl p-4 shadow-soft-lg z-40 overflow-hidden border border-border">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-primary" /> Play Queue ({queue.length})
            </h4>
            <button
              onClick={() => setQueueOpen(false)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Close
            </button>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {queue.map((song, i) => (
              <div
                key={`${song.id}-${i}`}
                className={`flex items-center gap-3 p-2 rounded-xl text-xs ${
                  currentSong.id === song.id ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                <img src={song.coverImage} alt={song.title} className="w-8 h-8 rounded-lg object-cover border border-border" />
                <div className="flex-1 truncate">
                  <p className="truncate text-text-primary">{song.title}</p>
                  <p className="text-text-muted truncate text-[10px]">{song.artist}</p>
                </div>
                <span className="font-mono text-[10px] text-text-muted">{formatTime(song.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
