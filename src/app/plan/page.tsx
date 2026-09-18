'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  WeeklyWorkoutPlan,
  PlannedWorkoutDay,
  ExerciseDefinition,
  AnatomicalMuscleId,
} from '@/types/workout';
import { getCurrentPlan, saveCurrentPlan } from '@/lib/indexeddb';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import {
  swapDaysInPlan,
  removeExerciseFromPlan,
  addExerciseToPlan,
  swapExerciseInPlan,
  updateDayMuscleFocusAndExercises,
} from '@/core/regeneration/plan-modifier';
import { SwapExerciseModal } from '@/components/workout/SwapExerciseModal';
import { CustomizeDayModal } from '@/components/workout/CustomizeDayModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  ArrowUpDown,
  Plus,
  Trash2,
  RefreshCw,
  Play,
  RotateCcw,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function PlanManagementPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [swapDaysModalOpen, setSwapDaysModalOpen] = useState(false);
  const [swapDayTargetA, setSwapDayTargetA] = useState('');
  const [swapDayTargetB, setSwapDayTargetB] = useState('');
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [customizeDayModalOpen, setCustomizeDayModalOpen] = useState(false);
  const [swapExerciseTarget, setSwapExerciseTarget] = useState<ExerciseDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getCurrentPlan();
      if (!p) {
        router.push('/onboarding');
        return;
      }
      setPlan(p);
      const todayDow = new Date().getDay();
      const current = p.days.find((d) => d.dayOfWeek === todayDow) || p.days[0];
      setSelectedDayId(current.id);
      setIsLoading(false);
    }
    load();
  }, [router]);

  if (isLoading || !plan) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedDay = plan.days.find((d) => d.id === selectedDayId) || plan.days[0];

  // Day Swap Handler
  const handleExecuteDaySwap = async () => {
    if (!swapDayTargetA || !swapDayTargetB || swapDayTargetA === swapDayTargetB) return;
    const updated = swapDaysInPlan(plan, swapDayTargetA, swapDayTargetB);
    setPlan(updated);
    await saveCurrentPlan(updated);
    setSwapDaysModalOpen(false);
  };

  // Remove Exercise Handler
  const handleRemoveExercise = async (exId: string) => {
    const updated = removeExerciseFromPlan(plan, selectedDay.id, exId);
    setPlan(updated);
    await saveCurrentPlan(updated);
  };

  // Add Exercise Handler
  const handleAddExercise = async (ex: ExerciseDefinition) => {
    const updated = addExerciseToPlan(plan, selectedDay.id, ex);
    setPlan(updated);
    await saveCurrentPlan(updated);
    setAddExerciseModalOpen(false);
  };

  // Swap Exercise Handler
  const handleSwapExerciseSuccess = async (replacement: ExerciseDefinition) => {
    if (!swapExerciseTarget) return;
    const updated = swapExerciseInPlan(plan, selectedDay.id, swapExerciseTarget.id, replacement);
    setPlan(updated);
    await saveCurrentPlan(updated);
    setSwapExerciseTarget(null);
  };

  // Customize Day Muscle Focus Handler
  const handleApplyCustomFocus = async (
    title: string,
    muscles: AnatomicalMuscleId[],
    patterns: string[],
    isRest?: boolean,
    isCardio?: boolean
  ) => {
    if (isRest) {
      const updatedDays = plan.days.map((d) =>
        d.id === selectedDay.id
          ? {
              ...d,
              title: 'Rest & Recovery',
              focusMuscles: [],
              exercises: [],
              isRestDay: true,
              isCardioDay: false,
            }
          : d
      );
      const updated = { ...plan, days: updatedDays, updatedAt: new Date().toISOString() };
      setPlan(updated);
      await saveCurrentPlan(updated);
      return;
    }

    const updated = updateDayMuscleFocusAndExercises(
      plan,
      selectedDay.id,
      title,
      muscles,
      patterns,
      ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'BODYWEIGHT'],
      EXERCISE_LIBRARY
    );
    setPlan(updated);
    await saveCurrentPlan(updated);
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-safe space-y-5">
      {/* Top Title & Actions */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            {plan.splitType.replace(/_/g, ' ')}
          </span>
          <h1 className="text-2xl font-black tracking-tight text-zinc-100">
            Weekly Routine
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSwapDayTargetA(plan.days[0].id);
              setSwapDayTargetB(plan.days[2]?.id || plan.days[1]?.id || plan.days[0].id);
              setSwapDaysModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-300 border-zinc-700"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            Swap Days
          </Button>
        </div>
      </div>

      {/* Day Selector Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {plan.days.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-cyan-500 text-zinc-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {day.dayName.slice(0, 3).toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan">{selectedDay.dayName.toUpperCase()}</Badge>
              <button
                type="button"
                onClick={() => setCustomizeDayModalOpen(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-lg transition-colors"
              >
                <Layers className="w-3 h-3" />
                Customize Muscle Focus
              </button>
            </div>
            <h2 className="text-xl font-extrabold text-zinc-100 mt-1.5">
              {selectedDay.title}
            </h2>
          </div>

          {!selectedDay.isRestDay && (
            <Link href={`/workout/active?dayId=${selectedDay.id}`}>
              <Button size="sm" variant="primary" className="flex items-center gap-1">
                <Play className="w-3.5 h-3.5 fill-current" />
                Start
              </Button>
            </Link>
          )}
        </div>

        {selectedDay.isRestDay ? (
          <div className="p-6 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 text-center space-y-3">
            <span className="text-sm font-bold text-zinc-300 block">
              Scheduled Rest Day
            </span>
            <p className="text-xs text-zinc-500">
              No lifting scheduled today. Dedicate time to mobility, nutrition, and rest.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCustomizeDayModalOpen(true)}
              className="text-xs border-zinc-700 text-cyan-400 hover:bg-zinc-800"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Assign Muscle Focus or Workout to this Day
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Exercises ({selectedDay.exercises.length})
              </span>

              <button
                onClick={() => setAddExerciseModalOpen(true)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Exercise
              </button>
            </div>

            <div className="space-y-2.5">
              {selectedDay.exercises.map((pe, idx) => {
                const ex = EXERCISE_LIBRARY.find((e) => e.id === pe.exerciseId);
                if (!ex) return null;

                return (
                  <div
                    key={pe.id}
                    className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-400 flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-zinc-100 truncate">
                          {ex.name}
                        </h4>
                        <span className="text-xs text-cyan-400 font-semibold">
                          {pe.targetSets} sets × {pe.targetRepMin}–{pe.targetRepMax} reps
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setSwapExerciseTarget(ex)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900"
                        title="Swap Exercise"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveExercise(pe.exerciseId)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900"
                        title="Remove from day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Re-generate / Re-run Onboarding Link */}
      <div className="pt-2 text-center">
        <Link href="/onboarding" className="inline-block">
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-300 text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Re-run Questionnaire to Regenerate Plan
          </Button>
        </Link>
      </div>

      {/* Swap Days Modal */}
      <Modal
        isOpen={swapDaysModalOpen}
        onClose={() => setSwapDaysModalOpen(false)}
        title="Swap Workout Days"
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Exchange the routines of two days while keeping your calendar structure intact:
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">
                Day 1:
              </label>
              <select
                value={swapDayTargetA}
                onChange={(e) => setSwapDayTargetA(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 font-semibold focus:outline-none focus:border-cyan-400"
              >
                {plan.days.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.dayName} — {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">
                Day 2:
              </label>
              <select
                value={swapDayTargetB}
                onChange={(e) => setSwapDayTargetB(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 font-semibold focus:outline-none focus:border-cyan-400"
              >
                {plan.days.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.dayName} — {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => setSwapDaysModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleExecuteDaySwap}
            >
              Apply Swap
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal
        isOpen={addExerciseModalOpen}
        onClose={() => setAddExerciseModalOpen(false)}
        title={`Add Exercise to ${selectedDay.dayName}`}
      >
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {EXERCISE_LIBRARY.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleAddExercise(ex)}
              className="w-full p-3 bg-zinc-950/80 border border-zinc-800/80 hover:border-cyan-500 rounded-xl text-left flex items-center justify-between transition-colors"
            >
              <div>
                <h4 className="text-sm font-bold text-zinc-100">{ex.name}</h4>
                <span className="text-[11px] text-zinc-400">
                  {ex.movementPattern.replace('_', ' ')} · {ex.equipmentRequired.join(', ')}
                </span>
              </div>
              <Plus className="w-4 h-4 text-cyan-400" />
            </button>
          ))}
        </div>
      </Modal>

      {/* Swap Exercise Modal */}
      <SwapExerciseModal
        isOpen={Boolean(swapExerciseTarget)}
        onClose={() => setSwapExerciseTarget(null)}
        targetExercise={swapExerciseTarget}
        availableEquipment={['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'BODYWEIGHT']}
        currentWorkoutExerciseIds={selectedDay.exercises.map((e) => e.exerciseId)}
        onSelectReplacement={handleSwapExerciseSuccess}
      />

      {/* Customize Day Focus Modal */}
      <CustomizeDayModal
        isOpen={customizeDayModalOpen}
        onClose={() => setCustomizeDayModalOpen(false)}
        day={selectedDay}
        onApply={handleApplyCustomFocus}
      />
    </div>
  );
}
