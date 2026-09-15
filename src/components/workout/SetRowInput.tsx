'use client';

import React from 'react';
import { ActiveSetLog } from '@/types/workout';
import { Check } from 'lucide-react';

interface SetRowInputProps {
  setLog: ActiveSetLog;
  previousPerformanceText?: string;
  suggestedWeight?: number;
  onUpdate: (updated: Partial<ActiveSetLog>) => void;
  onToggleComplete: () => void;
}

export const SetRowInput: React.FC<SetRowInputProps> = ({
  setLog,
  previousPerformanceText,
  suggestedWeight,
  onUpdate,
  onToggleComplete,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 p-3 rounded-2xl border transition-all ${
        setLog.isCompleted
          ? 'bg-emerald-950/20 border-emerald-800/60'
          : 'bg-zinc-950/80 border-zinc-800/80'
      }`}
    >
      {/* Set Number */}
      <div className="flex flex-col items-center justify-center w-8 shrink-0">
        <span className="text-xs font-bold text-zinc-400">SET</span>
        <span className="text-sm font-black text-zinc-100">{setLog.setNumber}</span>
      </div>

      {/* Previous Performance Hint */}
      <div className="hidden sm:flex flex-col w-20 shrink-0 text-center">
        <span className="text-[10px] text-zinc-500 uppercase font-semibold">PREV</span>
        <span className="text-xs font-medium text-zinc-400 truncate">
          {previousPerformanceText || '—'}
        </span>
      </div>

      {/* Weight Input */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase font-semibold text-center mb-0.5">
          KG
        </span>
        <input
          type="number"
          step="0.5"
          min="0"
          value={setLog.weightKg === 0 ? '' : setLog.weightKg}
          placeholder={suggestedWeight ? `${suggestedWeight}` : '0'}
          onChange={(e) =>
            onUpdate({ weightKg: parseFloat(e.target.value) || 0 })
          }
          className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-cyan-400 rounded-xl py-2 px-1 text-center font-bold text-zinc-100 text-sm focus:outline-none transition-colors"
        />
      </div>

      {/* Reps Input */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase font-semibold text-center mb-0.5">
          REPS
        </span>
        <input
          type="number"
          step="1"
          min="0"
          value={setLog.reps === 0 ? '' : setLog.reps}
          placeholder="10"
          onChange={(e) =>
            onUpdate({ reps: parseInt(e.target.value, 10) || 0 })
          }
          className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-cyan-400 rounded-xl py-2 px-1 text-center font-bold text-zinc-100 text-sm focus:outline-none transition-colors"
        />
      </div>

      {/* RIR Selection */}
      <div className="w-16 shrink-0 flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase font-semibold text-center mb-0.5" title="Reps in Reserve">
          RIR
        </span>
        <select
          value={setLog.rir !== undefined ? setLog.rir : 2}
          onChange={(e) => onUpdate({ rir: parseInt(e.target.value, 10) })}
          className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-cyan-400 rounded-xl py-2 px-1 text-center font-semibold text-zinc-200 text-xs focus:outline-none"
        >
          <option value={0}>0 (Max)</option>
          <option value={1}>1</option>
          <option value={2}>2 (Rec)</option>
          <option value={3}>3</option>
          <option value={4}>4+</option>
        </select>
      </div>

      {/* Complete Checkbox Button (Large touch target) */}
      <div className="shrink-0 flex flex-col items-center">
        <span className="text-[10px] text-zinc-500 uppercase font-semibold mb-0.5">
          DONE
        </span>
        <button
          type="button"
          onClick={onToggleComplete}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
            setLog.isCompleted
              ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500'
          }`}
        >
          <Check className={`w-5 h-5 ${setLog.isCompleted ? 'stroke-[3]' : 'stroke-2'}`} />
        </button>
      </div>
    </div>
  );
};
