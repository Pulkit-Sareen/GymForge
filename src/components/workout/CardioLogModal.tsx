'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { calculateAdvancedCardioCalories } from '@/core/calories/calorie-calculator';
import { db, StoredSession, getPreferences } from '@/lib/indexeddb';
import { Flame, Activity, Gauge, Timer, Mountain, Check, ArrowRight } from 'lucide-react';

interface CardioLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (session: StoredSession) => void;
}

const CARDIO_TYPES = [
  { id: 'Treadmill / Walk', name: 'Treadmill Walk', icon: '🚶‍♂️', hasIncline: true },
  { id: 'Outdoor Walk', name: 'Outdoor Walk', icon: '🌲', hasIncline: false },
  { id: 'Running / Jogging', name: 'Running / Jogging', icon: '🏃‍♂️', hasIncline: true },
  { id: 'Stationary Bike', name: 'Cycling / Stationary Bike', icon: '🚴‍♂️', hasIncline: false },
  { id: 'Elliptical', name: 'Elliptical Trainer', icon: '⚡', hasIncline: true },
  { id: 'Stairmaster', name: 'Stairmaster / Stepper', icon: '🪜', hasIncline: false },
  { id: 'Rowing Machine', name: 'Rowing Machine', icon: '🚣', hasIncline: false },
  { id: 'Jump Rope', name: 'Jump Rope', icon: '🪢', hasIncline: false },
];

