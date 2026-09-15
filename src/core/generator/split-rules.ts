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
