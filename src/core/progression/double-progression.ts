import { ExerciseDefinition } from '@/types/workout';

export interface SetPerformance {
  weightKg: number;
  reps: number;
  rir?: number;
  rpe?: number;
}

export interface ProgressionRecommendation {
  action: 'INCREASE' | 'MAINTAIN' | 'DELOAD';
  suggestedWeightKg: number;
  previousWeightKg: number;
  reason: string;
  explanation: string;
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
}

export function calculateProgression(
  exercise: ExerciseDefinition,
  targetRepMin: number,
  targetRepMax: number,
  lastSessionSets: SetPerformance[],
  consecutivePlateauSessions: number = 0
): ProgressionRecommendation {
  if (!lastSessionSets || lastSessionSets.length === 0) {
    return {
      action: 'MAINTAIN',
      suggestedWeightKg: 20,
      previousWeightKg: 0,
      reason: 'First time performing this exercise.',
      explanation: 'Establish a solid baseline weight where you can complete all prescribed sets with 1-2 reps in reserve.',
      confidence: 'LOW',
    };
  }

  // Determine standard weight in previous session (take highest or median)
  const lastWeight = Math.max(...lastSessionSets.map((s) => s.weightKg));

  // If bodyweight exercise with 0 kg
  if (lastWeight === 0 && exercise.equipmentRequired.includes('BODYWEIGHT')) {
    const allHitMax = lastSessionSets.every((s) => s.reps >= targetRepMax);
    if (allHitMax) {
      return {
        action: 'INCREASE',
        suggestedWeightKg: 0,
        previousWeightKg: 0,
        reason: 'Consistently hitting top of rep range.',
        explanation: 'Add 1-2 reps per set, slow down your eccentric tempo (3 seconds down), or introduce added weight/resistance.',
        confidence: 'HIGH',
      };
    }
    return {
      action: 'MAINTAIN',
      suggestedWeightKg: 0,
      previousWeightKg: 0,
      reason: 'Building bodyweight rep capacity.',
      explanation: `Aim to reach ${targetRepMax} reps on all sets before increasing difficulty.`,
      confidence: 'HIGH',
    };
  }

  // Check if all sets hit or exceeded targetRepMax
  const allHitMaxReps = lastSessionSets.every((s) => s.reps >= targetRepMax);
  const minRepsHit = lastSessionSets.every((s) => s.reps >= targetRepMin);
  const averageRir =
    lastSessionSets.reduce((acc, s) => acc + (s.rir ?? 1.5), 0) /
    lastSessionSets.length;

  // Determine increment based on movement pattern
  const isLowerBody =
    exercise.movementPattern === 'SQUAT' ||
    exercise.movementPattern === 'HINGE' ||
    exercise.movementPattern === 'LUNGE' ||
    exercise.movementPattern === 'ISOLATION_LEG';

  const weightIncrement = isLowerBody ? 2.5 : 1.25;

  // Scenario 1: Deload trigger if user stalled for 3+ sessions
  if (consecutivePlateauSessions >= 3) {
    const deloadWeight = Math.max(
      Math.round((lastWeight * 0.9) / weightIncrement) * weightIncrement,
      weightIncrement
    );
    return {
      action: 'DELOAD',
      suggestedWeightKg: deloadWeight,
      previousWeightKg: lastWeight,
      reason: `Stalled for ${consecutivePlateauSessions} consecutive sessions.`,
      explanation: `You've encountered a fatigue plateau. A 10% deload down to ${deloadWeight} kg for 1 week will dissipate central fatigue and reset strength adaptations.`,
      confidence: 'HIGH',
    };
  }

  // Scenario 2: Successful progression! All sets hit target rep max with good effort reserve
  if (allHitMaxReps && averageRir >= 0.5) {
    const nextWeight = lastWeight + weightIncrement;
    return {
      action: 'INCREASE',
      suggestedWeightKg: nextWeight,
      previousWeightKg: lastWeight,
      reason: `Completed all ${lastSessionSets.length} sets at top rep target (${targetRepMax} reps).`,
      explanation: `Outstanding! You're dominating ${lastWeight} kg. Step up to ${nextWeight} kg next session and aim for the lower end of the rep range (${targetRepMin} reps).`,
      confidence: 'HIGH',
    };
  }

  // Scenario 3: Completed within range (e.g. 10, 9, 8 reps of 8-12)
  if (minRepsHit) {
    const repsSummary = lastSessionSets.map((s) => s.reps).join(', ');
    return {
      action: 'MAINTAIN',
      suggestedWeightKg: lastWeight,
      previousWeightKg: lastWeight,
      reason: `Rep performance: [${repsSummary}]. Within target window (${targetRepMin}–${targetRepMax}).`,
      explanation: `Maintain ${lastWeight} kg. Focus on adding 1-2 reps across your lagging sets until you can hit ${targetRepMax} reps on all sets.`,
      confidence: 'HIGH',
    };
  }

  // Scenario 4: Missed minimum reps (e.g. 6 of 8-12)
  const missedCount = lastSessionSets.filter((s) => s.reps < targetRepMin).length;
  return {
    action: 'MAINTAIN',
    suggestedWeightKg: lastWeight,
    previousWeightKg: lastWeight,
    reason: `Fell below minimum rep threshold (${targetRepMin} reps) on ${missedCount} set(s).`,
    explanation: `Keep the weight at ${lastWeight} kg. Ensure 2-3 minutes of rest between sets and dial in form to complete the minimum ${targetRepMin} reps.`,
    confidence: 'HIGH',
  };
}
