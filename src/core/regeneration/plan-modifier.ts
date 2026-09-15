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
