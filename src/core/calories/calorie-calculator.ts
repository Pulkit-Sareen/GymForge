import { ExerciseDefinition } from '@/types/workout';

export interface CalorieEstimationInput {
  exercise: ExerciseDefinition;
  setsCount: number;
  repsPerSetAvg: number;
  restSecondsAvg: number;
  userWeightKg: number;
}

export function estimateExerciseCalories(input: CalorieEstimationInput): number {
  const { exercise, setsCount, repsPerSetAvg, restSecondsAvg, userWeightKg } = input;
  const weight = userWeightKg > 0 ? userWeightKg : 75;

  // Active duration per set (avg ~4.0 seconds per controlled rep including setup)
  const activeSecondsPerSet = Math.max(repsPerSetAvg * 4.0, 30);
  const totalActiveSeconds = activeSecondsPerSet * setsCount;
  const totalRestSeconds = restSecondsAvg * Math.max(setsCount - 1, 0);

  // Active portion burns at exercise MET value
  const activeHours = totalActiveSeconds / 3600;
  const activeCalories = exercise.metValue * weight * activeHours;

  // Inter-set recovery intervals elevate metabolic rate (EPOC: ~2.8 MET with elevated heart rate)
  const restHours = totalRestSeconds / 3600;
  const restCalories = 2.8 * weight * restHours;

  return Math.round(activeCalories + restCalories);
}

export function estimateCardioCalories(
  cardioType: string,
  durationMinutes: number,
  intensity: 'LOW' | 'MODERATE' | 'HIGH',
  userWeightKg: number = 75
): number {
  const weight = userWeightKg > 0 ? userWeightKg : 75;
  const hours = durationMinutes / 60;

  let baseMet = 6.0;
  const lowerType = cardioType.toLowerCase();

  if (lowerType.includes('treadmill') || lowerType.includes('walk')) {
    baseMet = 5.0;
  } else if (lowerType.includes('run') || lowerType.includes('jog')) {
    baseMet = 9.5;
  } else if (lowerType.includes('bike') || lowerType.includes('cycle')) {
    baseMet = 6.8;
  } else if (lowerType.includes('row')) {
    baseMet = 7.5;
  } else if (lowerType.includes('stair')) {
    baseMet = 8.5;
  }

  let intensityMult = 1.0;
  if (intensity === 'LOW') intensityMult = 0.8;
  if (intensity === 'HIGH') intensityMult = 1.25;

  const totalMet = baseMet * intensityMult;
  return Math.round(totalMet * weight * hours);
}

export function estimateWorkoutTotalCalories(
  strengthCalories: number,
  cardioCalories: number = 0
): { strengthKcal: number; cardioKcal: number; totalKcal: number } {
  return {
    strengthKcal: strengthCalories,
    cardioKcal: cardioCalories,
    totalKcal: strengthCalories + cardioCalories,
  };
}
