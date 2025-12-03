
"use client";

import { CalendarDays, Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";
import React from "react";

export function CycleStats({ avgPeriodLength, avgCycleLength, t }: { avgPeriodLength: number; avgCycleLength: number; t: (id: string) => string | React.ReactNode; }) {
    if (avgPeriodLength === 0 && avgCycleLength === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-destructive/10 border-destructive/20">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-destructive/90">{t('averagePeriod')}</span>
                    <Droplet className="h-5 w-5 text-destructive/70"/>
                </div>
                <div className="text-2xl font-bold text-foreground">{avgPeriodLength} <span className="text-base font-medium">{t('days')}</span></div>
            </Card>
            <Card className="p-4 bg-primary/10 border-primary/20">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-primary/90">{t('averageCycle')}</span>
                    <CalendarDays className="h-5 w-5 text-primary/70"/>
                </div>
                <div className="text-2xl font-bold text-foreground">{avgCycleLength} <span className="text-base font-medium">{t('days')}</span></div>
            </Card>
        </div>
    )
  }

