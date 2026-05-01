import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Utility to calculate BTC halving countdown and Tailwind width class
 * Based on: 
 * - Start: April 20, 2024
 * - Target: April 20, 2028 (Estimated)
 */
export const getHalvingData = () => {
  const START_DATE = new Date("2024-04-20T00:00:00Z").getTime();
  const TARGET_DATE = new Date("2028-04-20T00:00:00Z").getTime();
  const NOW = new Date().getTime();

  // 1. Calculate Days Left
  const diff = TARGET_DATE - NOW;
  const daysLeft = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  // 2. Calculate Progress Percentage
  const totalDuration = TARGET_DATE - START_DATE;
  const elapsed = NOW - START_DATE;
  const progressPercent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

  return {
    daysLeft,
    progressPercent
  };
};
