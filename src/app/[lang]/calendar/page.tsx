"use client";

import { useAuth } from "@/features/auth/auth-context";
import { useContent } from "@/features/content/content-context";
import { CycleDashboard } from "@/components/features/tracking/cycle-dashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatISO, addDays, eachDayOfInterval } from "date-fns";
import { useCycle } from "@/features/cycle/use-cycle";
import { calculateFertileWindow } from "@/features/cycle/cycle-utils";
import { useDailyEvents } from "@/features/cycle/use-daily-events";

export default function CalendarPage() {
    const { user, loading: authLoading } = useAuth();
    const { language, t } = useContent();
    const router = useRouter();
    const { history, loading: cycleLoading, stats } = useCycle();
    const { events: dailyEvents, loading: eventsLoading, saveEvent } = useDailyEvents();

    // State for selected day (passed down to dashboard)
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    // Derived state for calendar visualization
    const [periodDays, setPeriodDays] = useState<Set<string>>(new Set());
    const [predictedPeriodDays, setPredictedPeriodDays] = useState<Set<string>>(new Set());
    const [fertileDays, setFertileDays] = useState<Set<string>>(new Set());
    const [ovulationDays, setOvulationDays] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/${language}/login`);
        }
    }, [user, authLoading, language, router]);

    useEffect(() => {
        if (history.length > 0) {
            const newPeriodDays = new Set<string>();
            const newPredictedPeriodDays = new Set<string>();
            const newFertileDays = new Set<string>();
            const newOvulationDays = new Set<string>();

            history.forEach(cycle => {
                // Period days
                if (cycle.startDate) {
                    const start = cycle.startDate;
                    const end = cycle.endDate || (cycle.isActive ? new Date() : addDays(start, (stats?.avgPeriodLength || 5) - 1));

                    const days = eachDayOfInterval({ start, end });
                    days.forEach(day => newPeriodDays.add(formatISO(day, { representation: 'date' })));
                }
            });

            // Predictions based on the latest cycle
            const latestCycle = history[0]; // Assumes sorted desc
            if (latestCycle) {
                const cycleLen = stats?.avgCycleLength || 28;
                const periodLen = stats?.avgPeriodLength || 5;

                // Predict next period
                const nextPeriodStart = addDays(latestCycle.startDate, cycleLen);

                // Let's predict next 3 months
                let currentPredictionStart = nextPeriodStart;
                for (let i = 0; i < 3; i++) {
                    const pEnd = addDays(currentPredictionStart, periodLen - 1);
                    const pDays = eachDayOfInterval({ start: currentPredictionStart, end: pEnd });
                    pDays.forEach(day => newPredictedPeriodDays.add(formatISO(day, { representation: 'date' })));

                    // Fertile window for this predicted cycle
                    const { start: fStart, end: fEnd, ovulation } = calculateFertileWindow(currentPredictionStart);
                    const fDays = eachDayOfInterval({ start: fStart, end: fEnd });
                    fDays.forEach(day => newFertileDays.add(formatISO(day, { representation: 'date' })));
                    newOvulationDays.add(formatISO(ovulation, { representation: 'date' }));

                    currentPredictionStart = addDays(currentPredictionStart, cycleLen);
                }
            }

            setPeriodDays(newPeriodDays);
            setPredictedPeriodDays(newPredictedPeriodDays);
            setFertileDays(newFertileDays);
            setOvulationDays(newOvulationDays);
        }
    }, [history, stats]);

    const handleDayClick = (day: Date) => {
        setSelectedDay(day);
    };

    if (authLoading || cycleLoading || eventsLoading) {
        return <div className="flex min-h-screen items-center justify-center">{t.common?.loading || "Učitavanje..."}</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container max-w-md mx-auto py-6 space-y-6 pb-24">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">{t.nav?.calendar || "Kalendar"}</h1>
                <p className="text-muted-foreground text-sm">
                    Pratite svoj ciklus i simptome.
                </p>
            </div>

            <CycleDashboard
                periodDays={periodDays}
                predictedPeriodDays={predictedPeriodDays}
                fertileDays={fertileDays}
                ovulationDays={ovulationDays}
                dailyEvents={dailyEvents}
                onDayClick={handleDayClick}
                selectedDay={selectedDay}
            />
        </div>
    );
}
