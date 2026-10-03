import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Award,
  Music,
  Users,
  Headphones,
  Disc,
  FileText,
  Radio,
  History,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { quizService } from '../../services/quiz/quizService';
import { QuizCategory } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useQuizStore } from '../../store/quizStore';

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Disc: <Disc className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  History: <History className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
};

export const QuizIndexPage: React.FC = () => {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const { user } = useAuthStore();
  const { startQuiz } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    quizService.getCategories().then(setCategories);
  }, []);

  const handleStartCategory = async (categoryId: string, prefs?: string[]) => {
    await startQuiz(categoryId, prefs || user?.favoriteGenres);
    navigate(`/quiz/play/${categoryId}`);
  };

  const userGenres = user?.favoriteGenres || ['Bollywood Romantic', 'Indian Indie', 'Punjabi Pop', 'Global Pop', 'Synthpop'];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400" /> Music Challenges & Trivia
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Test your ear, recognize melodies, beat the timer, and claim your share of TunePoints.
            <span className="text-primary font-medium ml-1">50+ top tracks added across Bollywood, Indie, Punjabi & Global Pop!</span>
          </p>
        </div>

        {/* User Quiz Performance Quick Stat */}
        <div className="flex items-center gap-3 p-3 bg-surface border border-slate-800 rounded-2xl w-fit">
          <div className="text-left pr-3 border-r border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Lifetime Accuracy</span>
            <p className="text-base font-bold text-emerald-400">82% (214/260)</p>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Streak</span>
            <p className="text-base font-bold text-orange-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" /> {user?.streak || 7} Days
            </p>
          </div>
        </div>
      </div>

      {/* DUAL FEATURED BANNERS: DAILY CHALLENGE & PERSONALIZED PREFERENCES QUIZ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner 1: Hero Daily Music Challenge Banner */}
        <div className="relative rounded-3xl glass-panel border border-amber-500/50 p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-amber-950/30 via-[#141420] to-purple-950/20 shadow-glow-points/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="points" size="sm">
                <Sparkles className="w-3 h-3 mr-1" /> Daily Streak Arena
              </Badge>
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> 5 Questions
              </span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-white">
              The Daily Sonic Gauntlet
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              5 specially curated audio, lyric, and history questions. Score at least 3/5 to keep your daily streak alive and earn +50 TunePoints!
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
              <span>⏱ 30s per Q</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">+50 TP Reward</span>
              <span>•</span>
              <span className="text-cyan-400 font-bold">+25 XP</span>
            </div>
          </div>

          <div className="pt-5">
            <Button
              variant="points"
              size="lg"
              className="w-full shadow-glow-points"
              onClick={() => handleStartCategory('daily')}
            >
              Start Daily Challenge (5 Qs) <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Banner 2: Personalized Preferences Quiz */}
        <div className="relative rounded-3xl glass-panel border border-primary/50 p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-primary/20 via-[#141420] to-indigo-950/30 shadow-soft-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm" className="bg-primary/20 text-primary border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" /> For You • Personalized
              </Badge>
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                Randomized Each Round
              </span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-white">
              My Preferences Gauntlet
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tailored directly to your musical taste: Arijit Singh, Anuv Jain, Diljit Dosanjh, The Weeknd, Taylor Swift, and your favorite genres!
            </p>

            {/* Favorite genre badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {userGenres.slice(0, 4).map((genre) => (
                <span key={genre} className="px-2 py-0.5 rounded-full text-[11px] bg-white/10 text-white border border-white/10">
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
              <span>⏱ 30s per Q</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">5 Questions</span>
              <span>•</span>
              <span className="text-primary font-bold">+50 TP</span>
            </div>
          </div>

          <div className="pt-5">
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-glow-primary"
              onClick={() => handleStartCategory('user-preferences', userGenres)}
            >
              Play My Preferences Quiz (5 Qs) <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Challenge Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">All Music Challenge Arenas</h3>
          <span className="text-xs text-slate-400">Strictly 5 Questions Per Round • Dynamically Shuffled</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleStartCategory(cat.id)}
              className="glass-card p-6 rounded-3xl cursor-pointer group flex flex-col justify-between space-y-5 border border-white/5 hover:border-purple-500/40 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.accentColor}20`, color: cat.accentColor }}
                >
                  {iconMap[cat.iconName] || <Music className="w-6 h-6" />}
                </div>
                <Badge variant="outline" size="sm">5 Qs • Shuffled</Badge>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{cat.timeLimitSeconds}s</span>
                </div>
                <span className="font-bold text-amber-400">+{cat.rewardPoints} TP</span>
                <span className="font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Play Arena →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
