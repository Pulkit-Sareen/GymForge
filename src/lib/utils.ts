import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWeight(kg: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (unit === 'lbs') {
    const lbs = Math.round(kg * 2.20462 * 10) / 10;
    return `${lbs} lbs`;
  }
  return `${kg} kg`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) {
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}

export function formatTimeMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Returns Monday 00:00:00 for the week containing the specified date.
 * Guarantees that weekly metrics reset at midnight every Monday.
 */
export function getWeekStartMonday(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Returns Sunday 23:59:59.999 for the week containing the specified date.
 */
export function getWeekEndSunday(date: Date = new Date()): Date {
  const monday = getWeekStartMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

/**
 * Validates if a session date falls strictly within the current week (Monday to Sunday).
 */
export function isDateInCurrentWeek(dateStr: string, referenceDate: Date = new Date()): boolean {
  const target = new Date(dateStr);
  const monday = getWeekStartMonday(referenceDate);
  const sunday = getWeekEndSunday(referenceDate);
  return target >= monday && target <= sunday;
}
