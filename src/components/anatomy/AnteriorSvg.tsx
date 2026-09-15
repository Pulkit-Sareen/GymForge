'use client';

import React from 'react';
import { AnatomicalMuscleId } from '@/types/workout';

interface AnteriorSvgProps {
  primaryMuscles?: AnatomicalMuscleId[];
  secondaryMuscles?: AnatomicalMuscleId[];
  className?: string;
}

export const AnteriorSvg: React.FC<AnteriorSvgProps> = ({
  primaryMuscles = [],
  secondaryMuscles = [],
  className = 'w-48 h-72',
}) => {
  const getFill = (muscleId: AnatomicalMuscleId) => {
    if (primaryMuscles.includes(muscleId)) {
      return '#06b6d4'; // cyan-500 glow
    }
    if (secondaryMuscles.includes(muscleId)) {
      return '#f59e0b'; // amber-500
    }
    return '#27272a'; // zinc-800 neutral
  };

  const getFilter = (muscleId: AnatomicalMuscleId) => {
    if (primaryMuscles.includes(muscleId)) {
      return 'url(#cyan-glow)';
    }
    if (secondaryMuscles.includes(muscleId)) {
      return 'url(#amber-glow)';
    }
    return 'none';
  };

  const getOpacity = (muscleId: AnatomicalMuscleId) => {
    if (primaryMuscles.includes(muscleId) || secondaryMuscles.includes(muscleId)) {
      return 1;
    }
    return 0.55;
  };

  return (
    <svg
      viewBox="0 0 200 380"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.9" />
        </filter>
        <filter id="amber-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#f59e0b" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Head & Neck Base */}
      <circle cx="100" cy="24" r="16" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" />
      <path d="M92 40 L92 56 L108 56 L108 40 Z" fill="#18181b" />

      {/* Trapezius (Upper / Front view) */}
      <path
        d="M86 46 C92 48 94 56 86 60 C80 58 78 50 86 46 Z"
        fill={getFill('trapezius_upper')}
        filter={getFilter('trapezius_upper')}
        opacity={getOpacity('trapezius_upper')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M114 46 C108 48 106 56 114 60 C120 58 122 50 114 46 Z"
        fill={getFill('trapezius_upper')}
        filter={getFilter('trapezius_upper')}
        opacity={getOpacity('trapezius_upper')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Front Deltoids */}
      <path
        d="M62 62 C58 70 58 84 66 90 C70 82 72 70 72 62 Z"
        fill={getFill('deltoid_anterior')}
        filter={getFilter('deltoid_anterior')}
        opacity={getOpacity('deltoid_anterior')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M138 62 C142 70 142 84 134 90 C130 82 128 70 128 62 Z"
        fill={getFill('deltoid_anterior')}
        filter={getFilter('deltoid_anterior')}
        opacity={getOpacity('deltoid_anterior')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Lateral Deltoids */}
      <path
        d="M58 66 C52 74 54 84 60 90 C62 82 62 72 62 66 Z"
        fill={getFill('deltoid_lateral')}
        filter={getFilter('deltoid_lateral')}
        opacity={getOpacity('deltoid_lateral')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M142 66 C148 74 146 84 140 90 C138 82 138 72 138 66 Z"
        fill={getFill('deltoid_lateral')}
        filter={getFilter('deltoid_lateral')}
        opacity={getOpacity('deltoid_lateral')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Upper Chest */}
      <path
        d="M74 62 C84 62 96 66 98 74 C86 76 76 72 74 62 Z"
        fill={getFill('chest_upper')}
        filter={getFilter('chest_upper')}
        opacity={getOpacity('chest_upper')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M126 62 C116 62 104 66 102 74 C114 76 124 72 126 62 Z"
        fill={getFill('chest_upper')}
        filter={getFilter('chest_upper')}
        opacity={getOpacity('chest_upper')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Mid & Lower Chest */}
      <path
        d="M74 74 C86 76 98 76 98 94 C82 96 72 88 74 74 Z"
        fill={getFill('chest_mid')}
        filter={getFilter('chest_mid')}
        opacity={getOpacity('chest_mid')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M126 74 C114 76 102 76 102 94 C118 96 128 88 126 74 Z"
        fill={getFill('chest_mid')}
        filter={getFilter('chest_mid')}
        opacity={getOpacity('chest_mid')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Biceps */}
      <path
        d="M58 92 C54 102 54 116 60 124 C66 120 68 106 66 94 Z"
        fill={getFill('biceps')}
        filter={getFilter('biceps')}
        opacity={getOpacity('biceps')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M142 92 C146 102 146 116 140 124 C134 120 132 106 134 94 Z"
        fill={getFill('biceps')}
        filter={getFilter('biceps')}
        opacity={getOpacity('biceps')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Forearms */}
      <path
        d="M56 126 C50 140 46 156 50 168 C56 168 62 152 64 130 Z"
        fill={getFill('forearms')}
        filter={getFilter('forearms')}
        opacity={getOpacity('forearms')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M144 126 C150 140 154 156 150 168 C144 168 138 152 136 130 Z"
        fill={getFill('forearms')}
        filter={getFilter('forearms')}
        opacity={getOpacity('forearms')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Hands */}
      <circle cx="48" cy="178" r="7" fill="#18181b" stroke="#27272a" strokeWidth="1" />
      <circle cx="152" cy="178" r="7" fill="#18181b" stroke="#27272a" strokeWidth="1" />

      {/* Rectus Abdominis */}
      <g>
        {/* Upper abs */}
        <rect x="88" y="98" width="10" height="12" rx="2" fill={getFill('rectus_abdominis')} filter={getFilter('rectus_abdominis')} opacity={getOpacity('rectus_abdominis')} stroke="#18181b" />
        <rect x="102" y="98" width="10" height="12" rx="2" fill={getFill('rectus_abdominis')} filter={getFilter('rectus_abdominis')} opacity={getOpacity('rectus_abdominis')} stroke="#18181b" />
        {/* Mid abs */}
        <rect x="88" y="112" width="10" height="12" rx="2" fill={getFill('rectus_abdominis')} filter={getFilter('rectus_abdominis')} opacity={getOpacity('rectus_abdominis')} stroke="#18181b" />
        <rect x="102" y="112" width="10" height="12" rx="2" fill={getFill('rectus_abdominis')} filter={getFilter('rectus_abdominis')} opacity={getOpacity('rectus_abdominis')} stroke="#18181b" />
        {/* Lower abs */}
        <rect x="89" y="126" width="9" height="14" rx="2" fill={getFill('rectus_abdominis')} filter={getFilter('rectus_abdominis')} opacity={getOpacity('rectus_abdominis')} stroke="#18181b" />
        <rect x="102" y="126" width="9" height="14" rx="2" fill={getFill('rectus_abdominis')} filter={getFilter('rectus_abdominis')} opacity={getOpacity('rectus_abdominis')} stroke="#18181b" />
      </g>

      {/* Obliques */}
      <path
        d="M76 100 C72 114 74 132 82 142 C86 136 86 112 86 100 Z"
        fill={getFill('obliques')}
        filter={getFilter('obliques')}
        opacity={getOpacity('obliques')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M124 100 C128 114 126 132 118 142 C114 136 114 112 114 100 Z"
        fill={getFill('obliques')}
        filter={getFilter('obliques')}
        opacity={getOpacity('obliques')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Pelvis / Hip Center */}
      <path d="M84 144 L100 156 L116 144 L110 160 L90 160 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" />

      {/* Quadriceps */}
      <path
        d="M74 162 C70 186 68 220 74 246 C86 248 94 238 96 210 C96 182 92 164 84 162 Z"
        fill={getFill('quadriceps')}
        filter={getFilter('quadriceps')}
        opacity={getOpacity('quadriceps')}
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <path
        d="M126 162 C130 186 132 220 126 246 C114 248 106 238 104 210 C104 182 108 164 116 162 Z"
        fill={getFill('quadriceps')}
        filter={getFilter('quadriceps')}
        opacity={getOpacity('quadriceps')}
        stroke="#18181b"
        strokeWidth="1.2"
      />

      {/* Knees */}
      <circle cx="82" cy="254" r="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />
      <circle cx="118" cy="254" r="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />

      {/* Calves (Anterior/Tibialis/Gastrocnemius) */}
      <path
        d="M74 262 C70 280 72 312 76 336 C84 336 88 322 88 296 C88 274 86 262 82 262 Z"
        fill={getFill('calves_gastrocnemius')}
        filter={getFilter('calves_gastrocnemius')}
        opacity={getOpacity('calves_gastrocnemius')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M126 262 C130 280 128 312 124 336 C116 336 112 322 112 296 C112 274 114 262 118 262 Z"
        fill={getFill('calves_gastrocnemius')}
        filter={getFilter('calves_gastrocnemius')}
        opacity={getOpacity('calves_gastrocnemius')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Feet */}
      <path d="M72 340 L84 340 L86 354 L68 354 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" rx="2" />
      <path d="M128 340 L116 340 L114 354 L132 354 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" rx="2" />
    </svg>
  );
};
