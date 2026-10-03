import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'points' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  glow,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2 font-semibold',
    icon: 'p-2 rounded-xl',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-soft-sm',
    secondary: 'bg-surface-secondary text-text-primary hover:bg-border/60 border border-border',
    accent: 'bg-primary-muted text-primary hover:bg-primary/15 font-semibold',
    points: 'bg-amber-500 text-white font-semibold hover:bg-amber-600 shadow-soft-sm',
    outline: 'bg-surface text-text-primary border border-border hover:bg-surface-secondary',
    ghost: 'bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-soft-sm',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
      {children}
    </button>
  );
};
