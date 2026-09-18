import {
  WeeklyWorkoutPlan,
  PlannedWorkoutDay,
  PlannedExercise,
  ExerciseDefinition,
} from '@/types/workout';

export function swapExerciseInPlan(
  plan: WeeklyWorkoutPlan,
  dayId: string,
  targetExerciseId: string,
  replacementExercise: ExerciseDefinition
): WeeklyWorkoutPlan {
  const updatedDays = plan.days.map((day) => {
    if (day.id !== dayId) return day;

    const updatedExercises = day.exercises.map((pe) => {
      if (pe.exerciseId !== targetExerciseId) return pe;

      return {
        ...pe,
        id: `pe-${day.dayOfWeek}-${replacementExercise.id}`,
        exerciseId: replacementExercise.id,
        targetSets: replacementExercise.defaultSets,
        targetRepMin: replacementExercise.defaultRepMin,
        targetRepMax: replacementExercise.defaultRepMax,
        restSeconds: replacementExercise.defaultRestSeconds,
      };
    });

    return {
      ...day,
      exercises: updatedExercises,
    };
  });

  return {
    ...plan,
    days: updatedDays,
    updatedAt: new Date().toISOString(),
  };
}

export function removeExerciseFromPlan(
  plan: WeeklyWorkoutPlan,
  dayId: string,
  exerciseId: string
): WeeklyWorkoutPlan {
  const updatedDays = plan.days.map((day) => {
    if (day.id !== dayId) return day;

    const filtered = day.exercises
      .filter((pe) => pe.exerciseId !== exerciseId)
      .map((pe, idx) => ({ ...pe, orderIndex: idx }));

    return {
      ...day,
      exercises: filtered,
    };
  });

  return {
    ...plan,
    days: updatedDays,
    updatedAt: new Date().toISOString(),
  };
}

export function addExerciseToPlan(
  plan: WeeklyWorkoutPlan,
  dayId: string,
  newExercise: ExerciseDefinition
): WeeklyWorkoutPlan {
  const updatedDays = plan.days.map((day) => {
    if (day.id !== dayId) return day;

    // Check if already in day
    if (day.exercises.some((e) => e.exerciseId === newExercise.id)) return day;

    const newPe: PlannedExercise = {
      id: `pe-${day.dayOfWeek}-${newExercise.id}`,
      exerciseId: newExercise.id,
      orderIndex: day.exercises.length,
      targetSets: newExercise.defaultSets,
      targetRepMin: newExercise.defaultRepMin,
      targetRepMax: newExercise.defaultRepMax,
      restSeconds: newExercise.defaultRestSeconds,
    };

    return {
      ...day,
      exercises: [...day.exercises, newPe],
    };
  });

  return {
    ...plan,
    days: updatedDays,
    updatedAt: new Date().toISOString(),
  };
}

export function swapDaysInPlan(
  plan: WeeklyWorkoutPlan,
  dayIdA: string,
  dayIdB: string
): WeeklyWorkoutPlan {
  const indexA = plan.days.findIndex((d) => d.id === dayIdA);
  const indexB = plan.days.findIndex((d) => d.id === dayIdB);

  if (indexA === -1 || indexB === -1) return plan;

  const daysCopy = [...plan.days];
  const dayA = daysCopy[indexA];
  const dayB = daysCopy[indexB];

  // Swap workout content but keep dayOfWeek and dayName aligned with calendar
  const newDayA: PlannedWorkoutDay = {
    ...dayA,
    title: dayB.title,
    focusMuscles: dayB.focusMuscles,
    isCardioDay: dayB.isCardioDay,
    isRestDay: dayB.isRestDay,
    exercises: dayB.exercises,
    cardioDetails: dayB.cardioDetails,
  };

  const newDayB: PlannedWorkoutDay = {
    ...dayB,
    title: dayA.title,
    focusMuscles: dayA.focusMuscles,
    isCardioDay: dayA.isCardioDay,
    isRestDay: dayA.isRestDay,
    exercises: dayA.exercises,
    cardioDetails: dayA.cardioDetails,
  };

  daysCopy[indexA] = newDayA;
  daysCopy[indexB] = newDayB;

  return {
    ...plan,
    days: daysCopy,
    updatedAt: new Date().toISOString(),
  };
}

export function updateDayMuscleFocusAndExercises(
  plan: WeeklyWorkoutPlan,
  dayId: string,
  focusTitle: string,
  focusMuscles: any[],
  movementPatterns: string[],
  availableEquipment: any[] = ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'BODYWEIGHT'],
  library: any[] = []
): WeeklyWorkoutPlan {
  const equipSet = new Set(availableEquipment);
  const exLib = library.length > 0 ? library : require('@/data/exercises').EXERCISE_LIBRARY;

  const updatedDays = plan.days.map((day) => {
    if (day.id !== dayId) return day;

    const newExercises: PlannedExercise[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < movementPatterns.length; i++) {
      const pat = movementPatterns[i];
      const candidates = exLib.filter((ex: any) => {
        if (usedIds.has(ex.id)) return false;
        if (ex.movementPattern !== pat) return false;
        return ex.equipmentRequired.every((eq: any) => equipSet.has(eq));
      });

      // Prefer exercises targeting the specified focus muscles
      const match = candidates.find((ex: any) =>
        ex.primaryMuscles.some((m: any) => focusMuscles.includes(m))
      ) || candidates[0];

      if (match) {
        usedIds.add(match.id);
        newExercises.push({
          id: `pe-${day.dayOfWeek}-${match.id}-${i}`,
          exerciseId: match.id,
          orderIndex: i,
          targetSets: match.defaultSets,
          targetRepMin: match.defaultRepMin,
          targetRepMax: match.defaultRepMax,
          targetRir: 2,
          restSeconds: match.defaultRestSeconds,
          suggestedWeightKg: 20,
        });
      }
    }

    return {
      ...day,
      title: focusTitle,
      focusMuscles,
      isRestDay: false,
      isCardioDay: movementPatterns.every((p) => p === 'CARDIO'),
      exercises: newExercises,
    };
  });

  return {
    ...plan,
    days: updatedDays,
    updatedAt: new Date().toISOString(),
  };
}

