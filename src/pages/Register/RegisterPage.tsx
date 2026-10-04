import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { referralService } from '../../services/referral/referralService';
import { useUIStore } from '../../store/uiStore';

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
        setReferralFeedback('✓ Valid referral code');
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
    if (score === 2 || score === 3) return { label: 'Fair', percent: 66, color: 'bg-warning text-warning' };
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
          message: '+50 TunePoints received.',
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-soft-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5">
            <Music className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Welcome to TuneQuest! 🎵
          </h2>

          {signupSuccessData.referralBonus ? (
            <div className="my-6 p-4 rounded-2xl bg-success/10 border border-success/20">
              <p className="text-xs uppercase tracking-wider font-bold text-success mb-1">
                Welcome Bonus
              </p>
              <p className="text-3xl font-extrabold text-success mb-1">
                +50 TunePoints
              </p>
              <p className="text-xs text-text-secondary">
                because you joined using a friend's referral code.
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-secondary my-5">
              Your account is ready. Discover music, challenge your trivia knowledge, and earn TunePoints!
            </p>
          )}

          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              className="w-full justify-center py-3 text-sm font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Start Listening
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center py-3 text-sm font-semibold"
              onClick={() => navigate('/quiz')}
            >
              Play Your First Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isDuplicateEmail = authError?.toLowerCase().includes('already exists') || authError?.toLowerCase().includes('duplicate');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-soft-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm">
              <span className="font-bold text-sm tracking-tight">TQ</span>
            </div>
            <span className="font-display font-extrabold text-xl text-text-primary">TuneQuest</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Discover music, challenge trivia, and unlock premium rewards.
          </p>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger mb-5 flex flex-col gap-1.5">
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
                Sign In instead
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                {...register('fullName')}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.fullName ? 'border-danger' : 'border-border'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-danger mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.email ? 'border-danger' : 'border-border'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...register('password')}
                className={`w-full pl-10 pr-10 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.password ? 'border-danger' : 'border-border'
                }`}
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
            {errors.password && (
              <p className="text-[11px] text-danger mt-1">{errors.password.message}</p>
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
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-10 py-2.5 bg-surface-secondary border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.confirmPassword ? 'border-danger' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-danger mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Referral Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-text-primary">Referral Code</label>
              <span className="text-[11px] text-text-muted">Optional</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Enter referral code (optional)"
                {...register('referralCode')}
                className={`w-full pl-10 pr-10 py-2.5 bg-surface-secondary border rounded-xl text-sm font-mono uppercase text-text-primary placeholder:font-sans placeholder:normal-case placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
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

            {/* Referral feedback & explanation */}
            {referralStatus === 'valid' && (
              <p className="text-[11px] text-success mt-1 font-medium">{referralFeedback}</p>
            )}
            {referralStatus === 'invalid' && (
              <p className="text-[11px] text-danger mt-1 font-medium">{referralFeedback}</p>
            )}
            {referralStatus === 'idle' && (
              <p className="text-[11px] text-text-muted mt-1">
                Optional — enter a friend's referral code to receive 50 TunePoints.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full justify-center py-3 text-sm font-semibold shadow-soft-sm cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-text-secondary">
          Already have an account?{' '}
          <Link
            to={`/login${refParam ? `?ref=${encodeURIComponent(refParam)}` : ''}`}
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
