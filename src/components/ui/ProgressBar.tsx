import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: 'primary' | 'xp' | 'points' | 'streak' | 'timer' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  const variantGradients = {
    primary: 'bg-primary',
    xp: 'bg-primary',
    points: 'bg-amber-500',
    streak: 'bg-orange-500',
    timer: clampedValue < 25 ? 'bg-danger' : clampedValue < 50 ? 'bg-warning' : 'bg-primary',
    success: 'bg-success',
  }[variant];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-text-secondary mb-1.5">
          <span>Progress</span>
          <span className="font-mono">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-secondary rounded-full overflow-hidden ${sizeStyles} border border-border`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${variantGradients}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
