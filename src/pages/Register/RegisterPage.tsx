import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  Lock,
  Tag,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Music,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { referralService } from '../../services/referral/referralService';
import { useUIStore } from '../../store/uiStore';
import { AuthVisualPanel } from '../../components/auth/AuthVisualPanel';

const registerSchema = z
  .object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error: authError, clearError, isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralStatus, setReferralStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [referralFeedback, setReferralFeedback] = useState<string>('');
  const [signupSuccessData, setSignupSuccessData] = useState<{
    success: boolean;
    referralBonus: boolean;
  } | null>(null);

  const refParam = searchParams.get('ref') || '';

  useEffect(() => {
    if (isAuthenticated && !signupSuccessData) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, signupSuccessData]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: refParam,
    },
  });

  const passwordVal = watch('password') || '';
  const referralVal = watch('referralCode') || '';

  // Synchronize referral code from query params
  useEffect(() => {
    if (refParam) {
      setValue('referralCode', refParam);
      validateReferral(refParam);
    }
  }, [refParam, setValue]);

  // Debounced referral code validation
  const validateReferral = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      setReferralStatus('idle');
      setReferralFeedback('');
      return;
    }

    setReferralStatus('checking');
    try {
      const result = await referralService.validateCode(trimmed);
      if (result.valid) {
        setReferralStatus('valid');
        setReferralFeedback('✓ Valid referral code: You will receive +50 TunePoints');
      } else {
        setReferralStatus('invalid');
        setReferralFeedback(result.message ? `✕ ${result.message}` : '✕ Referral code not found');
      }
    } catch {
      setReferralStatus('invalid');
      setReferralFeedback('✕ Referral code not found');
    }
  };

  useEffect(() => {
    if (refParam && referralVal === refParam) return;
    const timer = setTimeout(() => {
      validateReferral(referralVal);
    }, 400);
    return () => clearTimeout(timer);
  }, [referralVal]);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '', percent: 0, color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Weak', percent: 33, color: 'bg-danger text-danger' };
    if (score === 2 || score === 3) return { label: 'Good', percent: 66, color: 'bg-warning text-warning' };
    return { label: 'Strong', percent: 100, color: 'bg-success text-success' };
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const result = await registerUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      referralCode: data.referralCode,
    });

    if (result.success) {
      if (result.referralRewardApplied) {
        addToast({
          type: 'success',
          title: 'Referral Applied!',
          message: '+50 TunePoints credited to your wallet.',
        });
      }
      setSignupSuccessData({
        success: true,
        referralBonus: !!result.referralRewardApplied,
      });
    }
  };

  // SUCCESS SCREEN
  if (signupSuccessData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 transition-colors">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-soft-xl text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5 shadow-soft-sm">
            <Music className="w-8 h-8" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary mb-2">
            Welcome to TuneQuest! 🎧
          </h2>

          {signupSuccessData.referralBonus ? (
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-amber-500 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Welcome Bonus Unlocked
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-500 my-1">
                +50 TunePoints
              </p>
              <p className="text-xs text-text-secondary">
                Credited because you registered with a friend's referral link.
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-secondary my-5 leading-relaxed">
              Your account has been created. Start exploring your sound, playing daily quizzes, and earning TunePoints!
            </p>
          )}

          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              className="w-full justify-center py-3 text-sm font-semibold shadow-soft-sm cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              Start Listening <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center py-3 text-sm font-semibold cursor-pointer"
              onClick={() => navigate('/quiz')}
            >
              Play Your First Quiz
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isDuplicateEmail =
    authError?.toLowerCase().includes('already exists') || authError?.toLowerCase().includes('duplicate');

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Music Visual Panel (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5">
          <AuthVisualPanel mode="register" />
        </div>

        {/* Right Column: Registration Form (All screens) */}
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
                Create Account
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
                Create your account
              </h1>
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                Join thousands of music lovers discovering songs, challenging quizzes, and earning rewards.
              </p>
            </div>

            {/* Global Error Banner */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-xs font-medium text-danger mb-5 flex flex-col gap-1.5 text-left">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {isDuplicateEmail
                      ? 'An account with this email already exists.'
                      : authError}
                  </span>
                </div>
                {isDuplicateEmail && (
                  <Link
                    to={`/login${refParam ? `?ref=${encodeURIComponent(refParam)}` : ''}`}
                    className="underline font-semibold ml-6 hover:text-danger/80"
                  >
                    Sign In to your existing account
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Alex Rivers"
                    {...register('fullName')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 ${
                      errors.fullName ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-danger mt-1 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
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
                    {...register('email')}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 ${
                      errors.email ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-danger mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    {...register('password')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 ${
                      errors.password ? 'border-danger' : 'border-border'
                    }`}
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
                {errors.password && (
                  <p className="text-[11px] text-danger mt-1 font-medium">{errors.password.message}</p>
                )}

                {/* Password strength indicator */}
                {passwordVal && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-secondary">Password strength</span>
                      <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden border border-border">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength.percent <= 33
                            ? 'bg-danger'
                            : strength.percent <= 66
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    {...register('confirmPassword')}
                    className={`w-full pl-10 pr-10 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 ${
                      errors.confirmPassword ? 'border-danger' : 'border-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-danger mt-1 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Referral Code (Special Reward Treatment) */}
              <div className="p-3.5 rounded-2xl bg-surface-secondary/70 border border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    Referral Code <span className="text-[10px] text-text-muted font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    +50 TP Reward
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="TUNE-A7K92X"
                    {...register('referralCode')}
                    className={`w-full px-3.5 pr-10 py-2 bg-surface border rounded-xl text-sm font-mono uppercase text-text-primary placeholder:font-sans placeholder:normal-case placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 ${
                      referralStatus === 'valid'
                        ? 'border-success'
                        : referralStatus === 'invalid'
                        ? 'border-danger'
                        : 'border-border'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    {referralStatus === 'checking' && (
                      <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
                    )}
                    {referralStatus === 'valid' && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                    {referralStatus === 'invalid' && (
                      <XCircle className="w-4 h-4 text-danger" />
                    )}
                  </div>
                </div>

                {/* Referral Explanation & Feedback */}
                {referralStatus === 'valid' ? (
                  <p className="text-[11px] text-success mt-1.5 font-medium flex items-center gap-1">
                    {referralFeedback}
                  </p>
                ) : referralStatus === 'invalid' ? (
                  <p className="text-[11px] text-danger mt-1.5 font-medium flex items-center gap-1">
                    {referralFeedback}
                  </p>
                ) : (
                  <p className="text-[11px] text-text-muted mt-1.5 leading-tight">
                    You can enter a friend's referral code to receive your new-user TunePoints reward (+50 TP).
                  </p>
                )}
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
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Separator / Footer */}
            <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Instant free membership</span>
              </div>
              <div>
                <span>Already a member? </span>
                <Link
                  to={`/login${refParam ? `?ref=${encodeURIComponent(refParam)}` : ''}`}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
