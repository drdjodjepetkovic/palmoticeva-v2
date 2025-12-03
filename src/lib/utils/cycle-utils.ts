import { differenceInDays } from 'date-fns';
import type { Cycle } from '@/core/types';

export const recalculateAverages = (
    allCycles: Cycle[],
    currentAvgCycleLength: number,
    currentAvgPeriodLength: number
): { newAvgCycleLength: number, newAvgPeriodLength: number } => {
    // Filter for regular cycles and sort by date
    // @ts-ignore - 'type' might be optional in some definitions, but we assume it exists or default to regular
    const sortedCycles = allCycles.filter(c => (c.type || 'regular') === 'regular').sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    let newAvgCycleLength = currentAvgCycleLength || 28;

    // Calculate Cycle Length (Start to Start)
    if (sortedCycles.length > 1) {
        const cycleLengths: number[] = [];
        for (let i = 1; i < sortedCycles.length; i++) {
            const diff = differenceInDays(sortedCycles[i].startDate, sortedCycles[i - 1].startDate);
            // Filter outliers (e.g. missed periods or extremely short cycles)
            if (diff >= 21 && diff <= 45) {
                cycleLengths.push(diff);
            }
        }

        // Use only the most recent 6 cycles for a rolling average
        const recentCycleLengths = cycleLengths.slice(-6);
        if (recentCycleLengths.length > 0) {
            newAvgCycleLength = Math.round(recentCycleLengths.reduce((a, b) => a + b, 0) / recentCycleLengths.length);
        }
    }

    let newAvgPeriodLength = currentAvgPeriodLength || 5;

    // Calculate Period Length (Start to End)
    const completedPeriods = sortedCycles
        .filter(c => c.endDate)
        .map(c => differenceInDays(c.endDate!, c.startDate) + 1)
        .filter(l => l > 0 && l < 15); // Filter outliers

    const recentPeriodLengths = completedPeriods.slice(-6);
    if (recentPeriodLengths.length > 0) {
        newAvgPeriodLength = Math.round(recentPeriodLengths.reduce((a, b) => a + b, 0) / recentPeriodLengths.length);
    }

    return { newAvgCycleLength, newAvgPeriodLength };
};
