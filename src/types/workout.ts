export type AnatomicalMuscleId =
  | 'chest_upper'
  | 'chest_mid'
  | 'chest_lower'
  | 'deltoid_anterior'
  | 'deltoid_lateral'
  | 'deltoid_posterior'
  | 'biceps'
  | 'triceps_long'
  | 'triceps_lateral'
  | 'forearms'
  | 'latissimus_dorsi'
  | 'trapezius_upper'
  | 'rhomboids'
  | 'erector_spinae'
  | 'rectus_abdominis'
  | 'obliques'
  | 'quadriceps'
  | 'hamstrings'
  | 'gluteus_maximus'
  | 'gluteus_medius'
  | 'calves_gastrocnemius'
  | 'calves_soleus';

export type MovementPattern =
  | 'HORIZONTAL_PUSH'
  | 'VERTICAL_PUSH'
  | 'HORIZONTAL_PULL'
  | 'VERTICAL_PULL'
  | 'SQUAT'
  | 'HINGE'
  | 'LUNGE'
  | 'ISOLATION_ARM'
  | 'ISOLATION_DELT'
  | 'ISOLATION_LEG'
  | 'CORE'
  | 'CARDIO';

export type EquipmentType =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'CABLE'
  | 'MACHINE'
  | 'BODYWEIGHT'
  | 'BENCH'
  | 'PULLUP_BAR'
  | 'KETTLEBELL'
  | 'RESISTANCE_BAND'
  | 'CARDIO_MACHINE';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ExperienceLevel = DifficultyLevel;

export interface ExerciseDefinition {
  id: string;
  slug: string;
  name: string;
  category: 'STRENGTH' | 'CARDIO' | 'MOBILITY';
  movementPattern: MovementPattern;
  equipmentRequired: EquipmentType[];
  difficulty: DifficultyLevel;
  primaryMuscles: AnatomicalMuscleId[];
  secondaryMuscles: AnatomicalMuscleId[];
  instructions: string[];
  breathingTips: string;
  formCues: string[];
  defaultSets: number;
  defaultRepMin: number;
  defaultRepMax: number;
  defaultRestSeconds: number;
  metValue: number;
}

export type GoalType =
  | 'MUSCLE_GAIN'
  | 'FAT_LOSS'
  | 'STRENGTH'
  | 'BODY_RECOMPOSITION'
  | 'GENERAL_FITNESS'
  | 'ATHLETIC_PERFORMANCE';

export type CardioPlacement = 'SEPARATE_DAYS' | 'POST_WORKOUT' | 'FLEXIBLE';

export type EquipmentPreset =
  | 'FULL_GYM'
  | 'BASIC_GYM'
  | 'HOME_GYM'
  | 'BODYWEIGHT'
  | 'CUSTOM';

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  targetSets: number;
  targetRepMin: number;
  targetRepMax: number;
  targetRir?: number;
  restSeconds: number;
  suggestedWeightKg?: number;
}

export interface PlannedWorkoutDay {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  dayName: string;   // 'Monday', etc.
  title: string;     // e.g. 'Push: Chest & Delts'
  focusMuscles: AnatomicalMuscleId[];
  isCardioDay: boolean;
  isRestDay: boolean;
  sortOrder: number;
  exercises: PlannedExercise[];
  cardioDetails?: {
    type: string;
    durationMinutes: number;
    intensity: 'LOW' | 'MODERATE' | 'HIGH';
  };
}

export interface WeeklyWorkoutPlan {
  id: string;
  name: string;
  splitType: string;
  version: number;
  days: PlannedWorkoutDay[];
  createdAt: string;
  updatedAt: string;
}

export type SetType = 'WARMUP' | 'NORMAL' | 'DROP' | 'FAILURE';

export interface ActiveSetLog {
  id: string;
  setNumber: number;
  setType: SetType;
  weightKg: number;
  reps: number;
  rpe?: number;
  rir?: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ActiveExerciseSession {
  id: string;
  exerciseId: string;
  orderIndex: number;
  targetSets: number;
  targetRepMin: number;
  targetRepMax: number;
  restSeconds: number;
  suggestedWeightKg?: number;
  previousPerformance?: {
    date: string;
    sets: { weightKg: number; reps: number }[];
  };
  sets: ActiveSetLog[];
  notes?: string;
}

export interface ActiveWorkoutState {
  id: string;
  planDayId?: string;
  name: string;
  startedAt: string;
  completedAt?: string;
  totalDurationSeconds: number;
  estimatedCalories: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  exercises: ActiveExerciseSession[];
  rpeOverall?: number;
  notes?: string;
}

export interface CompletedWorkoutSummary {
  id: string;
  name: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  estimatedCalories: number;
  personalRecordsAchieved: PersonalRecordAchievement[];
}

export interface PersonalRecordAchievement {
  exerciseId: string;
  exerciseName: string;
  recordType: 'MAX_WEIGHT' | 'ESTIMATED_1RM' | 'MAX_REPS';
  weightKg: number;
  reps: number;
  estimated1RM: number;
  isNew: boolean;
}
