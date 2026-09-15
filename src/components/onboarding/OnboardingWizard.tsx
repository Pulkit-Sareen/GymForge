'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  GoalType,
  ExperienceLevel,
  CardioPlacement,
  EquipmentPreset,
  EquipmentType,
} from '@/types/workout';
import { OnboardingPreferences, DEFAULT_ONBOARDING_PREFERENCES } from '@/types/onboarding';
import { generateWeeklyPlan } from '@/core/generator/routine-generator';
import { getPreferences, saveCurrentPlan, savePreferences } from '@/lib/indexeddb';
import {
  Flame,
  Dumbbell,
  Clock,
  HeartPulse,
  Award,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 7;

  const [prefs, setPrefs] = useState<OnboardingPreferences>(DEFAULT_ONBOARDING_PREFERENCES);
  const [isGenerating, setIsGenerating] = useState(false);

  // Re-running the questionnaire should start from the user's last answers,
  // while still allowing every answer to be changed.
  useEffect(() => {
    getPreferences()
      .then((savedPreferences) => {
        if (savedPreferences) setPrefs(savedPreferences);
      })
      .catch((error) => console.warn('Unable to restore saved preferences:', error));
  }, []);

  const update = <K extends keyof OnboardingPreferences>(key: K, value: OnboardingPreferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleEquipmentPresetChange = (preset: EquipmentPreset) => {
    let eq: EquipmentType[] = [];
    if (preset === 'FULL_GYM') {
      eq = ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BENCH', 'PULLUP_BAR', 'BODYWEIGHT', 'CARDIO_MACHINE'];
    } else if (preset === 'BASIC_GYM') {
      eq = ['DUMBBELL', 'BENCH', 'CABLE', 'BODYWEIGHT', 'CARDIO_MACHINE'];
    } else if (preset === 'HOME_GYM') {
      eq = ['DUMBBELL', 'BENCH', 'BODYWEIGHT'];
    } else if (preset === 'BODYWEIGHT') {
      eq = ['BODYWEIGHT', 'PULLUP_BAR'];
    }
    setPrefs((prev) => ({ ...prev, equipmentPreset: preset, availableEquipment: eq }));
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      // 1. Generate customized deterministic weekly plan
      const plan = generateWeeklyPlan(prefs);

      // 2. Persist locally to IndexedDB for offline access
      await savePreferences(prefs);
      await saveCurrentPlan(plan);

      // 3. Optional server sync
      try {
        const response = await fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: prefs, plan }),
        });
        if (!response.ok) {
          throw new Error('Server could not sync the regenerated plan');
        }
      } catch (err) {
        console.warn('Local-first mode active: Server sync deferred', err);
      }

      // 4. Navigate to dashboard
      router.push('/');
    } catch (e) {
      console.error('Error generating plan:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 max-w-lg mx-auto">
      {/* Top Header & Progress Bar */}
      <div>
        <div className="flex items-center justify-between py-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-100">
              Personalized Routine
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-6 border border-zinc-800/80">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step 1: Workout Days Per Week */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
                How many days per week will you lift?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                We design your split (Full Body, Upper/Lower, or PPL) around your availability.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { days: 2, label: '2 Days', desc: 'Full Body A/B' },
                { days: 3, label: '3 Days', desc: 'Full Body 3x' },
                { days: 4, label: '4 Days', desc: 'Upper / Lower' },
                { days: 5, label: '5 Days', desc: 'Upper/Lower + PPL' },
                { days: 6, label: '6 Days', desc: 'Push / Pull / Legs' },
                { days: 1, label: '1 Day', desc: 'Single Full Body' },
              ].map((item) => {
                const isSelected = prefs.workoutDaysPerWeek === item.days;
                return (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => update('workoutDaysPerWeek', item.days)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-zinc-100">{item.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <span className="text-[11px] text-zinc-400 block mt-1">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Cardio Days */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
                Cardio sessions per week?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Maintain aerobic conditioning and cardiovascular endurance.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { count: 0, title: '0 Sessions', desc: 'Strictly weight training' },
                { count: 1, title: '1 Session / week', desc: 'Light conditioning' },
                { count: 2, title: '2 Sessions / week', desc: 'Recommended heart-health balance' },
                { count: 3, title: '3 Sessions / week', desc: 'Fat loss & stamina boost' },
                { count: 4, title: '4+ Sessions / week', desc: 'High aerobic volume' },
              ].map((item) => {
                const isSelected = prefs.cardioDaysPerWeek === item.count;
                return (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => update('cardioDaysPerWeek', item.count)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-base font-bold text-zinc-100 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-400">{item.desc}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Primary Goal */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
                What is your primary goal?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Sets, reps, rest intervals, and volume are calibrated to this goal.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { goal: 'MUSCLE_GAIN' as GoalType, title: 'Muscle Gain (Hypertrophy)', desc: '8-12 rep range, 3-4 sets, optimal hypertrophy volume' },
                { goal: 'STRENGTH' as GoalType, title: 'Strength & Power', desc: '3-6 rep heavy compounds, 2.5-3 min rest, high neural drive' },
                { goal: 'FAT_LOSS' as GoalType, title: 'Fat Loss', desc: '10-15 reps, shorter rest intervals, elevated calorie burn' },
                { goal: 'BODY_RECOMPOSITION' as GoalType, title: 'Body Recomposition', desc: 'Build lean mass while dropping body fat simultaneously' },
                { goal: 'GENERAL_FITNESS' as GoalType, title: 'General Fitness & Health', desc: 'Balanced functional strength, mobility, and vitality' },
                { goal: 'ATHLETIC_PERFORMANCE' as GoalType, title: 'Athletic Performance', desc: 'Explosive power, structural balance, and stamina' },
              ].map((item) => {
                const isSelected = prefs.primaryGoal === item.goal;
                return (
                  <button
                    key={item.goal}
                    type="button"
                    onClick={() => update('primaryGoal', item.goal)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-zinc-100 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-400">{item.desc}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Experience Level */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
                Your experience level?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Tunes progression rate, exercise complexity, and starting weight suggestions.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  level: 'BEGINNER' as ExperienceLevel,
                  title: 'Beginner',
                  desc: '< 1 year of consistent lifting. Fast linear progression with clear form cues.',
                },
                {
                  level: 'INTERMEDIATE' as ExperienceLevel,
                  title: 'Intermediate',
                  desc: '1–3 years consistent lifting. Mastered compound technique; ready for double progression.',
                },
                {
                  level: 'ADVANCED' as ExperienceLevel,
                  title: 'Advanced',
                  desc: '3+ years. High volume tolerance, RIR autoregulation, periodized intensity.',
                },
              ].map((item) => {
                const isSelected = prefs.experienceLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => update('experienceLevel', item.level)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-base font-bold text-zinc-100 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-400">{item.desc}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Equipment Availability */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
                Available equipment?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Every generated movement will be strictly performable with your setup.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  preset: 'FULL_GYM' as EquipmentPreset,
                  title: 'Full Commercial Gym',
                  desc: 'Barbells, dumbbells, cables, machines, benches, squat racks.',
                },
                {
                  preset: 'BASIC_GYM' as EquipmentPreset,
                  title: 'Basic Gym / Apartment Gym',
                  desc: 'Dumbbells, basic cable station, flat/incline bench.',
                },
                {
                  preset: 'HOME_GYM' as EquipmentPreset,
                  title: 'Home Gym (Dumbbells Only)',
                  desc: 'Pair of adjustable dumbbells and bench/floor space.',
                },
                {
                  preset: 'BODYWEIGHT' as EquipmentPreset,
                  title: 'Bodyweight / Calisthenics',
                  desc: 'Push-ups, pull-up bar, bodyweight squats & dips.',
                },
              ].map((item) => {
                const isSelected = prefs.equipmentPreset === item.preset;
                return (
                  <button
                    key={item.preset}
                    type="button"
                    onClick={() => handleEquipmentPresetChange(item.preset)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-base font-bold text-zinc-100 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-400">{item.desc}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Preferred Duration & Weight Unit */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
                Session duration & units
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                We fit the optimal exercise volume into your gym window.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Workout Duration
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[30, 45, 60, 75, 90].map((mins) => {
                  const isSelected = prefs.preferredDurationMinutes === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => update('preferredDurationMinutes', mins)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-lg block">{mins}</span>
                      <span className="text-[10px] text-zinc-500">minutes</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-zinc-900">
                <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                  Weight Units
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['kg', 'lbs'] as const).map((unit) => {
                    const isSelected = prefs.weightUnit === unit;
                    return (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => update('weightUnit', unit)}
                        className={`p-3 rounded-2xl border text-center font-bold text-base transition-all ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {unit.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Cardio Placement & Confirmation */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
                Cardio placement preference
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                How should cardio be integrated with your lifting days?
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  placement: 'POST_WORKOUT' as CardioPlacement,
                  title: 'After Workouts (15–20 min)',
                  desc: 'Keep rest days 100% free; finish lifting with cardio conditioning.',
                },
                {
                  placement: 'SEPARATE_DAYS' as CardioPlacement,
                  title: 'Separate Dedicated Days',
                  desc: 'Dedicate 1-2 rest days to pure aerobic stamina and recovery.',
                },
                {
                  placement: 'FLEXIBLE' as CardioPlacement,
                  title: 'Flexible / Automatic',
                  desc: 'Distribute cardio smoothly without hampering leg day recovery.',
                },
              ].map((item) => {
                const isSelected = prefs.cardioPlacement === item.placement;
                return (
                  <button
                    key={item.placement}
                    type="button"
                    onClick={() => update('cardioPlacement', item.placement)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-zinc-100 block">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-400">{item.desc}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="pt-6 border-t border-zinc-900 flex items-center justify-between gap-3">
        {step > 1 ? (
          <Button
            variant="secondary"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1 px-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <Button
            variant="primary"
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-1 px-6 ml-auto"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleFinish}
            disabled={isGenerating}
            className="flex items-center gap-2 px-8 ml-auto font-bold bg-gradient-to-r from-cyan-500 to-emerald-400 text-zinc-950"
          >
            {isGenerating ? (
              <span>Building Routine...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-zinc-950" />
                Generate My Workout Plan
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
