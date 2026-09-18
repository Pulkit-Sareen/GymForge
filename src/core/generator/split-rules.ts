import { AnatomicalMuscleId } from '@/types/workout';

export interface DayTemplate {
  dayName: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  title: string;
  focusMuscles: AnatomicalMuscleId[];
  movementPatterns: string[];
  isCardioDay: boolean;
  isRestDay: boolean;
}

export interface SplitTemplate {
  splitType: string;
  description: string;
  days: DayTemplate[];
}

export const SPLIT_TEMPLATES: Record<number, SplitTemplate> = {
  // 1 DAY SPLIT: Full Body
  1: {
    splitType: 'FULL_BODY_1X',
    description: '1-Day Full Body Comprehensive',
    days: [
      {
        dayName: 'Monday',
        dayOfWeek: 1,
        title: 'Full Body Foundational',
        focusMuscles: ['quadriceps', 'chest_mid', 'latissimus_dorsi', 'hamstrings', 'deltoid_anterior'],
        movementPatterns: ['SQUAT', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'HINGE', 'VERTICAL_PUSH', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Tuesday', dayOfWeek: 2, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Wednesday', dayOfWeek: 3, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Thursday', dayOfWeek: 4, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Friday', dayOfWeek: 5, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Saturday', dayOfWeek: 6, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Sunday', dayOfWeek: 0, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
    ],
  },

  // 2 DAY SPLIT: Full Body A & B
  2: {
    splitType: 'FULL_BODY_2X',
    description: '2-Day Full Body Alternating Split',
    days: [
      {
        dayName: 'Tuesday',
        dayOfWeek: 2,
        title: 'Full Body A (Squat & Push Focus)',
        focusMuscles: ['quadriceps', 'chest_mid', 'rhomboids', 'triceps_lateral', 'calves_gastrocnemius'],
        movementPatterns: ['SQUAT', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'ISOLATION_ARM', 'ISOLATION_LEG'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Wednesday', dayOfWeek: 3, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Thursday', dayOfWeek: 4, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        title: 'Full Body B (Hinge & Pull Focus)',
        focusMuscles: ['hamstrings', 'gluteus_maximus', 'latissimus_dorsi', 'deltoid_anterior', 'biceps'],
        movementPatterns: ['HINGE', 'VERTICAL_PULL', 'VERTICAL_PUSH', 'ISOLATION_ARM', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Saturday', dayOfWeek: 6, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Sunday', dayOfWeek: 0, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Monday', dayOfWeek: 1, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
    ],
  },

  // 3 DAY SPLIT: Full Body 3x (Mon / Wed / Fri)
  3: {
    splitType: 'FULL_BODY_3X',
    description: '3-Day Full Body Classic Split',
    days: [
      {
        dayName: 'Monday',
        dayOfWeek: 1,
        title: 'Full Body 1 (Chest & Quads Focus)',
        focusMuscles: ['quadriceps', 'chest_mid', 'latissimus_dorsi', 'calves_gastrocnemius'],
        movementPatterns: ['SQUAT', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'ISOLATION_DELT', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Tuesday', dayOfWeek: 2, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      {
        dayName: 'Wednesday',
        dayOfWeek: 3,
        title: 'Full Body 2 (Shoulders & Hamstrings Focus)',
        focusMuscles: ['hamstrings', 'gluteus_maximus', 'deltoid_anterior', 'deltoid_lateral', 'biceps'],
        movementPatterns: ['HINGE', 'VERTICAL_PUSH', 'VERTICAL_PULL', 'ISOLATION_ARM', 'ISOLATION_LEG'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Thursday', dayOfWeek: 4, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        title: 'Full Body 3 (Back & Upper Chest Focus)',
        focusMuscles: ['chest_upper', 'latissimus_dorsi', 'rhomboids', 'quadriceps', 'triceps_long'],
        movementPatterns: ['LUNGE', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'ISOLATION_ARM', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Saturday', dayOfWeek: 6, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Sunday', dayOfWeek: 0, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
    ],
  },

  // 4 DAY SPLIT: Upper / Lower / Upper / Lower
  4: {
    splitType: 'UPPER_LOWER_4X',
    description: '4-Day Upper / Lower Split',
    days: [
      {
        dayName: 'Monday',
        dayOfWeek: 1,
        title: 'Upper Body A (Horizontal Focus)',
        focusMuscles: ['chest_mid', 'latissimus_dorsi', 'deltoid_lateral', 'triceps_lateral', 'biceps'],
        movementPatterns: ['HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'ISOLATION_DELT', 'ISOLATION_ARM', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Tuesday',
        dayOfWeek: 2,
        title: 'Lower Body A (Squat & Quad Focus)',
        focusMuscles: ['quadriceps', 'gluteus_maximus', 'hamstrings', 'calves_gastrocnemius', 'rectus_abdominis'],
        movementPatterns: ['SQUAT', 'HINGE', 'ISOLATION_LEG', 'ISOLATION_LEG', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Wednesday', dayOfWeek: 3, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      {
        dayName: 'Thursday',
        dayOfWeek: 4,
        title: 'Upper Body B (Vertical Focus)',
        focusMuscles: ['chest_upper', 'deltoid_anterior', 'latissimus_dorsi', 'deltoid_posterior', 'triceps_long'],
        movementPatterns: ['VERTICAL_PUSH', 'VERTICAL_PULL', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        title: 'Lower Body B (Hinge & Hamstring Focus)',
        focusMuscles: ['hamstrings', 'gluteus_maximus', 'quadriceps', 'calves_soleus', 'rectus_abdominis'],
        movementPatterns: ['HINGE', 'LUNGE', 'ISOLATION_LEG', 'ISOLATION_LEG', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Saturday', dayOfWeek: 6, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      { dayName: 'Sunday', dayOfWeek: 0, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
    ],
  },

  // 5 DAY SPLIT: Upper / Lower / Push / Pull / Legs (UL-PPL)
  5: {
    splitType: 'UL_PPL_5X',
    description: '5-Day Upper/Lower + Push/Pull/Legs Hybrid',
    days: [
      {
        dayName: 'Monday',
        dayOfWeek: 1,
        title: 'Upper Body Power',
        focusMuscles: ['chest_mid', 'latissimus_dorsi', 'deltoid_anterior', 'rhomboids'],
        movementPatterns: ['HORIZONTAL_PUSH', 'VERTICAL_PULL', 'VERTICAL_PUSH', 'HORIZONTAL_PULL'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Tuesday',
        dayOfWeek: 2,
        title: 'Lower Body Power',
        focusMuscles: ['quadriceps', 'hamstrings', 'gluteus_maximus', 'calves_gastrocnemius'],
        movementPatterns: ['SQUAT', 'HINGE', 'ISOLATION_LEG', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Wednesday', dayOfWeek: 3, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
      {
        dayName: 'Thursday',
        dayOfWeek: 4,
        title: 'Push (Chest, Shoulders & Triceps)',
        focusMuscles: ['chest_mid', 'chest_upper', 'deltoid_lateral', 'triceps_long'],
        movementPatterns: ['HORIZONTAL_PUSH', 'VERTICAL_PUSH', 'ISOLATION_DELT', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        title: 'Pull (Back, Rear Delts & Biceps)',
        focusMuscles: ['latissimus_dorsi', 'rhomboids', 'deltoid_posterior', 'biceps'],
        movementPatterns: ['VERTICAL_PULL', 'HORIZONTAL_PULL', 'HORIZONTAL_PULL', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Saturday',
        dayOfWeek: 6,
        title: 'Legs & Core Hypertrophy',
        focusMuscles: ['quadriceps', 'hamstrings', 'gluteus_maximus', 'rectus_abdominis'],
        movementPatterns: ['LUNGE', 'HINGE', 'ISOLATION_LEG', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Sunday', dayOfWeek: 0, title: 'Rest & Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
    ],
  },

  // 6 DAY SPLIT: Push / Pull / Legs (PPL x 2)
  6: {
    splitType: 'PPL_6X',
    description: '6-Day Push / Pull / Legs High-Frequency Split',
    days: [
      {
        dayName: 'Monday',
        dayOfWeek: 1,
        title: 'Push A (Chest & Triceps Focus)',
        focusMuscles: ['chest_mid', 'chest_upper', 'deltoid_anterior', 'triceps_long'],
        movementPatterns: ['HORIZONTAL_PUSH', 'VERTICAL_PUSH', 'HORIZONTAL_PUSH', 'ISOLATION_DELT', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Tuesday',
        dayOfWeek: 2,
        title: 'Pull A (Lats & Biceps Focus)',
        focusMuscles: ['latissimus_dorsi', 'rhomboids', 'deltoid_posterior', 'biceps'],
        movementPatterns: ['VERTICAL_PULL', 'HORIZONTAL_PULL', 'HORIZONTAL_PULL', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Wednesday',
        dayOfWeek: 3,
        title: 'Legs A (Squat & Quad Focus)',
        focusMuscles: ['quadriceps', 'gluteus_maximus', 'hamstrings', 'calves_gastrocnemius'],
        movementPatterns: ['SQUAT', 'LUNGE', 'ISOLATION_LEG', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Thursday',
        dayOfWeek: 4,
        title: 'Push B (Shoulders & Incline Focus)',
        focusMuscles: ['deltoid_anterior', 'chest_upper', 'deltoid_lateral', 'triceps_lateral'],
        movementPatterns: ['VERTICAL_PUSH', 'HORIZONTAL_PUSH', 'ISOLATION_DELT', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        title: 'Pull B (Upper Back & Rows Focus)',
        focusMuscles: ['rhomboids', 'latissimus_dorsi', 'erector_spinae', 'biceps'],
        movementPatterns: ['HORIZONTAL_PULL', 'VERTICAL_PULL', 'ISOLATION_ARM', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Saturday',
        dayOfWeek: 6,
        title: 'Legs B (Deadlift & Hamstring Focus)',
        focusMuscles: ['hamstrings', 'gluteus_maximus', 'quadriceps', 'calves_soleus'],
        movementPatterns: ['HINGE', 'ISOLATION_LEG', 'ISOLATION_LEG', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      { dayName: 'Sunday', dayOfWeek: 0, title: 'Rest & Active Recovery', focusMuscles: [], movementPatterns: [], isCardioDay: false, isRestDay: true },
    ],
  },

  // 7 DAY SPLIT: 5 Lift Days + 2 Dedicated Active Cardio/Recovery Days
  7: {
    splitType: 'HYBRID_7X',
    description: '7-Day High Consistency Routine (5 Lift + 2 Cardio Days)',
    days: [
      {
        dayName: 'Monday',
        dayOfWeek: 1,
        title: 'Upper Body Push',
        focusMuscles: ['chest_mid', 'deltoid_anterior', 'triceps_long'],
        movementPatterns: ['HORIZONTAL_PUSH', 'VERTICAL_PUSH', 'ISOLATION_DELT', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Tuesday',
        dayOfWeek: 2,
        title: 'Upper Body Pull',
        focusMuscles: ['latissimus_dorsi', 'rhomboids', 'biceps'],
        movementPatterns: ['VERTICAL_PULL', 'HORIZONTAL_PULL', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Wednesday',
        dayOfWeek: 3,
        title: 'Active Cardio & Conditioning',
        focusMuscles: ['calves_gastrocnemius', 'gluteus_maximus'],
        movementPatterns: ['CARDIO', 'CORE'],
        isCardioDay: true,
        isRestDay: false,
      },
      {
        dayName: 'Thursday',
        dayOfWeek: 4,
        title: 'Lower Body Strength',
        focusMuscles: ['quadriceps', 'gluteus_maximus', 'hamstrings'],
        movementPatterns: ['SQUAT', 'HINGE', 'ISOLATION_LEG'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        title: 'Upper Body Hypertrophy',
        focusMuscles: ['chest_upper', 'latissimus_dorsi', 'deltoid_lateral'],
        movementPatterns: ['HORIZONTAL_PUSH', 'VERTICAL_PULL', 'ISOLATION_DELT', 'ISOLATION_ARM'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Saturday',
        dayOfWeek: 6,
        title: 'Lower Body & Core Hypertrophy',
        focusMuscles: ['hamstrings', 'quadriceps', 'rectus_abdominis'],
        movementPatterns: ['LUNGE', 'ISOLATION_LEG', 'CORE'],
        isCardioDay: false,
        isRestDay: false,
      },
      {
        dayName: 'Sunday',
        dayOfWeek: 0,
        title: 'Dedicated Cardio & Recovery',
        focusMuscles: [],
        movementPatterns: ['CARDIO'],
        isCardioDay: true,
        isRestDay: false,
      },
    ],
  },
};

export const INDIVIDUAL_MUSCLE_SETS: Record<string, { name: string; muscles: AnatomicalMuscleId[]; patterns: string[] }> = {
  chest: {
    name: 'Chest',
    muscles: ['chest_mid', 'chest_upper', 'chest_lower'],
    patterns: ['HORIZONTAL_PUSH', 'HORIZONTAL_PUSH', 'HORIZONTAL_PUSH'],
  },
  back: {
    name: 'Back',
    muscles: ['latissimus_dorsi', 'rhomboids', 'erector_spinae', 'trapezius_upper'],
    patterns: ['VERTICAL_PULL', 'HORIZONTAL_PULL', 'HORIZONTAL_PULL'],
  },
  shoulders: {
    name: 'Shoulders',
    muscles: ['deltoid_anterior', 'deltoid_lateral', 'deltoid_posterior'],
    patterns: ['VERTICAL_PUSH', 'ISOLATION_DELT', 'ISOLATION_DELT'],
  },
  arms: {
    name: 'Arms (Biceps & Triceps)',
    muscles: ['biceps', 'triceps_long', 'triceps_lateral', 'forearms'],
    patterns: ['ISOLATION_ARM', 'ISOLATION_ARM', 'ISOLATION_ARM', 'ISOLATION_ARM'],
  },
  legs: {
    name: 'Legs',
    muscles: ['quadriceps', 'hamstrings', 'gluteus_maximus', 'calves_gastrocnemius'],
    patterns: ['SQUAT', 'HINGE', 'ISOLATION_LEG', 'ISOLATION_LEG'],
  },
  abs: {
    name: 'Abs & Core',
    muscles: ['rectus_abdominis', 'obliques'],
    patterns: ['CORE', 'CORE', 'CORE'],
  },
};

export const PRESET_WORKOUT_SPLITS = [
  { key: 'FULL_BODY', name: 'Full Body', desc: 'Chest, Back, Quads, Hamstrings & Core' },
  { key: 'UPPER_BODY', name: 'Upper Body', desc: 'Chest, Back, Shoulders & Arms' },
  { key: 'LOWER_BODY', name: 'Lower Body', desc: 'Quads, Hamstrings, Glutes & Calves' },
  { key: 'CHEST', name: 'Chest Only', desc: 'Horizontal Push & Upper/Lower Pecs' },
  { key: 'BACK', name: 'Back Only', desc: 'Lats, Rhomboids, Traps & Rows' },
  { key: 'SHOULDERS', name: 'Shoulders Only', desc: 'Front, Lateral & Rear Delts' },
  { key: 'ARMS', name: 'Arms Only', desc: 'Biceps, Triceps & Forearms' },
  { key: 'LEGS', name: 'Legs Only', desc: 'Squats, Hinges, Quad & Hamstring curls' },
  { key: 'ABS', name: 'Abs / Core', desc: 'Direct abdominal & oblique training' },
  { key: 'CHEST_TRICEPS', name: 'Chest + Triceps', desc: 'Pectoral pressing paired with tricep extensions' },
  { key: 'BACK_BICEPS', name: 'Back + Biceps', desc: 'Pulling movements paired with bicep curls' },
  { key: 'CHEST_BACK', name: 'Chest + Back', desc: 'Classic antagonistic push-pull pairing' },
  { key: 'SHOULDERS_ARMS', name: 'Shoulders + Arms', desc: 'Complete upper body arm & delt focus' },
  { key: 'LEGS_ABS', name: 'Legs + Abs', desc: 'Lower body paired with core conditioning' },
];

export function getMusclesAndPatternsForSelection(
  selection: string,
  pairSecondary?: string
): { title: string; muscles: AnatomicalMuscleId[]; patterns: string[] } {
  // If user combined two single muscles together:
  if (pairSecondary && INDIVIDUAL_MUSCLE_SETS[selection] && INDIVIDUAL_MUSCLE_SETS[pairSecondary]) {
    const setA = INDIVIDUAL_MUSCLE_SETS[selection];
    const setB = INDIVIDUAL_MUSCLE_SETS[pairSecondary];
    return {
      title: `${setA.name} + ${setB.name}`,
      muscles: Array.from(new Set([...setA.muscles, ...setB.muscles])),
      patterns: [...setA.patterns.slice(0, 3), ...setB.patterns.slice(0, 3)],
    };
  }

  switch (selection) {
    case 'FULL_BODY':
      return {
        title: 'Full Body',
        muscles: ['quadriceps', 'chest_mid', 'latissimus_dorsi', 'hamstrings', 'rectus_abdominis'],
        patterns: ['SQUAT', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'HINGE', 'CORE'],
      };
    case 'UPPER_BODY':
      return {
        title: 'Upper Body',
        muscles: ['chest_mid', 'latissimus_dorsi', 'deltoid_lateral', 'triceps_long', 'biceps'],
        patterns: ['HORIZONTAL_PUSH', 'VERTICAL_PULL', 'HORIZONTAL_PULL', 'ISOLATION_DELT', 'ISOLATION_ARM'],
      };
    case 'LOWER_BODY':
      return {
        title: 'Lower Body',
        muscles: ['quadriceps', 'hamstrings', 'gluteus_maximus', 'calves_gastrocnemius'],
        patterns: ['SQUAT', 'HINGE', 'LUNGE', 'ISOLATION_LEG', 'ISOLATION_LEG'],
      };
    case 'CHEST_TRICEPS':
      return {
        title: 'Chest + Triceps',
        muscles: ['chest_mid', 'chest_upper', 'triceps_long', 'triceps_lateral'],
        patterns: ['HORIZONTAL_PUSH', 'HORIZONTAL_PUSH', 'HORIZONTAL_PUSH', 'ISOLATION_ARM', 'ISOLATION_ARM'],
      };
    case 'BACK_BICEPS':
      return {
        title: 'Back + Biceps',
        muscles: ['latissimus_dorsi', 'rhomboids', 'biceps', 'forearms'],
        patterns: ['VERTICAL_PULL', 'HORIZONTAL_PULL', 'HORIZONTAL_PULL', 'ISOLATION_ARM', 'ISOLATION_ARM'],
      };
    case 'CHEST_BACK':
      return {
        title: 'Chest + Back',
        muscles: ['chest_mid', 'chest_upper', 'latissimus_dorsi', 'rhomboids'],
        patterns: ['HORIZONTAL_PUSH', 'VERTICAL_PULL', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL'],
      };
    case 'SHOULDERS_ARMS':
      return {
        title: 'Shoulders + Arms',
        muscles: ['deltoid_anterior', 'deltoid_lateral', 'deltoid_posterior', 'biceps', 'triceps_long'],
        patterns: ['VERTICAL_PUSH', 'ISOLATION_DELT', 'ISOLATION_ARM', 'ISOLATION_ARM'],
      };
    case 'LEGS_ABS':
      return {
        title: 'Legs + Abs',
        muscles: ['quadriceps', 'hamstrings', 'gluteus_maximus', 'rectus_abdominis', 'obliques'],
        patterns: ['SQUAT', 'HINGE', 'ISOLATION_LEG', 'CORE', 'CORE'],
      };
    default:
      if (INDIVIDUAL_MUSCLE_SETS[selection.toLowerCase()]) {
        const s = INDIVIDUAL_MUSCLE_SETS[selection.toLowerCase()];
        return {
          title: s.name,
          muscles: s.muscles,
          patterns: s.patterns,
        };
      }
      return {
        title: 'Custom Focus',
        muscles: ['chest_mid', 'latissimus_dorsi'],
        patterns: ['HORIZONTAL_PUSH', 'HORIZONTAL_PULL'],
      };
  }
}

