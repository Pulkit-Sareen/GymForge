'use client';

import React, { useState } from 'react';
import { PlannedWorkoutDay, AnatomicalMuscleId } from '@/types/workout';
import {
  PRESET_WORKOUT_SPLITS,
  INDIVIDUAL_MUSCLE_SETS,
  getMusclesAndPatternsForSelection,
} from '@/core/generator/split-rules';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Sparkles, Layers, Link as LinkIcon, Coffee, Flame, Check } from 'lucide-react';

interface CustomizeDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: PlannedWorkoutDay;
  onApply: (
    title: string,
    muscles: AnatomicalMuscleId[],
    patterns: string[],
    isRest?: boolean,
    isCardio?: boolean
  ) => void;
}

export const CustomizeDayModal: React.FC<CustomizeDayModalProps> = ({
  isOpen,
  onClose,
  day,
  onApply,
}) => {
  const [tab, setTab] = useState<'presets' | 'customPair' | 'recovery'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<string>('CHEST_TRICEPS');
  const [pairMuscleA, setPairMuscleA] = useState<string>('chest');
  const [pairMuscleB, setPairMuscleB] = useState<string>('arms');

  const muscleKeys = Object.keys(INDIVIDUAL_MUSCLE_SETS);

  const handleApplyPreset = () => {
    const result = getMusclesAndPatternsForSelection(selectedPreset);
    onApply(result.title, result.muscles, result.patterns, false, false);
    onClose();
  };

  const handleApplyCustomPair = () => {
    const result = getMusclesAndPatternsForSelection(pairMuscleA, pairMuscleB);
    onApply(result.title, result.muscles, result.patterns, false, false);
    onClose();
  };

  const handleApplyRest = () => {
    onApply('Rest & Recovery', [], [], true, false);
    onClose();
  };

  const handleApplyCardio = () => {
    onApply('Cardio & Core Conditioning', ['rectus_abdominis', 'obliques'], ['CARDIO', 'CORE'], false, true);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Customize ${day.dayName} Focus`}>
      <div className="space-y-4 text-zinc-200">
        <p className="text-xs text-zinc-400">
          Change the training focus of {day.dayName}. Exercises will automatically be configured to match your selected muscle groups.
        </p>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setTab('presets')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'presets'
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Splits & Muscles
          </button>
          <button
            type="button"
            onClick={() => setTab('customPair')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'customPair'
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Combine 2
          </button>
          <button
            type="button"
            onClick={() => setTab('recovery')}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'recovery'
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Cardio / Rest
          </button>
        </div>

        {/* TAB 1: Preset Splits & Single Muscles */}
        {tab === 'presets' && (
          <div className="space-y-3">
            <div className="max-h-72 overflow-y-auto pr-1 space-y-1.5 no-scrollbar">
              {PRESET_WORKOUT_SPLITS.map((split) => {
                const isSelected = selectedPreset === split.key;
                return (
                  <button
                    key={split.key}
                    type="button"
                    onClick={() => setSelectedPreset(split.key)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-zinc-100 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                        : 'bg-zinc-950 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-100">{split.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {split.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleApplyPreset}>
                Apply to {day.dayName}
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: Combine Any Two Muscles */}
        {tab === 'customPair' && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Pick any two target muscle groups to create a personalized antagonistic or synergistic combination day.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  First Muscle Group
                </label>
                <select
                  value={pairMuscleA}
                  onChange={(e) => setPairMuscleA(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-cyan-500"
                >
                  {muscleKeys.map((k) => (
                    <option key={k} value={k}>
                      {INDIVIDUAL_MUSCLE_SETS[k].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  Second Muscle Group
                </label>
                <select
                  value={pairMuscleB}
                  onChange={(e) => setPairMuscleB(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-cyan-500"
                >
                  {muscleKeys.map((k) => (
                    <option key={k} value={k}>
                      {INDIVIDUAL_MUSCLE_SETS[k].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 bg-zinc-950/80 border border-cyan-500/30 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Generated Day Focus
                </span>
                <span className="text-sm font-extrabold text-cyan-400">
                  {INDIVIDUAL_MUSCLE_SETS[pairMuscleA]?.name} + {INDIVIDUAL_MUSCLE_SETS[pairMuscleB]?.name}
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleApplyCustomPair}>
                Apply Combination
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: Cardio or Rest */}
        {tab === 'recovery' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={handleApplyCardio}
                className="p-4 bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 rounded-2xl text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300">
                      Set as Cardio & Core Day
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Swap this lifting session for cardio conditioning, intervals, and core work.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleApplyRest}
                className="p-4 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300">
                      Set as Rest & Recovery Day
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Take this day off to allow full muscular and nervous system recuperation.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <Button size="sm" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
