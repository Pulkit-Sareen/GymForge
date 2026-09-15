import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { WeeklyWorkoutPlan } from '@/types/workout';
import { OnboardingPreferences } from '@/types/onboarding';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { preferences, plan }: { preferences: OnboardingPreferences; plan: WeeklyWorkoutPlan } = body;

    // Ensure default user exists
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Athlete',
          isGuest: true,
        },
      });
    }

    // Upsert UserProfile
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        workoutDaysPerWeek: preferences.workoutDaysPerWeek,
        cardioDaysPerWeek: preferences.cardioDaysPerWeek,
        primaryGoal: preferences.primaryGoal,
        experienceLevel: preferences.experienceLevel,
        availableEquipment: JSON.stringify(preferences.availableEquipment),
        preferredDurationMins: preferences.preferredDurationMinutes,
        cardioPlacement: preferences.cardioPlacement,
        weightUnit: preferences.weightUnit,
        currentWeightKg: preferences.currentWeightKg,
      },
      create: {
        userId: user.id,
        workoutDaysPerWeek: preferences.workoutDaysPerWeek,
        cardioDaysPerWeek: preferences.cardioDaysPerWeek,
        primaryGoal: preferences.primaryGoal,
        experienceLevel: preferences.experienceLevel,
        availableEquipment: JSON.stringify(preferences.availableEquipment),
        preferredDurationMins: preferences.preferredDurationMinutes,
        cardioPlacement: preferences.cardioPlacement,
        weightUnit: preferences.weightUnit,
        currentWeightKg: preferences.currentWeightKg,
      },
    });

    // Keep a single active plan for the user. Without retiring the previous plan,
    // subsequent reads could continue returning an older active routine.
    const savedPlan = await prisma.$transaction(async (tx) => {
      await tx.workoutPlan.updateMany({
        where: { userId: user.id, isActive: true },
        data: { isActive: false },
      });

      return tx.workoutPlan.create({
        data: {
          userId: user.id,
          name: plan.name,
          splitType: plan.splitType,
          isActive: true,
          version: plan.version,
          days: {
            create: plan.days.map((day) => ({
              dayOfWeek: day.dayOfWeek,
              dayName: day.dayName,
              title: day.title,
              focusMuscles: JSON.stringify(day.focusMuscles),
              isCardioDay: day.isCardioDay,
              isRestDay: day.isRestDay,
              sortOrder: day.sortOrder,
              exercises: {
                create: day.exercises.map((pe) => ({
                  exerciseId: pe.exerciseId,
                  orderIndex: pe.orderIndex,
                  targetSets: pe.targetSets,
                  targetRepMin: pe.targetRepMin,
                  targetRepMax: pe.targetRepMax,
                  targetRir: pe.targetRir ?? 2,
                  restSeconds: pe.restSeconds,
                  suggestedWeight: pe.suggestedWeightKg ?? 20,
                })),
              },
            })),
          },
        },
      });
    });

    return NextResponse.json({ success: true, planId: savedPlan.id });
  } catch (error: any) {
    console.error('API Error saving plan:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        plans: {
          where: { isActive: true },
          orderBy: { updatedAt: 'desc' },
          include: {
            days: {
              include: {
                exercises: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.plans.length === 0) {
      return NextResponse.json({ plan: null });
    }

    return NextResponse.json({ plan: user.plans[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
