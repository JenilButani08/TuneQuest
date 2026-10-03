import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-primary flex-shrink-0" />;
    }
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-surface shadow-soft-xl text-left"
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
