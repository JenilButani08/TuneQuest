import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth/authService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authService.requestPasswordReset(email);
    setLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-[#08080D] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        {isSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If an account is associated with <span className="text-white font-medium">{email}</span>, we have sent password recovery instructions.
            </p>
            <Button variant="primary" className="w-full" onClick={() => setIsSent(false)}>
              Send Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-xs text-slate-400">
              Enter the email linked to your TuneQuest account and we'll send a secure password reset link.
            </p>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={loading} glow>
              Send Reset Instructions
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
