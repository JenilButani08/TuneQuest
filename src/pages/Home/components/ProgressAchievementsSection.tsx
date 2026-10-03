import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { UserHomeProgress } from '../../../services/home/homeService';

export interface ProgressAchievementsSectionProps {
  progress: UserHomeProgress;
}

export const ProgressAchievementsSection: React.FC<ProgressAchievementsSectionProps> = ({
  progress,
}) => {
  const xpPercent = Math.round((progress.xp / progress.xpToNextLevel) * 100);

  return (
    <section className="space-y-4">
      {/* 2-Column Grid: Level Progression + Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: User Progression Card */}
        <Card className="p-5 sm:p-6 shadow-soft-sm flex flex-col justify-between text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Progression
                </span>
                <h3 className="text-base font-bold text-text-primary mt-0.5">
                  Level {progress.level} • {progress.levelTitle}
                </h3>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-warning bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
                <Flame className="w-3.5 h-3.5" /> {progress.streakDays}-Day Streak
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-text-secondary font-mono">
                <span>{progress.xp.toLocaleString()} XP</span>
                <span>{progress.xpToNextLevel.toLocaleString()} XP to Level {progress.level + 1}</span>
              </div>
              <ProgressBar value={xpPercent} variant="xp" size="sm" />
            </div>
          </div>

          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <span className="text-text-muted">Earn XP by completing quizzes and listening.</span>
            <Link to="/profile" className="font-semibold text-primary hover:underline">
              View Profile →
            </Link>
          </div>
        </Card>

        {/* Right: Recent Achievements Card */}
        <Card className="p-5 sm:p-6 shadow-soft-sm flex flex-col justify-between text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Milestones
                </span>
                <h3 className="text-base font-bold text-text-primary mt-0.5">
                  Recent Achievements
                </h3>
              </div>
              <Link to="/achievements" className="text-xs font-semibold text-primary hover:underline">
                View All →
              </Link>
            </div>

            {/* 3 Achievement items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {progress.recentAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-3 rounded-xl bg-surface-secondary border border-border flex flex-col items-center text-center space-y-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <h4 className="text-xs font-bold text-text-primary truncate w-full">
                    {ach.title}
                  </h4>
                  <span className="text-[10px] text-text-muted line-clamp-1">
                    +{ach.rewardPoints} TP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border mt-3 text-xs text-text-muted">
            12 total achievements available to unlock.
          </div>
        </Card>
      </div>
    </section>
  );
};
