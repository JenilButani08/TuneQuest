import React from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, Trophy, Disc3, Headphones, Award } from 'lucide-react';

interface AuthVisualPanelProps {
  mode: 'login' | 'register';
}

export const AuthVisualPanel: React.FC<AuthVisualPanelProps> = ({ mode }) => {
  const isLogin = mode === 'login';

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[640px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#12141C] via-[#1A1D27] to-[#0F1117] p-8 lg:p-12 flex flex-col justify-between text-white border border-white/10 shadow-2xl select-none">
      {/* Ambient background glows */}
      <div
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/20 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top: Brand Header */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-slate-300">
            TuneQuest Soundstage
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {isLogin ? (
            <>
              DISCOVER <br />
              <span className="bg-gradient-to-r from-primary-light via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                YOUR SOUND.
              </span>
            </>
          ) : (
            <>
              JOIN THE <br />
              <span className="bg-gradient-to-r from-primary-light via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                SOUNDSTAGE.
              </span>
            </>
          )}
        </h2>

        <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-sm">
          {isLogin
            ? 'Your music journey starts here. Discover songs, challenge your knowledge, and earn TunePoints along the way.'
            : 'Stream endless curated tracks, compete in daily music trivia, and unlock exclusive rewards with every listen.'}
        </p>
      </div>

      {/* Center: Interactive Music Card Showcase */}
      <div className="relative z-10 my-8 py-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative max-w-sm mx-auto"
        >
          {/* Background Card Offset (Stack effect) */}
          <div className="absolute -top-3 left-4 right-4 h-24 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm -rotate-2 pointer-events-none" />

          {/* Main "Now Playing" Style Glass Showcase Card */}
          <div className="relative bg-surface/40 dark:bg-white/[0.07] border border-white/15 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-white/10 group">
                <img
                  src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=300&auto=format&fit=crop&q=80"
                  alt="Featured Song Artwork"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Disc3 className="w-5 h-5 text-white/90 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary-light">
                    Now Playing
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    <Sparkles className="w-2.5 h-2.5" /> +50 TP
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">Faded</h4>
                <p className="text-xs text-slate-400 truncate">Alan Walker • Different World</p>
              </div>
            </div>

            {/* Subtle Equalizer & Audio Waveform */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-end gap-1 h-4">
                <span className="w-1 bg-primary rounded-full animate-pulse h-3" />
                <span className="w-1 bg-indigo-400 rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-purple-400 rounded-full animate-pulse h-2" style={{ animationDelay: '300ms' }} />
                <span className="w-1 bg-primary-light rounded-full animate-pulse h-4" style={{ animationDelay: '450ms' }} />
                <span className="w-1 bg-indigo-400 rounded-full animate-pulse h-3" style={{ animationDelay: '200ms' }} />
              </div>
              <span className="text-[11px] font-mono text-slate-400">320kbps Lossless</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Value Props Feature Badges */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
            <Headphones className="w-4 h-4 mx-auto text-primary-light mb-1" />
            <p className="text-[11px] font-semibold text-slate-200">Hi-Fi Audio</p>
            <p className="text-[9px] text-slate-400">100% Free</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
            <Trophy className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <p className="text-[11px] font-semibold text-slate-200">Daily Quizzes</p>
            <p className="text-[9px] text-slate-400">Test Knowledge</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
            <Award className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <p className="text-[11px] font-semibold text-slate-200">TunePoints</p>
            <p className="text-[9px] text-slate-400">Earn Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};
