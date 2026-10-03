import React from 'react';
import { Headphones, Sparkles, Gift, Coins, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export interface QuickActionsProps {
  onContinueListening: () => void;
  onDailyChallenge: () => void;
  onRewards: () => void;
  onReferrals: () => void;
  lastPlayedTitle?: string;
  pointsBalance: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onContinueListening,
  onDailyChallenge,
  onRewards,
  onReferrals,
  lastPlayedTitle,
  pointsBalance,
}) => {
  return (
    <section aria-label="Quick Actions" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Continue Listening */}
      <div
        onClick={onContinueListening}
        className="group bg-surface hover:bg-surface-secondary border border-border hover:border-primary/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-soft-sm hover:shadow-soft-md flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">Continue Listening</p>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              {lastPlayedTitle ? `Resume: ${lastPlayedTitle}` : 'Pick up where you left off'}
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
      </div>

      {/* 2. Daily Challenge */}
      <div
        onClick={onDailyChallenge}
        className="group bg-surface hover:bg-surface-secondary border border-border hover:border-warning/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-soft-sm hover:shadow-soft-md flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-warning/10 text-warning flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-text-primary truncate">Daily Challenge</p>
              <span className="text-[10px] font-bold text-warning bg-warning/10 px-1.5 py-0.2 rounded">
                Today
              </span>
            </div>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              Test ear • Earn +100 TP
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-warning group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
      </div>

      {/* 3. Your Rewards */}
      <div
        onClick={onRewards}
        className="group bg-surface hover:bg-surface-secondary border border-border hover:border-primary/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-soft-sm hover:shadow-soft-md flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">Your Rewards</p>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              {pointsBalance.toLocaleString()} TP balance
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
      </div>

      {/* 4. Invite Friends */}
      <div
        onClick={onReferrals}
        className="group bg-surface hover:bg-surface-secondary border border-border hover:border-success/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-soft-sm hover:shadow-soft-md flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-success/10 text-success flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">Invite Friends</p>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              You get +100 TP • Friend +50
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-success group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
      </div>
    </section>
  );
};
