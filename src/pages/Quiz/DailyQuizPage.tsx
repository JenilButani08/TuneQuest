import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Flame, Check, Coins, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const DailyQuizPage: React.FC = () => {
  const { user } = useAuthStore();
  const { startQuiz } = useQuizStore();
  const navigate = useNavigate();

  const handleStart = async () => {
    await startQuiz('daily');
    navigate('/quiz/play/daily');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <button
        onClick={() => navigate('/quiz')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </button>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/40 text-center space-y-6 shadow-glow-points/10">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <Badge variant="points" size="md">
            Daily Music Quest
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white mt-2">
            Today's Music Challenge
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            5 questions to test your musical ear. Answer correctly to gain +50 TunePoints and extend your daily streak calendar!
          </p>
        </div>

        {/* Weekly Streak Tracker Calendar (Section 26) */}
        <div className="p-5 rounded-2xl bg-[#0D0D14] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{user?.streak || 7}-Day Streak Ongoing</span>
            </span>
            <span className="text-orange-400 font-bold">Today: Active</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
            {(user?.streakCalendar || []).map((item) => (
              <div
                key={item.day}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-center border transition-all ${
                  item.isToday
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-glow-points/30'
                    : item.completed
                    ? 'bg-orange-950/40 border-orange-600/40 text-orange-400'
                    : 'bg-surface border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{item.dayShort}</span>
                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-1">
                  {item.completed ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : item.isToday ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-left pt-1">
            🔥 Complete today's 5-question challenge to continue your streak and earn the +50 TP bonus.
          </p>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-surface border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Questions</span>
            <p className="text-lg font-bold text-white mt-0.5">5</p>
          </div>
          <div className="p-3 rounded-2xl bg-surface border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Reward</span>
            <p className="text-lg font-bold text-amber-400 mt-0.5">+50 TP</p>
          </div>
          <div className="p-3 rounded-2xl bg-surface border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Time</span>
            <p className="text-lg font-bold text-cyan-400 mt-0.5">30s / Q</p>
          </div>
        </div>

        <Button
          variant="points"
          size="lg"
          className="w-full text-base font-bold shadow-glow-points py-4"
          onClick={handleStart}
        >
          START CHALLENGE NOW <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
