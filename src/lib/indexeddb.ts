import Dexie, { type Table } from 'dexie';
import {
  WeeklyWorkoutPlan,
  ActiveWorkoutState,
  CompletedWorkoutSummary,
  PersonalRecordAchievement,
} from '@/types/workout';
import { OnboardingPreferences } from '@/types/onboarding';

export interface StoredSession {
  id: string;
  planDayId?: string;
  name: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  estimatedCalories: number;
  rpeOverall?: number;
  notes?: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: { weightKg: number; reps: number; rir?: number; rpe?: number }[];
  }[];
  synced: boolean;
}

export interface SyncOutboxItem {
  id: string;
  action: 'CREATE_SESSION' | 'UPDATE_PLAN' | 'UPDATE_PROFILE';
  payload: any;
  createdAt: string;
}

export class GymDatabase extends Dexie {
  plans!: Table<WeeklyWorkoutPlan, string>;
  activeSession!: Table<ActiveWorkoutState, string>;
  sessions!: Table<StoredSession, string>;
  userProfile!: Table<OnboardingPreferences & { id: string }, string>;
  personalRecords!: Table<PersonalRecordAchievement & { id: string }, string>;
  syncOutbox!: Table<SyncOutboxItem, string>;

  constructor() {
    super('GymPlannerDB');
    this.version(1).stores({
      plans: 'id, splitType, updatedAt',
      activeSession: 'id, startedAt, status',
      sessions: 'id, startedAt, completedAt, synced',
      userProfile: 'id',
      personalRecords: 'id, exerciseId, recordType, achievedAt',
      syncOutbox: 'id, action, createdAt',
    });
  }
}

export const db = new GymDatabase();

// Offline & Active Workout Persistence Helpers
export async function getActiveWorkout(): Promise<ActiveWorkoutState | undefined> {
  const active = await db.activeSession.where('status').equals('IN_PROGRESS').first();
  return active;
}

export async function saveActiveWorkout(state: ActiveWorkoutState): Promise<void> {
  await db.activeSession.put(state);
}

export async function clearActiveWorkout(id: string): Promise<void> {
  await db.activeSession.delete(id);
}

export async function saveCompletedSession(summary: StoredSession): Promise<void> {
  await db.sessions.put(summary);
  // Add to sync queue
  await db.syncOutbox.put({
    id: `sync-${summary.id}`,
    action: 'CREATE_SESSION',
    payload: summary,
    createdAt: new Date().toISOString(),
  });
}

export async function getCompletedSessions(): Promise<StoredSession[]> {
  return await db.sessions.orderBy('completedAt').reverse().toArray();
}

export async function saveCurrentPlan(plan: WeeklyWorkoutPlan): Promise<void> {
  // A generated routine replaces the previous routine. Keeping historical plans in
  // this table meant getCurrentPlan() could return the very first plan after a
  // questionnaire re-run.
  await db.transaction('rw', db.plans, async () => {
    await db.plans.clear();
    await db.plans.put(plan);
  });
}

export async function getCurrentPlan(): Promise<WeeklyWorkoutPlan | undefined> {
  return db.plans.orderBy('updatedAt').reverse().first();
}

export async function savePreferences(prefs: OnboardingPreferences): Promise<void> {
  await db.userProfile.put({ ...prefs, id: 'current_user_profile' });
}

export async function getPreferences(): Promise<OnboardingPreferences | undefined> {
  const profile = await db.userProfile.get('current_user_profile');
  return profile;
}
