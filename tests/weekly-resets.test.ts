import { describe, it, expect } from 'vitest';
import { getWeekStartMonday, getWeekEndSunday, isDateInCurrentWeek } from '@/lib/utils';
import {
  INDIVIDUAL_MUSCLE_SETS,
  PRESET_WORKOUT_SPLITS,
  getMusclesAndPatternsForSelection,
} from '@/core/generator/split-rules';

describe('Weekly Resets (Monday 00:00 Cycle) & History Locking', () => {
  it('correctly sets Monday 00:00:00 as the start of the week', () => {
    // Wednesday Sept 16, 2026 at 12:00
    const wednesday = new Date(2026, 8, 16, 12, 0, 0);
    const monday = getWeekStartMonday(wednesday);

    expect(monday.getDay()).toBe(1); // Monday
    expect(monday.getHours()).toBe(0);
    expect(monday.getMinutes()).toBe(0);
    expect(monday.getSeconds()).toBe(0);
    // Should be Monday Sept 14, 2026
    expect(monday.getDate()).toBe(14);
  });

  it('correctly treats Sunday as part of the preceding Monday-Sunday week', () => {
    // Sunday Sept 20, 2026 at 14:00
    const sunday = new Date(2026, 8, 20, 14, 0, 0);
    const monday = getWeekStartMonday(sunday);

    expect(monday.getDay()).toBe(1);
    // Should still belong to the week starting Monday Sept 14
    expect(monday.getDate()).toBe(14);
  });

  it('resets to new week on Monday morning 00:00', () => {
    // Monday Sept 21, 2026 at 08:00
    const newMonday = new Date(2026, 8, 21, 8, 0, 0);
    const weekStart = getWeekStartMonday(newMonday);

    expect(weekStart.getDate()).toBe(21);
    expect(weekStart.getDay()).toBe(1);
  });

  it('identifies sessions within current week and locks past weeks', () => {
    // Reference date: Wednesday Sept 16, 2026 at 12:00
    const refDate = new Date(2026, 8, 16, 12, 0, 0);

    // Tuesday Sept 15, 2026 -> current week
    const currentWeekSession = new Date(2026, 8, 15, 10, 0, 0).toISOString();
    expect(isDateInCurrentWeek(currentWeekSession, refDate)).toBe(true);

    // Sunday Sept 13, 2026 -> previous week (LOCKED)
    const pastWeekSession = new Date(2026, 8, 13, 15, 0, 0).toISOString();
    expect(isDateInCurrentWeek(pastWeekSession, refDate)).toBe(false);

    // Next Monday Sept 21, 2026 -> future week
    const futureSession = new Date(2026, 8, 21, 10, 0, 0).toISOString();
    expect(isDateInCurrentWeek(futureSession, refDate)).toBe(false);
  });
});

describe('Split Rules & Muscle Combinations', () => {
  it('provides all requested individual muscle sets', () => {
    expect(INDIVIDUAL_MUSCLE_SETS.chest).toBeDefined();
    expect(INDIVIDUAL_MUSCLE_SETS.back).toBeDefined();
    expect(INDIVIDUAL_MUSCLE_SETS.shoulders).toBeDefined();
    expect(INDIVIDUAL_MUSCLE_SETS.arms).toBeDefined();
    expect(INDIVIDUAL_MUSCLE_SETS.legs).toBeDefined();
    expect(INDIVIDUAL_MUSCLE_SETS.abs).toBeDefined();
  });

  it('generates paired muscle combinations with combined muscles and movement patterns', () => {
    const chestTriceps = getMusclesAndPatternsForSelection('chest', 'arms');
    expect(chestTriceps.title).toBe('Chest + Arms (Biceps & Triceps)');
    expect(chestTriceps.muscles.length).toBeGreaterThan(3);
    expect(chestTriceps.patterns.length).toBeGreaterThanOrEqual(4);
  });

  it('supports full body, upper body, and lower body presets', () => {
    const fullBody = getMusclesAndPatternsForSelection('FULL_BODY');
    expect(fullBody.title).toBe('Full Body');

    const upper = getMusclesAndPatternsForSelection('UPPER_BODY');
    expect(upper.title).toBe('Upper Body');

    const lower = getMusclesAndPatternsForSelection('LOWER_BODY');
    expect(lower.title).toBe('Lower Body');
  });
});
