import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const ExpandedMobilePlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    repeat,
    volume,
    isExpandedMobile,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    toggleLikeCurrent,
    setIsExpandedMobile,
  } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      {isExpandedMobile && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="md:hidden fixed inset-0 z-50 bg-[#08080D] flex flex-col p-6 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4">
            <button
              onClick={() => setIsExpandedMobile(false)}
              className="p-2 -ml-2 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="text-center">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Playing from Quest
              </span>
              <p className="text-xs font-semibold text-purple-400 truncate max-w-[200px]">
                {currentSong.album}
              </p>
            </div>
            <div className="w-8" />
          </div>

          {/* Large Album Artwork */}
          <div className="my-auto py-4 flex flex-col items-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 max-w-full">
              <img
                src={currentSong.coverImage}
                alt={currentSong.title}
                className={`w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10 ${
                  isPlaying ? 'shadow-[0_0_50px_rgba(139,92,246,0.35)]' : ''
                }`}
              />
              {isPlaying && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-600/50 flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3 h-3 text-purple-400 animate-spin" />
                  <span className="text-[10px] font-bold text-purple-300">Live Playing</span>
                </div>
              )}
            </div>
          </div>

          {/* Title & Artist & Like */}
          <div className="flex items-center justify-between my-4">
            <div className="min-w-0 pr-4">
              <h2 className="text-xl font-bold text-white truncate">{currentSong.title}</h2>
              <p className="text-sm text-slate-400 truncate">{currentSong.artist}</p>
            </div>
            <button
              onClick={toggleLikeCurrent}
              className={`p-3 rounded-full hover:bg-white/5 transition-colors ${
                currentSong.isLiked ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              <Heart className={`w-6 h-6 ${currentSong.isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Trivia Snippet Pill */}
          {currentSong.triviaSnippet && (
            <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/30 mb-4 flex items-start gap-2 text-xs text-purple-300">
              <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <p>{currentSong.triviaSnippet}</p>
            </div>
          )}

          {/* Time Scrubber */}
          <div className="space-y-1 mb-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || currentSong.duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between px-2 mb-6">
            <button onClick={toggleShuffle} className={`p-2 ${shuffle ? 'text-cyan-400' : 'text-slate-400'}`}>
              <Shuffle className="w-5 h-5" />
            </button>
            <button onClick={prevTrack} className="p-2 text-white">
              <SkipBack className="w-7 h-7 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-2 text-white">
              <SkipForward className="w-7 h-7 fill-current" />
            </button>
            <button onClick={cycleRepeat} className={`p-2 ${repeat !== 'off' ? 'text-purple-400' : 'text-slate-400'}`}>
              {repeat === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 px-4 pt-2 border-t border-white/5">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-purple-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
