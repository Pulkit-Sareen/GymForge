'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OnboardingPreferences } from '@/types/onboarding';
import { getPreferences, savePreferences, eraseAllUserData } from '@/lib/indexeddb';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  Settings,
  Scale,
  Smartphone,
  RotateCcw,
  Check,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<OnboardingPreferences | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await getPreferences();
      if (p) setPrefs(p);
    }
    load();
  }, []);

  const handleUnitToggle = async (unit: 'kg' | 'lbs') => {
    if (!prefs) return;
    const updated = { ...prefs, weightUnit: unit };
    setPrefs(updated);
    await savePreferences(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleEraseData = async () => {
    setIsErasing(true);
    try {
      await eraseAllUserData();
      setShowResetModal(false);
      router.push('/onboarding');
    } catch (err) {
      console.error('Failed to erase all user data:', err);
    } finally {
      setIsErasing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-safe space-y-5">
      {/* Header */}
      <div className="pt-1 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            ATHLETE PROFILE
          </span>
          <h1 className="text-2xl font-black tracking-tight text-zinc-100">
            Settings & Preferences
          </h1>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-black">
          GF
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-zinc-100">Gym Athlete</h3>
            <Badge variant="emerald">Local Guest</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Offline-first mode active. Your workouts and PRs are saved locally.
          </p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-cyan-400" />
          Training Configuration
        </h3>

        {prefs ? (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Workout Days:</span>
              <span className="font-bold text-zinc-100">{prefs.workoutDaysPerWeek} Days / week</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Cardio Days:</span>
              <span className="font-bold text-zinc-100">{prefs.cardioDaysPerWeek} Days / week</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Primary Goal:</span>
              <Badge variant="cyan">{prefs.primaryGoal.replace(/_/g, ' ')}</Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Experience Level:</span>
              <span className="font-bold text-zinc-100">{prefs.experienceLevel}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Equipment Setup:</span>
              <span className="font-bold text-zinc-100">{prefs.equipmentPreset.replace(/_/g, ' ')}</span>
            </div>

            {/* Weight Units Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-zinc-400 font-semibold flex items-center gap-1">
                <Scale className="w-4 h-4 text-cyan-400" />
                Weight Units:
              </span>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('kg')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    prefs.weightUnit === 'kg'
                      ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  KG
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('lbs')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    prefs.weightUnit === 'lbs'
                      ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>
            {isSaved && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 justify-end">
                <Check className="w-3.5 h-3.5" /> Unit preference saved
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No profile configuration detected.</p>
        )}
      </div>

      {/* PWA & Install Guide */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Install as App (PWA)
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          You can install GymForge directly to your phone&apos;s home screen for an app experience with offline support:
        </p>
        <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 text-xs text-zinc-300 space-y-1.5">
          <div>
            <span className="font-bold text-cyan-400">iOS (Safari):</span> Tap the Share icon, then select <span className="font-semibold">&quot;Add to Home Screen&quot;</span>.
          </div>
          <div>
            <span className="font-bold text-emerald-400">Android (Chrome):</span> Tap the three dots menu, then select <span className="font-semibold">&quot;Install App&quot;</span>.
          </div>
        </div>
      </div>

      {/* Routine Re-run */}
      <div className="pt-1">
        <Link href="/onboarding" className="block">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="flex items-center justify-center gap-2 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
          >
            <RotateCcw className="w-4 h-4" />
            Re-run Questionnaire & Regenerate Routine
          </Button>
        </Link>
      </div>

      {/* Danger Zone: Erase All Data */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Danger Zone</h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Permanently wipe all stored routines, personal records, history logs, and profile settings from this device. This resets the application completely.
        </p>
        <Button
          variant="danger"
          size="md"
          fullWidth
          onClick={() => setShowResetModal(true)}
          className="flex items-center justify-center gap-2 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-200"
        >
          <Trash2 className="w-4 h-4" />
          Erase All Data & Reset Profile
        </Button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Erase All Data & Reset Profile?"
      >
        <div className="space-y-4 text-zinc-200">
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200 space-y-1">
              <p className="font-bold">This action cannot be undone.</p>
              <p className="text-zinc-400">
                All workout plans, weekly schedules, completed session history, personal records, and questionnaire answers will be completely erased. You will be redirected to the initial onboarding screen.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowResetModal(false)}
              disabled={isErasing}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleEraseData}
              disabled={isErasing}
              className="flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              {isErasing ? 'Erasing Data...' : 'Yes, Erase Everything & Reset'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
