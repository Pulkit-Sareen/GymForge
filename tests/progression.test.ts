import { describe, it, expect } from 'vitest';
import { calculateProgression } from '@/core/progression/double-progression';
import { EXERCISE_LIBRARY } from '@/data/exercises';

describe('Double Progression Recommendation Engine', () => {
  const benchPress = EXERCISE_LIBRARY.find((e) => e.id === 'ex-bb-bench')!;
  const squat = EXERCISE_LIBRARY.find((e) => e.id === 'ex-bb-squat')!;

  it('recommends weight increase when all sets hit top rep limit with good RIR', () => {
    const lastSession = [
      { weightKg: 60, reps: 10, rir: 2 },
      { weightKg: 60, reps: 10, rir: 1 },
      { weightKg: 60, reps: 10, rir: 1 },
    ];

    const recommendation = calculateProgression(benchPress, 6, 10, lastSession);

    expect(recommendation.action).toBe('INCREASE');
    expect(recommendation.suggestedWeightKg).toBe(61.25); // upper body increment: 1.25kg
    expect(recommendation.reason).toContain('Completed all 3 sets at top rep target');
  });

  it('applies larger increment for lower body compound movements', () => {
    const lastSession = [
      { weightKg: 100, reps: 8, rir: 2 },
      { weightKg: 100, reps: 8, rir: 2 },
      { weightKg: 100, reps: 8, rir: 1 },
    ];

    const recommendation = calculateProgression(squat, 5, 8, lastSession);

    expect(recommendation.action).toBe('INCREASE');
    expect(recommendation.suggestedWeightKg).toBe(102.5); // lower body increment: 2.5kg
  });

  it('recommends maintaining weight when within rep range', () => {
    const lastSession = [
      { weightKg: 60, reps: 10, rir: 1 },
      { weightKg: 60, reps: 9, rir: 1 },
      { weightKg: 60, reps: 7, rir: 0 },
    ];

    const recommendation = calculateProgression(benchPress, 6, 10, lastSession);

    expect(recommendation.action).toBe('MAINTAIN');
    expect(recommendation.suggestedWeightKg).toBe(60);
    expect(recommendation.explanation).toContain('Maintain 60 kg');
  });

  it('detects a plateau and suggests deload after 3 failed sessions', () => {
    const lastSession = [
      { weightKg: 80, reps: 5, rir: 0 },
      { weightKg: 80, reps: 4, rir: 0 },
      { weightKg: 80, reps: 4, rir: 0 },
    ];

    const recommendation = calculateProgression(benchPress, 6, 10, lastSession, 3);

    expect(recommendation.action).toBe('DELOAD');
    expect(recommendation.suggestedWeightKg).toBeLessThan(80);
    expect(recommendation.reason).toContain('Stalled for 3 consecutive sessions');
  });
});
