"use client";

import { useMemo } from 'react';
import { format, addDays, differenceInDays, startOfDay } from 'date-fns';
import { enUS, sr, srLatn, ru } from 'date-fns/locale';
import type { LanguageCode } from '@/types/content';
import type { Cycle } from '@/types/user';
import type { Locale } from 'date-fns';
import { Leaf } from 'lucide-react';

const localeMap: Record<LanguageCode, Locale> = {
    en: enUS,
    'se-lat': srLatn,
    se: sr,
    ru: ru,
};

export function CycleLegend({ cycles, avgCycleLength, language, t }: { cycles: Cycle[], avgCycleLength: number, language: LanguageCode, t: (key: string) => string }) {
    const locale = localeMap[language];
    const today = startOfDay(new Date());

    const lastCycle = useMemo(() => {
        const regularCycles = cycles.filter(c => c.type === 'regular');
        if (regularCycles.length === 0) return null;
        return regularCycles.sort((a,b) => b.startDate.getTime() - a.startDate.getTime())[0];
    }, [cycles]);


    if (!lastCycle || !avgCycleLength) return null;
    
    const nextPredictedPeriodStart = addDays(lastCycle.startDate, avgCycleLength);

    const ovulationDate = addDays(nextPredictedPeriodStart, -14);
    const fertileStart = addDays(ovulationDate, -4);
    const fertileEnd = addDays(ovulationDate, 1);
    
    const colors = {
        period: 'hsl(350, 90%, 70%)',
        fertile: 'hsl(250, 80%, 80%)',
        ovulation: 'hsl(270, 90%, 70%)',
    };

    const legendItems = [
        { label: t('legendPeriodStart'), date: nextPredictedPeriodStart, id: 'start', color: colors.period },
        { label: t('legendFertileStart'), date: fertileStart, id: 'fertileStart', color: colors.fertile },
        { label: t('legendOvulation'), date: ovulationDate, id: 'ovulation', icon: Leaf },
        { label: t('legendFertileEnd'), date: fertileEnd, id: 'fertileEnd', color: colors.fertile },
    ];
    
    return (
        <div className="p-4 border-t bg-muted/20 text-sm space-y-2 rounded-b-lg">
            {legendItems.map(item => {
                const daysUntil = differenceInDays(item.date, today);
                if (daysUntil < 0) return null; // Don't show past events

                return (
                    <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {item.icon ? <item.icon className="h-4 w-4 text-primary" /> : <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>}
                            <span className="text-muted-foreground">{item.label}</span>
                        </div>
                        <div className="text-right">
                           <span className="font-semibold">{format(item.date, 'd. MMM', { locale })}</span>
                           <span className="text-xs text-muted-foreground ml-2">(za {daysUntil} {t('days')})</span>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
