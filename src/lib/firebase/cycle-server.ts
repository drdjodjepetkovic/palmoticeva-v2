import { dbAdmin, FieldValue } from './admin';
import { recalculateAverages } from '@/lib/cycle-utils';
import { startOfDay, isSameDay } from 'date-fns';
import type { Cycle } from '@/types/user';
import { Timestamp } from 'firebase-admin/firestore';

export async function logPeriodToFirestoreServer(userId: string, date: Date) {
    const dataRef = dbAdmin.collection('users').doc(userId).collection('cycleData').doc('main');
    const dataSnap = await dataRef.get();

    let cycles: Cycle[] = [];
    let avgCycleLength = 28;
    let avgPeriodLength = 5;

    if (dataSnap.exists) {
        const data = dataSnap.data();
        if (data) {
            cycles = data.cycles?.map((c: any) => ({
                id: c.id,
                // Handle both Firestore Timestamp and regular Date objects
                startDate: c.startDate instanceof Timestamp ? c.startDate.toDate() : new Date(c.startDate),
                endDate: c.endDate ? (c.endDate instanceof Timestamp ? c.endDate.toDate() : new Date(c.endDate)) : null,
                type: c.type || 'regular'
            })) || [];
            avgCycleLength = data.avgCycleLength || 28;
            avgPeriodLength = data.avgPeriodLength || 5;
        }
    }

    const dayStart = startOfDay(date);

    // Check if cycle already exists on this day
    const existingCycle = cycles.find(c => c.id !== 'predicted' && isSameDay(c.startDate, dayStart));
    if (existingCycle) {
        return { success: true, message: 'Cycle already logged for this date.' };
    }

    const newCycle: Cycle = {
        id: dbAdmin.collection('users').doc().id,
        startDate: dayStart,
        endDate: null,
        type: 'regular'
    };

    const newCycles = [...cycles, newCycle].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(newCycles, avgCycleLength, avgPeriodLength);

    // Convert dates back to Timestamps for storage
    const cyclesForStorage = newCycles.map(c => ({
        ...c,
        startDate: Timestamp.fromDate(c.startDate),
        endDate: c.endDate ? Timestamp.fromDate(c.endDate) : null
    }));

    await dataRef.set({
        cycles: cyclesForStorage,
        avgCycleLength: newAvgCycleLength,
        avgPeriodLength: newAvgPeriodLength
    }, { merge: true });

    return { success: true, message: 'Period logged successfully.', newAvgCycleLength, newAvgPeriodLength };
}
