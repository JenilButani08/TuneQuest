import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  Gift,
  Flame,
  Award,
  HelpCircle,
  Copy,
  Check,
  Crown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';

export interface RewardsReferralSectionProps {
  pointsBalance: number;
  thisWeekEarned: number;
  referralCode: string;
}

export const RewardsReferralSection: React.FC<RewardsReferralSectionProps> = ({
  pointsBalance,
  thisWeekEarned,
  referralCode,
}) => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Referral Code Copied',
        message: `${referralCode} copied to clipboard!`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Could not copy referral code.',
      });
    }
  };

  return (
    <section className="space-y-6">
      {/* 2-Column Split: TunePoints Wallet + Referral Promotion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: TunePoints Balance & Ways to Earn (7 cols) */}
        <Card className="lg:col-span-7 p-6 sm:p-7 shadow-soft-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Gamified Rewards
                </span>
                <h3 className="text-xl font-bold text-text-primary mt-0.5">
                  Keep playing. Keep earning.
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            {/* Balance Overview */}
            <div className="p-4 rounded-2xl bg-surface-secondary border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-text-muted">Your TunePoints</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-text-primary tracking-tight">
                    {pointsBalance.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-primary">TP</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-text-muted">This week</span>
                <p className="text-sm font-bold text-success mt-0.5">
                  +{thisWeekEarned} TP
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/rewards')}
                className="mt-1 sm:mt-0 font-semibold"
              >
                View Rewards
              </Button>
            </div>

            {/* Breakdown of how to earn more */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left">
              <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border/80">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" /> Quiz
                </span>
                <p className="text-xs font-semibold text-primary mt-1">+10 TP</p>
                <p className="text-[11px] text-text-muted">per correct answer</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border/80">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-warning" /> Streak
                </span>
                <p className="text-xs font-semibold text-warning mt-1">Multipliers</p>
                <p className="text-[11px] text-text-muted">daily bonuses</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border/80">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-success" /> Referral
                </span>
                <p className="text-xs font-semibold text-success mt-1">+100 TP</p>
                <p className="text-[11px] text-text-muted">per joined friend</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Referral Promotion Card (5 cols) */}
        <Card className="lg:col-span-5 p-6 sm:p-7 shadow-soft-sm flex flex-col justify-between">
          <div className="space-y-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-text-primary">Share the music.</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                Invite a friend to TuneQuest. They receive 50 TunePoints, and you receive 100 TunePoints when they join.
              </p>
            </div>

            {/* Code Box */}
            <div className="bg-surface-secondary border border-border rounded-xl p-3 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-text-muted block">Your referral code</span>
                <span className="font-mono text-sm font-bold text-text-primary tracking-wider">
                  {referralCode}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="font-medium text-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-success" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/referrals')}
              className="w-full justify-center font-semibold"
            >
              Invite Friends <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Subtle Premium Banner (Section 44) */}
      <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-soft-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Unlock more from TuneQuest
            </h4>
            <p className="text-xs text-text-secondary mt-0.5">
              Lossless 320kbps audio • Unlimited skips • Zero advertisements • Exclusive VIP trivia
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/rewards/redeem')}
          className="font-semibold flex-shrink-0"
        >
          Explore Premium
        </Button>
      </div>
    </section>
  );
};
