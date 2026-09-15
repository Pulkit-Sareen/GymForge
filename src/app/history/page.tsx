'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCompletedSessions, StoredSession } from '@/lib/indexeddb';
import { formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  Dumbbell,
  Flame,
  Trophy,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await getCompletedSessions();
      setSessions(s);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate high level lifetime stats
  const totalWorkouts = sessions.length;
  const totalVolumeLifetime = sessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const totalCaloriesLifetime = sessions.reduce((acc, s) => acc + s.estimatedCalories, 0);

  return (
    <div className="max-w-lg mx-auto p-4 pb-safe space-y-5">
      {/* Top Header */}
      <div className="pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
          LOGGED ACHIEVEMENTS
        </span>
        <h1 className="text-2xl font-black tracking-tight text-zinc-100">
          Workout History & PRs
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Review your training consistency, accumulated volume, and personal records.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
            Workouts
          </span>
          <span className="text-xl font-black text-cyan-400 block mt-0.5">
            {totalWorkouts}
          </span>
          <span className="text-[10px] text-zinc-500">Completed</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
            Volume
          </span>
          <span className="text-xl font-black text-zinc-100 block mt-0.5">
            {Math.round(totalVolumeLifetime / 1000)}k
          </span>
          <span className="text-[10px] text-zinc-500">kg lifted</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
            Calories
          </span>
          <span className="text-xl font-black text-amber-400 block mt-0.5">
            {Math.round(totalCaloriesLifetime)}
          </span>
          <span className="text-[10px] text-zinc-500">est. kcal</span>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block px-1">
          Recent Workout Logs
        </span>

        {sessions.length === 0 ? (
          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl text-center space-y-3">
            <Dumbbell className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-zinc-200">No workouts logged yet</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Start today&apos;s workout from your dashboard. All sets, volume, and calories will be tracked here.
            </p>
            <Link href="/" className="inline-block pt-1">
              <Button size="sm" variant="primary">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const formattedDate = new Date(session.completedAt).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={session.id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                        {formattedDate}
                      </span>
                      <h4 className="text-base font-bold text-zinc-100 mt-0.5">
                        {session.name}
                      </h4>
                    </div>
                    <Badge variant="emerald" className="flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      DONE
                    </Badge>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="flex items-center gap-3 text-xs text-zinc-300 flex-wrap pt-1 border-t border-zinc-800/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {formatDuration(session.durationSeconds)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
                      {session.totalSetsCompleted} sets
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      {session.totalVolumeKg.toLocaleString()} kg
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      ~{session.estimatedCalories} kcal
                    </span>
                  </div>

                  {/* Exercise Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {session.exercises.map((ex, exIdx) => (
                      <span
                        key={exIdx}
                        className="bg-zinc-950 text-zinc-400 border border-zinc-800 text-[11px] px-2 py-0.5 rounded-lg"
                      >
                        {ex.exerciseName} ({ex.sets.length})
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
