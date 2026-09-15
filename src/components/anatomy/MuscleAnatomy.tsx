'use client';

import React, { useState } from 'react';
import { AnteriorSvg } from './AnteriorSvg';
import { PosteriorSvg } from './PosteriorSvg';
import { AnatomicalMuscleId } from '@/types/workout';
import { MUSCLE_METADATA_MAP } from '@/data/muscles';

interface MuscleAnatomyProps {
  primaryMuscles: AnatomicalMuscleId[];
  secondaryMuscles?: AnatomicalMuscleId[];
  showLegend?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MuscleAnatomy: React.FC<MuscleAnatomyProps> = ({
  primaryMuscles = [],
  secondaryMuscles = [],
  showLegend = true,
  size = 'md',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'front' | 'back'>('both');

  // Determine size classes
  const svgSizeClass =
    size === 'sm'
      ? 'w-24 h-40'
      : size === 'lg'
      ? 'w-48 h-80'
      : 'w-36 h-60';

  const primaryNames = primaryMuscles.map(
    (id) => MUSCLE_METADATA_MAP[id]?.name || id
  );
  const secondaryNames = secondaryMuscles.map(
    (id) => MUSCLE_METADATA_MAP[id]?.name || id
  );

  return (
    <div className={`flex flex-col items-center bg-zinc-950/60 rounded-2xl p-4 border border-zinc-800/80 ${className}`}>
      {/* Mobile Tab Switcher */}
      <div className="flex sm:hidden items-center justify-center p-1 bg-zinc-900 rounded-xl mb-3 border border-zinc-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('both')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            activeTab === 'both' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-400'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('front')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            activeTab === 'front' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-400'
          }`}
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('back')}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            activeTab === 'back' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-400'
          }`}
        >
          Back
        </button>
      </div>

      {/* Anatomy Visuals */}
      <div className="flex items-center justify-center gap-4 w-full">
        {(activeTab === 'both' || activeTab === 'front') && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
              Front
            </span>
            <AnteriorSvg
              primaryMuscles={primaryMuscles}
              secondaryMuscles={secondaryMuscles}
              className={svgSizeClass}
            />
          </div>
        )}

        {(activeTab === 'both' || activeTab === 'back') && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
              Back
            </span>
            <PosteriorSvg
              primaryMuscles={primaryMuscles}
              secondaryMuscles={secondaryMuscles}
              className={svgSizeClass}
            />
          </div>
        )}
      </div>

      {/* Legend & Target Muscle Tags */}
      {showLegend && (
        <div className="mt-4 w-full pt-3 border-t border-zinc-900 space-y-2 text-xs">
          {primaryNames.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-400 shrink-0 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                Primary:
              </span>
              <span className="text-zinc-300 leading-relaxed">
                {primaryNames.join(', ')}
              </span>
            </div>
          )}

          {secondaryNames.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-amber-400 shrink-0 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                Secondary:
              </span>
              <span className="text-zinc-400 leading-relaxed">
                {secondaryNames.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
