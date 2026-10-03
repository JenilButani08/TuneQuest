import React, { useState, useEffect } from 'react';
import {
  Users,
  Copy,
  Share2,
  Check,
  Gift,
  Award,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { referralService } from '../../services/referral/referralService';
import { ReferralStats, ReferralHistoryItem } from '../../types';

export const ReferralsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [history, setHistory] = useState<ReferralHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const referralCode = stats?.referralCode || user?.referralCode || 'TUNE-A7K92X';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  useEffect(() => {
    const loadReferralData = async () => {
      try {
        setIsLoading(true);
        const [statsData, historyData] = await Promise.all([
          referralService.getReferralStats(),
          referralService.getReferralHistory(),
        ]);
        setStats(statsData);
        setHistory(historyData);
      } catch (err) {
        console.error('Failed to load referral data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadReferralData();
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Referral Code Copied',
        message: 'Referral code copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Unable to copy to clipboard.',
      });
    }
  };

  const handleShare = async () => {
    const shareMessage = `Join me on TuneQuest and earn 50 TunePoints! Use my referral code: ${referralCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TuneQuest — Listen. Play. Earn. Unlock.',
          text: shareMessage,
          url: referralLink,
        });
        addToast({
          type: 'success',
          title: 'Shared!',
          message: 'Referral invitation sent.',
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          fallbackCopyLink();
        }
      }
    } else {
      fallbackCopyLink();
    }
  };

  const fallbackCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      addToast({
        type: 'success',
        title: 'Referral Link Copied',
        message: 'Invite link copied to clipboard!',
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Could not copy link.',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="primary" size="sm">
            <Gift className="w-3.5 h-3.5 mr-1" /> Referral Program
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Invite Friends
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl">
          Share your referral code with friends. They receive 50 TunePoints when joining, and you receive 100 TunePoints for every friend who creates an account.
        </p>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code & Rewards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Referral Code Card */}
          <Card className="p-6 sm:p-7 shadow-soft-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Your Unique Referral Code
                </p>
                <h3 className="text-lg font-bold text-text-primary mt-0.5">
                  Share & Earn TunePoints
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
            </div>

            {/* Code Display Box */}
            <div className="bg-surface-secondary border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
              <div className="text-center sm:text-left">
                <span className="text-xs text-text-muted block mb-0.5">Referral Code</span>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-text-primary">
                  {referralCode}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCopyCode}
                  className="flex-1 sm:flex-initial justify-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1.5" /> Copy Code
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleShare}
                  className="flex-1 sm:flex-initial justify-center"
                >
                  <Share2 className="w-4 h-4 mr-1.5" /> Share
                </Button>
              </div>
            </div>

            {/* Value Exchange Banner */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface-secondary/70 border border-border text-center">
              <div className="border-r border-border pr-2">
                <span className="text-[11px] text-text-secondary block">Your friend receives</span>
                <span className="text-lg font-bold text-success">+50 TP</span>
              </div>
              <div className="pl-2">
                <span className="text-[11px] text-text-secondary block">You receive</span>
                <span className="text-lg font-bold text-primary">+100 TP</span>
              </div>
            </div>
          </Card>

          {/* Referral Reward Explanation */}
          <Card className="p-6 shadow-soft-sm">
            <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> How Referral Rewards Work
            </h4>
            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  <strong className="text-text-primary">Share your link or code:</strong> Friends can use your link or enter your code in the signup form.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  <strong className="text-text-primary">Friend signs up:</strong> Once their account is confirmed by the backend, they instantly receive 50 TunePoints.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  <strong className="text-text-primary">You receive 100 TunePoints:</strong> The reward is credited to your wallet with an official transaction record.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-[11px] text-text-muted">
              <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
              <span>
                Rewards are validated and awarded server-side upon successful registration.
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Stats & History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stats Summary Cards */}
          <Card className="p-6 shadow-soft-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
              Referral Statistics
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                <p className="text-[11px] text-text-secondary truncate">Invited</p>
                <p className="text-xl font-bold text-text-primary mt-1">
                  {stats?.friendsReferred ?? 5}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                <p className="text-[11px] text-text-secondary truncate">Joined</p>
                <p className="text-xl font-bold text-success mt-1">
                  {stats?.successfulReferrals ?? 4}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                <p className="text-[11px] text-text-secondary truncate">Earned</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {stats?.pointsEarned ?? 400} <span className="text-xs font-normal text-text-muted">TP</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Referral History List */}
          <Card className="p-6 shadow-soft-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-text-primary">Referral History</h4>
              <span className="text-xs text-text-muted">{history.length} completed</span>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">
                No referrals yet. Share your code to earn your first bonus!
              </p>
            ) : (
              <div className="divide-y divide-border">
                {history.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-text-primary">{item.friendDisplayName}</p>
                      <p className="text-[11px] text-text-muted">
                        Joined {new Date(item.joinedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-success block">+{item.rewardPoints} TP</span>
                      <span className="text-[10px] text-text-muted capitalize">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
