import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'cyan' | 'points' | 'streak' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-medium',
  };

  const variantStyles = {
    primary: 'bg-primary-muted text-primary border border-primary/20',
    secondary: 'bg-surface-secondary text-text-secondary border border-border',
    cyan: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
    points: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    streak: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    outline: 'bg-transparent text-text-secondary border border-border',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
