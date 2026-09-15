'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-zinc-900/90 border border-zinc-800/80',
    elevated: 'bg-zinc-900 border border-zinc-700/80 shadow-lg shadow-black/40',
    glass: 'bg-zinc-900/60 backdrop-blur-md border border-zinc-800/60',
  };

  return (
    <div
      className={cn('rounded-2xl p-4 transition-all', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
