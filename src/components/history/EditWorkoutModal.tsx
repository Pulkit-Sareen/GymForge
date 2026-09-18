'use client';

import React, { useState } from 'react';
import { StoredSession, updateCompletedSession, deleteCompletedSession } from '@/lib/indexeddb';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Dumbbell, Save, AlertTriangle, Clock, Flame } from 'lucide-react';

interface EditWorkoutModalProps {
  session: StoredSession | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedSession: StoredSession) => void;
  onDeleted: (sessionId: string) => void;
}

export const EditWorkoutModal: React.FC<EditWorkoutModalProps> = ({
  session,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  if (!session) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Completed Workout">
      <EditWorkoutForm
        session={session}
        onClose={onClose}
        onUpdated={onUpdated}
        onDeleted={onDeleted}
      />
    </Modal>
  );
};

interface EditWorkoutFormProps {
  session: StoredSession;
  onClose: () => void;
  onUpdated: (updatedSession: StoredSession) => void;
  onDeleted: (sessionId: string) => void;
}

const EditWorkoutForm: React.FC<EditWorkoutFormProps> = ({
  session,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  const [name, setName] = useState(session.name);
  const [durationMinutes, setDurationMinutes] = useState(
    Math.round((session.durationSeconds || 0) / 60)
  );
  const [calories, setCalories] = useState(session.estimatedCalories || 0);
  const [notes, setNotes] = useState(session.notes || '');
  const [exercises, setExercises] = useState(
    session.exercises ? JSON.parse(JSON.stringify(session.exercises)) : []
  );
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    EXERCISE_LIBRARY[0]?.id || ''
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set updates
  const handleUpdateSet = (
    exIdx: number,
    setIdx: number,
    field: 'weightKg' | 'reps',
    val: number
  ) => {
    setExercises((prev: any[]) => {
      const copy = [...prev];
      const ex = { ...copy[exIdx] };
      const sets = [...ex.sets];
      sets[setIdx] = { ...sets[setIdx], [field]: Math.max(0, val) };
      ex.sets = sets;
      copy[exIdx] = ex;
      return copy;
    });
  };

  const handleAddSet = (exIdx: number) => {
    setExercises((prev: any[]) => {
      const copy = [...prev];
      const ex = { ...copy[exIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      ex.sets = [
        ...ex.sets,
        {
          weightKg: lastSet ? lastSet.weightKg : 20,
          reps: lastSet ? lastSet.reps : 10,
        },
      ];
      copy[exIdx] = ex;
      return copy;
    });
  };

  const handleRemoveSet = (exIdx: number, setIdx: number) => {
    setExercises((prev: any[]) => {
      const copy = [...prev];
      const ex = { ...copy[exIdx] };
      ex.sets = ex.sets.filter((_: any, idx: number) => idx !== setIdx);
      copy[exIdx] = ex;
      return copy;
    });
  };

  const handleRemoveExercise = (exIdx: number) => {
    setExercises((prev: any[]) =>
      prev.filter((_: any, idx: number) => idx !== exIdx)
    );
  };

  const handleAddNewExercise = () => {
    const found = EXERCISE_LIBRARY.find((e) => e.id === selectedExerciseId);
    if (!found) return;

    setExercises((prev: any[]) => [
      ...prev,
      {
        exerciseId: found.id,
        exerciseName: found.name,
        sets: [
          { weightKg: 20, reps: 10 },
          { weightKg: 20, reps: 10 },
          { weightKg: 20, reps: 10 },
        ],
      },
    ]);
    setShowAddExercise(false);
  };

  // Compute live totals
  const totalVolume = exercises.reduce((acc: number, ex: any) => {
    return (
      acc +
      ex.sets.reduce((sAcc: number, s: any) => sAcc + (Number(s.weightKg) || 0) * (Number(s.reps) || 0), 0)
    );
  }, 0);

  const totalSets = exercises.reduce((acc: number, ex: any) => acc + ex.sets.length, 0);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const updated = await updateCompletedSession(session.id, {
        name,
        durationSeconds: Math.max(60, durationMinutes * 60),
        estimatedCalories: Math.max(0, calories),
        notes,
        exercises,
        totalVolumeKg: totalVolume,
        totalSetsCompleted: totalSets,
      });
      if (updated) {
        onUpdated(updated);
        onClose();
      }
    } catch (err) {
      console.error('Failed to update workout:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCompletedSession(session.id);
      onDeleted(session.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete workout:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 text-zinc-200">
      {/* Basic Details */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1">
            Workout Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Duration (mins)
            </label>
            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Calories (kcal)
            </label>
            <input
              type="number"
              min="0"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Recalculated Live Stats */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-500">Recalculated Sets</span>
          <span className="text-base font-black text-cyan-400 block">{totalSets}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-500">Recalculated Volume</span>
          <span className="text-base font-black text-emerald-400 block">{totalVolume.toLocaleString()} kg</span>
        </div>
      </div>

      {/* Exercises & Sets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
            Logged Exercises ({exercises.length})
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddExercise(!showAddExercise)}
            className="text-xs py-1 h-7 border-zinc-700 text-cyan-400 hover:bg-zinc-800"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Exercise
          </Button>
        </div>

        {/* Add Exercise Selector Dropdown */}
        {showAddExercise && (
          <div className="p-3 bg-zinc-950 border border-cyan-500/40 rounded-xl space-y-2">
            <span className="text-xs text-zinc-400 font-semibold block">Select Exercise to Add</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                {EXERCISE_LIBRARY.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.primaryMuscles.join(', ')})
                  </option>
                ))}
              </select>
              <Button size="sm" variant="primary" onClick={handleAddNewExercise} className="text-xs h-8">
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-3">
          {exercises.map((ex: any, exIdx: number) => (
            <div
              key={exIdx}
              className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-3 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                  {ex.exerciseName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(exIdx)}
                  className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                  title="Remove exercise"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Set Rows */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-zinc-500 px-1">
                  <span className="col-span-2">Set</span>
                  <span className="col-span-5">Weight (kg)</span>
                  <span className="col-span-4">Reps</span>
                  <span className="col-span-1"></span>
                </div>

                {ex.sets.map((s: any, setIdx: number) => (
                  <div
                    key={setIdx}
                    className="grid grid-cols-12 items-center gap-2 bg-zinc-900/60 rounded-lg p-1.5 border border-zinc-800/50"
                  >
                    <span className="col-span-2 text-xs font-mono font-bold text-zinc-400 pl-1">
                      #{setIdx + 1}
                    </span>
                    <div className="col-span-5">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={s.weightKg}
                        onChange={(e) =>
                          handleUpdateSet(exIdx, setIdx, 'weightKg', parseFloat(e.target.value) || 0)
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 font-mono text-center focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="1"
                        value={s.reps}
                        onChange={(e) =>
                          handleUpdateSet(exIdx, setIdx, 'reps', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 font-mono text-center focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveSet(exIdx, setIdx)}
                        className="text-zinc-600 hover:text-rose-400 p-0.5 rounded transition-colors"
                        title="Remove set"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Set Button */}
              <button
                type="button"
                onClick={() => handleAddSet(exIdx)}
                className="w-full py-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-900/40 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Set
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Delete Workout Section */}
        <div className="pt-3 border-t border-zinc-800/60">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1.5 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete this workout log
            </button>
          ) : (
            <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Are you sure? This cannot be undone.</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="text-xs h-7 py-0"
                >
                  Yes, Delete Workout
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs h-7 py-0 text-zinc-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
