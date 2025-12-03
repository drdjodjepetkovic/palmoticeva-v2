import { useState, useEffect } from "react";
import { db } from "@/core/firebase";
import { doc, onSnapshot, Timestamp, setDoc, getDoc, collection } from "firebase/firestore";
import { useAuth } from "@/features/auth/auth-context";
import type { Cycle } from "@/core/types";

export function useCycle() {
    const { user } = useAuth();
    const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
    const [history, setHistory] = useState<Cycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ avgCycleLength: number; avgPeriodLength: number } | null>(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const cycleDataRef = doc(db, "users", user.uid, "cycleData", "main");

        const unsubscribe = onSnapshot(cycleDataRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const cyclesData = data.cycles || [];

                const parsedCycles: Cycle[] = cyclesData.map((c: any) => ({
                    id: c.id,
                    userId: user.uid,
                    startDate: (c.startDate as Timestamp).toDate(),
                    endDate: c.endDate ? (c.endDate as Timestamp).toDate() : undefined,
                    type: c.type,
                    isActive: !c.endDate, // Determine active status based on endDate
                    periodLength: 5, // Default or from stats?
                    cycleLength: 28, // Default or from stats?
                }));

                // Sort by start date descending
                parsedCycles.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

                if (parsedCycles.length > 0) {
                    // The most recent one is likely the current one if it has no end date, or just the latest one
                    const active = parsedCycles.find(c => !c.endDate) || parsedCycles[0];
                    setCurrentCycle(active);
                    setHistory(parsedCycles);
                } else {
                    setCurrentCycle(null);
                    setHistory([]);
                }

                if (data.avgCycleLength && data.avgPeriodLength) {
                    setStats({
                        avgCycleLength: data.avgCycleLength,
                        avgPeriodLength: data.avgPeriodLength
                    });
                }

            } else {
                // Initialize if not exists? Or just empty state
                setCurrentCycle(null);
                setHistory([]);
                setStats(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching cycle data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const logPeriod = async (startDate: Date, endDate?: Date) => {
        if (!user) return;
        const cycleDataRef = doc(db, "users", user.uid, "cycleData", "main");

        try {
            const docSnap = await getDoc(cycleDataRef);
            const newCycle = {
                id: doc(collection(db, "dummy")).id, // Generate ID
                startDate: Timestamp.fromDate(startDate),
                endDate: endDate ? Timestamp.fromDate(endDate) : null,
                type: 'regular'
            };

            if (docSnap.exists()) {
                const data = docSnap.data();
                const cycles = data.cycles || [];
                cycles.push(newCycle);
                await setDoc(cycleDataRef, { cycles }, { merge: true });
            } else {
                await setDoc(cycleDataRef, {
                    cycles: [newCycle],
                    avgCycleLength: 28,
                    avgPeriodLength: 5
                });
            }
        } catch (error) {
            console.error("Error logging period:", error);
        }
    };

    const togglePeriodEnd = async (endDate: Date | undefined, cycleId: string) => {
        if (!user) return;
        const cycleDataRef = doc(db, "users", user.uid, "cycleData", "main");

        try {
            const docSnap = await getDoc(cycleDataRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const cycles = data.cycles || [];
                const updatedCycles = cycles.map((c: any) => {
                    if (c.id === cycleId) {
                        return {
                            ...c,
                            endDate: endDate ? Timestamp.fromDate(endDate) : null
                        };
                    }
                    return c;
                });
                await setDoc(cycleDataRef, { cycles: updatedCycles }, { merge: true });
            }
        } catch (error) {
            console.error("Error toggling period end:", error);
        }
    };

    return { currentCycle, history, loading, stats, logPeriod, togglePeriodEnd };
}
