import React, { useEffect, useState } from 'react';
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Brain,
  Music,
  Coins,
  Headphones,
  Compass,
  Star,
  FolderHeart,
  Trophy,
  Crown,
} from 'lucide-react';
import { achievementService } from '../../services/user/userService';
import { Achievement } from '../../types';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Coins: <Coins className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  FolderHeart: <FolderHeart className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
};

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    achievementService.getAchievements().then(setAchievements);
  }, []);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const filtered = achievements.filter((a) => {
    if (filter === 'unlocked') return a.isUnlocked;
    if (filter === 'locked') return !a.isUnlocked;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400" /> Achievements & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Unlock achievements by streaming songs, guessing tracks, maintaining daily streaks, and mastering trivia.
          </p>
        </div>

        <div className="p-3 bg-surface border border-slate-800 rounded-2xl flex items-center gap-3 w-fit">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Trophies Unlocked</span>
            <p className="text-lg font-bold text-amber-400">
              {unlockedCount} / {achievements.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            {Math.round((unlockedCount / (achievements.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-surface border border-slate-800 rounded-2xl w-fit">
        {(['all', 'unlocked', 'locked'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === t
                ? 'bg-purple-600 text-white shadow-glow-primary/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className={`glass-card p-5 rounded-3xl flex flex-col justify-between space-y-4 border ${
              ach.isUnlocked
                ? 'border-purple-500/40 bg-purple-950/10 shadow-glow-primary/10'
                : 'border-slate-800/80 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  ach.isUnlocked
                    ? 'bg-gradient-to-tr from-purple-600 to-amber-500 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {iconMap[ach.icon] || <Award className="w-6 h-6" />}
              </div>

              {ach.isUnlocked ? (
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Unlocked
                </Badge>
              ) : (
                <Badge variant="outline" size="sm">
                  <Lock className="w-3 h-3 mr-1" /> Locked
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{ach.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Progress</span>
                <span>
                  {ach.progress} / {ach.maxProgress}
                </span>
              </div>
              <ProgressBar
                value={ach.progressPercent}
                variant={ach.isUnlocked ? 'success' : 'primary'}
                size="sm"
              />
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">+{ach.rewardPoints} TP</span>
              <span className="text-cyan-400 font-bold">+{ach.rewardXp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
