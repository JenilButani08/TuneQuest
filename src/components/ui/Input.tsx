import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-surface border ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            } rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:ring-2 ${
              icon ? 'pl-10' : ''
            } ${rightElement ? 'pr-11' : ''} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center justify-center text-text-muted">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-danger font-medium mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
