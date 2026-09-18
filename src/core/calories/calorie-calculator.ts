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
  } else if (lowerType.includes('elliptical')) {
    baseMet = 7.0;
  }

  let intensityMult = 1.0;
  if (intensity === 'LOW') intensityMult = 0.8;
  if (intensity === 'HIGH') intensityMult = 1.25;

  const totalMet = baseMet * intensityMult;
  return Math.round(totalMet * weight * hours);
}

export interface AdvancedCardioParams {
  cardioType: string;
  durationMinutes: number;
  distanceKm?: number;
  speedKmh?: number;
  inclinePercent?: number;
  directKcalOverride?: number;
  userWeightKg?: number;
}

/**
 * Calculates cardio calories using detailed parameters (distance, speed, incline, duration)
 * or accepts a direct machine calorie readout override.
 */
export function calculateAdvancedCardioCalories(params: AdvancedCardioParams): number {
  // If user directly enters machine readout, return it immediately
  if (params.directKcalOverride !== undefined && params.directKcalOverride > 0) {
    return Math.round(params.directKcalOverride);
  }

  const duration = Math.max(params.durationMinutes || 0, 1);
  const weight = (params.userWeightKg && params.userWeightKg > 0) ? params.userWeightKg : 75;
  const hours = duration / 60;
  const lowerType = params.cardioType.toLowerCase();

  // Determine speed if distance and time are supplied
  let speed = params.speedKmh;
  if (!speed && params.distanceKm && params.distanceKm > 0) {
    speed = params.distanceKm / hours;
  }

  // Treadmill / Walking / Running with ACSM formula
  if (lowerType.includes('walk') || lowerType.includes('treadmill') || lowerType.includes('run')) {
    const effectiveSpeedKmh = speed || (lowerType.includes('run') ? 9.0 : 5.0);
    const speedMPerMin = (effectiveSpeedKmh * 1000) / 60;
    const grade = (params.inclinePercent || 0) / 100;

    let vo2 = 3.5;
    if (effectiveSpeedKmh < 7.0) {
      // ACSM Walking formula: VO2 = 0.1 * S + 1.8 * S * G + 3.5
      vo2 = 0.1 * speedMPerMin + 1.8 * speedMPerMin * grade + 3.5;
    } else {
      // ACSM Running formula: VO2 = 0.2 * S + 0.9 * S * G + 3.5
      vo2 = 0.2 * speedMPerMin + 0.9 * speedMPerMin * grade + 3.5;
    }

    const met = vo2 / 3.5;
    return Math.round(met * weight * hours);
  }

  // Cycling
  if (lowerType.includes('bike') || lowerType.includes('cycle')) {
    let met = 6.8;
    if (speed) {
      if (speed < 16) met = 4.5;
      else if (speed < 20) met = 6.5;
      else if (speed < 25) met = 8.5;
      else met = 11.5;
    }
    return Math.round(met * weight * hours);
  }

  // Default fallback to standard cardio MET
  return estimateCardioCalories(params.cardioType, duration, 'MODERATE', weight);
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
