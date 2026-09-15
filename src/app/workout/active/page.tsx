'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ActiveWorkoutView } from '@/components/workout/ActiveWorkoutView';
import { getCurrentPlan } from '@/lib/indexeddb';
import { PlannedWorkoutDay } from '@/types/workout';

function ActiveWorkoutWrapper() {
  const searchParams = useSearchParams();
  const dayId = searchParams.get('dayId');
  const [initialPlanDay, setInitialPlanDay] = useState<PlannedWorkoutDay | undefined>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function load() {
      const plan = await getCurrentPlan();
      if (plan) {
        if (dayId) {
          const found = plan.days.find((d) => d.id === dayId);
          setInitialPlanDay(found);
        } else {
          // Default to today's day of week
          const currentDow = new Date().getDay();
          const found = plan.days.find((d) => d.dayOfWeek === currentDow) || plan.days[0];
          setInitialPlanDay(found);
        }
      }
      setIsReady(true);
    }
    load();
  }, [dayId]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <ActiveWorkoutView initialPlanDay={initialPlanDay} />;
}

export default function ActiveWorkoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ActiveWorkoutWrapper />
    </Suspense>
  );
}
