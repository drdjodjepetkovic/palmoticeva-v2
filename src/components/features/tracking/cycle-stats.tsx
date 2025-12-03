"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Droplets, CalendarDays, Activity } from 'lucide-react';

interface CycleStatsProps {
    avgCycleLength: number;
    avgPeriodLength: number;
    t: any;
}

export function CycleStats({ avgCycleLength, avgPeriodLength, t }: CycleStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 w-full">
            <Card className="bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-rose-100 rounded-full text-rose-600">
                        <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Trajanje</p>
                        <p className="text-2xl font-bold text-foreground">{avgPeriodLength} <span className="text-sm font-normal text-muted-foreground">dana</span></p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-sky-100 rounded-full text-sky-600">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ciklus</p>
                        <p className="text-2xl font-bold text-foreground">{avgCycleLength} <span className="text-sm font-normal text-muted-foreground">dana</span></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
