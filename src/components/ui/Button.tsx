'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

    const variants = {
      primary:
        'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.35)]',
      secondary:
        'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/80',
      outline:
        'bg-transparent hover:bg-zinc-800/60 text-zinc-300 border border-zinc-700',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]',
      ghost:
        'bg-transparent hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2.5 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 min-h-[52px] font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
