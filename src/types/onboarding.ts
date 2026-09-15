import { GoalType, ExperienceLevel, CardioPlacement, EquipmentType, EquipmentPreset } from './workout';

export interface OnboardingPreferences {
  workoutDaysPerWeek: number; // 1 to 7
  cardioDaysPerWeek: number;  // 0 to 7
  primaryGoal: GoalType;
  experienceLevel: ExperienceLevel;
  equipmentPreset: EquipmentPreset;
  availableEquipment: EquipmentType[];
  preferredDurationMinutes: number; // 30, 45, 60, 75, 90
  cardioPlacement: CardioPlacement;
  weightUnit: 'kg' | 'lbs';
  currentWeightKg: number;
}

export const DEFAULT_ONBOARDING_PREFERENCES: OnboardingPreferences = {
  workoutDaysPerWeek: 4,
  cardioDaysPerWeek: 2,
  primaryGoal: 'MUSCLE_GAIN',
  experienceLevel: 'INTERMEDIATE',
  equipmentPreset: 'FULL_GYM',
  availableEquipment: [
    'BARBELL',
    'DUMBBELL',
    'CABLE',
    'MACHINE',
    'BENCH',
    'PULLUP_BAR',
    'BODYWEIGHT',
    'CARDIO_MACHINE',
  ],
  preferredDurationMinutes: 60,
  cardioPlacement: 'POST_WORKOUT',
  weightUnit: 'kg',
  currentWeightKg: 75,
};
