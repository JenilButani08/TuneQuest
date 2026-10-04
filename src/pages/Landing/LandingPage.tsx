import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Coins,
  Flame,
  Award,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sun,
  Moon,
  Gift,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Calculator,
  Users,
  Check,
  Music,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { LoginRequiredModal } from '../../components/auth/LoginRequiredModal';

// ALL DATA LOADED DIRECTLY FROM JSON FILE
import landingData from '../../data/landingData.json';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { resolvedTheme, setTheme } = useThemeStore();
  const { openLoginRequiredModal } = useUIStore();
  const navigate = useNavigate();

  // Interactive Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const activeQuestion = landingData.interactiveQuizQuestions[currentQuizIndex];

  // Interactive Reward Calculator State
  const [quizzesPerDay, setQuizzesPerDay] = useState(landingData.rewardsCalculator.defaults.quizzesPerDay);
  const [streakDays, setStreakDays] = useState(landingData.rewardsCalculator.defaults.streakDays);
  const [friendsReferred, setFriendsReferred] = useState(landingData.rewardsCalculator.defaults.friendsReferred);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Handle Interactive Quiz Choice
  const handleAnswerQuestion = (optId: string) => {
    if (!isAuthenticated) {
      openLoginRequiredModal({
        title: 'Sign in to continue',
        message: 'Sign in or create an account to play TuneQuest quizzes and earn TunePoints.',
      });
      return;
    }
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optId);

    const isCorrect = optId === activeQuestion.correctOptionId;
    if (isCorrect) {
      setUserScore((prev) => prev + activeQuestion.rewardPoints);
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.65 },
          colors: ['#6D5DFB', '#22C55E', '#F59E0B'],
        });
      } catch {
        // Fallback gracefully if canvas is blocked
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < landingData.interactiveQuizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setQuizCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOptionId(null);
    setUserScore(0);
    setQuizCompleted(false);
  };

  // Calculate Monthly Estimated TunePoints
  const monthlyCalculatedPoints =
    quizzesPerDay * landingData.rewardsCalculator.perQuizPoints * 30 +
    Math.floor(streakDays / 7) * landingData.rewardsCalculator.perStreakBonus * 4 +
    friendsReferred * landingData.rewardsCalculator.perFriendPoints;

  // Find unlocked reward tier
  const unlockedTiers = landingData.rewardsCalculator.tiers.filter(
    (tier) => monthlyCalculatedPoints >= tier.threshold
  );
  const highestTier = unlockedTiers[unlockedTiers.length - 1];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary selection:text-white transition-colors duration-200">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm transition-transform group-hover:scale-105">
              <span className="font-display font-extrabold text-sm tracking-tight">
                {landingData.brand.shortName}
              </span>
            </div>
            <span className="font-display font-bold text-xl text-text-primary tracking-tight">
              Tune<span className="text-primary">Quest</span>
            </span>
          </Link>

          {/* Navigation links loaded from JSON */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            {landingData.navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface-secondary hover:bg-border/60 text-text-secondary hover:text-text-primary transition-all text-xs font-semibold cursor-pointer shadow-soft-sm"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-warning" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-primary" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Log In Button */}
            {!isAuthenticated && (
              <Link to="/login">
                <Button variant="outline" size="sm" className="font-semibold">
                  Log In
                </Button>
              </Link>
            )}

            {/* Open Web App or Register */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              className="font-bold shadow-soft-sm"
            >
              {isAuthenticated ? 'Open Web App' : 'Get Started'} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* 2. MAIN EDITORIAL HERO */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 lg:space-y-24">
        <section className="max-w-4xl mx-auto text-center space-y-8 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{landingData.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.12]">
              {landingData.hero.headlinePrefix} <br />
              <span className="text-primary">{landingData.hero.headlineHighlight}</span>{' '}
              {landingData.hero.headlineSuffix}
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {landingData.hero.description}
            </p>

            {/* CTAs (Section 30) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                className="font-bold px-7 shadow-soft-sm cursor-pointer"
              >
                <Headphones className="w-5 h-5 mr-2" />{' '}
                {isAuthenticated ? 'Open Web App' : 'Start Your Journey'}
              </Button>
              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="font-semibold px-6 cursor-pointer"
                >
                  Already have an account? Sign In
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/quiz')}
                  className="font-semibold px-6 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-warning" /> Daily Quiz
                </Button>
              )}
            </div>

            <p className="text-xs text-text-muted">
              {landingData.hero.supportingNote}
            </p>

            {/* Quick Hero Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border max-w-2xl mx-auto">
              {landingData.hero.stats.map((stat) => (
                <div key={stat.label} className="p-3 rounded-2xl bg-surface border border-border shadow-soft-sm">
                  <span className="text-base sm:text-lg font-extrabold text-primary block">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-text-muted mt-0.5 block truncate">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 3. INTERACTIVE LIVE QUIZ CHALLENGE (Visitors can play & earn immediately) */}
        <section
          id="interactive-quiz-section"
          className="rounded-3xl bg-surface border border-border p-6 sm:p-10 shadow-soft-sm text-left relative overflow-hidden"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Interactive Challenge Demo
                  </Badge>
                  <span className="text-xs text-text-muted">
                    Question {currentQuizIndex + 1} of {landingData.interactiveQuizQuestions.length}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary mt-1">
                  Test Your Musical Ear Right Now
                </h2>
              </div>

              {/* Live Points Counter / Guest Sign In to Play CTA (Section 4, 32) */}
              {!isAuthenticated ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    openLoginRequiredModal({
                      title: 'Sign in to continue',
                      message: 'Sign in or create an account to play TuneQuest quizzes and earn TunePoints.',
                    })
                  }
                  className="font-bold shadow-soft-sm"
                >
                  <Sparkles className="w-4 h-4 mr-1 text-warning" /> Sign In to Play
                </Button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-secondary border border-border w-fit">
                  <Coins className="w-4 h-4 text-warning" />
                  <span className="text-xs text-text-secondary">Demo Score:</span>
                  <span className="text-sm font-extrabold text-text-primary font-mono">
                    {userScore} TP
                  </span>
                </div>
              )}
            </div>

            {/* Quiz Body OR Completion Celebration */}
            {quizCompleted ? (
              <div className="p-8 rounded-2xl bg-surface-secondary border border-border text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-success/10 text-success mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-text-primary">
                  Challenge Completed! 🎵
                </h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto">
                  You scored <strong className="text-success font-bold">{userScore} TunePoints</strong> on this live demo. Create your free account to keep your points and compete on the daily leaderboard!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/register')}
                    className="font-bold px-6 shadow-soft-sm"
                  >
                    Claim My Points & Register
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleResetQuiz}
                    className="font-semibold"
                  >
                    Play Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Active Question Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-secondary border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>
                      Track reference: <strong>{activeQuestion.trackTitle}</strong> by {activeQuestion.trackArtist}
                    </span>
                    <span className="text-success font-bold">+{activeQuestion.rewardPoints} TP</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    {activeQuestion.question}
                  </h3>
                </div>

                {/* Interactive Clickable Options */}
                <div className="space-y-2.5">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isCorrect = opt.id === activeQuestion.correctOptionId;
                    const showFeedback = selectedOptionId !== null;

                    let buttonStyle = 'bg-surface hover:bg-surface-secondary border-border text-text-primary';
                    if (showFeedback) {
                      if (isCorrect) {
                        buttonStyle = 'bg-success/15 border-success text-success font-bold';
                      } else if (isSelected) {
                        buttonStyle = 'bg-danger/15 border-danger text-danger font-bold';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswerQuestion(opt.id)}
                        disabled={selectedOptionId !== null}
                        className={`w-full p-3.5 rounded-xl border text-sm text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-xs font-mono font-bold uppercase">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {showFeedback && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-danger flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback on answering */}
                {selectedOptionId && (
                  <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-3 animate-fade-in">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {activeQuestion.explanation}
                    </p>
                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleNextQuestion}
                        className="font-semibold cursor-pointer"
                      >
                        {currentQuizIndex < landingData.interactiveQuizQuestions.length - 1
                          ? 'Next Question →'
                          : 'See Challenge Results →'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 4. INTERACTIVE REWARDS & TUNEPOINTS CALCULATOR */}
        <section className="rounded-3xl bg-surface border border-border p-6 sm:p-10 shadow-soft-sm text-left">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <Badge variant="outline" size="sm" className="font-semibold text-text-primary">
                <Calculator className="w-3.5 h-3.5 mr-1 text-primary" /> Earnings Simulator
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {landingData.rewardsCalculator.title}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                {landingData.rewardsCalculator.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Sliders (7 cols) */}
              <div className="lg:col-span-7 space-y-5 bg-surface-secondary p-5 sm:p-6 rounded-2xl border border-border">
                {/* Slider 1: Quizzes per day */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-text-primary">Quizzes played per day:</span>
                    <span className="font-mono text-primary font-bold text-sm">
                      {quizzesPerDay} quizzes
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={quizzesPerDay}
                    onChange={(e) => setQuizzesPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-text-muted mt-1">
                    <span>1 quiz</span>
                    <span>10 quizzes</span>
                  </div>
                </div>

                {/* Slider 2: Daily Streak Days */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-text-primary">Daily streak maintained:</span>
                    <span className="font-mono text-warning font-bold text-sm">
                      {streakDays} days
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={streakDays}
                    onChange={(e) => setStreakDays(Number(e.target.value))}
                    className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-warning"
                  />
                  <div className="flex justify-between text-[10px] text-text-muted mt-1">
                    <span>1 day</span>
                    <span>30 days (1 Month)</span>
                  </div>
                </div>

                {/* Slider 3: Friends Referred */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-text-primary">Friends invited using your code:</span>
                    <span className="font-mono text-success font-bold text-sm">
                      {friendsReferred} friends
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={friendsReferred}
                    onChange={(e) => setFriendsReferred(Number(e.target.value))}
                    className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-success"
                  />
                  <div className="flex justify-between text-[10px] text-text-muted mt-1">
                    <span>0 friends</span>
                    <span>10 friends (+1,000 TP)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Total & Unlocked Perk (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-surface border border-border shadow-soft-sm space-y-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Estimated Monthly Yield
                </span>

                <div className="space-y-0.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-primary font-mono tracking-tight">
                    {monthlyCalculatedPoints.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-primary block">TunePoints / month</span>
                </div>

                {highestTier ? (
                  <div className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-success font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked: {highestTier.name}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">{highestTier.perk}</p>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">
                    Increase your activities to unlock the 1-Day VIP Pass!
                  </p>
                )}

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/rewards');
                    } else {
                      openLoginRequiredModal({
                        title: 'Sign in to continue',
                        message: 'Sign in or create an account to redeem TuneQuest rewards and discounts.',
                      });
                    }
                  }}
                  className="w-full justify-center font-bold"
                >
                  {isAuthenticated ? 'Go to Rewards Store →' : 'Sign In to Redeem'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CORE 4 PILLAR FEATURES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {landingData.features.map((feat) => (
            <Card key={feat.id} className="p-5 sm:p-6 shadow-soft-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {feat.icon === 'Headphones' && <Headphones className="w-5 h-5" />}
                  {feat.icon === 'Award' && <Award className="w-5 h-5" />}
                  {feat.icon === 'Coins' && <Coins className="w-5 h-5" />}
                  {feat.icon === 'Gift' && <Gift className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {feat.badge}
                </span>
                <h3 className="text-base font-bold text-text-primary">
                  {feat.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </Card>
          ))}
        </section>

        {/* 6. LISTENER TESTIMONIALS */}
        <section className="space-y-6 text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Loved by Music Explorers
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              See what community listeners say about streaming and earning on TuneQuest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {landingData.communityReviews.map((rev) => (
              <Card key={rev.id} className="p-5 shadow-soft-sm space-y-3 flex flex-col justify-between">
                <p className="text-xs text-text-secondary leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-9 h-9 rounded-full object-cover border border-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-text-primary truncate">{rev.name}</p>
                    <p className="text-[10px] text-text-muted truncate">{rev.handle}</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {rev.points}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 7. INTERACTIVE FAQ ACCORDION */}
        <section className="rounded-3xl bg-surface border border-border p-6 sm:p-10 shadow-soft-sm text-left max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-text-secondary">
              Everything you need to know about streaming, quizzes, and rewards on TuneQuest.
            </p>
          </div>

          <div className="divide-y divide-border">
            {landingData.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.question} className="py-3.5">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-text-primary hover:text-primary transition-colors cursor-pointer gap-4"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-text-secondary leading-relaxed pt-2">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 8. FOOTER WITH LINKS LOADED FROM JSON */}
      <footer className="border-t border-border py-8 px-6 text-center text-xs text-text-secondary max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>{landingData.footer.copyright}</p>
        <div className="flex gap-6">
          {landingData.footer.links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="hover:text-text-primary transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </footer>

      {/* Global Login Required Modal for guests (Section 28) */}
      <LoginRequiredModal />
    </div>
  );
};
