import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, Flame, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DailyChallengePreview } from '../../../services/home/homeService';

export interface DailyChallengeBannerProps {
  challenge: DailyChallengePreview;
  streakDays: number;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  challenge,
  streakDays,
}) => {
  const navigate = useNavigate();

  const progressPercent = Math.round((challenge.completedQuestions / challenge.questionCount) * 100);

  return (
    <section aria-label="Today's Music Challenge">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-surface to-surface-secondary border border-border p-6 sm:p-8 lg:p-10 shadow-soft-sm">
        {/* Subtle decorative aura */}
        <div
          className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-warning/10 blur-[80px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Challenge Description */}
          <div className="space-y-4 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="outline" size="sm" className="bg-surface font-semibold text-text-primary">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-warning" /> {challenge.categoryName}
              </Badge>
              <span className="flex items-center gap-1 text-xs font-semibold text-warning bg-warning/10 px-2.5 py-0.5 rounded-full border border-warning/20">
                <Flame className="w-3.5 h-3.5" /> {streakDays}-Day Active Streak
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {challenge.title}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                {challenge.subtitle}
              </p>
            </div>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>{challenge.questionCount} Questions</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-text-muted" />
                <span>{challenge.timeLimitSeconds}s Time Limit</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Award className="w-4 h-4" />
                <span>+{challenge.rewardPoints} TunePoints</span>
              </div>
            </div>

            {/* Progress Visualization (If already started) */}
            {challenge.isStarted && (
              <div className="pt-2 max-w-md space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-text-primary">
                    Progress: {challenge.completedQuestions} / {challenge.questionCount} completed
                  </span>
                  <span className="text-success font-mono font-bold">
                    +{Math.round((challenge.rewardPoints / challenge.questionCount) * challenge.completedQuestions)} TP earned
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 flex-shrink-0 pt-2 lg:pt-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/quiz/daily')}
              className="w-full sm:w-auto font-bold px-8 shadow-soft-sm cursor-pointer"
            >
              {challenge.isStarted ? 'Continue Challenge' : 'Start Challenge'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <span className="text-[11px] text-text-muted">
              Refreshes daily at midnight UTC
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
