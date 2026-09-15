'use client';

import React from 'react';
import Link from 'next/link';
import { ExerciseDefinition, PlannedExercise } from '@/types/workout';
import { MUSCLE_METADATA_MAP } from '@/data/muscles';
import { ChevronRight, RefreshCw, Dumbbell } from 'lucide-react';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  plannedExercise?: PlannedExercise;
  lastSessionWeight?: number;
  onSwapClick?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  plannedExercise,
  lastSessionWeight,
  onSwapClick,
}) => {
  const muscleLabels = [
    ...exercise.primaryMuscles.slice(0, 2).map((m) => MUSCLE_METADATA_MAP[m]?.name.split(' ')[0] || m),
    ...exercise.secondaryMuscles.slice(0, 1).map((m) => MUSCLE_METADATA_MAP[m]?.name.split(' ')[0] || m),
  ].join(' · ');

  const setsText = plannedExercise
    ? `${plannedExercise.targetSets} × ${plannedExercise.targetRepMin}–${plannedExercise.targetRepMax}`
    : `${exercise.defaultSets} × ${exercise.defaultRepMin}–${exercise.defaultRepMax}`;

  const weightDisplay = lastSessionWeight
    ? `${lastSessionWeight} kg last session`
    : plannedExercise?.suggestedWeightKg
    ? `~${plannedExercise.suggestedWeightKg} kg suggested`
    : 'Track weight';

  return (
    <div className="group relative bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-4 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/exercises/${exercise.slug}`} className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
              {exercise.name}
            </h4>
          </div>

          <p className="text-xs text-zinc-400 mt-0.5 truncate">
            {muscleLabels}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-extrabold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-lg">
              {setsText}
            </span>
            <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
              {weightDisplay}
            </span>
          </div>
        </Link>

        {/* Action button: Swap or View */}
        <div className="flex items-center gap-1">
          {onSwapClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwapClick();
              }}
              title="Change Exercise"
              className="p-2 rounded-xl text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <Link
            href={`/exercises/${exercise.slug}`}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
