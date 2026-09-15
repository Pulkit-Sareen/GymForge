import { ActiveSetLog, PersonalRecordAchievement } from '@/types/workout';

export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;

  // Epley formula: weight * (1 + reps / 30)
  const epley = weightKg * (1 + reps / 30);
  return Math.round(epley * 10) / 10;
}

export interface HistoricalPR {
  exerciseId: string;
  maxWeightKg: number;
  maxEstimated1RM: number;
}

export function detectPersonalRecords(
  exerciseId: string,
  exerciseName: string,
  completedSets: ActiveSetLog[],
  historicalPR?: HistoricalPR
): PersonalRecordAchievement[] {
  const validSets = completedSets.filter(
    (s) => s.isCompleted && s.weightKg > 0 && s.reps > 0
  );

  if (validSets.length === 0) return [];

  const achievements: PersonalRecordAchievement[] = [];
  const currentMaxWeight = historicalPR ? historicalPR.maxWeightKg : 0;
  const currentMax1RM = historicalPR ? historicalPR.maxEstimated1RM : 0;

  // Find today's peak set by weight
  let bestWeightSet = validSets[0];
  let best1RMSet = validSets[0];
  let best1RMVal = calculateEstimated1RM(best1RMSet.weightKg, best1RMSet.reps);

  for (const set of validSets) {
    if (set.weightKg > bestWeightSet.weightKg) {
      bestWeightSet = set;
    }
    const e1rm = calculateEstimated1RM(set.weightKg, set.reps);
    if (e1rm > best1RMVal) {
      best1RMSet = set;
      best1RMVal = e1rm;
    }
  }

  // Check Max Weight PR
  if (bestWeightSet.weightKg > currentMaxWeight) {
    achievements.push({
      exerciseId,
      exerciseName,
      recordType: 'MAX_WEIGHT',
      weightKg: bestWeightSet.weightKg,
      reps: bestWeightSet.reps,
      estimated1RM: calculateEstimated1RM(bestWeightSet.weightKg, bestWeightSet.reps),
      isNew: currentMaxWeight > 0, // only show "NEW PR" tag if there was a prior record beaten
    });
  }

  // Check 1RM PR
  if (best1RMVal > currentMax1RM && best1RMVal > bestWeightSet.weightKg) {
    // If not redundant with max weight
    const alreadyAdded = achievements.some((a) => a.recordType === 'MAX_WEIGHT' && a.weightKg === best1RMSet.weightKg);
    if (!alreadyAdded) {
      achievements.push({
        exerciseId,
        exerciseName,
        recordType: 'ESTIMATED_1RM',
        weightKg: best1RMSet.weightKg,
        reps: best1RMSet.reps,
        estimated1RM: best1RMVal,
        isNew: currentMax1RM > 0,
      });
    }
  }

  return achievements;
}
