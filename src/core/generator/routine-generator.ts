import { OnboardingPreferences } from '@/types/onboarding';
import {
  WeeklyWorkoutPlan,
  PlannedWorkoutDay,
  PlannedExercise,
  ExerciseDefinition,
  MovementPattern,
  EquipmentType,
  GoalType,
} from '@/types/workout';
import { SPLIT_TEMPLATES } from './split-rules';
import { EXERCISE_LIBRARY } from '@/data/exercises';

export function generateWeeklyPlan(
  preferences: OnboardingPreferences,
  exerciseLibrary: ExerciseDefinition[] = EXERCISE_LIBRARY
): WeeklyWorkoutPlan {
  const daysPerWeek = Math.min(Math.max(preferences.workoutDaysPerWeek, 1), 7);
  const template = SPLIT_TEMPLATES[daysPerWeek] || SPLIT_TEMPLATES[4];

  // Maximum exercises per workout according to preferred duration
  let maxExercises = 5;
  if (preferences.preferredDurationMinutes <= 45) {
    maxExercises = 4;
  } else if (preferences.preferredDurationMinutes === 60) {
    maxExercises = 5;
  } else if (preferences.preferredDurationMinutes >= 75) {
    maxExercises = 6;
  }

  // Decide placement before building days, so FLEXIBLE actually allocates cardio
  // across both rest days and post-workout sessions instead of silently omitting it.
  const requestedCardioDays = Math.max(0, preferences.cardioDaysPerWeek);
  const restDayIndexes = template.days
    .map((day, index) => (day.isRestDay ? index : -1))
    .filter((index) => index >= 0);
  const workoutDayIndexes = template.days
    .map((day, index) => (!day.isRestDay && !day.isCardioDay ? index : -1))
    .filter((index) => index >= 0);
  const nonLegWorkoutIndexes = workoutDayIndexes.filter(
    (index) => !template.days[index].focusMuscles.some((muscle) =>
      ['quadriceps', 'hamstrings', 'gluteus_maximus'].includes(muscle)
    )
  );

  const separateCardioCount = preferences.cardioPlacement === 'SEPARATE_DAYS'
    ? Math.min(requestedCardioDays, restDayIndexes.length)
    : preferences.cardioPlacement === 'FLEXIBLE'
      ? Math.min(Math.ceil(requestedCardioDays / 2), restDayIndexes.length)
      : 0;
  const separateCardioIndexes = new Set(restDayIndexes.slice(0, separateCardioCount));
  const postWorkoutCardioCount = requestedCardioDays - separateCardioCount;
  const preferredPostWorkoutIndexes = [
    ...nonLegWorkoutIndexes,
    ...workoutDayIndexes.filter((index) => !nonLegWorkoutIndexes.includes(index)),
  ];
  const postWorkoutCardioIndexes = new Set(
    preferredPostWorkoutIndexes.slice(0, postWorkoutCardioCount)
  );

  const plannedDays: PlannedWorkoutDay[] = template.days.map((dayTemplate, dayIndex) => {
    // If it's a rest day, check if user requested separate cardio days
    if (dayTemplate.isRestDay) {
      if (
        separateCardioIndexes.has(dayIndex)
      ) {
        return {
          id: `day-${dayIndex}-${dayTemplate.dayName.toLowerCase()}`,
          dayOfWeek: dayTemplate.dayOfWeek,
          dayName: dayTemplate.dayName,
          title: 'Cardio & Conditioning',
          focusMuscles: [],
          isCardioDay: true,
          isRestDay: false,
          sortOrder: dayIndex,
          exercises: [],
          cardioDetails: {
            type: 'Incline Treadmill Walk / Steady Cardio',
            durationMinutes: Math.min(preferences.preferredDurationMinutes, 30),
            intensity: 'MODERATE',
          },
        };
      }

      return {
        id: `day-${dayIndex}-${dayTemplate.dayName.toLowerCase()}`,
        dayOfWeek: dayTemplate.dayOfWeek,
        dayName: dayTemplate.dayName,
        title: 'Rest & Recovery',
        focusMuscles: [],
        isCardioDay: false,
        isRestDay: true,
        sortOrder: dayIndex,
        exercises: [],
      };
    }

    // Active workout day: pick exercises matching movement patterns & available equipment
    const selectedExercises: PlannedExercise[] = [];
    const usedExerciseIds = new Set<string>();

    const targetPatterns = dayTemplate.movementPatterns.slice(0, maxExercises);

    for (let i = 0; i < targetPatterns.length; i++) {
      const pattern = targetPatterns[i] as MovementPattern;
      const candidates = findEligibleExercises(
        pattern,
        preferences.availableEquipment,
        exerciseLibrary,
        usedExerciseIds
      );

      if (candidates.length > 0) {
        // Pick best matching candidate (prioritize compound / intermediate/beginner)
        const chosen = candidates[0];
        usedExerciseIds.add(chosen.id);

        const volumeConfig = calculateVolumeForGoal(
          preferences.primaryGoal,
          chosen.movementPattern,
          i === 0 // is first primary compound movement
        );

        selectedExercises.push({
          id: `pe-${dayIndex}-${chosen.id}`,
          exerciseId: chosen.id,
          orderIndex: i,
          targetSets: volumeConfig.sets,
          targetRepMin: volumeConfig.repMin,
          targetRepMax: volumeConfig.repMax,
          targetRir: volumeConfig.rir,
          restSeconds: volumeConfig.restSeconds,
          suggestedWeightKg: getInitialSuggestedWeight(chosen, preferences),
        });
      }
    }

    // Check post-workout cardio addition
    let cardioDetails = undefined;
    if (
      postWorkoutCardioIndexes.has(dayIndex)
    ) {
      cardioDetails = {
        type: 'Post-Workout Incline Walk / Bike',
        durationMinutes: 15,
        intensity: 'MODERATE' as const,
      };
    }

    return {
      id: `day-${dayIndex}-${dayTemplate.dayName.toLowerCase()}`,
      dayOfWeek: dayTemplate.dayOfWeek,
      dayName: dayTemplate.dayName,
      title: dayTemplate.title,
      focusMuscles: dayTemplate.focusMuscles,
      isCardioDay: dayTemplate.isCardioDay,
      isRestDay: false,
      sortOrder: dayIndex,
      exercises: selectedExercises,
      cardioDetails,
    };
  });

  return {
    id: `plan-${Date.now()}`,
    name: `${preferences.primaryGoal.replace('_', ' ')} ${daysPerWeek}-Day Plan`,
    splitType: template.splitType,
    version: 1,
    days: plannedDays,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function findEligibleExercises(
  pattern: MovementPattern,
  availableEquipment: EquipmentType[],
  library: ExerciseDefinition[],
  usedIds: Set<string>
): ExerciseDefinition[] {
  const equipSet = new Set(availableEquipment);

  return library
    .filter((ex) => {
      if (usedIds.has(ex.id)) return false;
      if (ex.movementPattern !== pattern) return false;
      // All required equipment must be available to user
      const hasEquipment = ex.equipmentRequired.every((eq) => equipSet.has(eq));
      return hasEquipment;
    })
    .sort((a, b) => {
      // Prioritize primary barbell / dumbbell compound movements
      const score = (ex: ExerciseDefinition) => {
        let s = 0;
        if (ex.equipmentRequired.includes('BARBELL')) s += 3;
        if (ex.equipmentRequired.includes('DUMBBELL')) s += 2;
        if (ex.category === 'STRENGTH') s += 1;
        return s;
      };
      return score(b) - score(a);
    });
}

function calculateVolumeForGoal(
  goal: GoalType,
  pattern: MovementPattern,
  isPrimaryCompound: boolean
): { sets: number; repMin: number; repMax: number; restSeconds: number; rir: number } {
  switch (goal) {
    case 'STRENGTH':
      if (isPrimaryCompound) {
        return { sets: 4, repMin: 4, repMax: 6, restSeconds: 150, rir: 2 };
      }
      return { sets: 3, repMin: 6, repMax: 8, restSeconds: 90, rir: 2 };

    case 'MUSCLE_GAIN':
      if (isPrimaryCompound) {
        return { sets: 4, repMin: 6, repMax: 10, restSeconds: 120, rir: 2 };
      }
      return { sets: 3, repMin: 8, repMax: 12, restSeconds: 75, rir: 1 };

    case 'FAT_LOSS':
    case 'BODY_RECOMPOSITION':
      return { sets: 3, repMin: 10, repMax: 15, restSeconds: 60, rir: 2 };

    case 'ATHLETIC_PERFORMANCE':
      return { sets: 3, repMin: 6, repMax: 10, restSeconds: 90, rir: 2 };

    case 'GENERAL_FITNESS':
    default:
      return { sets: 3, repMin: 8, repMax: 12, restSeconds: 75, rir: 2 };
  }
}

function getInitialSuggestedWeight(
  exercise: ExerciseDefinition,
  preferences: OnboardingPreferences
): number {
  const bodyWeight = preferences.currentWeightKg || 75;
  const isMaleOrIntermediate = preferences.experienceLevel !== 'BEGINNER';
  const mult = isMaleOrIntermediate ? 1.0 : 0.65;

  if (exercise.equipmentRequired.includes('BODYWEIGHT')) return 0;

  switch (exercise.movementPattern) {
    case 'SQUAT':
      return exercise.equipmentRequired.includes('BARBELL')
        ? Math.round((bodyWeight * 0.6 * mult) / 2.5) * 2.5
        : 16;
    case 'HINGE':
      return exercise.equipmentRequired.includes('BARBELL')
        ? Math.round((bodyWeight * 0.7 * mult) / 2.5) * 2.5
        : 20;
    case 'HORIZONTAL_PUSH':
      return exercise.equipmentRequired.includes('BARBELL')
        ? Math.round((bodyWeight * 0.5 * mult) / 2.5) * 2.5
        : 14;
    case 'VERTICAL_PUSH':
      return exercise.equipmentRequired.includes('BARBELL')
        ? Math.round((bodyWeight * 0.35 * mult) / 2.5) * 2.5
        : 10;
    case 'HORIZONTAL_PULL':
    case 'VERTICAL_PULL':
      return exercise.equipmentRequired.includes('BARBELL')
        ? Math.round((bodyWeight * 0.45 * mult) / 2.5) * 2.5
        : 45;
    case 'ISOLATION_ARM':
    case 'ISOLATION_DELT':
      return 8;
    default:
      return 20;
  }
}
