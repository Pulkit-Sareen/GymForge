'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'zinc';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'zinc',
  children,
  ...props
}) => {
  const variants = {
    cyan: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80',
    emerald: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
    amber: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
    rose: 'bg-rose-950/80 text-rose-400 border-rose-800/80',
    zinc: 'bg-zinc-800 text-zinc-300 border-zinc-700/70',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
