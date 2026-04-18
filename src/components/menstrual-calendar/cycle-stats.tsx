
"use client";

import { CalendarDays, Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

// 2026-04-18 — tiles sada klik -> /{language}/menstrual-calendar (traženo na home-u).
// language je opcionalan: kad se komponenta koristi unutar calendar stranice, ne treba da linkuje.
export function CycleStats({ avgPeriodLength, avgCycleLength, t, language }: { avgPeriodLength: number; avgCycleLength: number; t: (id: string) => string | React.ReactNode; language?: string; }) {
    if (avgPeriodLength === 0 && avgCycleLength === 0) return null;

    const periodTile = (
        <Card className={`p-4 bg-destructive/10 border-destructive/20${language ? ' hover:bg-destructive/15 transition-colors cursor-pointer' : ''}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-destructive/90">{t('averagePeriod')}</span>
                <Droplet className="h-5 w-5 text-destructive/70"/>
            </div>
            <div className="text-2xl font-headline font-bold text-foreground">{avgPeriodLength} <span className="text-base font-medium font-body">{t('days')}</span></div>
        </Card>
    );

    const cycleTile = (
        <Card className={`p-4 bg-primary/10 border-primary/20${language ? ' hover:bg-primary/15 transition-colors cursor-pointer' : ''}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-primary/90">{t('averageCycle')}</span>
                <CalendarDays className="h-5 w-5 text-primary/70"/>
            </div>
            <div className="text-2xl font-headline font-bold text-foreground">{avgCycleLength} <span className="text-base font-medium font-body">{t('days')}</span></div>
        </Card>
    );

    return (
        <div className="grid grid-cols-2 gap-4">
            {language ? (
                <>
                    <Link href={`/${language}/menstrual-calendar`} className="block">{periodTile}</Link>
                    <Link href={`/${language}/menstrual-calendar`} className="block">{cycleTile}</Link>
                </>
            ) : (
                <>
                    {periodTile}
                    {cycleTile}
                </>
            )}
        </div>
    )
  }

