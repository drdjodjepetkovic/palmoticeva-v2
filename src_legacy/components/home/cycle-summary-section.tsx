"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CycleStats } from '@/components/menstrual-calendar/cycle-stats';
import { CycleLegend } from '@/components/menstrual-calendar/cycle-legend';
import { useAuth } from "@/context/auth-context";
import type { Cycle } from '@/types/user';

interface CycleSummarySectionProps {
    t: (id: string, fallback?: string) => string | React.ReactNode;
    language: string;
    cycleData: { cycles: Cycle[], avgCycleLength: number, avgPeriodLength: number } | null;
    loading: boolean;
}

export function CycleSummarySection({ t, language, cycleData, loading }: CycleSummarySectionProps) {
    const { user } = useAuth();

    if (!user) return null;

    if (loading) {
        return (
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-base"><Skeleton className="h-5 w-32" /></CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <Skeleton className="h-36 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!cycleData || cycleData.cycles.length === 0) {
        return (
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-base">{t('homepage_cycle_summary_title', 'Pregled Ciklusa') as React.ReactNode}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-center text-sm text-muted-foreground">
                    {t('homepage_cycle_empty_state', 'Unesite svoj prvi ciklus u kalendar da biste ovde videli pregled.') as React.ReactNode}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">{t('homepage_cycle_summary_title', 'Pregled Ciklusa') as React.ReactNode}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <CycleStats avgPeriodLength={cycleData.avgPeriodLength} avgCycleLength={cycleData.avgCycleLength} t={t as (id: string, fallback?: string) => React.ReactNode} />
                <div className="mt-4">
                    <CycleLegend cycles={cycleData.cycles} avgCycleLength={cycleData.avgCycleLength} language={language as any} t={t as (key: string) => string} />
                </div>
            </CardContent>
        </Card>
    )
}
