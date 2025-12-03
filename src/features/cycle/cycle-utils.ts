import { addDays, differenceInDays, format, isSameDay, subDays } from "date-fns";
import type { Cycle } from "@/core/types";

// Constants
export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;
export const LUTEAL_PHASE_LENGTH = 14; // Days from ovulation to next period

/**
 * Predicts the start date of the next period based on the current cycle start and average cycle length.
 */
export function predictNextPeriodStart(currentCycleStart: Date, cycleLength: number = DEFAULT_CYCLE_LENGTH): Date {
    return addDays(currentCycleStart, cycleLength);
}

/**
 * Calculates the fertile window (including ovulation day) for a given cycle.
 * Fertile window is typically 5 days before ovulation + ovulation day.
 */
export function calculateFertileWindow(nextPeriodStart: Date): { start: Date; end: Date; ovulation: Date } {
    const ovulationDate = subDays(nextPeriodStart, LUTEAL_PHASE_LENGTH);
    const fertileStartDate = subDays(ovulationDate, 5);

    return {
        start: fertileStartDate,
        end: ovulationDate, // Fertile window ends on ovulation day
        ovulation: ovulationDate,
    };
}

/**
 * Determines the current phase of the cycle.
 */
export function getCyclePhase(date: Date, cycleStart: Date, periodLength: number = DEFAULT_PERIOD_LENGTH, cycleLength: number = DEFAULT_CYCLE_LENGTH): 'period' | 'follicular' | 'fertile' | 'luteal' | 'late' {
    const nextPeriod = predictNextPeriodStart(cycleStart, cycleLength);
    const { start: fertileStart, end: fertileEnd } = calculateFertileWindow(nextPeriod);

    if (date < cycleStart) return 'luteal'; // Should not happen if date is "today" and cycleStart is recent

    const daysSinceStart = differenceInDays(date, cycleStart);

    if (daysSinceStart < periodLength) return 'period';
    if (date >= fertileStart && date <= fertileEnd) return 'fertile';
    if (date > fertileEnd && date < nextPeriod) return 'luteal';
    if (date >= nextPeriod) return 'late';

    return 'follicular';
}

/**
 * Formats a date for display (e.g., "28. Nov").
 */
export function formatDate(date: Date, locale: string = 'sr'): string {
    // Simple formatting, can be enhanced with date-fns locale
    return format(date, "d. MMM");
}

export const recalculateAverages = (
    allCycles: any[], // Accepts objects with startDate/endDate as Date
    currentAvgCycleLength: number,
    currentAvgPeriodLength: number
): { newAvgCycleLength: number, newAvgPeriodLength: number } => {
    const sortedCycles = allCycles.filter(c => c.type === 'regular').sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    let newAvgCycleLength = currentAvgCycleLength || 28;
    if (sortedCycles.length > 1) {
        const cycleLengths: number[] = [];
        for (let i = 1; i < sortedCycles.length; i++) {
            const diff = differenceInDays(sortedCycles[i].startDate, sortedCycles[i - 1].startDate);
            if (diff >= 21 && diff <= 45) {
                cycleLengths.push(diff);
            }
        }
        const recentCycleLengths = cycleLengths.slice(-6);
        if (recentCycleLengths.length > 0) {
            newAvgCycleLength = Math.round(recentCycleLengths.reduce((a, b) => a + b, 0) / recentCycleLengths.length);
        }
    }

    let newAvgPeriodLength = currentAvgPeriodLength || 5;
    const completedPeriods = sortedCycles.filter(c => c.endDate).map(c => differenceInDays(c.endDate!, c.startDate) + 1).filter(l => l > 0 && l < 15);
    const recentPeriodLengths = completedPeriods.slice(-6);
    if (recentPeriodLengths.length > 0) {
        newAvgPeriodLength = Math.round(recentPeriodLengths.reduce((a, b) => a + b, 0) / recentPeriodLengths.length);
    }

    return { newAvgCycleLength, newAvgPeriodLength };
};
