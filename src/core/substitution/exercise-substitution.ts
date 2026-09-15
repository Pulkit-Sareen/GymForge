import { ExerciseDefinition, EquipmentType } from '@/types/workout';
import { EXERCISE_LIBRARY } from '@/data/exercises';

export interface ExerciseSubstitutionMatch {
  exercise: ExerciseDefinition;
  score: number;
  matchReasons: string[];
}

export function findExerciseSubstitutions(
  targetExercise: ExerciseDefinition,
  availableEquipment: EquipmentType[],
  currentWorkoutExerciseIds: string[] = [],
  library: ExerciseDefinition[] = EXERCISE_LIBRARY,
  limit: number = 3
): ExerciseSubstitutionMatch[] {
  const equipSet = new Set(availableEquipment);
  const currentWorkoutSet = new Set(currentWorkoutExerciseIds);

  const scoredList: ExerciseSubstitutionMatch[] = [];

  for (const candidate of library) {
    // Cannot substitute with itself
    if (candidate.id === targetExercise.id) continue;

    // Check equipment compatibility
    const hasEquipment = candidate.equipmentRequired.every((eq) =>
      equipSet.has(eq)
    );
    if (!hasEquipment) continue;

    let score = 0;
    const matchReasons: string[] = [];

    // 1. Movement Pattern Match (30 pts)
    if (candidate.movementPattern === targetExercise.movementPattern) {
      score += 30;
      matchReasons.push('Identical movement pattern');
    }

    // 2. Primary Muscle Overlap (up to 35 pts)
    const targetPrimarySet = new Set(targetExercise.primaryMuscles);
    const candidatePrimarySet = new Set(candidate.primaryMuscles);
    const primaryIntersection = candidate.primaryMuscles.filter((m) =>
      targetPrimarySet.has(m)
    );

    if (primaryIntersection.length > 0) {
      const primaryJaccard =
        primaryIntersection.length /
        new Set([...targetExercise.primaryMuscles, ...candidate.primaryMuscles]).size;
      const primaryScore = Math.round(primaryJaccard * 35);
      score += primaryScore;
      matchReasons.push(`Shares primary muscle focus (${primaryIntersection.join(', ')})`);
    }

    // 3. Secondary Muscle Overlap (up to 15 pts)
    const targetSecondarySet = new Set(targetExercise.secondaryMuscles);
    const secondaryIntersection = candidate.secondaryMuscles.filter((m) =>
      targetSecondarySet.has(m)
    );
    if (secondaryIntersection.length > 0) {
      score += 10;
    }

    // 4. Equipment variation (10 pts)
    const usesDifferentEquipment = !candidate.equipmentRequired.every((eq) =>
      targetExercise.equipmentRequired.includes(eq)
    );
    if (usesDifferentEquipment) {
      score += 10;
      matchReasons.push(`Uses ${candidate.equipmentRequired.join('/')}`);
    }

    // 5. Difficulty alignment (10 pts)
    if (candidate.difficulty === targetExercise.difficulty) {
      score += 10;
    }

    // 6. Penalty if already in today's workout (-60 pts)
    if (currentWorkoutSet.has(candidate.id)) {
      score -= 60;
    }

    if (score > 20) {
      scoredList.push({
        exercise: candidate,
        score,
        matchReasons: matchReasons.slice(0, 2),
      });
    }
  }

  // Sort descending by score and return top results
  return scoredList.sort((a, b) => b.score - a.score).slice(0, limit);
}
