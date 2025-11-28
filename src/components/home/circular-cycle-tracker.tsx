"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from 'lucide-react';

interface CircularCycleTrackerProps {
    currentDay: number;
    cycleLength: number;
    periodLength: number;
    fertileWindowStart?: number;
    fertileWindowEnd?: number;
    ovulationDay?: number;
    t: (id: string, fallback?: string) => string | React.ReactNode;
}

export function CircularCycleTracker({
    currentDay,
    cycleLength = 28,
    periodLength = 5,
    fertileWindowStart,
    fertileWindowEnd,
    ovulationDay,
    t
}: CircularCycleTrackerProps) {
    // SVG Configuration
    const size = 280;
    const strokeWidth = 20;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Helper to calculate stroke-dasharray for segments
    const getSegmentStroke = (startDay: number, endDay: number) => {
        const startAngle = ((startDay - 1) / cycleLength) * 360;
        const endAngle = (endDay / cycleLength) * 360;
        const length = ((endDay - startDay + 1) / cycleLength) * circumference;
        const gap = circumference - length;
        return {
            strokeDasharray: `${length} ${gap}`,
            strokeDashoffset: -((startAngle / 360) * circumference) + (circumference / 4) // Rotate -90deg to start at top
        };
    };

    // Helper to get position for day markers
    const getDayPosition = (day: number) => {
        const angle = ((day - 1) / cycleLength) * 2 * Math.PI - Math.PI / 2;
        const x = center + (radius + 25) * Math.cos(angle);
        const y = center + (radius + 25) * Math.sin(angle);
        return { x, y };
    };

    // Determine current phase text
    let phaseText = t('cycle_phase_follicular', 'Folikularna faza');
    let phaseColor = "text-muted-foreground";

    if (currentDay <= periodLength) {
        phaseText = t('cycle_phase_menstruation', 'Menstruacija');
        phaseColor = "text-destructive";
    } else if (fertileWindowStart && fertileWindowEnd && currentDay >= fertileWindowStart && currentDay <= fertileWindowEnd) {
        phaseText = t('cycle_phase_fertile', 'Plodni dani');
        phaseColor = "text-teal-600";
    } else if (currentDay > (fertileWindowEnd || 15)) {
        phaseText = t('cycle_phase_luteal', 'Lutealna faza');
        phaseColor = "text-orange-400";
    }

    return (
        <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-b from-white to-stone-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-headline text-stone-800">
                    {t('cycle_tracker_title', 'Vaš Ciklus')}
                </CardTitle>
                <Info className="h-4 w-4 text-muted-foreground opacity-50" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 relative">

                <div className="relative w-[280px] h-[280px]">
                    {/* Base Circle (Background) */}
                    <svg width={size} height={size} className="transform -rotate-90">
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth={strokeWidth}
                            className="opacity-20"
                        />

                        {/* Period Segment */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke="#ef4444" // Red-500
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            className="opacity-80"
                            style={getSegmentStroke(1, periodLength)}
                        />

                        {/* Fertile Window Segment */}
                        {fertileWindowStart && fertileWindowEnd && (
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke="#14b8a6" // Teal-500
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                className="opacity-80"
                                style={getSegmentStroke(fertileWindowStart, fertileWindowEnd)}
                            />
                        )}

                        {/* Current Day Indicator (Dot) */}
                        <circle
                            cx={center + radius * Math.cos(((currentDay - 1) / cycleLength) * 2 * Math.PI)}
                            cy={center + radius * Math.sin(((currentDay - 1) / cycleLength) * 2 * Math.PI)}
                            r={8}
                            fill="white"
                            stroke="hsl(var(--foreground))"
                            strokeWidth={4}
                            className="shadow-md drop-shadow-md z-10"
                        />
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">
                            {t('cycle_day_label', 'Dan')}
                        </span>
                        <span className="text-6xl font-headline font-bold text-stone-800">
                            {currentDay}
                        </span>
                        <span className={cn("text-sm font-medium mt-2 px-3 py-1 rounded-full bg-white/80 shadow-sm border border-stone-100", phaseColor)}>
                            {phaseText}
                        </span>
                    </div>
                </div>

                {/* Legend / Footer Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 w-full text-center">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('cycle_next_period', 'Sledeća')}</span>
                        <span className="font-semibold text-stone-700">
                            {cycleLength - currentDay > 0 ? `za ${cycleLength - currentDay} dana` : t('cycle_today', 'Danas')}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('cycle_length', 'Dužina')}</span>
                        <span className="font-semibold text-stone-700">{cycleLength} {t('days', 'dana')}</span>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
