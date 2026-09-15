'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { ExerciseDefinition, EquipmentType } from '@/types/workout';
import { findExerciseSubstitutions } from '@/core/substitution/exercise-substitution';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface SwapExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetExercise: ExerciseDefinition | null;
  availableEquipment: EquipmentType[];
  currentWorkoutExerciseIds: string[];
  onSelectReplacement: (replacement: ExerciseDefinition) => void;
}

export const SwapExerciseModal: React.FC<SwapExerciseModalProps> = ({
  isOpen,
  onClose,
  targetExercise,
  availableEquipment,
  currentWorkoutExerciseIds,
  onSelectReplacement,
}) => {
  if (!targetExercise) return null;

  const substitutions = findExerciseSubstitutions(
    targetExercise,
    availableEquipment,
    currentWorkoutExerciseIds,
    EXERCISE_LIBRARY,
    3
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Change "${targetExercise.name}"`}
    >
      <div className="space-y-4">
        <p className="text-xs text-zinc-400">
          Smart recommendations based on biomechanical overlap, equipment, and fatigue balance:
        </p>

        {substitutions.length === 0 ? (
          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 text-center text-xs text-zinc-400">
            No direct alternatives found matching your available equipment settings.
          </div>
        ) : (
          <div className="space-y-3">
            {substitutions.map((sub, idx) => {
              const ex = sub.exercise;
              return (
                <div
                  key={ex.id}
                  className="bg-zinc-950/80 border border-zinc-800 hover:border-cyan-500/80 rounded-2xl p-3.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-100">{ex.name}</h4>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge variant="cyan">{ex.movementPattern.replace('_', ' ')}</Badge>
                        <Badge variant="zinc">{ex.equipmentRequired.join(' + ')}</Badge>
                      </div>

                      <div className="mt-2 space-y-1">
                        {sub.matchReasons.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        onSelectReplacement(ex);
                        onClose();
                      }}
                      className="shrink-0 flex items-center gap-1 text-xs"
                    >
                      Swap
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button variant="ghost" fullWidth onClick={onClose} size="sm" className="mt-2">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
