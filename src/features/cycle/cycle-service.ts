import { db } from '@/lib/firebase/client';
import { doc, getDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import type { Cycle, DailyEvent } from '@/core/types';
import { addDays, differenceInDays, formatISO, isSameDay, isWithinInterval, startOfDay } from 'date-fns';

export const CycleService = {
    getCycleData: async (uid: string) => {
        const dataRef = doc(db, 'users', uid, 'cycleData', 'main');
        const docSnap = await getDoc(dataRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    },

    getMenstrualDataForAI: async (userId: string): Promise<any> => {
        try {
            const cycleDocRef = doc(db, 'users', userId, 'cycleData', 'main');
            const cycleDocSnap = await getDoc(cycleDocRef);

            if (!cycleDocSnap.exists()) {
                return { error: "Korisnica još nije podesila kalendar.", isPeriod: false, isFertile: false, isOvulation: false };
            }

            const cycleData = cycleDocSnap.data();
            const cycles: Cycle[] = cycleData.cycles?.map((c: any) => ({
                id: c.id,
                startDate: c.startDate.toDate(),
                endDate: c.endDate ? c.endDate.toDate() : null,
                type: c.type || 'regular'
            })) || [];

            const avgCycleLength = cycleData.avgCycleLength || 28;
            const avgPeriodLength = cycleData.avgPeriodLength || 5;

            if (cycles.length === 0) {
                return { error: "Korisnica još nije unela nijedan ciklus.", isPeriod: false, isFertile: false, isOvulation: false };
            }

            const today = startOfDay(new Date());
            const lastCycle = cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];

            if (!lastCycle) {
                return { error: "Nema unetih regularnih ciklusa.", isPeriod: false, isFertile: false, isOvulation: false };
            }

            let isPeriod = false;
            if (lastCycle && !lastCycle.endDate) { // Active cycle
                const daysIn = differenceInDays(today, lastCycle.startDate);
                if (daysIn >= 0 && daysIn < avgPeriodLength) {
                    isPeriod = true;
                }
            } else if (lastCycle && lastCycle.endDate) { // Completed cycle
                if (isWithinInterval(today, { start: lastCycle.startDate, end: lastCycle.endDate })) {
                    isPeriod = true;
                }
            }

            const nextPredictedPeriodStart = addDays(lastCycle.startDate, avgCycleLength);
            const ovulationDate = addDays(nextPredictedPeriodStart, -14);
            const fertileWindowStartDate = addDays(ovulationDate, -4);
            const fertileWindowEndDate = addDays(ovulationDate, 1);

            const isOvulation = isSameDay(today, ovulationDate);
            const isFertile = isWithinInterval(today, { start: fertileWindowStartDate, end: fertileWindowEndDate });
            const daysUntilNextPeriod = differenceInDays(nextPredictedPeriodStart, today);

            const currentActiveCycle = cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime()).find(c => today >= c.startDate);
            const currentCycleDay = currentActiveCycle ? differenceInDays(today, currentActiveCycle.startDate) + 1 : undefined;

            const eventsRef = collection(db, 'users', userId, 'dailyEvents');
            const eventsQuery = query(eventsRef, orderBy('date', 'desc'), limit(10));
            const eventsSnapshot = await getDocs(eventsQuery);
            const loggedEvents = eventsSnapshot.docs.map(doc => {
                const data = doc.data() as DailyEvent;
                const eventEntries = Object.entries(data).filter(([key, value]) => key !== 'date' && key !== 'id' && value === true);
                return eventEntries.map(([type]) => ({ date: data.date, type: type as any }));
            }).flat();

            const completedCycles = cycles.filter(c => c.endDate && c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
            const pastCycles = completedCycles.slice(0, 5).map((cycle, index) => {
                const previousCycle = completedCycles[index + 1];
                const cycleLength = previousCycle ? differenceInDays(cycle.startDate, previousCycle.startDate) : avgCycleLength;
                const periodLength = cycle.endDate ? differenceInDays(cycle.endDate, cycle.startDate) + 1 : avgPeriodLength;
                return {
                    startDate: formatISO(cycle.startDate, { representation: 'date' }),
                    endDate: formatISO(cycle.endDate!, { representation: 'date' }),
                    periodLength,
                    cycleLength
                }
            });

            return {
                isPeriod,
                isFertile,
                isOvulation,
                currentCycleDay,
                daysUntilNextPeriod: daysUntilNextPeriod >= 0 ? daysUntilNextPeriod : undefined,
                lastPeriodStartDate: lastCycle?.startDate ? formatISO(lastCycle.startDate, { representation: 'date' }) : undefined,
                fertileWindowStartDate: formatISO(fertileWindowStartDate, { representation: 'date' }),
                fertileWindowEndDate: formatISO(fertileWindowEndDate, { representation: 'date' }),
                ovulationDate: formatISO(ovulationDate, { representation: 'date' }),
                nextPredictedPeriodStartDate: formatISO(nextPredictedPeriodStart, { representation: 'date' }),
                avgCycleLength,
                avgPeriodLength,
                loggedEvents,
                pastCycles,
            };

        } catch (e: any) {
            console.error("Error fetching menstrual data for agent:", e);
            return { error: `Internal server error: ${e.message}`, isPeriod: false, isFertile: false, isOvulation: false };
        }
    },
};
