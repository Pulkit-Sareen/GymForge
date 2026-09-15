import { describe, it, expect } from 'vitest';
import { generateWeeklyPlan } from '@/core/generator/routine-generator';
import { OnboardingPreferences } from '@/types/onboarding';

describe('Workout Routine Generator', () => {
  it('generates a valid 4-day Upper/Lower split', () => {
    const prefs: OnboardingPreferences = {
      workoutDaysPerWeek: 4,
      cardioDaysPerWeek: 2,
      primaryGoal: 'MUSCLE_GAIN',
      experienceLevel: 'INTERMEDIATE',
      equipmentPreset: 'FULL_GYM',
      availableEquipment: ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'BODYWEIGHT', 'CARDIO_MACHINE'],
      preferredDurationMinutes: 60,
      cardioPlacement: 'POST_WORKOUT',
      weightUnit: 'kg',
      currentWeightKg: 80,
    };

    const plan = generateWeeklyPlan(prefs);

    expect(plan).toBeDefined();
    expect(plan.days.length).toBe(7);

    // Active lifting days should be 4
    const activeDays = plan.days.filter((d) => !d.isRestDay && !d.isCardioDay);
    expect(activeDays.length).toBe(4);

    // Check that each active day has exercises
    activeDays.forEach((day) => {
      expect(day.exercises.length).toBeGreaterThanOrEqual(4);
      expect(day.exercises.length).toBeLessThanOrEqual(6);
    });

    // Check post-workout cardio is added to at least 2 days
    const daysWithCardio = plan.days.filter((d) => d.cardioDetails !== undefined);
    expect(daysWithCardio.length).toBe(2);
  });

  it('generates a 3-day Full Body split with separate cardio days', () => {
    const prefs: OnboardingPreferences = {
      workoutDaysPerWeek: 3,
      cardioDaysPerWeek: 2,
      primaryGoal: 'STRENGTH',
      experienceLevel: 'INTERMEDIATE',
      equipmentPreset: 'FULL_GYM',
      availableEquipment: ['BARBELL', 'DUMBBELL', 'BENCH', 'BODYWEIGHT', 'CARDIO_MACHINE'],
      preferredDurationMinutes: 45,
      cardioPlacement: 'SEPARATE_DAYS',
      weightUnit: 'kg',
      currentWeightKg: 85,
    };

    const plan = generateWeeklyPlan(prefs);
    expect(plan.days.length).toBe(7);

    const liftingDays = plan.days.filter((d) => !d.isRestDay && !d.isCardioDay);
    expect(liftingDays.length).toBe(3);

    const dedicatedCardioDays = plan.days.filter((d) => d.isCardioDay);
    expect(dedicatedCardioDays.length).toBe(2);
  });

  it('respects equipment limitations (e.g. dumbbell and bodyweight only)', () => {
    const prefs: OnboardingPreferences = {
      workoutDaysPerWeek: 3,
      cardioDaysPerWeek: 0,
      primaryGoal: 'FAT_LOSS',
      experienceLevel: 'BEGINNER',
      equipmentPreset: 'HOME_GYM',
      availableEquipment: ['DUMBBELL', 'BODYWEIGHT', 'BENCH'],
      preferredDurationMinutes: 45,
      cardioPlacement: 'FLEXIBLE',
      weightUnit: 'kg',
      currentWeightKg: 70,
    };

    const plan = generateWeeklyPlan(prefs);
    const activeDays = plan.days.filter((d) => !d.isRestDay);

    activeDays.forEach((day) => {
      day.exercises.forEach((pe) => {
        // Exercise shouldn't require barbell, cable, or machine
        expect(pe.exerciseId).not.toContain('bb-');
        expect(pe.exerciseId).not.toContain('cable-');
        expect(pe.exerciseId).not.toContain('machine-');
      });
    });
  });

  it('splits flexible cardio between a rest day and post-workout session', () => {
    const prefs: OnboardingPreferences = {
      workoutDaysPerWeek: 5,
      cardioDaysPerWeek: 2,
      primaryGoal: 'GENERAL_FITNESS',
      experienceLevel: 'INTERMEDIATE',
      equipmentPreset: 'FULL_GYM',
      availableEquipment: ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'BODYWEIGHT', 'CARDIO_MACHINE'],
      preferredDurationMinutes: 60,
      cardioPlacement: 'FLEXIBLE',
      weightUnit: 'kg',
      currentWeightKg: 75,
    };

    const plan = generateWeeklyPlan(prefs);

    expect(plan.days.filter((day) => day.isCardioDay)).toHaveLength(1);
    expect(plan.days.filter((day) => day.cardioDetails && !day.isCardioDay)).toHaveLength(1);
  });
});
