'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WeeklyWorkoutPlan, PlannedWorkoutDay, ExerciseDefinition } from '@/types/workout';
import { getCurrentPlan, saveCurrentPlan } from '@/lib/indexeddb';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import { MuscleAnatomy } from '@/components/anatomy/MuscleAnatomy';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { SwapExerciseModal } from '@/components/workout/SwapExerciseModal';
import { swapExerciseInPlan } from '@/core/regeneration/plan-modifier';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ChevronLeft,
  Play,
  Clock,
  Flame,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function DayWorkoutPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const dayId = params.dayId as string;

  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<PlannedWorkoutDay | null>(null);
  const [swapTarget, setSwapTarget] = useState<ExerciseDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getCurrentPlan();
      if (!p) {
        router.push('/onboarding');
        return;
      }
      setPlan(p);
      const day = p.days.find((d) => d.id === dayId) || p.days[0];
      setSelectedDay(day);
      setIsLoading(false);
    }
    load();
  }, [dayId, router]);

  if (isLoading || !selectedDay) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSwapSuccess = async (replacement: ExerciseDefinition) => {
    if (!plan || !swapTarget) return;
    const updatedPlan = swapExerciseInPlan(plan, selectedDay.id, swapTarget.id, replacement);
    setPlan(updatedPlan);
    const updatedDay = updatedPlan.days.find((d) => d.id === selectedDay.id) || selectedDay;
    setSelectedDay(updatedDay);
    await saveCurrentPlan(updatedPlan);
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-safe space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-100"
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <Badge variant="cyan">{selectedDay.dayName.toUpperCase()}</Badge>
      </div>

      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-100">
          {selectedDay.title}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          {selectedDay.exercises.length} planned movements tailored to your split.
        </p>
      </div>

      {/* Anatomical Visualization */}
      {!selectedDay.isRestDay && (
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Target Muscle Activations
          </span>
          <MuscleAnatomy
            primaryMuscles={selectedDay.focusMuscles}
            secondaryMuscles={[]}
            size="md"
            showLegend={true}
          />
        </div>
      )}

      {/* Start Workout Button */}
      {!selectedDay.isRestDay && (
        <Link href={`/workout/active?dayId=${selectedDay.id}`} className="block">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="flex items-center justify-center gap-2 font-black text-base bg-gradient-to-r from-cyan-400 to-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Play className="w-5 h-5 fill-current" />
            Start This Workout
          </Button>
        </Link>
      )}

      {/* Exercise List */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block px-1">
          Prescribed Exercises
        </span>

        {selectedDay.exercises.map((pe) => {
          const exDef = EXERCISE_LIBRARY.find((e) => e.id === pe.exerciseId);
          if (!exDef) return null;

          return (
            <ExerciseCard
              key={pe.id}
              exercise={exDef}
              plannedExercise={pe}
              onSwapClick={() => setSwapTarget(exDef)}
            />
          );
        })}

        {selectedDay.cardioDetails && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Cardio Finisher
              </span>
              <h4 className="text-sm font-bold text-zinc-100 mt-0.5">
                {selectedDay.cardioDetails.type}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedDay.cardioDetails.durationMinutes} minutes · {selectedDay.cardioDetails.intensity} intensity
              </p>
            </div>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
        )}
      </div>

      {/* Swap Modal */}
      <SwapExerciseModal
        isOpen={Boolean(swapTarget)}
        onClose={() => setSwapTarget(null)}
        targetExercise={swapTarget}
        availableEquipment={['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'BODYWEIGHT']}
        currentWorkoutExerciseIds={selectedDay.exercises.map((e) => e.exerciseId)}
        onSelectReplacement={handleSwapSuccess}
      />
    </div>
  );
}
