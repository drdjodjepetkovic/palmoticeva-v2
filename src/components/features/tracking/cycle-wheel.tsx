"use client";

import { useMemo, useCallback } from 'react';
import { useLanguage } from "@/features/content/context/language-context";
import { format, addDays, differenceInDays, isSameDay, startOfDay, formatISO } from 'date-fns';
import { enUS, sr, srLatn, ru } from 'date-fns/locale';
import type { AppLanguage } from '@/core/types';
import type { Cycle } from '@/core/types';
import { cn } from '@/lib/utils';
import type { Locale } from 'date-fns';

const localeMap: Record<AppLanguage, Locale> = {
    en: enUS,
    'sr': srLatn,
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
    t: any; // Using any for translation object for flexibility
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
    const size = 320; // Slightly larger for better visibility
    const center = size / 2;
    const strokeWidth = 24; // Thinner, more elegant stroke
    const radius = center - strokeWidth - 10;
    const today = startOfDay(new Date());

    const currentCycleDay = activeCycle && today
        ? differenceInDays(today, activeCycle.startDate) + 1
        : null;

    // Updated Palette: Pure White, Bright Medical Blue (Azure), Cool Grays
    const colors = {
        default: 'hsl(210, 20%, 96%)', // Very light cool gray
        period: 'hsl(340, 85%, 65%)', // Soft Pink/Red
        predicted: 'hsl(340, 85%, 65%, 0.3)',
        fertile: 'hsl(200, 95%, 40%, 0.2)', // Light Azure
        ovulation: 'hsl(200, 95%, 40%)', // Bright Azure
    };

    const segments = useMemo(() => {
        if (avgCycleLength <= 0) return [];
        const segs = [];
        const dayAngle = 360 / avgCycleLength;

        for (let i = 1; i <= avgCycleLength; i++) {
            const startAngle = (i - 1) * dayAngle - 90;
            const endAngle = i * dayAngle - 90;

            let dayDate: Date;
            if (activeCycle) {
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
                pathD: describeArc(center, center, radius, startAngle + 1.5, endAngle - 1.5), // More gap between segments
                textPos: polarToCartesian(center, center, radius - 25, endAngle - dayAngle / 2),
                type: type,
                isCurrent: i === currentCycleDay
            });
        }
        return segs;
    }, [avgCycleLength, daysUntilPeriod, currentCycleDay, periodDays, predictedPeriodDays, fertileDays, ovulationDays, activeCycle, today, radius, center]);

    const getCycleStatus = useCallback(() => {
        const today = startOfDay(new Date());
        const todayKey = formatISO(today, { representation: 'date' });
        const locale = localeMap[language as AppLanguage] || srLatn;

        if (periodDays.has(todayKey)) {
            const activePeriodCycle = activeCycle || { startDate: today };
            const periodDayNumber = differenceInDays(today, activePeriodCycle.startDate) + 1;
            const isEnd = activeCycle?.endDate && isSameDay(today, activeCycle.endDate);

            // Fallback translations if t() keys missing
            const title = t.calendar?.period || "Menstruacija";

            return { title: title, subtitle: format(today, 'd. MMMM', { locale }), dayNumber: periodDayNumber, color: 'text-rose-500' };
        }

        if (activeCycle && currentCycleDay) {
            if (currentCycleDay > avgCycleLength && daysUntilPeriod !== null && daysUntilPeriod < 0) {
                return { title: "Kasni", subtitle: `${Math.abs(daysUntilPeriod)} dana`, dayNumber: '!', color: 'text-rose-500' };
            }
            if (currentCycleDay > 0) {
                return { title: "Dan ciklusa", subtitle: format(today, 'd. MMMM', { locale }), dayNumber: currentCycleDay, color: 'text-primary' };
            }
        }

        const isOvulationToday = ovulationDays.has(todayKey);
        const isFertileToday = fertileDays.has(todayKey);

        if (isOvulationToday) {
            return { title: "Danas je", subtitle: "OVULACIJA", dayNumber: '●', color: 'text-sky-600' };
        }

        if (isFertileToday) {
            return { title: "Trenutno su", subtitle: "PLODNI DANI", dayNumber: '○', color: 'text-sky-400' };
        }

        if (daysUntilPeriod !== null && daysUntilPeriod >= 0) {
            return { title: "Sledeća menstruacija", subtitle: `za ${daysUntilPeriod} dana`, dayNumber: daysUntilPeriod, color: 'text-slate-600' };
        }

        return { title: "Kalendar", subtitle: '', dayNumber: '?', color: 'text-muted-foreground' };
    }, [language, t, activeCycle, currentCycleDay, periodDays, ovulationDays, fertileDays, daysUntilPeriod, avgCycleLength]);


    const status = getCycleStatus();

    return (
        <div className="relative w-full flex flex-col items-center justify-center py-8">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    <g>
                        {segments.map(({ day, pathD, textPos, type, isCurrent }) => (
                            <g key={day}>
                                <path
                                    d={pathD}
                                    stroke={colors[type]}
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />
                                {isCurrent && (
                                    <circle
                                        cx={polarToCartesian(center, center, radius, (day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2).x}
                                        cy={polarToCartesian(center, center, radius, (day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2).y}
                                        r={strokeWidth / 1.5}
                                        fill="white"
                                        stroke={colors[type] === colors.default ? 'hsl(var(--primary))' : colors[type]}
                                        strokeWidth={4}
                                        className="drop-shadow-md"
                                    />
                                )}
                                {/* Date Label for Key Segments */}
                                {(type === 'period' || type === 'ovulation' || (type === 'fertile' && day % 2 === 0)) && (
                                    <text
                                        x={polarToCartesian(center, center, radius + 25, (day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2).x}
                                        y={polarToCartesian(center, center, radius + 25, (day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2).y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-[10px] fill-muted-foreground font-medium"
                                        transform={`rotate(${((day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2) + 90}, ${polarToCartesian(center, center, radius + 25, (day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2).x}, ${polarToCartesian(center, center, radius + 25, (day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2).y})`}
                                    >
                                        {format(addDays(activeCycle ? activeCycle.startDate : (daysUntilPeriod !== null && today ? addDays(addDays(today, daysUntilPeriod), -avgCycleLength) : new Date()), day - 1), 'd.M')}
                                    </text>
                                )}
                            </g>
                        ))}
                    </g>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center justify-center text-center p-4 animate-in fade-in zoom-in duration-500">
                        <span className={cn("text-6xl font-bold tracking-tighter", status.color)}>{status.dayNumber}</span>
                        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground mt-2">{status.title}</span>
                        {status.subtitle && <span className="text-xs text-muted-foreground/80 mt-1">{status.subtitle}</span>}
                    </div>
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
