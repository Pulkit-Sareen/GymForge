import { AnatomicalMuscleId } from '@/types/workout';

export interface MuscleMetadata {
  id: AnatomicalMuscleId;
  name: string;
  group: 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Core' | 'Legs';
  view: 'anterior' | 'posterior' | 'both';
  svgRegionIds: string[];
}

export const MUSCLE_METADATA_MAP: Record<AnatomicalMuscleId, MuscleMetadata> = {
  chest_upper: {
    id: 'chest_upper',
    name: 'Upper Chest (Clavicular Head)',
    group: 'Chest',
    view: 'anterior',
    svgRegionIds: ['muscle-chest-upper-left', 'muscle-chest-upper-right'],
  },
  chest_mid: {
    id: 'chest_mid',
    name: 'Middle Chest (Sternal Head)',
    group: 'Chest',
    view: 'anterior',
    svgRegionIds: ['muscle-chest-mid-left', 'muscle-chest-mid-right'],
  },
  chest_lower: {
    id: 'chest_lower',
    name: 'Lower Chest (Costal Head)',
    group: 'Chest',
    view: 'anterior',
    svgRegionIds: ['muscle-chest-lower-left', 'muscle-chest-lower-right'],
  },
  deltoid_anterior: {
    id: 'deltoid_anterior',
    name: 'Front Deltoid',
    group: 'Shoulders',
    view: 'anterior',
    svgRegionIds: ['muscle-delt-front-left', 'muscle-delt-front-right'],
  },
  deltoid_lateral: {
    id: 'deltoid_lateral',
    name: 'Side Deltoid (Lateral)',
    group: 'Shoulders',
    view: 'both',
    svgRegionIds: ['muscle-delt-lat-left', 'muscle-delt-lat-right', 'muscle-post-delt-lat-left', 'muscle-post-delt-lat-right'],
  },
  deltoid_posterior: {
    id: 'deltoid_posterior',
    name: 'Rear Deltoid',
    group: 'Shoulders',
    view: 'posterior',
    svgRegionIds: ['muscle-delt-rear-left', 'muscle-delt-rear-right'],
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps Brachii',
    group: 'Arms',
    view: 'anterior',
    svgRegionIds: ['muscle-bicep-left', 'muscle-bicep-right'],
  },
  triceps_long: {
    id: 'triceps_long',
    name: 'Triceps Long Head',
    group: 'Arms',
    view: 'posterior',
    svgRegionIds: ['muscle-tricep-long-left', 'muscle-tricep-long-right'],
  },
  triceps_lateral: {
    id: 'triceps_lateral',
    name: 'Triceps Lateral/Medial Head',
    group: 'Arms',
    view: 'posterior',
    svgRegionIds: ['muscle-tricep-lat-left', 'muscle-tricep-lat-right'],
  },
  forearms: {
    id: 'forearms',
    name: 'Forearms (Flexors & Extensors)',
    group: 'Arms',
    view: 'both',
    svgRegionIds: ['muscle-forearm-front-left', 'muscle-forearm-front-right', 'muscle-forearm-back-left', 'muscle-forearm-back-right'],
  },
  latissimus_dorsi: {
    id: 'latissimus_dorsi',
    name: 'Lats (Latissimus Dorsi)',
    group: 'Back',
    view: 'posterior',
    svgRegionIds: ['muscle-lat-left', 'muscle-lat-right'],
  },
  trapezius_upper: {
    id: 'trapezius_upper',
    name: 'Traps (Trapezius)',
    group: 'Back',
    view: 'both',
    svgRegionIds: ['muscle-trap-front-left', 'muscle-trap-front-right', 'muscle-trap-back-left', 'muscle-trap-back-right'],
  },
  rhomboids: {
    id: 'rhomboids',
    name: 'Rhomboids & Mid Traps',
    group: 'Back',
    view: 'posterior',
    svgRegionIds: ['muscle-rhomboids-left', 'muscle-rhomboids-right'],
  },
  erector_spinae: {
    id: 'erector_spinae',
    name: 'Lower Back (Erector Spinae)',
    group: 'Back',
    view: 'posterior',
    svgRegionIds: ['muscle-erectors-left', 'muscle-erectors-right'],
  },
  rectus_abdominis: {
    id: 'rectus_abdominis',
    name: 'Abs (Rectus Abdominis)',
    group: 'Core',
    view: 'anterior',
    svgRegionIds: ['muscle-abs-left', 'muscle-abs-right'],
  },
  obliques: {
    id: 'obliques',
    name: 'Obliques',
    group: 'Core',
    view: 'anterior',
    svgRegionIds: ['muscle-oblique-left', 'muscle-oblique-right'],
  },
  quadriceps: {
    id: 'quadriceps',
    name: 'Quadriceps',
    group: 'Legs',
    view: 'anterior',
    svgRegionIds: ['muscle-quad-left', 'muscle-quad-right'],
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Hamstrings',
    group: 'Legs',
    view: 'posterior',
    svgRegionIds: ['muscle-hamstring-left', 'muscle-hamstring-right'],
  },
  gluteus_maximus: {
    id: 'gluteus_maximus',
    name: 'Glutes (Gluteus Maximus)',
    group: 'Legs',
    view: 'posterior',
    svgRegionIds: ['muscle-glute-left', 'muscle-glute-right'],
  },
  gluteus_medius: {
    id: 'gluteus_medius',
    name: 'Gluteus Medius / Hip Abductors',
    group: 'Legs',
    view: 'both',
    svgRegionIds: ['muscle-glute-med-left', 'muscle-glute-med-right'],
  },
  calves_gastrocnemius: {
    id: 'calves_gastrocnemius',
    name: 'Calves (Gastrocnemius)',
    group: 'Legs',
    view: 'both',
    svgRegionIds: ['muscle-calf-front-left', 'muscle-calf-front-right', 'muscle-calf-back-left', 'muscle-calf-back-right'],
  },
  calves_soleus: {
    id: 'calves_soleus',
    name: 'Calves (Soleus)',
    group: 'Legs',
    view: 'posterior',
    svgRegionIds: ['muscle-soleus-left', 'muscle-soleus-right'],
  },
};
