'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WeeklyWorkoutPlan, PlannedWorkoutDay, ActiveWorkoutState } from '@/types/workout';
import {
  getCurrentPlan,
  getActiveWorkout,
  getCompletedSessions,
  StoredSession,
} from '@/lib/indexeddb';
import { isDateInCurrentWeek } from '@/lib/utils';
import { WeekScheduleStrip } from '@/components/dashboard/WeekScheduleStrip';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { CardioLogModal } from '@/components/workout/CardioLogModal';
import { Button } from '@/components/ui/Button';
import {
  Flame,
  Trophy,
  Activity,
  ArrowRight,
  Calendar,
  Zap,
  TrendingUp,
  RotateCcw,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveWorkoutState | null>(null);
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCardioModalOpen, setIsCardioModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const savedPlan = await getCurrentPlan();
        if (!savedPlan) {
          // If no plan exists yet, guide user through onboarding
          router.push('/onboarding');
          return;
        }

        const active = await getActiveWorkout();
        const history = await getCompletedSessions();

        setPlan(savedPlan);
        setActiveSession(active || null);
        setSessions(history);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-zinc-400">Loading your training dashboard...</p>
      </div>
    );
  }

  if (!plan) return null;

  // Compute today's workout based on JavaScript Day of Week (0 = Sun, 1 = Mon ... 6 = Sat)
  const currentDayOfWeek = new Date().getDay();
  const todayPlan: PlannedWorkoutDay =
    plan.days.find((d) => d.dayOfWeek === currentDayOfWeek) || plan.days[0];

  // Calculate current week sessions (resets every Monday at 00:00:00)
  const now = new Date();
  const completedThisWeek = sessions.filter((s) => isDateInCurrentWeek(s.completedAt));
  const weekVolume = completedThisWeek.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const weekCalories = completedThisWeek.reduce((acc, s) => acc + s.estimatedCalories, 0);

  const isTodayCompleted = sessions.some((s) => {
    const d = new Date(s.completedAt);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  // Basic Streak calculation
  const streakCount = Math.max(sessions.length > 0 ? 1 : 0, completedThisWeek.length);

  const handleCardioSaved = (newSession: StoredSession) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-safe space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            GYMFORGE INTELLIGENCE
          </span>
          <h1 className="text-2xl font-black tracking-tight text-zinc-100">
            Training Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCardioModalOpen(true)}
            className="text-xs h-9 border-zinc-700 bg-zinc-900/90 text-amber-400 hover:text-amber-300 hover:border-amber-500/50 flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Cardio</span>
          </Button>

          <Link href="/profile">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors">
              <span className="text-xs font-bold">ME</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Interrupted Workout Resume Banner */}
      {activeSession && activeSession.status === 'IN_PROGRESS' && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-amber-950/20 animate-in fade-in">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              Workout in progress
            </div>
            <span className="text-sm font-extrabold text-zinc-100 block mt-0.5">
              {activeSession.name}
            </span>
          </div>

          <Link href="/workout/active">
            <Button
              variant="primary"
              size="sm"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            >
              Resume
            </Button>
          </Link>
        </div>
      )}

      {/* Weekly Cycle Status Banner (Monday Reset) */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="text-xs font-bold text-zinc-200">This Week&apos;s Training Cycle</span>
        </div>
        <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
          <RotateCcw className="w-2.5 h-2.5 text-cyan-400" /> Resets Monday 00:00
        </span>
      </div>

      {/* 1. Full Week Schedule Strip */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Weekly Schedule
          </span>
          <span className="text-xs text-cyan-400 font-bold">
            {completedThisWeek.length} Completed
          </span>
        </div>
        <WeekScheduleStrip
          plan={plan}
          sessionsThisWeek={completedThisWeek}
          selectedDayId={todayPlan.id}
        />
      </div>

      {/* 2. Today's Dominant Hero Workout Card */}
      <TodayWorkoutCard
        todayPlan={todayPlan}
        isCompletedToday={isTodayCompleted}
      />

      {/* 3. Consistency, Weekly Volume & Weekly Calories Metrics (Resets Every Monday) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Weekly Volume */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Volume</span>
          </div>
          <span className="text-xl font-black text-zinc-100">
            {weekVolume >= 1000 ? `${(weekVolume / 1000).toFixed(1)}k` : Math.round(weekVolume)}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">kg this week</span>
        </div>

        {/* Weekly Calories */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Calories</span>
          </div>
          <span className="text-xl font-black text-amber-400">
            {Math.round(weekCalories)}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">kcal this week</span>
        </div>

        {/* Streak / Workouts */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Workouts</span>
          </div>
          <span className="text-xl font-black text-zinc-100">
            {completedThisWeek.length}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">done this week</span>
        </div>
      </div>

      {/* Quick Navigation to Plan & Cardio Trigger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <Link href="/plan" className="block">
          <div className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-3.5 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100">
                  Custom Muscle Split
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Combine muscle sets or adjust days
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0" />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsCardioModalOpen(true)}
          className="w-full text-left bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-100">
                Include Cardio
              </h4>
              <p className="text-[11px] text-zinc-400">
                Log distance, incline, or machine kcal
              </p>
            </div>
          </div>
          <Plus className="w-4 h-4 text-amber-400 shrink-0" />
        </button>
      </div>

      {/* Cardio Log Modal */}
      <CardioLogModal
        isOpen={isCardioModalOpen}
        onClose={() => setIsCardioModalOpen(false)}
        onSaved={handleCardioSaved}
      />
    </div>
  );
}
