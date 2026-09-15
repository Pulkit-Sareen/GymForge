'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EXERCISE_LIBRARY } from '@/data/exercises';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { Badge } from '@/components/ui/Badge';
import { Search, Filter, Dumbbell } from 'lucide-react';

export default function ExerciseLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('ALL');

  const muscleFilters = [
    'ALL',
    'Chest',
    'Back',
    'Shoulders',
    'Arms',
    'Legs',
    'Core',
    'Cardio',
  ];

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    // Search matching
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.equipmentRequired.some((eq) => eq.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Muscle category filtering
    if (selectedMuscleFilter === 'ALL') return true;
    if (selectedMuscleFilter === 'Cardio') return ex.category === 'CARDIO';

    const filterLower = selectedMuscleFilter.toLowerCase();
    if (filterLower === 'chest') {
      return ex.primaryMuscles.some((m) => m.startsWith('chest'));
    }
    if (filterLower === 'back') {
      return ex.primaryMuscles.some((m) =>
        ['latissimus_dorsi', 'rhomboids', 'erector_spinae', 'trapezius_upper'].includes(m)
      );
    }
    if (filterLower === 'shoulders') {
      return ex.primaryMuscles.some((m) => m.startsWith('deltoid'));
    }
    if (filterLower === 'arms') {
      return ex.primaryMuscles.some((m) =>
        ['biceps', 'triceps_long', 'triceps_lateral', 'forearms'].includes(m)
      );
    }
    if (filterLower === 'legs') {
      return ex.primaryMuscles.some((m) =>
        ['quadriceps', 'hamstrings', 'gluteus_maximus', 'calves_gastrocnemius'].includes(m)
      );
    }
    if (filterLower === 'core') {
      return ex.primaryMuscles.some((m) =>
        ['rectus_abdominis', 'obliques'].includes(m)
      );
    }

    return true;
  });

  return (
    <div className="max-w-lg mx-auto p-4 pb-safe space-y-4">
      {/* Top Header */}
      <div className="pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
          ANATOMICAL DATABASE
        </span>
        <h1 className="text-2xl font-black tracking-tight text-zinc-100">
          Exercise Library
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Explore movement patterns, anatomical targets, and cues.
        </p>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by exercise, muscle, or equipment..."
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-400 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-500"
        />
      </div>

      {/* Muscle Filter Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {muscleFilters.map((filter) => {
          const isSelected = selectedMuscleFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setSelectedMuscleFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-cyan-500 text-zinc-950 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>Showing {filteredExercises.length} movements</span>
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
