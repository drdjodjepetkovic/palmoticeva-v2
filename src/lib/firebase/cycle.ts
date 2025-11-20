import { db, logAnalyticsEvent } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { startOfDay, formatISO, isSameDay } from 'date-fns';
import type { Cycle } from '@/types/user';
import { recalculateAverages } from '@/lib/cycle-utils';

export async function logPeriodToFirestore(userId: string, date: Date) {
    const dataRef = doc(db, 'users', userId, 'cycleData', 'main');
    const dataSnap = await getDoc(dataRef);

    let cycles: Cycle[] = [];
    let avgCycleLength = 28;
    let avgPeriodLength = 5;

    if (dataSnap.exists()) {
        const data = dataSnap.data();
        cycles = data.cycles?.map((c: any) => ({
            id: c.id,
            startDate: c.startDate.toDate(),
            endDate: c.endDate ? c.endDate.toDate() : null,
            type: c.type || 'regular'
        })) || [];
        avgCycleLength = data.avgCycleLength || 28;
        avgPeriodLength = data.avgPeriodLength || 5;
    }

    const dayStart = startOfDay(date);

    // Check if cycle already exists on this day
    const existingCycle = cycles.find(c => c.id !== 'predicted' && isSameDay(c.startDate, dayStart));
    if (existingCycle) {
        // If it exists, we might want to toggle it off, but for AI "log period", we usually mean "add it".
        // If it's already there, we can just return success or maybe update it.
        // For now, let's assume "log period" means "ensure it's there".
        return { success: true, message: 'Cycle already logged for this date.' };
    }

    const newCycle: Cycle = {
        id: doc(collection(db, 'users')).id,
        startDate: dayStart,
        endDate: null,
        type: 'regular'
    };

    const newCycles = [...cycles, newCycle].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(newCycles, avgCycleLength, avgPeriodLength);

    await setDoc(dataRef, {
        cycles: newCycles,
        avgCycleLength: newAvgCycleLength,
        avgPeriodLength: newAvgPeriodLength
    }, { merge: true });

    logAnalyticsEvent('cycle_logged_via_ai', { start_date: formatISO(dayStart, { representation: 'date' }) });

    return { success: true, message: 'Period logged successfully.', newAvgCycleLength, newAvgPeriodLength };
}
