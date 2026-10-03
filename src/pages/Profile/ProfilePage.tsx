import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Coins,
  Flame,
  Award,
  Sparkles,
  Check,
  FolderHeart,
  Headphones,
  CheckCircle2,
  Gift,
  Copy,
  Share2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useUIStore } from '../../store/uiStore';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { wallet } = useWalletStore();
  const { addToast } = useUIStore();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralCode = user.referralCode || 'TUNE-A7K92X';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

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
        message: 'Could not copy code.',
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
          message: 'Referral link shared successfully.',
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyLinkFallback();
        }
      }
    } else {
      copyLinkFallback();
    }
  };

  const copyLinkFallback = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Referral link copied to clipboard!',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Unable to copy link.',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8 shadow-soft-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-border shadow-soft-sm"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-primary text-[11px] font-bold text-white shadow-soft-sm">
              Lvl {user.level}
            </span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {user.displayName}
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary">
                  @{user.username} • Joined January 2025
                </p>
              </div>

              <Link to="/settings">
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </Link>
            </div>

            {/* Favorite Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {user.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-1 rounded-full bg-surface-secondary border border-border text-[11px] font-semibold text-text-secondary"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Level XP Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-text-secondary">
                <span>Music Explorer (Level {user.level})</span>
                <span className="font-mono">{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <ProgressBar value={(user.xp / user.xpToNextLevel) * 100} variant="xp" size="md" />
            </div>
          </div>
        </div>
      </Card>

      {/* Section 57: YOUR REFERRAL SECTION */}
      <Card className="p-6 shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" /> Your Referral
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Share your code to earn 100 TP when friends register.
            </p>
          </div>
          <Link to="/referrals" className="text-xs font-semibold text-primary hover:underline">
            View Full Referral Dashboard →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-center sm:text-left">
            <span className="text-[11px] text-text-muted block">Referral Code</span>
            <span className="font-mono text-lg font-bold text-text-primary tracking-wider">
              {referralCode}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-center sm:text-left">
            <span className="text-[11px] text-text-muted block">Friends Referred</span>
            <span className="text-lg font-bold text-text-primary">
              {user.stats.friendsReferred || 5}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-center sm:text-left">
            <span className="text-[11px] text-text-muted block">TunePoints Earned</span>
            <span className="text-lg font-bold text-primary">
              {(user.stats.friendsReferred || 5) * 100 - 100} TP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleCopyCode}>
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
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1.5" /> Share
          </Button>
        </div>
      </Card>

      {/* Streak Calendar */}
      <Card className="p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Flame className="w-5 h-5 text-warning" /> Daily Challenge Streak
            </h3>
            <p className="text-xs text-text-secondary">
              You're on a {user.streak}-day streak! Keep it going to earn bonus points.
            </p>
          </div>
          <span className="text-xs font-bold text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
            {user.streak} Days Active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {user.streakCalendar.map((item) => (
            <div
              key={item.day}
              className={`p-3 rounded-xl text-center border flex flex-col items-center justify-center transition-all ${
                item.isToday
                  ? 'bg-primary/10 border-primary text-primary font-bold'
                  : item.completed
                  ? 'bg-surface-secondary border-border text-warning'
                  : 'bg-surface-secondary/40 border-border text-text-muted'
              }`}
            >
              <span className="text-xs uppercase">{item.dayShort}</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center mt-2">
                {item.completed ? (
                  <Check className="w-3.5 h-3.5 text-warning" />
                ) : item.isToday ? (
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Career Metrics */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Career Statistics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Card className="p-4 text-center shadow-soft-sm">
            <Coins className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">TunePoints</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {wallet.balance.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <Award className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Quizzes Done</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {user.stats.quizzesCompleted}
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Accuracy</span>
            <p className="text-lg font-bold text-success mt-0.5">
              {user.stats.accuracyPercent}%
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <Headphones className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Songs Streamed</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {user.stats.songsPlayed}
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <FolderHeart className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Playlists</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {user.stats.playlistsCreated}
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
