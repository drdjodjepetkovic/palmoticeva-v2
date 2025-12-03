import { useState, useEffect } from 'react';
import { CycleService } from '@/lib/services/cycle-service';
import { useAuth } from '@/context/auth-context';
import { useEventBus } from '@/context/event-bus-context';
import { UserEventType } from '@/lib/events';
import type { Cycle } from '@/types/user';

export function useCycleData() {
    const { user } = useAuth();
    const { emit } = useEventBus();
    const [cycleData, setCycleData] = useState<{ cycles: Cycle[], avgCycleLength: number, avgPeriodLength: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await CycleService.getCycleData(user.uid);
                if (data) {
                    const cycles = data.cycles?.map((c: any) => ({
                        id: c.id,
                        startDate: c.startDate.toDate(),
                        endDate: c.endDate ? c.endDate.toDate() : null,
                        type: c.type || 'regular'
                    })) || [];

                    setCycleData({
                        cycles,
                        avgCycleLength: data.avgCycleLength || 28,
                        avgPeriodLength: data.avgPeriodLength || 5,
                    });

                    // Badge logic based on cycle data
                    if (cycles.length > 0) emit(UserEventType.BadgeUnlocked, { badgeKey: 'explorer' });
                    if (cycles.length >= 3) emit(UserEventType.BadgeUnlocked, { badgeKey: 'routine_queen' });
                } else {
                    setCycleData(null);
                }
            } catch (error) {
                console.error("Error fetching cycle data:", error);
                setCycleData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user, emit]);

    return { cycleData, loading };
}
