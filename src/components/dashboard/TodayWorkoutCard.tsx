'use client';

import React from 'react';
import Link from 'next/link';
import { PlannedWorkoutDay, ExerciseDefinition } from '@/types/workout';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import { MuscleAnatomy } from '@/components/anatomy/MuscleAnatomy';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Clock,
  Flame,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface TodayWorkoutCardProps {
  todayPlan: PlannedWorkoutDay;
  isCompletedToday: boolean;
  library?: ExerciseDefinition[];
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  todayPlan,
  isCompletedToday,
  library = EXERCISE_LIBRARY,
}) => {
  // Compute metrics
  const exercises = todayPlan.exercises;
  const exerciseCount = exercises.length;

  // Approximate duration: ~8-10 mins per exercise + cardio
  const approxDurationMins = Math.max(
    exerciseCount * 9 + (todayPlan.cardioDetails?.durationMinutes || 0),
    20
  );

  // Approximate calories: ~45-60 kcal per exercise + cardio
  const approxCaloriesKcal = Math.round(
    exerciseCount * 55 +
      (todayPlan.cardioDetails ? todayPlan.cardioDetails.durationMinutes * 7.5 : 0)
  );

  if (todayPlan.isRestDay) {
    return (
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <Calendar className="w-7 h-7" />
        </div>
        <div>
          <Badge variant="zinc">Scheduled Rest</Badge>
          <h2 className="text-xl font-bold text-zinc-100 mt-2">Active Recovery Day</h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
            Muscle protein synthesis and neuromuscular repair occur during rest. Stay hydrated, eat clean protein, and stretch.
          </p>
        </div>
        <Link href="/plan" className="inline-block">
          <Button variant="outline" size="sm">
            View Full Weekly Plan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900/90 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-2xl shadow-cyan-950/20">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="cyan">TODAY'S ROUTINE</Badge>
            {isCompletedToday && (
              <Badge variant="emerald" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                COMPLETED
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-100">
            {todayPlan.title}
          </h2>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/70 mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exercises</span>
          </div>
          <span className="text-base font-extrabold text-zinc-100 mt-0.5">
            {exerciseCount}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center border-x border-zinc-800">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Duration</span>
          </div>
          <span className="text-base font-extrabold text-zinc-100 mt-0.5">
            ~{approxDurationMins}m
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Calories</span>
          </div>
          <span className="text-base font-extrabold text-zinc-100 mt-0.5">
            ~{approxCaloriesKcal} kcal
          </span>
        </div>
      </div>

      {/* Muscle Focus Visualization */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Target Muscles
          </span>
        </div>
        <MuscleAnatomy
          primaryMuscles={todayPlan.focusMuscles}
          secondaryMuscles={[]}
          showLegend={false}
          size="sm"
          className="py-2"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Link href={`/workout/active?dayId=${todayPlan.id}`} className="block w-full">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-zinc-950 font-black text-base shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Play className="w-5 h-5 fill-current" />
            {isCompletedToday ? 'Repeat Workout' : 'Start Workout'}
          </Button>
        </Link>

        <Link href={`/workout/${todayPlan.id}`} className="block w-full text-center">
          <button className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 py-2 flex items-center justify-center gap-1 w-full transition-colors">
            Preview Exercise List
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
};
