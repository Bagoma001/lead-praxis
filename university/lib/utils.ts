import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateCGPA(results: Array<{ grade: string; units: number }>): number {
  const gradePoints: Record<string, number> = {
    A: 5.0,
    B: 4.0,
    C: 3.0,
    D: 2.0,
    E: 1.0,
    F: 0.0,
  };

  let totalPoints = 0;
  let totalUnits = 0;

  results.forEach(({ grade, units }) => {
    totalPoints += (gradePoints[grade] || 0) * units;
    totalUnits += units;
  });

  return totalUnits > 0 ? Number((totalPoints / totalUnits).toFixed(2)) : 0.0;
}
