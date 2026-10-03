import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coins, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';
import { useWalletStore } from '../../store/walletStore';

export const RedemptionModal: React.FC = () => {
  const { activeRedemptionReward, closeRedemptionModal, addToast } = useUIStore();
  const { wallet, redeemReward, isRedeeming } = useWalletStore();
  const [successResult, setSuccessResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!activeRedemptionReward) return null;

  const currentBalance = wallet.balance;
  const cost = activeRedemptionReward.costPoints;
  const afterBalance = currentBalance - cost;
  const canAfford = currentBalance >= cost;

  const handleConfirmRedemption = async () => {
    setErrorMsg(null);
    try {
      const res = await redeemReward(activeRedemptionReward.id);
      setSuccessResult(res.message);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899'],
        });
      } catch {}

      addToast({
        type: 'success',
        title: 'Redemption Successful!',
        message: `${activeRedemptionReward.title} is now active on your account.`,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete redemption.');
      addToast({
        type: 'error',
        title: 'Redemption Failed',
        message: err.message,
      });
    }
  };

  const handleClose = () => {
    setSuccessResult(null);
    setErrorMsg(null);
    closeRedemptionModal();
  };

  return (
    <Modal
      isOpen={!!activeRedemptionReward}
      onClose={handleClose}
      title={successResult ? 'Perk Unlocked!' : 'Confirm Redemption'}
    >
      {successResult ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-white">{activeRedemptionReward.title}</h4>
          <p className="text-sm text-slate-300">{successResult}</p>
          <div className="p-4 rounded-2xl bg-surface-elevated border border-slate-800 text-xs text-slate-400">
            Your new balance is <span className="font-bold text-amber-400">{wallet.balance} TP</span>. Enjoy ad-free premium listening!
          </div>
          <Button variant="primary" className="w-full" onClick={handleClose}>
            Back to Rewards
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">{activeRedemptionReward.title}</h4>
              <p className="text-xs text-slate-400">{activeRedemptionReward.description}</p>
            </div>
          </div>

          {/* Balance Calculation Breakdown */}
          <div className="p-4 rounded-2xl bg-[#0C0C14] border border-slate-800 space-y-3 text-sm">
            <div className="flex justify-between items-center text-slate-400">
              <span>Current TunePoints Balance:</span>
              <span className="font-bold text-amber-300">{currentBalance.toLocaleString()} TP</span>
            </div>
            <div className="flex justify-between items-center text-rose-400">
              <span>Redemption Cost:</span>
              <span className="font-bold">- {cost.toLocaleString()} TP</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between items-center font-bold">
              <span className="text-slate-300">Balance After Unlock:</span>
              <span className={canAfford ? 'text-emerald-400' : 'text-rose-400'}>
                {afterBalance.toLocaleString()} TP
              </span>
            </div>
          </div>

          {!canAfford && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>You need {cost - currentBalance} more TP. Complete today's music quiz to earn points!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isRedeeming}>
              Cancel
            </Button>
            <Button
              variant="points"
              className="flex-1"
              disabled={!canAfford}
              isLoading={isRedeeming}
              onClick={handleConfirmRedemption}
            >
              Confirm Redemption
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
