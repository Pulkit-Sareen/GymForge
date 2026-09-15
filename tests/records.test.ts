import { describe, it, expect } from 'vitest';
import { calculateEstimated1RM, detectPersonalRecords } from '@/core/records/pr-detector';

describe('Personal Records & 1RM Calculations', () => {
  it('correctly calculates estimated 1RM via Epley formula', () => {
    // 100 kg x 10 reps -> 100 * (1 + 10/30) = 133.3 kg
    const e1rm = calculateEstimated1RM(100, 10);
    expect(e1rm).toBeCloseTo(133.3, 1);

    // 100 kg x 1 rep should equal 100 kg
    expect(calculateEstimated1RM(100, 1)).toBe(100);
  });

  it('detects new max weight personal records', () => {
    const sets = [
      { id: '1', setNumber: 1, setType: 'NORMAL' as const, weightKg: 80, reps: 8, isCompleted: true },
      { id: '2', setNumber: 2, setType: 'NORMAL' as const, weightKg: 85, reps: 6, isCompleted: true },
    ];

    const historical = {
      exerciseId: 'ex-bb-bench',
      maxWeightKg: 82.5,
      maxEstimated1RM: 100,
    };

    const prs = detectPersonalRecords('ex-bb-bench', 'Barbell Bench Press', sets, historical);
    expect(prs.length).toBeGreaterThan(0);
    expect(prs[0].recordType).toBe('MAX_WEIGHT');
    expect(prs[0].weightKg).toBe(85);
    expect(prs[0].isNew).toBe(true);
  });
});
