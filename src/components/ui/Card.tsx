import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'secondary' | 'interactive';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface border border-border rounded-2xl shadow-soft-sm',
    elevated: 'bg-surface border border-border rounded-2xl shadow-soft-md',
    secondary: 'bg-surface-secondary border border-border rounded-2xl',
    interactive: 'bg-surface border border-border rounded-2xl shadow-soft-sm hover:border-primary/40 hover:shadow-soft-md transition-all duration-150 cursor-pointer',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
