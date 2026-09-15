import { describe, it, expect } from 'vitest';
import { findExerciseSubstitutions } from '@/core/substitution/exercise-substitution';
import { EXERCISE_LIBRARY } from '@/data/exercises';

describe('Exercise Substitution Engine', () => {
  const barbellBench = EXERCISE_LIBRARY.find((e) => e.id === 'ex-bb-bench')!;

  it('suggests top alternatives matching movement pattern and muscle focus', () => {
    const availableEquipment = ['DUMBBELL', 'BENCH', 'MACHINE', 'BODYWEIGHT', 'CABLE'];
    const substitutions = findExerciseSubstitutions(
      barbellBench,
      availableEquipment as any,
      [],
      EXERCISE_LIBRARY,
      3
    );

    expect(substitutions.length).toBeGreaterThan(0);
    expect(substitutions.length).toBeLessThanOrEqual(3);

    // Should include Dumbbell Bench Press, Machine Chest Press, or Push-Ups
    const topIds = substitutions.map((s) => s.exercise.id);
    expect(
      topIds.includes('ex-db-bench') ||
      topIds.includes('ex-machine-chest-press') ||
      topIds.includes('ex-pushup')
    ).toBe(true);

    // Check that reasons are populated
    expect(substitutions[0].matchReasons.length).toBeGreaterThan(0);
  });

  it('penalizes exercises already present in current workout', () => {
    const availableEquipment = ['DUMBBELL', 'BENCH', 'MACHINE', 'BODYWEIGHT', 'CABLE'];
    const substitutions = findExerciseSubstitutions(
      barbellBench,
      availableEquipment as any,
      ['ex-db-bench'], // ex-db-bench is already in today's workout
      EXERCISE_LIBRARY,
      3
    );

    const firstMatch = substitutions[0];
    // Since ex-db-bench is penalized by -60, it should not be the #1 choice
    expect(firstMatch.exercise.id).not.toBe('ex-db-bench');
  });
});
