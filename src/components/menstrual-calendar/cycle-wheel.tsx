
"use client";

import { useMemo, useCallback } from 'react';
import { useLanguage } from "@/context/language-context";
import { format, addDays, differenceInDays, isSameDay, startOfDay, formatISO } from 'date-fns';
import { enUS, sr, srLatn, ru } from 'date-fns/locale';
import type { LanguageCode as ContentLanguageCode } from '@/types/content';
import type { Cycle } from '@/types/user';
import { cn } from '@/lib/utils';
import type { Locale } from 'date-fns';

const localeMap: Record<ContentLanguageCode, Locale> = {
    en: enUS,
    'se-lat': srLatn,
    se: sr,
    ru: ru,
};

interface CycleWheelProps {
  avgCycleLength: number;
  daysUntilPeriod: number | null;
  activeCycle: Cycle | undefined;
  periodDays: Set<string>;
  predictedPeriodDays: Set<string>;
  fertileDays: Set<string>;
  ovulationDays: Set<string>;
  t: (id: string) => string;
}

export function CycleWheel({
  avgCycleLength,
  daysUntilPeriod,
  activeCycle,
  periodDays,
  predictedPeriodDays,
  fertileDays,
  ovulationDays,
  t
}: CycleWheelProps) {
    const { language } = useLanguage();
    const size = 300;
    const center = size / 2;
    const strokeWidth = 30;
    const radius = center - strokeWidth / 2;
    const today = startOfDay(new Date());

    const currentCycleDay = activeCycle && today
      ? differenceInDays(today, activeCycle.startDate) + 1
      : null;

    const colors = {
        default: 'hsl(var(--muted))',
        period: 'hsl(350, 90%, 70%)',
        predicted: 'hsl(350, 90%, 70% / 0.5)',
        fertile: 'hsl(250, 80%, 80%)',
        ovulation: 'hsl(270, 90%, 70%)',
    };

    const segments = useMemo(() => {
        if (avgCycleLength <= 0) return [];
        const segs = [];
        const dayAngle = 360 / avgCycleLength;

        for (let i = 1; i <= avgCycleLength; i++) {
            const startAngle = (i - 1) * dayAngle - 90;
            const endAngle = i * dayAngle - 90;
            
            let dayDate: Date;
            if(activeCycle) {
                dayDate = addDays(activeCycle.startDate, i - 1);
            } else if (daysUntilPeriod !== null && today) {
                const nextPeriodStart = addDays(today, daysUntilPeriod);
                const cycleStart = addDays(nextPeriodStart, -avgCycleLength);
                dayDate = addDays(cycleStart, i - 1);
            } else {
                 dayDate = addDays(new Date(), i);
            }
            const dateKey = formatISO(dayDate, { representation: 'date' });

            let type: 'default' | 'period' | 'predicted' | 'fertile' | 'ovulation' = 'default';

            if (ovulationDays.has(dateKey)) {
                type = 'ovulation';
            } else if (periodDays.has(dateKey)) {
                type = 'period';
            } else if (fertileDays.has(dateKey)) {
                type = 'fertile';
            } else if (predictedPeriodDays.has(dateKey)) {
                type = 'predicted';
            }

            segs.push({
                day: i,
                pathD: describeArc(center, center, radius, startAngle + 1, endAngle - 1),
                textPos: polarToCartesian(center, center, radius, endAngle - dayAngle / 2),
                type: type,
                isCurrent: i === currentCycleDay
            });
        }
        return segs;
    }, [avgCycleLength, daysUntilPeriod, currentCycleDay, periodDays, predictedPeriodDays, fertileDays, ovulationDays, activeCycle, today]);

    const getCycleStatus = useCallback(() => {
      const today = startOfDay(new Date());
      const todayKey = formatISO(today, { representation: 'date' });
      const locale = localeMap[language];

      if (periodDays.has(todayKey)) {
          const activePeriodCycle = activeCycle || { startDate: today };
          const periodDayNumber = differenceInDays(today, activePeriodCycle.startDate) + 1;
          const isEnd = activeCycle?.endDate && isSameDay(today, activeCycle.endDate);
          if (periodDayNumber === 1) {
              return { title: t('firstDayOfPeriod'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: periodDayNumber };
          }
          if (isEnd) {
              return { title: t('lastDayOfPeriod'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: periodDayNumber };
          }
          return { title: t('yourPeriod'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: periodDayNumber };
      }

      if (activeCycle && currentCycleDay) {
         if (currentCycleDay > avgCycleLength && daysUntilPeriod !== null && daysUntilPeriod < 0) {
            const nextPeriodDate = addDays(today, daysUntilPeriod);
            return { title: t('daysUntilNextPeriod'), subtitle: `Kasni ${Math.abs(daysUntilPeriod)} dana`, dayNumber: daysUntilPeriod };
         }
         if (currentCycleDay > 0) {
            return { title: t('currentCycle'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: currentCycleDay };
         }
      }

      const isOvulationToday = ovulationDays.has(todayKey);
      const isFertileToday = fertileDays.has(todayKey);

      if (isOvulationToday) {
          return { title: t('ovulationDay'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: '!' };
      }

      if (isFertileToday) {
           const prevDayKey = formatISO(addDays(today, -1), { representation: 'date' });
           const nextDayKey = formatISO(addDays(today, 1), { representation: 'date' });
           if (!fertileDays.has(prevDayKey)) {
               return { title: t('fertileWindowStarts'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: t('fertile') };
           }
           if (!fertileDays.has(nextDayKey)) {
               return { title: t('fertileWindowEnds'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: t('fertile') };
           }
          return { title: t('fertileWindow'), subtitle: format(today, 'd. MMMM', { locale }), dayNumber: t('fertile') };
      }
      
      if (daysUntilPeriod !== null && daysUntilPeriod >= 0) {
          const nextPeriodDate = addDays(today, daysUntilPeriod);
          return { title: t('daysUntilNextPeriod'), subtitle: format(nextPeriodDate, 'd. MMMM', { locale }), dayNumber: daysUntilPeriod };
      }

      return { title: t('calendarStartPrompt'), subtitle: '', dayNumber: '?' };
    }, [language, t, activeCycle, currentCycleDay, periodDays, ovulationDays, fertileDays, daysUntilPeriod, avgCycleLength]);


    const status = getCycleStatus();

    return (
        <div className="relative w-full flex flex-col items-center justify-center gap-4" style={{ height: `${size}px` }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <g>
                    {segments.map(({ day, pathD, textPos, type, isCurrent }) => (
                        <g key={day}>
                            <path d={pathD} stroke={colors[type]} strokeWidth={strokeWidth} fill="none" />
                            {isCurrent && <circle cx={textPos.x} cy={textPos.y} r={15} fill="hsl(var(--primary))" className="opacity-30" />}
                            <text
                                x={textPos.x}
                                y={textPos.y}
                                dy="0.35em"
                                textAnchor="middle"
                                className={cn("text-xs", isCurrent ? "font-bold fill-primary-foreground" : "fill-foreground")}
                            >
                                {day}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-br from-primary/80 to-purple-500/80 shadow-2xl flex flex-col items-center justify-center text-center text-primary-foreground p-4">
                     <span className="text-5xl font-bold">{status.dayNumber}</span>
                     <span className="text-sm font-medium leading-tight">{status.title}</span>
                     {status.subtitle && <span className="text-xs text-primary-foreground/80 mt-1">{status.subtitle}</span>}
                 </div>
            </div>
        </div>
    );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
    return d;
}
