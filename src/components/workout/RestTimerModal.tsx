'use client';

import React, { useState, useEffect } from 'react';
import { formatTimeMMSS } from '@/lib/utils';
import { Play, Pause, RotateCcw, X, Plus, Minus, Volume2 } from 'lucide-react';

interface RestTimerProps {
  targetSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  targetSeconds = 90,
  isOpen,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(targetSeconds);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    setSecondsRemaining(targetSeconds);
    setIsActive(true);
  }, [targetSeconds, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      // Beep cue via Web Audio API (zero external asset dependency)
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      } catch (e) {
        // Audio might be muted or blocked by browser policy
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  if (!isOpen) return null;

  const percentage = Math.max(0, (secondsRemaining / (targetSeconds || 90)) * 100);

  return (
    <div className="fixed bottom-20 right-4 z-40 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-zinc-900/95 border border-cyan-500/50 shadow-2xl shadow-cyan-950/40 backdrop-blur-md rounded-2xl p-3 w-64 text-zinc-100 flex flex-col items-center">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between w-full mb-1">
          <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            Rest Timer (Optional)
          </span>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Time Display */}
        <div className="my-1">
          <span className="text-3xl font-black tracking-tight text-zinc-50">
            {formatTimeMMSS(secondsRemaining)}
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mb-3">
          <div
            className="bg-cyan-400 h-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-1 w-full text-xs">
          <button
            onClick={() => setSecondsRemaining((s) => Math.max(0, s - 15))}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold"
            title="Subtract 15s"
          >
            -15s
          </button>

          <button
            onClick={() => setIsActive((a) => !a)}
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold flex items-center gap-1 px-3 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
          >
            {isActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isActive ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={() => setSecondsRemaining((s) => s + 30)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold"
            title="Add 30s"
          >
            +30s
          </button>

          <button
            onClick={() => {
              setSecondsRemaining(targetSeconds);
              setIsActive(true);
            }}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
