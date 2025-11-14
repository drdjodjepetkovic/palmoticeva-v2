// src/components/menstrual-calendar/daily-tip-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatISO, startOfDay, differenceInDays } from 'date-fns';
import { Lightbulb } from 'lucide-react';
import type { Cycle } from '@/types/user';

interface DailyTipCardProps {
    periodDays: Set<string>;
    fertileDays: Set<string>;
    avgCycleLength: number;
    activeCycle: Cycle | undefined;
    t: (key: string) => string;
}

export function DailyTipCard({ periodDays, fertileDays, avgCycleLength, activeCycle, t }: DailyTipCardProps) {
    const todayKey = formatISO(startOfDay(new Date()), { representation: 'date' });

    const getTip = () => {
        if (periodDays.has(todayKey)) {
            return Math.random() < 0.5 ? t('tip_period_1') : t('tip_period_2');
        }
        if (fertileDays.has(todayKey)) {
             return Math.random() < 0.5 ? t('tip_fertile_1') : t('tip_fertile_2');
        }
        if (activeCycle) {
            const currentDay = differenceInDays(startOfDay(new Date()), activeCycle.startDate) + 1;
            if (currentDay > avgCycleLength - 7) {
                return Math.random() < 0.5 ? t('tip_pms_1') : t('tip_pms_2');
            }
        }
        return t('tip_default');
    };
    
    const tip = getTip();

    if (!tip) return null;

    return (
        <Card className="bg-primary/10 border-primary/20 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-base">
                    <Lightbulb className="h-5 w-5" />
                    {t('daily_tip_title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-primary/90">{tip}</p>
            </CardContent>
        </Card>
    );
};