export const CardioLogModal: React.FC<CardioLogModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [cardioType, setCardioType] = useState('Treadmill / Walk');
  const [inputMode, setInputMode] = useState<'machine' | 'direct' | 'quick'>('machine');

  // Input states
  const [durationMins, setDurationMins] = useState<number>(30);
  const [distanceKm, setDistanceKm] = useState<number>(3.0);
  const [speedKmh, setSpeedKmh] = useState<number>(6.0);
  const [inclinePercent, setInclinePercent] = useState<number>(4.0);
  const [directCalories, setDirectCalories] = useState<number>(220);
  const [quickIntensity, setQuickIntensity] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'HIIT'>('MODERATE');
  const [userWeightKg, setUserWeightKg] = useState<number>(75);
  const [isSaving, setIsSaving] = useState(false);

  // Load user bodyweight from preferences if available
  useEffect(() => {
    async function loadWeight() {
      const prefs = await getPreferences();
      if (prefs?.bodyweightKg) {
        setUserWeightKg(prefs.bodyweightKg);
      }
    }
    loadWeight();
  }, []);

  // Sync speed when distance and duration change if speed is auto-computed
  const handleDistanceChange = (km: number) => {
    setDistanceKm(km);
    if (durationMins > 0) {
      const computedSpeed = (km / (durationMins / 60));
      setSpeedKmh(parseFloat(computedSpeed.toFixed(1)));
    }
  };

  const handleDurationChange = (mins: number) => {
    setDurationMins(mins);
    if (distanceKm > 0 && mins > 0) {
      const computedSpeed = (distanceKm / (mins / 60));
      setSpeedKmh(parseFloat(computedSpeed.toFixed(1)));
    }
  };

  // Calculate live estimated calories
  let estimatedCalories = 0;
  if (inputMode === 'direct') {
    estimatedCalories = Math.max(0, directCalories);
  } else if (inputMode === 'machine') {
    estimatedCalories = calculateAdvancedCardioCalories({
      cardioType,
      durationMinutes: durationMins,
      distanceKm: distanceKm > 0 ? distanceKm : undefined,
      speedKmh: speedKmh > 0 ? speedKmh : undefined,
      inclinePercent: inclinePercent > 0 ? inclinePercent : 0,
      userWeightKg,
    });
  } else {
    // Quick intensity estimate
    let mult = 1.0;
    if (quickIntensity === 'LOW') mult = 0.8;
    if (quickIntensity === 'HIGH') mult = 1.25;
    if (quickIntensity === 'HIIT') mult = 1.5;
    const baseMet = cardioType.toLowerCase().includes('run') ? 8.5 : 4.5;
    estimatedCalories = Math.round(baseMet * mult * userWeightKg * (durationMins / 60));
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newSession: StoredSession = {
        id: `cardio-${Date.now()}`,
        name: `Cardio: ${cardioType}`,
        startedAt: new Date(Date.now() - durationMins * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: durationMins * 60,
        totalVolumeKg: 0,
        totalSetsCompleted: 1,
        estimatedCalories,
        notes: inputMode === 'direct'
          ? `Machine Console Readout: ${directCalories} kcal`
          : `${distanceKm > 0 ? `${distanceKm} km · ` : ''}${speedKmh > 0 ? `${speedKmh} km/h · ` : ''}${inclinePercent > 0 ? `${inclinePercent}% incline` : ''}`,
        exercises: [
          {
            exerciseId: `cardio-${cardioType.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            exerciseName: cardioType,
            sets: [
              {
                weightKg: 0,
                reps: distanceKm > 0 ? Math.round(distanceKm * 1000) : durationMins,
              },
            ],
          },
        ],
        synced: false,
      };

      await db.sessions.put(newSession);

      if (onSaved) {
        onSaved(newSession);
      }
      onClose();
    } catch (err) {
      console.error('Failed to log cardio session:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedTypeObj = CARDIO_TYPES.find((t) => t.id === cardioType) || CARDIO_TYPES[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Cardio Session">
      <div className="space-y-4 text-zinc-200">
        {/* Activity Selection Chips */}
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
            Cardio Activity
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {CARDIO_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setCardioType(type.id)}
                className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                  cardioType === type.id
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span className="text-sm">{type.icon}</span>
                <span className="truncate">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800/80 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setInputMode('machine')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
              inputMode === 'machine'
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Distance & Incline
          </button>
          <button
            type="button"
            onClick={() => setInputMode('direct')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
              inputMode === 'direct'
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Machine Console Kcal
          </button>
          <button
            type="button"
            onClick={() => setInputMode('quick')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
              inputMode === 'quick'
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Quick Time
          </button>
        </div>

        {/* Form Inputs based on Mode */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3.5">
          {inputMode === 'direct' ? (
            /* Mode 2: Direct machine calorie input */
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  Exact Machine Console Calorie Readout (kcal)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={directCalories}
                  onChange={(e) => setDirectCalories(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-lg font-black text-amber-300 focus:outline-none focus:border-amber-400"
                  placeholder="e.g. 250"
                />
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Enter the exact number displayed on the treadmill, stationary bike, or stairmaster monitor.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1">
                  <Timer className="w-3.5 h-3.5 text-zinc-500" />
                  Workout Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={durationMins}
                  onChange={(e) => setDurationMins(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          ) : inputMode === 'machine' ? (
            /* Mode 1: Detailed metrics (Distance, Speed, Incline, Time) */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                    <Timer className="w-3.5 h-3.5 text-zinc-500" />
                    Time (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={durationMins}
                    onChange={(e) => handleDurationChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                    <Activity className="w-3.5 h-3.5 text-zinc-500" />
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={distanceKm}
                    onChange={(e) => handleDistanceChange(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-zinc-500" />
                    Speed (km/h)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={speedKmh}
                    onChange={(e) => setSpeedKmh(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                    <Mountain className="w-3.5 h-3.5 text-zinc-500" />
                    Incline (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    value={inclinePercent}
                    onChange={(e) => setInclinePercent(Math.max(0, parseFloat(e.target.value) || 0))}
                    disabled={!selectedTypeObj.hasIncline}
                    className={`w-full bg-zinc-900 border rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 ${
                      !selectedTypeObj.hasIncline ? 'opacity-40 border-zinc-800/40 cursor-not-allowed' : 'border-zinc-800'
                    }`}
                  />
                </div>
              </div>

              {!selectedTypeObj.hasIncline && (
                <span className="text-[10px] text-zinc-500 block">
                  Incline is disabled for {selectedTypeObj.name}.
                </span>
              )}
            </div>
          ) : (
            /* Mode 3: Quick time & intensity */
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                  <Timer className="w-3.5 h-3.5 text-zinc-500" />
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={durationMins}
                  onChange={(e) => setDurationMins(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  Perceived Intensity
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['LOW', 'MODERATE', 'HIGH', 'HIIT'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuickIntensity(lvl)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                        quickIntensity === lvl
                          ? 'bg-cyan-500 text-zinc-950 border-cyan-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Calculation Banner */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                Calculated Burn
              </span>
              <div className="text-xl font-black text-amber-300">
                {estimatedCalories} <span className="text-xs font-normal text-zinc-400">kcal</span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-zinc-400">
            <div>{durationMins} mins</div>
            {inputMode === 'machine' && distanceKm > 0 && (
              <div className="text-[11px] text-zinc-500">{distanceKm} km</div>
            )}
          </div>
        </div>

        {/* Save & Cancel */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
          <Button size="sm" variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Logging...' : 'Log Cardio Session'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
