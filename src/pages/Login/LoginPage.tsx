import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { AuthVisualPanel } from '../../components/auth/AuthVisualPanel';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const refCode = searchParams.get('ref') || '';

  const [email, setEmail] = useState('demo@tunequest.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login({ email, password });
    if (success) {
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'Signed in successfully to TuneQuest.',
      });
      navigate(redirectTarget);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    clearError();
    const success = await login({ email: demoEmail, password: demoPass });
    if (success) {
      addToast({
        type: 'success',
        title: 'Demo Session Active',
        message: `Signed in as ${demoEmail}`,
      });
      navigate(redirectTarget);
    }
  };

  const registerLink = `/register${refCode ? `?ref=${encodeURIComponent(refCode)}` : ''}`;

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Music Visual Panel (Desktop / Tablet Large) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5">
          <AuthVisualPanel mode="login" />
        </div>

        {/* Right Column: Premium Login Form (All screens) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center"
        >
          <div className="w-full bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-soft-lg transition-colors">
            {/* Mobile-only compact brand badge */}
            <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-border">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm">
                  <span className="font-display font-extrabold text-sm tracking-tight">TQ</span>
                </div>
                <span className="font-display font-extrabold text-xl text-text-primary tracking-tight">
                  Tune<span className="text-primary">Quest</span>
                </span>
              </Link>
              <span className="text-[11px] font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                Music & Rewards
              </span>
            </div>

            {/* Desktop Brand Icon & Title Header */}
            <div className="text-left mb-6">
              <div className="hidden lg:inline-flex items-center gap-2 mb-4">
                <Link to="/" className="inline-flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform">
                    <span className="font-display font-extrabold text-sm tracking-tight">TQ</span>
                  </div>
                  <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                    Tune<span className="text-primary">Quest</span>
                  </span>
                </Link>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                Continue your music journey. Listen, test your trivia knowledge, and earn TunePoints.
              </p>
            </div>

            {/* Demo Fast Login Banner */}
            <div className="p-3.5 rounded-2xl bg-surface-secondary border border-border mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-text-primary">Demo Accounts</p>
                  <p className="text-[11px] text-text-secondary">Instant one-click access</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => handleQuickDemoLogin('demo@tunequest.com', 'demo123')}
                  disabled={isLoading}
                  className="text-xs font-medium flex-1 sm:flex-initial cursor-pointer hover:border-primary/40 transition-colors"
                >
                  demo123
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleQuickDemoLogin('explorer@tunequest.app', 'TuneQuestDemo2026!')}
                  disabled={isLoading}
                  className="text-xs font-medium flex-1 sm:flex-initial cursor-pointer hover:border-primary/40 transition-colors"
                >
                  Alex (1,240 TP)
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-xs font-medium text-danger mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="music@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-text-primary">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-medium text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-text-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="w-full justify-center py-3 text-sm font-semibold shadow-soft-sm cursor-pointer transition-transform active:scale-[0.99]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Separator / Footer */}
            <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Protected with AES encryption</span>
              </div>
              <div>
                <span>New to TuneQuest? </span>
                <Link to={registerLink} className="text-primary font-semibold hover:underline">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
