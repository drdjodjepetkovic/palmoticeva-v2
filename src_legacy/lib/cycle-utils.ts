import { differenceInDays } from 'date-fns';
import type { Cycle } from '@/types/user';

export const recalculateAverages = (
    allCycles: Cycle[],
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
