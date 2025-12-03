"use client";

import { useMemo, useCallback } from 'react';
import { useLanguage } from "@/features/content/context/language-context";
import { format, addDays, differenceInDays, isSameDay, startOfDay, formatISO } from 'date-fns';
import { enUS, sr, srLatn, ru } from 'date-fns/locale';
import type { AppLanguage } from '@/core/types';
import type { Cycle } from '@/core/types';
import { cn } from '@/lib/utils';
import type { Locale } from 'date-fns';
import { Droplet, CircleDot, Sparkles, Clock } from 'lucide-react';

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
    t: any;
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
    const size = 320;
    const center = size / 2;
    const strokeWidth = 28; // Slightly thicker for the pastel look
    const radius = center - strokeWidth - 20; // Adjust for container padding
    const today = startOfDay(new Date());

    const currentCycleDay = activeCycle && today
        ? differenceInDays(today, activeCycle.startDate) + 1
        : null;

    // Pastel Palette
    const colors = {
        default: 'hsl(210, 20%, 93%)', // Light Gray
        period: 'hsl(350, 100%, 88%)', // Pastel Pink/Red
        predicted: 'hsl(350, 100%, 88%, 0.5)',
        fertile: 'hsl(150, 50%, 60%)', // Darker Pastel Green for visibility
        ovulation: 'hsl(200, 80%, 85%)', // Pastel Blue
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
                pathD: describeArc(center, center, radius, startAngle + 1, endAngle - 1), // 1 degree gap
                type: type,
                isCurrent: i === currentCycleDay
            });
        }
        return segs;
    }, [avgCycleLength, daysUntilPeriod, currentCycleDay, periodDays, predictedPeriodDays, fertileDays, ovulationDays, activeCycle, today, radius, center]);

    const getCycleStatus = useCallback(() => {
        const locale = localeMap[language as AppLanguage] || srLatn;

        let title = "DAN";
        let dayNumber: string | number = "?";
        let progress = 0;
        let predictionText = "";

        if (activeCycle && currentCycleDay) {
            dayNumber = currentCycleDay;
            progress = Math.min(100, Math.max(0, (currentCycleDay / avgCycleLength) * 100));

            if (daysUntilPeriod !== null) {
                const nextPeriodDate = addDays(today, daysUntilPeriod);
                const dayName = format(nextPeriodDate, 'EEEE', { locale }); // e.g., "utorak"
                predictionText = `Menstruacija počinje u ${dayName} (za ${daysUntilPeriod} dana)`;
            }
        }

        return { title, dayNumber, progress, predictionText };
    }, [language, activeCycle, currentCycleDay, avgCycleLength, daysUntilPeriod, today]);

    const status = getCycleStatus();

    return (
        <div className="relative w-full flex flex-col items-center justify-center py-12">
            {/* Metallic Ring Container */}
            <div
                className="relative rounded-full shadow-2xl flex items-center justify-center"
                style={{
                    width: size + 40,
                    height: size + 40,
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 50%, #d0d0d0 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.15)'
                }}
            >
                {/* Inner Ring Depth */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: size + 20,
                        height: size + 20,
                        background: 'linear-gradient(135deg, #d0d0d0 0%, #f0f0f0 100%)',
                        boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)'
                    }}
                />

                {/* SVG Wheel */}
                <div className="relative z-10" style={{ width: size, height: size }}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 drop-shadow-sm">
                        <g>
                            {segments.map(({ day, pathD, type, isCurrent }) => (
                                <g key={day}>
                                    <path
                                        d={pathD}
                                        stroke={colors[type]}
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        strokeLinecap="butt"
                                        className="transition-all duration-300"
                                    />
                                    {/* Current Day Indicator (Outer Glow) */}
                                    {isCurrent && (
                                        <path
                                            d={pathD}
                                            stroke="rgba(0,0,0,0.1)"
                                            strokeWidth={strokeWidth + 4}
                                            fill="none"
                                            strokeLinecap="butt"
                                            className="animate-pulse"
                                        />
                                    )}
                                </g>
                            ))}
                        </g>
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center justify-center text-center p-8 w-3/4">

                            {/* Typography: DAN 21 */}
                            <div className="flex flex-col items-center mb-4">
                                <span className="text-4xl md:text-5xl font-serif text-slate-700 tracking-tight">
                                    {status.title} <span className="font-light">{status.dayNumber}</span>
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-slate-300 to-slate-400 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${status.progress}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-slate-500 mb-4">
                                {Math.round(status.progress)}% ciklusa završeno
                            </span>

                            {/* Prediction Text */}
                            {status.predictionText && (
                                <div className="text-xs text-slate-500 font-medium leading-relaxed max-w-[180px]">
                                    Predviđanje:
                                    <br />
                                    <span className="text-slate-600">{status.predictionText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Surrounding Icons (Dynamic Positioning) */}
                <div className="absolute inset-0 pointer-events-none">
                    {(() => {
                        const containerCenter = (size + 40) / 2;
                        const getIconPos = (day: number) => {
                            const angle = (day * (360 / avgCycleLength) - 90) - (360 / avgCycleLength) / 2 - 90; // -90 to match SVG rotation
                            // Radius = 170 places it on the metallic rim (between 160 and 180)
                            return polarToCartesian(containerCenter, containerCenter, 170, angle);
                        };

                        // 1. Period Icon (Day 1 or middle of period)
                        const periodStartDay = 1;
                        const periodPos = getIconPos(periodStartDay);

                        // 2. Ovulation Icon
                        let ovulationDay = Math.floor(avgCycleLength / 2); // Default fallback
                        // Find actual ovulation day from set
                        const ovulationDateStr = Array.from(ovulationDays)[0];
                        if (ovulationDateStr && activeCycle) {
                            const ovDate = new Date(ovulationDateStr);
                            ovulationDay = differenceInDays(ovDate, activeCycle.startDate) + 1;
                        } else if (ovulationDateStr && daysUntilPeriod !== null && today) {
                            // Fallback calculation if needed, but usually ovulationDays set is correct relative to cycle
                            // Simplified: if we have the set, try to find the day index
                            // Since we iterate segments 1..length, we can match the date key
                            // Let's iterate to find the day index that matches the ovulation date key
                            for (let i = 1; i <= avgCycleLength; i++) {
                                // Re-calculate date for i (copied from segments loop logic efficiently)
                                let d: Date;
                                if (activeCycle) d = addDays(activeCycle.startDate, i - 1);
                                else if (daysUntilPeriod !== null) d = addDays(addDays(today, daysUntilPeriod), -avgCycleLength + i - 1);
                                else d = addDays(new Date(), i); // fallback

                                if (ovulationDays.has(formatISO(d, { representation: 'date' }))) {
                                    ovulationDay = i;
                                    break;
                                }
                            }
                        }
                        const ovulationPos = getIconPos(ovulationDay);

                        // 3. Fertile Icon (Middle of fertile window)
                        let fertileDay = ovulationDay - 2; // Approx
                        let fertileCount = 0;
                        let fertileSum = 0;
                        for (let i = 1; i <= avgCycleLength; i++) {
                            let d: Date;
                            if (activeCycle) d = addDays(activeCycle.startDate, i - 1);
                            else if (daysUntilPeriod !== null) d = addDays(addDays(today, daysUntilPeriod), -avgCycleLength + i - 1);
                            else d = addDays(new Date(), i);

                            if (fertileDays.has(formatISO(d, { representation: 'date' }))) {
                                fertileSum += i;
                                fertileCount++;
                            }
                        }
                        if (fertileCount > 0) fertileDay = Math.round(fertileSum / fertileCount);
                        const fertilePos = getIconPos(fertileDay);

                        // 4. Predicted Period Icon (Start of predicted)
                        let predictedDay = avgCycleLength; // End of cycle
                        for (let i = 1; i <= avgCycleLength; i++) {
                            let d: Date;
                            if (activeCycle) d = addDays(activeCycle.startDate, i - 1);
                            else if (daysUntilPeriod !== null) d = addDays(addDays(today, daysUntilPeriod), -avgCycleLength + i - 1);
                            else d = addDays(new Date(), i);

                            if (predictedPeriodDays.has(formatISO(d, { representation: 'date' }))) {
                                predictedDay = i;
                                break; // First day of predicted
                            }
                        }
                        const predictedPos = getIconPos(predictedDay);

                        return (
                            <>
                                {/* Period */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: periodPos.x, top: periodPos.y }}
                                >
                                    <div className="opacity-0 animate-fly-in" style={{ animationDelay: '100ms' }}>
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-full bg-rose-50/90 backdrop-blur-sm shadow-md flex items-center justify-center border border-rose-200">
                                                <Droplet className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                                                <span className="text-[10px] font-bold text-slate-600">{periodStartDay}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fertile */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: fertilePos.x, top: fertilePos.y }}
                                >
                                    <div className="opacity-0 animate-fly-in" style={{ animationDelay: '300ms' }}>
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-full bg-teal-50/90 backdrop-blur-sm shadow-md flex items-center justify-center border border-teal-200">
                                                <Sparkles className="w-5 h-5 text-teal-600" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                                                <span className="text-[10px] font-bold text-slate-600">{fertileDay}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ovulation */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: ovulationPos.x, top: ovulationPos.y }}
                                >
                                    <div className="opacity-0 animate-fly-in" style={{ animationDelay: '500ms' }}>
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-full bg-sky-50/90 backdrop-blur-sm shadow-md flex items-center justify-center border border-sky-200">
                                                <CircleDot className="w-5 h-5 text-sky-600" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                                                <span className="text-[10px] font-bold text-slate-600">{ovulationDay}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Predicted */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: predictedPos.x, top: predictedPos.y }}
                                >
                                    <div className="opacity-0 animate-fly-in" style={{ animationDelay: '700ms' }}>
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-full bg-rose-50/90 backdrop-blur-sm shadow-md flex items-center justify-center border border-rose-200">
                                                <Clock className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                                                <span className="text-[10px] font-bold text-slate-600">{predictedDay}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
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
