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
import { WeekScheduleStrip } from '@/components/dashboard/WeekScheduleStrip';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Flame,
  Trophy,
  Activity,
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveWorkoutState | null>(null);
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Calculate Streak & Weekly consistency
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const completedThisWeek = sessions.filter(
    (s) => new Date(s.completedAt) >= startOfWeek
  );

  const isTodayCompleted = sessions.some((s) => {
    const d = new Date(s.completedAt);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  // Basic Streak calculation (consecutive workout weeks or days)
  const streakCount = Math.max(sessions.length > 0 ? 1 : 0, completedThisWeek.length);

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

        <Link href="/profile">
          <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors">
            <span className="text-xs font-bold">ME</span>
          </div>
        </Link>
      </div>

      {/* Interrupted Workout Resume Banner (Requirement #19) */}
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

      {/* 1. Full Week Schedule Strip (Requirement #6) */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            This Week&apos;s Schedule
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

      {/* 2. Today's Dominant Hero Workout Card (Requirement #6) */}
      <TodayWorkoutCard
        todayPlan={todayPlan}
        isCompletedToday={isTodayCompleted}
      />

      {/* 3. Consistency, Streak & Recovery Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {/* Streak */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Streak</span>
          </div>
          <span className="text-xl font-black text-zinc-100">{streakCount} Days</span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Consistency</span>
        </div>

        {/* PRs */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">PRs</span>
          </div>
          <span className="text-xl font-black text-zinc-100">
            {sessions.reduce((acc, s) => acc + (s.exercises.length > 0 ? 1 : 0), 0)}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Logged</span>
        </div>

        {/* Recovery Status */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Recovery</span>
          </div>
          <span className="text-xl font-black text-emerald-400">Optimal</span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Ready to Lift</span>
        </div>
      </div>

      {/* Quick Navigation to Plan */}
      <div className="pt-1">
        <Link href="/plan" className="block">
          <div className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-4 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">
                  Manage Weekly Plan
                </h4>
                <p className="text-xs text-zinc-400">
                  Swap days, swap exercises, or adjust volume
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </div>
        </Link>
      </div>
    </div>
  );
}
