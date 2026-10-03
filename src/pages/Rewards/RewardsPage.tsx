import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Sparkles,
  TrendingUp,
  History,
  ShieldCheck,
  Flame,
  HelpCircle,
  Users,
  CheckCircle,
} from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const RewardsPage: React.FC = () => {
  const { wallet, transactions, fetchWalletData, isLoading } = useWalletStore();
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'earned') return t.amount > 0;
    if (filter === 'redeemed') return t.amount < 0;
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Coins className="w-7 h-7 text-primary" /> TunePoints Wallet & Rewards
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track your verified point balance, learn how to earn, and redeem for exclusive perks.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-fit"
          onClick={() => navigate('/rewards/redeem')}
        >
          <Gift className="w-4 h-4 mr-2" /> Redeem Store
        </Button>
      </div>

      {/* Main Balance Card (Section 32) */}
      <Card className="p-6 sm:p-8 shadow-soft-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Your Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
                {wallet.balance.toLocaleString()}
              </span>
              <span className="text-base sm:text-lg font-bold text-primary">TP</span>
            </div>
            <p className="text-xs text-text-secondary">
              Authoritative balance verified by backend ledger.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" size="md" onClick={() => navigate('/quiz')}>
              Play Quizzes (+10 TP)
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/referrals')}>
              Invite Friends (+100 TP)
            </Button>
          </div>
        </div>

        {/* 3 Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-border">
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <TrendingUp className="w-4 h-4 text-success" />
              <span>Earned This Week</span>
            </div>
            <p className="text-lg font-bold text-success mt-1">
              +{wallet.thisWeekEarned.toLocaleString()} TP
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Coins className="w-4 h-4 text-primary" />
              <span>Lifetime Earned</span>
            </div>
            <p className="text-lg font-bold text-text-primary mt-1">
              {wallet.lifetimeEarned.toLocaleString()} TP
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Gift className="w-4 h-4 text-warning" />
              <span>Lifetime Redeemed</span>
            </div>
            <p className="text-lg font-bold text-text-primary mt-1">
              {wallet.lifetimeRedeemed.toLocaleString()} TP
            </p>
          </div>
        </div>
      </Card>

      {/* Section 32: EARN MORE CARDS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-text-primary">Earn More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <Card
            onClick={() => navigate('/quiz')}
            className="p-5 cursor-pointer hover:border-primary/40 transition-colors shadow-soft-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-text-primary">🎮 Play Quizzes</h3>
              <p className="text-xs text-text-secondary mt-1">
                Answer trivia questions on genres, lyrics, and artists.
              </p>
            </div>
            <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
              <span className="font-bold text-primary">Earn +10 TP per answer</span>
              <span className="text-text-muted">Start →</span>
            </div>
          </Card>

          {/* Card 2 */}
          <Card
            onClick={() => navigate('/quiz/daily')}
            className="p-5 cursor-pointer hover:border-primary/40 transition-colors shadow-soft-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-text-primary">🔥 Daily Streak</h3>
              <p className="text-xs text-text-secondary mt-1">
                Complete daily quizzes without breaking your rhythm.
              </p>
            </div>
            <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
              <span className="font-bold text-warning">Earn streak bonuses</span>
              <span className="text-text-muted">Maintain →</span>
            </div>
          </Card>

          {/* Card 3 */}
          <Card
            onClick={() => navigate('/referrals')}
            className="p-5 cursor-pointer hover:border-primary/40 transition-colors shadow-soft-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-text-primary">🎁 Refer Friends</h3>
              <p className="text-xs text-text-secondary mt-1">
                Invite fellow music listeners using your unique referral code.
              </p>
            </div>
            <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
              <span className="font-bold text-success">Friend gets +50 TP • You get +100 TP</span>
              <span className="text-text-muted">Invite →</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Section 31: HOW TUNEPOINTS WORK */}
      <Card className="p-6 shadow-soft-sm">
        <h3 className="text-base font-bold text-text-primary mb-3">
          How TunePoints Work
        </h3>
        <p className="text-xs text-text-secondary mb-4">
          TunePoints are awarded through verified platform engagement and music trivia accuracy:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border">
            <span className="text-xs text-text-secondary block">Correct Quiz Answer</span>
            <span className="text-lg font-bold text-primary mt-0.5 block">+10 TP</span>
            <span className="text-[11px] text-text-muted mt-1 block">Instant trivia reward</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border">
            <span className="text-xs text-text-secondary block">Friend joins using code</span>
            <span className="text-lg font-bold text-success mt-0.5 block">+100 TP</span>
            <span className="text-[11px] text-text-muted mt-1 block">Referral reward</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border">
            <span className="text-xs text-text-secondary block">Joining through referral</span>
            <span className="text-lg font-bold text-warning mt-0.5 block">+50 TP</span>
            <span className="text-[11px] text-text-muted mt-1 block">Welcome signup bonus</span>
          </div>
        </div>
      </Card>

      {/* Transaction History Ledger */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Point Transaction History
            </h3>
            <p className="text-xs text-text-secondary">
              Verified record of all earned and redeemed TunePoints
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 p-1 bg-surface-secondary border border-border rounded-xl w-fit">
            {(['all', 'earned', 'redeemed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filter === t
                    ? 'bg-surface text-text-primary shadow-soft-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-surface border border-border p-4 rounded-2xl flex items-center justify-between gap-4 shadow-soft-sm"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.amount > 0
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-text-primary">{tx.description}</p>
                  <p className="text-[11px] text-text-muted mt-0.5 font-mono">
                    {new Date(tx.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold font-mono ${
                    tx.amount > 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} TP
                </span>
                <span className="block text-[10px] text-text-muted capitalize">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
