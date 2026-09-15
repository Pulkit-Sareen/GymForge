'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Calendar, History, User, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  // Hide bottom navbar during active workout or onboarding
  if (pathname === '/workout/active' || pathname === '/onboarding') {
    return null;
  }

  const navItems = [
    { label: 'Today', href: '/', icon: Dumbbell },
    { label: 'Routine', href: '/plan', icon: Calendar },
    { label: 'Library', href: '/exercises', icon: Activity },
    { label: 'History', href: '/history', icon: History },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800/80 px-4 py-2 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-400 font-semibold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
