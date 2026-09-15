'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ActiveWorkoutState,
  ActiveExerciseSession,
  ActiveSetLog,
  ExerciseDefinition,
  PlannedWorkoutDay,
  CompletedWorkoutSummary,
  PersonalRecordAchievement,
} from '@/types/workout';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import { MuscleAnatomy } from '@/components/anatomy/MuscleAnatomy';
import { SetRowInput } from './SetRowInput';
import { RestTimer } from './RestTimerModal';
import { SwapExerciseModal } from './SwapExerciseModal';
import { WorkoutSummaryModal } from './WorkoutSummaryModal';
import { calculateProgression } from '@/core/progression/double-progression';
import { estimateExerciseCalories, estimateWorkoutTotalCalories } from '@/core/calories/calorie-calculator';
import { detectPersonalRecords } from '@/core/records/pr-detector';
import {
  saveActiveWorkout,
  clearActiveWorkout,
  saveCompletedSession,
  getActiveWorkout,
  getCompletedSessions,
  StoredSession,
} from '@/lib/indexeddb';
import { formatTimeMMSS } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Pause,
  Clock,
  Flame,
  Plus,
  Trash2,
  RefreshCw,
  SkipForward,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Timer,
  AlertTriangle,
} from 'lucide-react';

interface ActiveWorkoutViewProps {
  initialPlanDay?: PlannedWorkoutDay;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  initialPlanDay,
}) => {
  const router = useRouter();

  // Active workout state
  const [workoutState, setWorkoutState] = useState<ActiveWorkoutState | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerOpen, setTimerOpen] = useState<boolean>(false);
  const [restDuration, setRestDuration] = useState<number>(90);
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [summary, setSummary] = useState<CompletedWorkoutSummary | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [historicalSessions, setHistoricalSessions] = useState<StoredSession[]>([]);

  // Load active workout or initialize from plan day
  useEffect(() => {
    async function init() {
      const history = await getCompletedSessions();
      setHistoricalSessions(history);

      const active = await getActiveWorkout();
      if (active && active.status === 'IN_PROGRESS') {
        setWorkoutState(active);
        const startTime = new Date(active.startedAt).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((now - startTime) / 1000));
        setElapsedSeconds(diff);
        return;
      }

      if (initialPlanDay) {
        // Initialize new active workout
        const exercises: ActiveExerciseSession[] = initialPlanDay.exercises.map((pe, idx) => {
          const exDef = EXERCISE_LIBRARY.find((e) => e.id === pe.exerciseId);
          // Find historical performance for this exercise
          let prevSets: { weightKg: number; reps: number }[] = [];
          for (const s of history) {
            const foundEx = s.exercises.find((e) => e.exerciseId === pe.exerciseId);
            if (foundEx && foundEx.sets.length > 0) {
              prevSets = foundEx.sets;
              break;
            }
          }

          const defaultWeight = pe.suggestedWeightKg || (prevSets[0]?.weightKg ?? 20);

          const sets: ActiveSetLog[] = Array.from({ length: pe.targetSets }, (_, sIdx) => ({
            id: `set-${idx}-${sIdx + 1}`,
            setNumber: sIdx + 1,
            setType: 'NORMAL',
            weightKg: prevSets[sIdx]?.weightKg ?? defaultWeight,
            reps: prevSets[sIdx]?.reps ?? pe.targetRepMin,
            rir: 2,
            isCompleted: false,
          }));

          return {
            id: `aes-${idx}-${pe.exerciseId}`,
            exerciseId: pe.exerciseId,
            orderIndex: idx,
            targetSets: pe.targetSets,
            targetRepMin: pe.targetRepMin,
            targetRepMax: pe.targetRepMax,
            restSeconds: pe.restSeconds || 90,
            suggestedWeightKg: defaultWeight,
            previousPerformance: prevSets.length > 0 ? { date: 'Last Session', sets: prevSets } : undefined,
            sets,
          };
        });

        const newSession: ActiveWorkoutState = {
          id: `session-${Date.now()}`,
          planDayId: initialPlanDay.id,
          name: initialPlanDay.title,
          startedAt: new Date().toISOString(),
          totalDurationSeconds: 0,
          estimatedCalories: 0,
          status: 'IN_PROGRESS',
          exercises,
        };

        setWorkoutState(newSession);
        await saveActiveWorkout(newSession);
      }
    }
    init();
  }, [initialPlanDay]);

  // Elapsed workout timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-save debouncer to IndexedDB for zero data loss
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const persistState = (newState: ActiveWorkoutState) => {
    setWorkoutState(newState);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveActiveWorkout({ ...newState, totalDurationSeconds: elapsedSeconds });
    }, 80);
  };

  if (!workoutState || workoutState.exercises.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-zinc-400">Loading workout session...</p>
      </div>
    );
  }

  const currentExerciseSession = workoutState.exercises[currentExerciseIndex] || workoutState.exercises[0];
  const currentDef =
    EXERCISE_LIBRARY.find((e) => e.id === currentExerciseSession.exerciseId) ||
    EXERCISE_LIBRARY[0];

  // Calculate progression recommendation for current exercise
  const lastPerformanceSets = currentExerciseSession.previousPerformance?.sets || [];
  const progression = calculateProgression(
    currentDef,
    currentExerciseSession.targetRepMin,
    currentExerciseSession.targetRepMax,
    lastPerformanceSets
  );

  // Set management handlers
  const handleUpdateSet = (setId: string, updates: Partial<ActiveSetLog>) => {
    const updatedExercises = workoutState.exercises.map((exSession, eIdx) => {
      if (eIdx !== currentExerciseIndex) return exSession;
      const updatedSets = exSession.sets.map((s) =>
        s.id === setId ? { ...s, ...updates } : s
      );
      return { ...exSession, sets: updatedSets };
    });
    persistState({ ...workoutState, exercises: updatedExercises });
  };

  const handleToggleCompleteSet = (setId: string) => {
    const updatedExercises = workoutState.exercises.map((exSession, eIdx) => {
      if (eIdx !== currentExerciseIndex) return exSession;
      const updatedSets = exSession.sets.map((s) => {
        if (s.id === setId) {
          const nextCompleted = !s.isCompleted;
          if (nextCompleted) {
            // Trigger rest timer
            setRestDuration(exSession.restSeconds || 90);
            setTimerOpen(true);
          }
          return {
            ...s,
            isCompleted: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return s;
      });
      return { ...exSession, sets: updatedSets };
    });
    persistState({ ...workoutState, exercises: updatedExercises });
  };

  const handleAddSet = () => {
    const updatedExercises = workoutState.exercises.map((exSession, eIdx) => {
      if (eIdx !== currentExerciseIndex) return exSession;
      const lastSet = exSession.sets[exSession.sets.length - 1];
      const newSet: ActiveSetLog = {
        id: `set-${eIdx}-${exSession.sets.length + 1}-${Date.now()}`,
        setNumber: exSession.sets.length + 1,
        setType: 'NORMAL',
        weightKg: lastSet?.weightKg ?? 20,
        reps: lastSet?.reps ?? exSession.targetRepMin,
        rir: 2,
        isCompleted: false,
      };
      return { ...exSession, sets: [...exSession.sets, newSet] };
    });
    persistState({ ...workoutState, exercises: updatedExercises });
  };

  const handleRemoveSet = () => {
    if (currentExerciseSession.sets.length <= 1) return;
    const updatedExercises = workoutState.exercises.map((exSession, eIdx) => {
      if (eIdx !== currentExerciseIndex) return exSession;
      return { ...exSession, sets: exSession.sets.slice(0, -1) };
    });
    persistState({ ...workoutState, exercises: updatedExercises });
  };

  // Skip / Replace handlers
  const handleSkipExercise = () => {
    if (workoutState.exercises.length <= 1) return;
    const filtered = workoutState.exercises.filter((_, idx) => idx !== currentExerciseIndex);
    const newIdx = Math.min(currentExerciseIndex, filtered.length - 1);
    setCurrentExerciseIndex(newIdx);
    persistState({ ...workoutState, exercises: filtered });
  };

  const handleReplaceExercise = (replacement: ExerciseDefinition) => {
    const updatedExercises = workoutState.exercises.map((exSession, eIdx) => {
      if (eIdx !== currentExerciseIndex) return exSession;
      return {
        ...exSession,
        exerciseId: replacement.id,
        targetSets: replacement.defaultSets,
        targetRepMin: replacement.defaultRepMin,
        targetRepMax: replacement.defaultRepMax,
        restSeconds: replacement.defaultRestSeconds,
        sets: Array.from({ length: replacement.defaultSets }, (_, sIdx) => ({
          id: `set-${eIdx}-${sIdx + 1}`,
          setNumber: sIdx + 1,
          setType: 'NORMAL' as const,
          weightKg: 20,
          reps: replacement.defaultRepMin,
          rir: 2,
          isCompleted: false,
        })),
      };
    });
    persistState({ ...workoutState, exercises: updatedExercises });
  };

  // Finish workout handler
  const handleFinishWorkout = async () => {
    // 1. Calculate stats
    let totalSetsCompleted = 0;
    let totalVolume = 0;
    let totalStrengthKcal = 0;
    const prsAchieved: PersonalRecordAchievement[] = [];

    const sessionSummaryExercises = workoutState.exercises.map((exSession) => {
      const def = EXERCISE_LIBRARY.find((e) => e.id === exSession.exerciseId) || EXERCISE_LIBRARY[0];
      const completedSets = exSession.sets.filter((s) => s.isCompleted);

      completedSets.forEach((s) => {
        totalSetsCompleted++;
        totalVolume += s.weightKg * s.reps;
      });

      // Calculate calories for this exercise
      if (completedSets.length > 0) {
        const avgReps =
          completedSets.reduce((acc, s) => acc + s.reps, 0) / completedSets.length;
        const kcal = estimateExerciseCalories({
          exercise: def,
          setsCount: completedSets.length,
          repsPerSetAvg: avgReps,
          restSecondsAvg: exSession.restSeconds || 90,
          userWeightKg: 75,
        });
        totalStrengthKcal += kcal;

        // Detect PRs
        const prs = detectPersonalRecords(def.id, def.name, completedSets);
        prsAchieved.push(...prs);
      }

      return {
        exerciseId: def.id,
        exerciseName: def.name,
        sets: completedSets.map((s) => ({
          weightKg: s.weightKg,
          reps: s.reps,
          rir: s.rir,
          rpe: s.rpe,
        })),
      };
    });

    const totalKcal = estimateWorkoutTotalCalories(totalStrengthKcal).totalKcal;

    const completedSession: StoredSession = {
      id: workoutState.id,
      planDayId: workoutState.planDayId,
      name: workoutState.name,
      startedAt: workoutState.startedAt,
      completedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg: totalVolume,
      totalSetsCompleted,
      estimatedCalories: totalKcal,
      exercises: sessionSummaryExercises,
      synced: false,
    };

    // 2. Persist completed session to IndexedDB & clear active session
    await saveCompletedSession(completedSession);
    await clearActiveWorkout(workoutState.id);

    // 3. Display summary
    setSummary({
      id: completedSession.id,
      name: completedSession.name,
      startedAt: completedSession.startedAt,
      completedAt: completedSession.completedAt,
      durationSeconds: elapsedSeconds,
      totalVolumeKg: totalVolume,
      totalSetsCompleted,
      estimatedCalories: totalKcal,
      personalRecordsAchieved: prsAchieved,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between max-w-lg mx-auto pb-6">
      {/* Top Session Status Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Leave
        </button>

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-400 shadow-inner">
          <Clock className="w-3.5 h-3.5" />
          {formatTimeMMSS(elapsedSeconds)}
        </div>

        <button
          onClick={() => setTimerOpen(true)}
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2.5 py-1 rounded-full hover:bg-cyan-900/40"
        >
          <Timer className="w-3.5 h-3.5" />
          Rest
        </button>
      </div>

      {/* Main Exercise View */}
      <div className="p-4 space-y-4">
        {/* Exercise Progress Indicator (Carousel dots) */}
        <div className="flex items-center justify-between gap-1 pb-1">
          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
            EXERCISE {currentExerciseIndex + 1} OF {workoutState.exercises.length}
          </span>
          <div className="flex items-center gap-1">
            {workoutState.exercises.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentExerciseIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentExerciseIndex
                    ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Exercise Header Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-50 tracking-tight">
                {currentDef.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Target: {currentExerciseSession.targetSets} sets × {currentExerciseSession.targetRepMin}–{currentExerciseSession.targetRepMax} reps
              </p>
            </div>

            <button
              onClick={() => setSwapModalOpen(true)}
              className="p-2 rounded-xl text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800/80 transition-colors"
              title="Change Exercise"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Smart Weight Progression Guidance Card */}
          <div className="mt-3 p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-2xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-cyan-300 block">
                Suggested Weight: {progression.suggestedWeightKg} kg
              </span>
              <p className="text-zinc-400 mt-0.5 text-[11px] leading-relaxed">
                {progression.explanation}
              </p>
            </div>
          </div>

          {/* Collapsible Dynamic Anatomy Visualizer */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Anatomical Activation
            </span>
          </div>
          <MuscleAnatomy
            primaryMuscles={currentDef.primaryMuscles}
            secondaryMuscles={currentDef.secondaryMuscles}
            size="sm"
            showLegend={true}
            className="mt-2 border-0 bg-zinc-950/40"
          />
        </div>

        {/* Sets Input List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              LOG SETS
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemoveSet}
                className="text-xs text-zinc-500 hover:text-rose-400 font-semibold p-1"
                title="Remove last set"
              >
                - Set
              </button>
              <button
                onClick={handleAddSet}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5 p-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Set
              </button>
            </div>
          </div>

          {currentExerciseSession.sets.map((setLog, sIdx) => {
            const prevSet = currentExerciseSession.previousPerformance?.sets[sIdx];
            const prevText = prevSet ? `${prevSet.weightKg}k×${prevSet.reps}` : undefined;

            return (
              <SetRowInput
                key={setLog.id}
                setLog={setLog}
                previousPerformanceText={prevText}
                suggestedWeight={progression.suggestedWeightKg}
                onUpdate={(updates) => handleUpdateSet(setLog.id, updates)}
                onToggleComplete={() => handleToggleCompleteSet(setLog.id)}
              />
            );
          })}
        </div>

        {/* Exercise Switcher Navigation Bar */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex((i) => Math.max(0, i - 1))}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipExercise}
            className="text-zinc-400 hover:text-zinc-200 text-xs px-3"
            title="Skip this exercise"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={currentExerciseIndex === workoutState.exercises.length - 1}
            onClick={() => setCurrentExerciseIndex((i) => Math.min(workoutState.exercises.length - 1, i + 1))}
            className="flex-1 flex items-center justify-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 p-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleFinishWorkout}
          className="flex items-center justify-center gap-2 font-black text-base bg-gradient-to-r from-emerald-500 to-cyan-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          Finish Workout
        </Button>
      </div>

      {/* Floating Rest Timer */}
      <RestTimer
        isOpen={timerOpen}
        targetSeconds={restDuration}
        onClose={() => setTimerOpen(false)}
      />

      {/* Swap Exercise Modal */}
      <SwapExerciseModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        targetExercise={currentDef}
        availableEquipment={['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'BODYWEIGHT']}
        currentWorkoutExerciseIds={workoutState.exercises.map((e) => e.exerciseId)}
        onSelectReplacement={handleReplaceExercise}
      />

      {/* Completed Workout Summary Modal */}
      <WorkoutSummaryModal
        summary={summary}
        onDismiss={() => {
          setSummary(null);
          router.push('/');
        }}
      />

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-sm text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Pause Workout?</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Your progress is auto-saved in local storage. You can resume this workout whenever you return.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowExitConfirm(false)}
              >
                Keep Lifting
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => router.push('/')}
              >
                Pause & Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
