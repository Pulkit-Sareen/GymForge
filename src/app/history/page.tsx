'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCompletedSessions, StoredSession } from '@/lib/indexeddb';
import { formatDuration, isDateInCurrentWeek } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EditWorkoutModal } from '@/components/history/EditWorkoutModal';
import {
  Clock,
  Dumbbell,
  Flame,
  TrendingUp,
  CheckCircle2,
  Lock,
  Edit3,
  RotateCcw,
} from 'lucide-react';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSessionForEdit, setSelectedSessionForEdit] = useState<StoredSession | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statView, setStatView] = useState<'week' | 'lifetime'>('week');

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

  // Filter current week sessions (resetting every Monday at 00:00:00)
  const currentWeekSessions = sessions.filter((s) => isDateInCurrentWeek(s.completedAt));
  const weekWorkouts = currentWeekSessions.length;
  const weekVolume = currentWeekSessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const weekCalories = currentWeekSessions.reduce((acc, s) => acc + s.estimatedCalories, 0);

  // Lifetime stats
  const totalWorkouts = sessions.length;
  const totalVolumeLifetime = sessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const totalCaloriesLifetime = sessions.reduce((acc, s) => acc + s.estimatedCalories, 0);

  const handleEditClick = (session: StoredSession) => {
    setSelectedSessionForEdit(session);
    setIsEditModalOpen(true);
  };

  const handleSessionUpdated = (updatedSession: StoredSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
  };

  const handleSessionDeleted = (deletedId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== deletedId));
  };

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

      {/* Aggregate Stats Cards with View Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
              {statView === 'week' ? "This Week's Activity" : 'All-Time Total'}
            </span>
            {statView === 'week' && (
              <span className="text-[10px] bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <RotateCcw className="w-2.5 h-2.5" /> Resets Monday
              </span>
            )}
          </div>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setStatView('week')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                statView === 'week'
                  ? 'bg-cyan-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setStatView('lifetime')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                statView === 'lifetime'
                  ? 'bg-cyan-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
              Workouts
            </span>
            <span className="text-xl font-black text-cyan-400 block mt-0.5">
              {statView === 'week' ? weekWorkouts : totalWorkouts}
            </span>
            <span className="text-[10px] text-zinc-500">
              {statView === 'week' ? 'this week' : 'completed'}
            </span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
              Volume
            </span>
            <span className="text-xl font-black text-zinc-100 block mt-0.5">
              {statView === 'week'
                ? weekVolume >= 1000
                  ? `${(weekVolume / 1000).toFixed(1)}k`
                  : `${Math.round(weekVolume)}`
                : totalVolumeLifetime >= 1000
                ? `${Math.round(totalVolumeLifetime / 1000)}k`
                : `${Math.round(totalVolumeLifetime)}`}
            </span>
            <span className="text-[10px] text-zinc-500">kg lifted</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
              Calories
            </span>
            <span className="text-xl font-black text-amber-400 block mt-0.5">
              {Math.round(statView === 'week' ? weekCalories : totalCaloriesLifetime)}
            </span>
            <span className="text-[10px] text-zinc-500">est. kcal</span>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
            Workout Logs
          </span>
          <span className="text-[11px] text-zinc-500">
            Current week sessions can be edited
          </span>
        </div>

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
              const isCurrentWeek = isDateInCurrentWeek(session.completedAt);

              return (
                <div
                  key={session.id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3 transition-colors hover:border-zinc-700/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                          {formattedDate}
                        </span>
                        {isCurrentWeek && (
                          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-1.5 py-0.2 rounded font-semibold">
                            THIS WEEK
                          </span>
                        )}
                      </div>
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

                  {/* Edit or Lock status */}
                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    {isCurrentWeek ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(session)}
                        className="text-xs h-7 py-0 border-zinc-700 text-cyan-400 hover:bg-zinc-800 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit Workout
                      </Button>
                    ) : (
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-zinc-600" />
                        Past Week (Archived & Locked)
                      </span>
                    )}
                    {session.notes && (
                      <span className="text-[11px] text-zinc-400 truncate max-w-[200px] italic">
                        &quot;{session.notes}&quot;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Workout Modal */}
      <EditWorkoutModal
        session={selectedSessionForEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSessionForEdit(null);
        }}
        onUpdated={handleSessionUpdated}
        onDeleted={handleSessionDeleted}
      />
    </div>
  );
}
