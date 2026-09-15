'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import { MUSCLE_METADATA_MAP } from '@/data/muscles';
import { MuscleAnatomy } from '@/components/anatomy/MuscleAnatomy';
import { calculateProgression } from '@/core/progression/double-progression';
import { estimateExerciseCalories } from '@/core/calories/calorie-calculator';
import { getCompletedSessions, StoredSession } from '@/lib/indexeddb';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ChevronLeft,
  Flame,
  Clock,
  Dumbbell,
  Sparkles,
  Wind,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const exercise = EXERCISE_LIBRARY.find((e) => e.slug === slug);
  const [history, setHistory] = useState<StoredSession[]>([]);

  useEffect(() => {
    async function load() {
      const h = await getCompletedSessions();
      setHistory(h);
    }
    load();
  }, []);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Exercise Not Found</h2>
        <Link href="/exercises">
          <Button variant="secondary" size="sm">
            Browse Exercise Library
          </Button>
        </Link>
      </div>
    );
  }

  // Find previous performance sets for this exercise
  let previousSets: { weightKg: number; reps: number; rir?: number }[] = [];
  let previousDate = '';
  for (const s of history) {
    const match = s.exercises.find((e) => e.exerciseId === exercise.id);
    if (match && match.sets.length > 0) {
      previousSets = match.sets;
      previousDate = new Date(s.completedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      break;
    }
  }

  // Calculate progression recommendation
  const progression = calculateProgression(
    exercise,
    exercise.defaultRepMin,
    exercise.defaultRepMax,
    previousSets
  );

  // Calculate estimated calories for standard target
  const estKcal = estimateExerciseCalories({
    exercise,
    setsCount: exercise.defaultSets,
    repsPerSetAvg: Math.round((exercise.defaultRepMin + exercise.defaultRepMax) / 2),
    restSecondsAvg: exercise.defaultRestSeconds,
    userWeightKg: 75,
  });

  return (
    <div className="max-w-lg mx-auto p-4 pb-safe space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-100"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <Badge variant="cyan">{exercise.category}</Badge>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-100">
          {exercise.name}
        </h1>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <Badge variant="zinc">{exercise.movementPattern.replace('_', ' ')}</Badge>
          <Badge variant="zinc">{exercise.equipmentRequired.join(' + ')}</Badge>
          <Badge variant="emerald">{exercise.difficulty}</Badge>
        </div>
      </div>

      {/* Prescribed Prescription Grid */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 text-center">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Prescription</span>
          <span className="text-base font-extrabold text-cyan-400 block mt-0.5">
            {exercise.defaultSets} × {exercise.defaultRepMin}–{exercise.defaultRepMax}
          </span>
        </div>
        <div className="border-x border-zinc-800">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Rest</span>
          <span className="text-base font-extrabold text-zinc-100 block mt-0.5">
            {exercise.defaultRestSeconds}s
          </span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Est. Burn</span>
          <span className="text-base font-extrabold text-amber-400 block mt-0.5">
            ~{estKcal} kcal
          </span>
        </div>
      </div>

      {/* Dynamic Anatomical Muscle Highlighting */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Anatomical Muscle Activation
        </span>
        <MuscleAnatomy
          primaryMuscles={exercise.primaryMuscles}
          secondaryMuscles={exercise.secondaryMuscles}
          size="md"
          showLegend={true}
        />
      </div>

      {/* Suggested Weight & Smart Progression Guidance Card */}
      <div className="bg-gradient-to-b from-cyan-950/30 to-zinc-900 border border-cyan-800/50 rounded-3xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Progression Guidance
          </span>
          <span className="text-xs font-bold bg-cyan-900/60 text-cyan-200 px-2.5 py-0.5 rounded-full border border-cyan-700/60">
            Suggested: {progression.suggestedWeightKg} kg
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          {progression.explanation}
        </p>

        {/* Previous Performance Log */}
        {previousSets.length > 0 && (
          <div className="pt-3 border-t border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 font-semibold uppercase block mb-1.5">
              Previous Session ({previousDate}):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {previousSets.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-mono font-semibold"
                >
                  Set {idx + 1}: {s.weightKg} kg × {s.reps}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Breathing Technique */}
      {exercise.breathingTips && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3">
          <Wind className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-300 font-bold mb-0.5">
              Breathing Pattern
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {exercise.breathingTips}
            </p>
          </div>
        </div>
      )}

      {/* Form Cues */}
      {exercise.formCues.length > 0 && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Technique Cues
          </h4>
          <ul className="space-y-1.5">
            {exercise.formCues.map((cue, idx) => (
              <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                <span>{cue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step-by-Step Instructions */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-zinc-400" />
          Execution Steps
        </h4>
        <ol className="space-y-2 text-xs text-zinc-400">
          {exercise.instructions.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed text-zinc-300">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
