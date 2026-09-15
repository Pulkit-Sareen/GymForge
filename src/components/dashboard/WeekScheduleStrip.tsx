'use client';

import React from 'react';
import Link from 'next/link';
import { WeeklyWorkoutPlan } from '@/types/workout';
import { StoredSession } from '@/lib/indexeddb';
import { Check, Circle, Minus } from 'lucide-react';

interface WeekScheduleStripProps {
  plan: WeeklyWorkoutPlan;
  sessionsThisWeek: StoredSession[];
  selectedDayId?: string;
}

export const WeekScheduleStrip: React.FC<WeekScheduleStripProps> = ({
  plan,
  sessionsThisWeek,
  selectedDayId,
}) => {
  // Current Day of Week: 0 = Sun, 1 = Mon ... 6 = Sat
  const today = new Date().getDay();

  // Reorder days so week starts on Monday (1) through Sunday (0)
  const sortedDays = [...plan.days].sort((a, b) => {
    const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return orderA - orderB;
  });

  const isDayCompleted = (dayOfWeek: number) => {
    // Check if there is a session completed on this day of week in the current calendar week
    return sessionsThisWeek.some((s) => {
      const sessionDate = new Date(s.completedAt);
      return sessionDate.getDay() === dayOfWeek;
    });
  };

  const dayAbbrMap: Record<string, string> = {
    Monday: 'MON',
    Tuesday: 'TUE',
    Wednesday: 'WED',
    Thursday: 'THU',
    Friday: 'FRI',
    Saturday: 'SAT',
    Sunday: 'SUN',
  };

  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3 shadow-inner">
      <div className="flex items-center justify-between gap-1">
        {sortedDays.map((day) => {
          const isToday = day.dayOfWeek === today;
          const completed = isDayCompleted(day.dayOfWeek);
          const isRest = day.isRestDay;
          const isSelected = selectedDayId ? selectedDayId === day.id : isToday;

          return (
            <Link
              key={day.id}
              href={`/workout/${day.id}`}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                isSelected
                  ? 'bg-zinc-800 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'hover:bg-zinc-900/80 border border-transparent'
              }`}
            >
              {/* Day Label */}
              <span
                className={`text-[11px] font-bold tracking-wider mb-1 ${
                  isToday ? 'text-cyan-400' : 'text-zinc-400'
                }`}
              >
                {dayAbbrMap[day.dayName] || day.dayName.slice(0, 3).toUpperCase()}
              </span>

              {/* Status Indicator Icon */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all">
                {completed ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isRest ? (
                  <div className="w-6 h-6 flex items-center justify-center text-zinc-600">
                    <Minus className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      isToday
                        ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                        : 'border-zinc-700 text-zinc-500'
                    }`}
                  >
                    <Circle className="w-2.5 h-2.5 fill-current" />
                  </div>
                )}
              </div>

              {/* Dot for today */}
              {isToday && (
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
