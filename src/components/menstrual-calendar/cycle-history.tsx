// src/components/menstrual-calendar/cycle-history.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays, differenceInDays } from 'date-fns';
import { Leaf } from 'lucide-react';
import type { Cycle } from '@/types/user';
import type { LanguageCode } from '@/types/content';
import { enUS, sr, srLatn, ru, type Locale } from 'date-fns/locale';

const localeMap: Record<LanguageCode, Locale> = {
    en: enUS,
    'sr': srLatn,
    se: sr,
    ru: ru,
};

function CycleHistoryItem({ cycle, nextCycle, avgPeriodLength, avgCycleLength, t, language, onLogMissedPeriod, onLogIrregularPeriod }: { cycle: Cycle; nextCycle?: Cycle; avgPeriodLength: number; avgCycleLength: number; t: (key: string) => string; language: LanguageCode, onLogMissedPeriod: (date: Date) => void; onLogIrregularPeriod: (date: Date) => void; }) {
    const locale = localeMap[language];

    if (cycle.type === 'irregular') {
        return (
             <div className="p-3 my-2 rounded-md border border-dashed border-muted-foreground/50 text-center">
                <p className="text-sm text-muted-foreground">Neregularan ciklus zabeležen za {format(cycle.startDate, 'MMMM yyyy', { locale })}.</p>
            </div>
        )
    }

    const periodEndDate = cycle.endDate ?? addDays(cycle.startDate, avgPeriodLength - 1);
    const periodLength = differenceInDays(periodEndDate, cycle.startDate) + 1;

    let cycleLength: number;
    let isGap = false;

    if (nextCycle) {
        cycleLength = differenceInDays(nextCycle.startDate, cycle.startDate);
        // A gap is detected if the cycle is much longer than usual, e.g., > 45 days or 1.5x the average
        if (cycleLength > Math.max(45, avgCycleLength * 1.5)) {
            isGap = true;
        }
    } else {
        cycleLength = avgCycleLength;
    }

    if (isGap) {
        const monthOfGap = format(addDays(cycle.startDate, Math.round(avgCycleLength/2)), 'MMMM yyyy', { locale });
        const suggestedDateForLog = addDays(cycle.startDate, Math.round(avgCycleLength));
        return (
            <div className="p-3 my-2 rounded-md border-2 border-dashed border-amber-500/50 bg-amber-50 dark:bg-amber-900/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="text-center md:text-left">
                        <p className="font-semibold text-amber-900 dark:text-amber-300">Da li ste imali menstruaciju u {monthOfGap}u?</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">Izgleda da postoji pauza u unosima.</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => onLogMissedPeriod(suggestedDateForLog)}>Da</Button>
                        <Button size="sm" variant="outline" onClick={() => onLogIrregularPeriod(suggestedDateForLog)}>Ne</Button>
                    </div>
                </div>
            </div>
        )
    }
    
    if (cycle.type !== 'regular') {
      return null;
    }

    if (cycleLength < 15 || cycleLength > 60) return null; // Don't show very short/long cycles for clarity

    const ovulationDay = cycleLength - 14;
    const periodWidth = (periodLength / cycleLength) * 100;
    const fertileWindowStart = ((ovulationDay - 4) / cycleLength) * 100;
    const fertileWindowWidth = (6 / cycleLength) * 100;
    const ovulationPosition = (ovulationDay / cycleLength) * 100;

    return (
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <div className="font-semibold text-sm">
            {format(cycle.startDate, 'MMM d', { locale })} - {cycle.endDate ? format(cycle.endDate, 'MMM d', { locale }) : '...'}
          </div>
          <span className="text-sm text-muted-foreground">{cycleLength} dana</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-destructive/80" style={{ width: `${periodWidth}%` }} />
          <div className="absolute top-0 h-full bg-primary/40" style={{ left: `${fertileWindowStart}%`, width: `${fertileWindowWidth}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `calc(${ovulationPosition}% - 6px)` }}>
              <Leaf className="h-3 w-3 text-primary" />
          </div>
        </div>
      </div>
    );
}


export function CycleHistory({ cycles, avgPeriodLength, avgCycleLength, t, language, onLogMissedPeriod, onLogIrregularPeriod }: { cycles: Cycle[]; avgPeriodLength: number; avgCycleLength: number; t: (key: string) => string; language: LanguageCode; onLogMissedPeriod: (date: Date) => void; onLogIrregularPeriod: (date: Date) => void; }) {
    const sortedCycles = [...cycles].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const reversedCycles = [...sortedCycles].reverse();
  
    if (cycles.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('history')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground p-4">
                    {t('history_empty_placeholder') || 'Istorija će se prikazati nakon unosa prvog ciklusa.'}
                </CardContent>
            </Card>
        );
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('history')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reversedCycles.map((cycle, index) => {
            const nextCycle = reversedCycles[index - 1]; // next in chronological order is previous in reversed array
            return (
              <CycleHistoryItem 
                key={cycle.id}
                cycle={cycle} 
                nextCycle={nextCycle}
                avgPeriodLength={avgPeriodLength}
                avgCycleLength={avgCycleLength}
                t={t} 
                language={language}
                onLogMissedPeriod={onLogMissedPeriod}
                onLogIrregularPeriod={onLogIrregularPeriod}
              />
            );
          })}
        </CardContent>
      </Card>
    );
}
