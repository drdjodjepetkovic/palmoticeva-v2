'use server';

import { dbAdmin } from '@/lib/firebase/admin';
import { recalculateAverages } from '@/lib/utils/cycle-utils';
import { isSameDay } from 'date-fns';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

// Type definition for Cycle to avoid circular dependencies if possible, 
// or import from a shared types file. 
// For now, defining locally or assuming it matches the one in @/core/types
import { Cycle } from '@/core/types';

export async function logPeriod(userId: string, date: Date | string) {
    try {
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
                    startDate: c.startDate instanceof Timestamp ? c.startDate.toDate() : new Date(c.startDate),
                    endDate: c.endDate ? (c.endDate instanceof Timestamp ? c.endDate.toDate() : new Date(c.endDate)) : null,
                    type: c.type || 'regular'
                })) || [];
                avgCycleLength = data.avgCycleLength || 28;
                avgPeriodLength = data.avgPeriodLength || 5;
            }
        }

        // Ensure date is a Date object
        const inputDate = typeof date === 'string' ? new Date(date) : date;

        // Set time to noon UTC to avoid timezone issues
        const dayStart = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 12, 0, 0, 0));

        // Check if cycle already exists on this day
        // We exclude 'predicted' cycles if we ever store them (though usually we don't store predictions persistently like this)
        const existingCycle = cycles.find(c => isSameDay(c.startDate, dayStart));

        if (existingCycle) {
            return { success: false, message: 'Ciklus za ovaj datum već postoji.' };
        }

        // Create new cycle
        const newCycle: Cycle = {
            id: dbAdmin.collection('users').doc().id,
            userId: userId,
            startDate: dayStart,
            endDate: undefined, // Active cycle
            periodLength: avgPeriodLength,
            isActive: true,
            type: 'regular'
        };

        // Add and sort
        const newCycles = [...cycles, newCycle].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        // Recalculate averages
        const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(newCycles, avgCycleLength, avgPeriodLength);

        // Prepare for storage (convert Dates back to Timestamps)
        const cyclesForStorage = newCycles.map(c => ({
            ...c,
            startDate: Timestamp.fromDate(c.startDate),
            endDate: c.endDate ? Timestamp.fromDate(c.endDate) : null as any
        }));

        await dataRef.set({
            cycles: cyclesForStorage,
            avgCycleLength: newAvgCycleLength,
            avgPeriodLength: newAvgPeriodLength,
            lastUpdated: Timestamp.now()
        }, { merge: true });

        revalidatePath('/calendar');
        revalidatePath('/[lang]/calendar');

        return { success: true, newAvgCycleLength, newAvgPeriodLength };
    } catch (error: any) {
        console.error('Error logging period:', error);
        return { success: false, error: error.message };
    }
}

export async function togglePeriodEnd(userId: string, cycleId: string, date: Date | string) {
    try {
        const dataRef = dbAdmin.collection('users').doc(userId).collection('cycleData').doc('main');
        const dataSnap = await dataRef.get();

        if (!dataSnap.exists) {
            return { success: false, error: 'No cycle data found' };
        }

        const data = dataSnap.data();
        let cycles: Cycle[] = data?.cycles?.map((c: any) => ({
            id: c.id,
            startDate: c.startDate instanceof Timestamp ? c.startDate.toDate() : new Date(c.startDate),
            endDate: c.endDate ? (c.endDate instanceof Timestamp ? c.endDate.toDate() : new Date(c.endDate)) : null,
            type: c.type || 'regular'
        })) || [];

        const cycleIndex = cycles.findIndex(c => c.id === cycleId);
        if (cycleIndex === -1) {
            return { success: false, error: 'Cycle not found' };
        }

        const inputDate = typeof date === 'string' ? new Date(date) : date;
        // Set time to noon UTC
        const endDate = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 12, 0, 0, 0));

        // Update the cycle
        // If it already has an end date, we might be reopening it or changing it. 
        // For toggle behavior: if it has end date, remove it (reopen). If not, set it.
        // But the UI usually passes the specific date to set as end.

        cycles[cycleIndex].endDate = endDate;

        // Recalculate averages
        const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(cycles, data?.avgCycleLength || 28, data?.avgPeriodLength || 5);

        const cyclesForStorage = cycles.map(c => ({
            ...c,
            startDate: Timestamp.fromDate(c.startDate),
            endDate: c.endDate ? Timestamp.fromDate(c.endDate) : null as any
        }));

        await dataRef.set({
            cycles: cyclesForStorage,
            avgCycleLength: newAvgCycleLength,
            avgPeriodLength: newAvgPeriodLength,
            lastUpdated: Timestamp.now()
        }, { merge: true });

        revalidatePath('/calendar');
        return { success: true };

    } catch (error: any) {
        console.error('Error toggling period end:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteCycle(userId: string, cycleId: string) {
    try {
        const dataRef = dbAdmin.collection('users').doc(userId).collection('cycleData').doc('main');
        const dataSnap = await dataRef.get();

        if (!dataSnap.exists) {
            return { success: false, error: 'No cycle data found' };
        }

        const data = dataSnap.data();
        let cycles: Cycle[] = data?.cycles?.map((c: any) => ({
            id: c.id,
            userId: userId,
            startDate: c.startDate instanceof Timestamp ? c.startDate.toDate() : new Date(c.startDate),
            endDate: c.endDate ? (c.endDate instanceof Timestamp ? c.endDate.toDate() : new Date(c.endDate)) : undefined,
            periodLength: data.avgPeriodLength || 5,
            isActive: !c.endDate,
            type: c.type || 'regular'
        })) || [];

        const initialLength = cycles.length;
        cycles = cycles.filter(c => c.id !== cycleId);

        if (cycles.length === initialLength) {
            return { success: false, error: 'Cycle not found' };
        }

        // Recalculate averages
        const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(cycles, data?.avgCycleLength || 28, data?.avgPeriodLength || 5);

        const cyclesForStorage = cycles.map(c => ({
            ...c,
            startDate: Timestamp.fromDate(c.startDate),
            endDate: c.endDate ? Timestamp.fromDate(c.endDate) : null as any
        }));

        await dataRef.set({
            cycles: cyclesForStorage,
            avgCycleLength: newAvgCycleLength,
            avgPeriodLength: newAvgPeriodLength,
            lastUpdated: Timestamp.now()
        }, { merge: true });

        revalidatePath('/calendar');
        return { success: true };

    } catch (error: any) {
        console.error('Error deleting cycle:', error);
        return { success: false, error: error.message };
    }
}
