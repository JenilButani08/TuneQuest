import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  Coins,
  Crown,
  Sparkles,
  Zap,
  Award,
  CheckCircle,
  Radio,
  ArrowLeft,
} from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import { useUIStore } from '../../store/uiStore';
import { Reward } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
};

export const RedeemStorePage: React.FC = () => {
  const { wallet, rewards, fetchWalletData } = useWalletStore();
  const { openRedemptionModal } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleOpenRedemption = (reward: Reward) => {
    openRedemptionModal(reward);
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate('/rewards')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Wallet
      </button>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
        <div>
          <Badge variant="points" size="md">VIP Perk Store</Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white mt-2">
            Redeem TunePoints
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Exchange your trivia mastery for real music listening upgrades and exclusive cosmetic badges.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Your Balance</span>
            <p className="text-xl font-bold text-amber-300 font-mono">
              {wallet.balance.toLocaleString()} TP
            </p>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const canAfford = wallet.balance >= reward.costPoints;

          return (
            <div
              key={reward.id}
              className={`glass-card p-6 rounded-3xl flex flex-col justify-between space-y-6 relative overflow-hidden border ${
                reward.popular
                  ? 'border-purple-500/60 shadow-glow-primary/20 ring-1 ring-purple-500/40'
                  : 'border-white/5'
              }`}
            >
              {reward.popular && (
                <div className="absolute top-4 right-4">
                  <Badge variant="primary" size="sm">Most Popular</Badge>
                </div>
              )}

              <div className="space-y-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${reward.bannerGradient} text-white shadow-lg`}
                >
                  {iconMap[reward.icon] || <Gift className="w-7 h-7" />}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{reward.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{reward.description}</p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Unlocks:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {reward.unlockedFeatures.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Cost</span>
                  <p className="text-xl font-bold text-amber-400 font-mono">
                    {reward.costPoints.toLocaleString()} TP
                  </p>
                </div>

                <Button
                  variant={canAfford ? (reward.popular ? 'points' : 'primary') : 'outline'}
                  size="md"
                  onClick={() => handleOpenRedemption(reward)}
                  className={reward.popular ? 'shadow-glow-points/40' : ''}
                >
                  {canAfford ? 'Redeem Perk' : `Need ${reward.costPoints - wallet.balance} TP`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
