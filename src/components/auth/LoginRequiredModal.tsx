import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';

export const LoginRequiredModal: React.FC = () => {
  const { isLoginRequiredModalOpen, loginRequiredContext, closeLoginRequiredModal } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginRequiredModalOpen) {
        closeLoginRequiredModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginRequiredModalOpen, closeLoginRequiredModal]);

  if (!isLoginRequiredModalOpen) return null;

  const title = loginRequiredContext?.title || 'Sign in to continue';
  const message =
    loginRequiredContext?.message ||
    'Create a TuneQuest account or sign in to access music, quizzes, TunePoints, rewards, and your personalized experience.';

  const handleSignIn = () => {
    closeLoginRequiredModal();
    navigate('/login');
  };

  const handleCreateAccount = () => {
    closeLoginRequiredModal();
    navigate('/register');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginRequiredModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
          className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-7 shadow-soft-lg z-10 space-y-5 text-center transition-colors"
        >
          {/* Close button */}
          <button
            onClick={closeLoginRequiredModal}
            className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-soft-sm">
            <Lock className="w-7 h-7" />
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 id="login-modal-title" className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleSignIn}
              className="w-full justify-center py-2.5 font-bold shadow-soft-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleCreateAccount}
              className="w-full justify-center py-2.5 font-semibold cursor-pointer"
            >
              <UserPlus className="w-4 h-4 mr-2 text-primary" />
              Create Account
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={closeLoginRequiredModal}
              className="w-full justify-center text-xs text-text-muted hover:text-text-primary cursor-pointer pt-1"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
