'use client';

import React from 'react';
import { AnatomicalMuscleId } from '@/types/workout';

interface PosteriorSvgProps {
  primaryMuscles?: AnatomicalMuscleId[];
  secondaryMuscles?: AnatomicalMuscleId[];
  className?: string;
}

export const PosteriorSvg: React.FC<PosteriorSvgProps> = ({
  primaryMuscles = [],
  secondaryMuscles = [],
  className = 'w-48 h-72',
}) => {
  const getFill = (muscleId: AnatomicalMuscleId) => {
    if (primaryMuscles.includes(muscleId)) {
      return '#06b6d4'; // cyan-500
    }
    if (secondaryMuscles.includes(muscleId)) {
      return '#f59e0b'; // amber-500
    }
    return '#27272a'; // zinc-800
  };

  const getFilter = (muscleId: AnatomicalMuscleId) => {
    if (primaryMuscles.includes(muscleId)) {
      return 'url(#cyan-glow-post)';
    }
    if (secondaryMuscles.includes(muscleId)) {
      return 'url(#amber-glow-post)';
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
        <filter id="cyan-glow-post" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.9" />
        </filter>
        <filter id="amber-glow-post" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#f59e0b" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Head & Neck Base */}
      <circle cx="100" cy="24" r="16" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" />
      <path d="M92 40 L92 54 L108 54 L108 40 Z" fill="#18181b" />

      {/* Trapezius Upper & Mid */}
      <path
        d="M100 48 L122 62 L100 102 L78 62 Z"
        fill={getFill('trapezius_upper')}
        filter={getFilter('trapezius_upper')}
        opacity={getOpacity('trapezius_upper')}
        stroke="#18181b"
        strokeWidth="1.2"
      />

      {/* Rear Deltoids */}
      <path
        d="M62 62 C58 72 58 84 66 90 C72 82 74 72 74 64 Z"
        fill={getFill('deltoid_posterior')}
        filter={getFilter('deltoid_posterior')}
        opacity={getOpacity('deltoid_posterior')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M138 62 C142 72 142 84 134 90 C128 82 126 72 126 64 Z"
        fill={getFill('deltoid_posterior')}
        filter={getFilter('deltoid_posterior')}
        opacity={getOpacity('deltoid_posterior')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Lateral Deltoids (Posterior Angle) */}
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

      {/* Triceps Long Head */}
      <path
        d="M66 94 C64 104 64 116 68 124 C72 118 72 104 70 94 Z"
        fill={getFill('triceps_long')}
        filter={getFilter('triceps_long')}
        opacity={getOpacity('triceps_long')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M134 94 C136 104 136 116 132 124 C128 118 128 104 130 94 Z"
        fill={getFill('triceps_long')}
        filter={getFilter('triceps_long')}
        opacity={getOpacity('triceps_long')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Triceps Lateral Head */}
      <path
        d="M58 92 C54 104 54 116 62 124 C64 114 64 102 64 92 Z"
        fill={getFill('triceps_lateral')}
        filter={getFilter('triceps_lateral')}
        opacity={getOpacity('triceps_lateral')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M142 92 C146 104 146 116 138 124 C136 114 136 102 136 92 Z"
        fill={getFill('triceps_lateral')}
        filter={getFilter('triceps_lateral')}
        opacity={getOpacity('triceps_lateral')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Forearms (Posterior extensor view) */}
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

      {/* Rhomboids & Infraspinatus */}
      <path
        d="M78 72 C88 74 94 82 94 96 C84 94 76 86 78 72 Z"
        fill={getFill('rhomboids')}
        filter={getFilter('rhomboids')}
        opacity={getOpacity('rhomboids')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M122 72 C112 74 106 82 106 96 C116 94 124 86 122 72 Z"
        fill={getFill('rhomboids')}
        filter={getFilter('rhomboids')}
        opacity={getOpacity('rhomboids')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Latissimus Dorsi (Lats) */}
      <path
        d="M74 88 C82 96 92 106 94 126 C82 128 72 116 70 96 Z"
        fill={getFill('latissimus_dorsi')}
        filter={getFilter('latissimus_dorsi')}
        opacity={getOpacity('latissimus_dorsi')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M126 88 C118 96 108 106 106 126 C118 128 128 116 130 96 Z"
        fill={getFill('latissimus_dorsi')}
        filter={getFilter('latissimus_dorsi')}
        opacity={getOpacity('latissimus_dorsi')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Lower Back / Erector Spinae */}
      <path
        d="M93 104 L99 104 L99 146 L93 146 Z"
        fill={getFill('erector_spinae')}
        filter={getFilter('erector_spinae')}
        opacity={getOpacity('erector_spinae')}
        stroke="#18181b"
        strokeWidth="0.8"
      />
      <path
        d="M101 104 L107 104 L107 146 L101 146 Z"
        fill={getFill('erector_spinae')}
        filter={getFilter('erector_spinae')}
        opacity={getOpacity('erector_spinae')}
        stroke="#18181b"
        strokeWidth="0.8"
      />

      {/* Gluteus Medius */}
      <path
        d="M76 142 C72 148 74 158 78 164 C84 154 84 146 76 142 Z"
        fill={getFill('gluteus_medius')}
        filter={getFilter('gluteus_medius')}
        opacity={getOpacity('gluteus_medius')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M124 142 C128 148 126 158 122 164 C116 154 116 146 124 142 Z"
        fill={getFill('gluteus_medius')}
        filter={getFilter('gluteus_medius')}
        opacity={getOpacity('gluteus_medius')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Gluteus Maximus */}
      <path
        d="M78 148 C76 168 84 186 98 186 C98 164 96 148 78 148 Z"
        fill={getFill('gluteus_maximus')}
        filter={getFilter('gluteus_maximus')}
        opacity={getOpacity('gluteus_maximus')}
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <path
        d="M122 148 C124 168 116 186 102 186 C102 164 104 148 122 148 Z"
        fill={getFill('gluteus_maximus')}
        filter={getFilter('gluteus_maximus')}
        opacity={getOpacity('gluteus_maximus')}
        stroke="#18181b"
        strokeWidth="1.2"
      />

      {/* Hamstrings */}
      <path
        d="M74 188 C70 212 72 238 78 248 C88 248 94 232 94 204 C94 192 88 188 74 188 Z"
        fill={getFill('hamstrings')}
        filter={getFilter('hamstrings')}
        opacity={getOpacity('hamstrings')}
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <path
        d="M126 188 C130 212 128 238 122 248 C112 248 106 232 106 204 C106 192 112 188 126 188 Z"
        fill={getFill('hamstrings')}
        filter={getFilter('hamstrings')}
        opacity={getOpacity('hamstrings')}
        stroke="#18181b"
        strokeWidth="1.2"
      />

      {/* Knee joint back */}
      <circle cx="82" cy="254" r="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />
      <circle cx="118" cy="254" r="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />

      {/* Calves (Gastrocnemius & Soleus) */}
      <path
        d="M74 262 C68 280 70 306 76 322 C84 322 88 304 88 284 C88 272 86 262 82 262 Z"
        fill={getFill('calves_gastrocnemius')}
        filter={getFilter('calves_gastrocnemius')}
        opacity={getOpacity('calves_gastrocnemius')}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M126 262 C132 280 130 306 124 322 C116 322 112 304 112 284 C112 272 114 262 118 262 Z"
        fill={getFill('calves_gastrocnemius')}
        filter={getFilter('calves_gastrocnemius')}
        opacity={getOpacity('calves_gastrocnemius')}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Soleus / Achilles Tendon */}
      <path
        d="M78 322 L84 322 L84 340 L78 340 Z"
        fill={getFill('calves_soleus')}
        filter={getFilter('calves_soleus')}
        opacity={getOpacity('calves_soleus')}
        stroke="#18181b"
      />
      <path
        d="M116 322 L122 322 L122 340 L116 340 Z"
        fill={getFill('calves_soleus')}
        filter={getFilter('calves_soleus')}
        opacity={getOpacity('calves_soleus')}
        stroke="#18181b"
      />

      {/* Feet */}
      <path d="M74 342 L88 342 L86 354 L72 354 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" rx="2" />
      <path d="M126 342 L112 342 L114 354 L128 354 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" rx="2" />
    </svg>
  );
};
