import { describe, it, expect } from 'vitest';
import {
  estimateExerciseCalories,
  estimateCardioCalories,
  estimateWorkoutTotalCalories,
} from '@/core/calories/calorie-calculator';
import { EXERCISE_LIBRARY } from '@/data/exercises';

describe('Calorie Estimation Engine', () => {
  const benchPress = EXERCISE_LIBRARY.find((e) => e.id === 'ex-bb-bench')!;

  it('estimates realistic calorie burn for strength exercises', () => {
    const kcal = estimateExerciseCalories({
      exercise: benchPress,
      setsCount: 3,
      repsPerSetAvg: 10,
      restSecondsAvg: 90,
      userWeightKg: 80,
    });

    // 3 sets of bench with 90s rest for 80kg person should burn approximately 25-45 kcal
    expect(kcal).toBeGreaterThanOrEqual(25);
    expect(kcal).toBeLessThanOrEqual(50);
  });

  it('estimates cardio calories based on intensity and duration', () => {
    const treadmillModerate = estimateCardioCalories('treadmill', 30, 'MODERATE', 75);
    const treadmillHigh = estimateCardioCalories('treadmill', 30, 'HIGH', 75);

    expect(treadmillModerate).toBeGreaterThan(150);
    expect(treadmillHigh).toBeGreaterThan(treadmillModerate);
  });

  it('aggregates total workout expenditure', () => {
    const total = estimateWorkoutTotalCalories(320, 180);
    expect(total.strengthKcal).toBe(320);
    expect(total.cardioKcal).toBe(180);
    expect(total.totalKcal).toBe(500);
  });
});
