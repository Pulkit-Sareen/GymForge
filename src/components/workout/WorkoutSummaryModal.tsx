'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CompletedWorkoutSummary } from '@/types/workout';
import { formatDuration } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Trophy,
  Clock,
  Dumbbell,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface WorkoutSummaryModalProps {
  summary: CompletedWorkoutSummary | null;
  onDismiss: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  summary,
  onDismiss,
}) => {
  useEffect(() => {
    if (summary) {
      // Fire celebration confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e'],
        });
      } catch (e) {
        // Fallback
      }
    }
  }, [summary]);

  if (!summary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700/80 rounded-3xl p-6 w-full max-w-md shadow-2xl text-center space-y-5">
        {/* Header Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <Badge variant="emerald" className="mb-2">
            WORKOUT LOGGED
          </Badge>
          <h2 className="text-2xl font-black tracking-tight text-zinc-50">
            Workout Complete! 🎉
          </h2>
          <p className="text-xs text-zinc-400 mt-1">{summary.name}</p>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Duration
            </span>
            <span className="text-xl font-black text-zinc-100 mt-1">
              {formatDuration(summary.durationSeconds)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
              Sets Logged
            </span>
            <span className="text-xl font-black text-zinc-100 mt-1">
              {summary.totalSetsCompleted} sets
            </span>
          </div>

          <div className="flex flex-col items-center pt-2 border-t border-zinc-900">
            <span className="text-[11px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Total Volume
            </span>
            <span className="text-xl font-black text-zinc-100 mt-1">
              {summary.totalVolumeKg.toLocaleString()} kg
            </span>
          </div>

          <div className="flex flex-col items-center pt-2 border-t border-zinc-900">
            <span className="text-[11px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Est. Calories
            </span>
            <span className="text-xl font-black text-zinc-100 mt-1">
              ~{summary.estimatedCalories} kcal
            </span>
          </div>
        </div>

        {/* PR Achievements */}
        {summary.personalRecordsAchieved.length > 0 && (
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-3 text-left">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-2">
              <Trophy className="w-3.5 h-3.5" />
              New Personal Records ({summary.personalRecordsAchieved.length})
            </span>
            <div className="space-y-1.5">
              {summary.personalRecordsAchieved.map((pr, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-zinc-200"
                >
                  <span className="font-semibold">{pr.exerciseName}</span>
                  <Badge variant="amber">
                    {pr.weightKg} kg × {pr.reps} reps
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Action */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onDismiss}
          className="flex items-center justify-center gap-2 font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          Return to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
