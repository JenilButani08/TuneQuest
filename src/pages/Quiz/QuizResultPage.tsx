import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Coins,
  Sparkles,
  Flame,
  RotateCcw,
  ArrowRight,
  ListOrdered,
  HelpCircle,
} from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const QuizResultPage: React.FC = () => {
  const { result, category, resetQuiz, startQuiz } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fire celebratory confetti on high accuracy
    if (result && result.accuracy >= 50) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899', '#10B981'],
        });
      } catch {}
    }
  }, [result]);

  if (!result) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-400">No active quiz result found.</p>
        <Button variant="primary" onClick={() => navigate('/quiz')}>
          Go to Challenges
        </Button>
      </div>
    );
  }

  const handlePlayAgain = async () => {
    const targetCat = category?.id || 'user-preferences';
    resetQuiz();
    await startQuiz(targetCat);
    navigate(`/quiz/play/${targetCat}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Trophy & Congratulatory Hero */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-purple-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 mx-auto shadow-glow-points/30">
          <div className="w-full h-full bg-[#0E0E18] rounded-[22px] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>
        </div>

        <div>
          <Badge variant="cyan" size="md">Challenge Completed</Badge>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white mt-2">
            Quiz Complete!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {result.accuracy >= 80
              ? 'Phenomenal ear! You demonstrated exceptional musical knowledge.'
              : 'Well played! Your music trivia skills are growing stronger every day.'}
          </p>
        </div>

        {/* Primary Metrics Cluster */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-surface border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
            <p className="text-2xl font-black text-white mt-1">
              {result.score} / {result.totalQuestions}
            </p>
            <span className="text-[10px] text-emerald-400 font-bold">{result.accuracy}% Accuracy</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-center shadow-glow-points/10">
            <span className="text-[10px] text-amber-300 uppercase font-semibold">TunePoints</span>
            <p className="text-2xl font-black text-amber-400 mt-1">
              +{result.tunePointsEarned} TP
            </p>
            <span className="text-[10px] text-amber-300/80 font-mono">Added to wallet</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-700/40 text-center">
            <span className="text-[10px] text-cyan-300 uppercase font-semibold">Experience</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">
              +{result.xpEarned} XP
            </p>
            <span className="text-[10px] text-cyan-300/80 font-mono">Progress boost</span>
          </div>

          <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-600/40 text-center">
            <span className="text-[10px] text-orange-300 uppercase font-semibold">Current Streak</span>
            <p className="text-2xl font-black text-orange-400 mt-1 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" /> {result.streakDays}d
            </p>
            <span className="text-[10px] text-orange-300/80 font-mono">Fire burning</span>
          </div>
        </div>

        {/* Action Buttons: Play Again, View Wallet, Back to Dashboard */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={handlePlayAgain} glow>
            <RotateCcw className="w-4 h-4 mr-2" /> Play Again
          </Button>

          <Button variant="points" size="md" onClick={() => navigate('/rewards')}>
            <Coins className="w-4 h-4 mr-2" /> View Wallet
          </Button>

          <Button variant="secondary" size="md" onClick={() => navigate('/home')}>
            Back to Dashboard
          </Button>

          <Link to="/leaderboard">
            <Button variant="outline" size="md">
              <ListOrdered className="w-4 h-4 mr-2" /> View Leaderboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Detailed Question-by-Question Breakdown */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-400" /> Question Breakdown
        </h3>

        <div className="space-y-3">
          {result.breakdown.map((item, idx) => (
            <div
              key={item.questionId}
              className={`p-4 rounded-2xl border ${
                item.isCorrect
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-500/30'
              } space-y-2`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-bold text-slate-400">
                  Question {idx + 1}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold ${
                    item.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> +10 TP
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> 0 TP
                    </>
                  )}
                </span>
              </div>

              <p className="text-sm font-semibold text-white">{item.question}</p>

              <div className="text-xs space-y-1 pt-1 text-slate-300">
                <p>
                  <span className="text-slate-400">Your Answer: </span>
                  <strong className={item.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                    {item.userAnswer}
                  </strong>
                </p>
                {!item.isCorrect && (
                  <p>
                    <span className="text-slate-400">Correct Answer: </span>
                    <strong className="text-emerald-300">{item.correctAnswer}</strong>
                  </p>
                )}
              </div>

              {item.explanation && (
                <p className="text-[11px] text-slate-400 bg-black/20 p-2.5 rounded-xl border border-white/5 mt-2">
                  💡 {item.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
