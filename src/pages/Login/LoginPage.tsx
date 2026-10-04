import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-soft-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm">
              <span className="font-bold text-sm tracking-tight">TQ</span>
            </div>
            <span className="font-display font-extrabold text-xl text-text-primary">TuneQuest</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Sign in to continue listening, testing your knowledge, and earning rewards.
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="p-3.5 rounded-2xl bg-surface-secondary border border-border mb-5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-text-primary">Demo Accounts</p>
              <p className="text-[11px] text-text-secondary">Instant login ready</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => handleQuickDemoLogin('demo@tunequest.com', 'demo123')}
              disabled={isLoading}
              className="text-xs font-medium flex-1 sm:flex-initial"
            >
              demo123
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => handleQuickDemoLogin('explorer@tunequest.app', 'TuneQuestDemo2026!')}
              disabled={isLoading}
              className="text-xs font-medium flex-1 sm:flex-initial"
            >
              Alex (1,240 TP)
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Password</label>
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
                className="w-full pl-10 pr-10 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/30"
              />
              <span>Remember me</span>
            </label>
            <span className="text-text-muted text-[11px] cursor-not-allowed">
              Forgot password?
            </span>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full justify-center py-2.5 text-sm font-semibold shadow-soft-sm cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>Secure authentication • Source of truth protected</span>
        </div>

        <div className="text-center mt-4 text-xs text-text-secondary">
          Don't have an account?{' '}
          <Link to={registerLink} className="text-primary font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
