
"use client";

import { useMemo, useCallback } from 'react';
import { useLanguage } from "@/context/language-context";
import { format, addDays, differenceInDays, isSameDay, startOfDay, formatISO } from 'date-fns';
import { enUS, sr, srLatn, ru } from 'date-fns/locale';
import type { LanguageCode as ContentLanguageCode } from '@/types/content';
import type { Cycle } from '@/types/user';
import { cn } from '@/lib/utils';
import type { Locale } from 'date-fns';
import { Sparkles, Flower, Droplets, Heart } from 'lucide-react';

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
        <div className="relative w-full flex flex-col items-center justify-center gap-4 group" style={{ height: `${size}px` }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-in fade-in zoom-in duration-1000 rotate-in-180">
                <defs>
                    <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <radialGradient id="status-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth + 2} fill="none" className="text-muted/10" />
                <g>
                    {segments.map(({ day, pathD, textPos, type, isCurrent }) => {
                        const isIconic = ['ovulation', 'fertile', 'period'].includes(type);
                        const Icon = type === 'ovulation' ? Sparkles : type === 'fertile' ? Heart : type === 'period' ? Droplets : null;

                        return (
                            <g key={day} className="transition-all duration-300 hover:opacity-80 cursor-default">
                                <path
                                    d={pathD}
                                    stroke={colors[type]}
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeLinecap="round"
                                    className={cn(
                                        "transition-all duration-500",
                                        isCurrent && "filter drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                                    )}
                                />
                                <path d={pathD} stroke="url(#metal-gradient)" strokeWidth={strokeWidth} fill="none" opacity="0.3" pointerEvents="none" />

                                {isCurrent && (
                                    <circle
                                        cx={textPos.x}
                                        cy={textPos.y}
                                        r={18}
                                        fill="hsl(var(--primary))"
                                        className="opacity-20 animate-pulse"
                                    />
                                )}

                                {Icon ? (
                                    <g transform={`translate(${textPos.x - 8}, ${textPos.y - 8})`}>
                                        <Icon className={cn(
                                            "w-4 h-4",
                                            isCurrent ? "text-primary-foreground" : "text-foreground/70"
                                        )} />
                                    </g>
                                ) : (
                                    <text
                                        x={textPos.x}
                                        y={textPos.y}
                                        dy="0.35em"
                                        textAnchor="middle"
                                        className={cn(
                                            "text-[10px] select-none pointer-events-none transition-all duration-300",
                                            isCurrent ? "font-bold fill-primary-foreground" : "fill-foreground/60"
                                        )}
                                    >
                                        {day}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative group">
                    <div className="absolute inset-[-20px] bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl animate-pulse opacity-50" />
                    <div className="w-[170px] h-[170px] rounded-full bg-background/40 backdrop-blur-2xl border border-white/20 shadow-premium-xl flex flex-col items-center justify-center text-center p-6 relative z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                        <span className="text-6xl font-headline font-bold text-foreground drop-shadow-sm">{status.dayNumber}</span>
                        <div className="h-px w-12 bg-primary/30 my-2" />
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">{status.title}</span>
                        {status.subtitle && <span className="text-[10px] text-muted-foreground font-medium mt-1 leading-tight">{status.subtitle}</span>}
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
