import { dbAdmin } from './admin';
import { recalculateAverages } from '@/features/cycle/cycle-utils';
import { isSameDay } from 'date-fns';
import { Timestamp } from 'firebase-admin/firestore';

// Define a local Cycle interface that uses Date for easier manipulation
// and matches what we store/retrieve before converting to Firestore types
interface ServerCycle {
    id: string;
    startDate: Date;
    endDate: Date | null;
    type: 'regular' | 'pregnancy' | 'miscarriage';
}

export async function logPeriodToFirestoreServer(userId: string, date: Date) {
    const dataRef = dbAdmin.collection('users').doc(userId).collection('cycleData').doc('main');
    const dataSnap = await dataRef.get();

    let cycles: ServerCycle[] = [];
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

    // Set time to noon UTC to avoid timezone issues
    // This ensures that when converted to local time (e.g. CET or EST), it stays on the same day
    const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0));

    // Check if cycle already exists on this day
    const existingCycle = cycles.find(c => c.id !== 'predicted' && isSameDay(c.startDate, dayStart));
    if (existingCycle) {
        return { success: true, message: 'Cycle already logged for this date.' };
    }

    const newCycle: ServerCycle = {
        id: dbAdmin.collection('users').doc().id,
        startDate: dayStart,
        endDate: null,
        type: 'regular'
    };

    const newCycles = [...cycles, newCycle].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // We need to map ServerCycle back to the shape expected by recalculateAverages if it expects something specific
    // Assuming recalculateAverages takes objects with startDate/endDate as Dates or strings
    const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(newCycles as any, avgCycleLength, avgPeriodLength);

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
