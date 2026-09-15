import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { StoredSession } from '@/lib/indexeddb';

export async function POST(req: NextRequest) {
  try {
    const session: StoredSession = await req.json();

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Athlete', isGuest: true },
      });
    }

    const saved = await prisma.workoutSession.create({
      data: {
        userId: user.id,
        planDayId: session.planDayId,
        name: session.name,
        status: 'COMPLETED',
        startedAt: new Date(session.startedAt),
        completedAt: new Date(session.completedAt),
        totalDurationSeconds: session.durationSeconds,
        estimatedCalories: session.estimatedCalories,
        exercises: {
          create: session.exercises.map((ex, exIdx) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            orderIndex: exIdx,
            sets: {
              create: ex.sets.map((s, sIdx) => ({
                setNumber: sIdx + 1,
                weightKg: s.weightKg,
                reps: s.reps,
                rir: s.rir ?? 2,
                rpe: s.rpe ?? 8,
                isCompleted: true,
                completedAt: new Date(session.completedAt),
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json({ success: true, sessionId: saved.id });
  } catch (error: any) {
    console.error('API Error saving session:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessions = await prisma.workoutSession.findMany({
      orderBy: { completedAt: 'desc' },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });
    return NextResponse.json({ sessions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
