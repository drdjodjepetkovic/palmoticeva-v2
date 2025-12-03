"use client";

import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { enUS, sr, srLatn, ru } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import type { AppLanguage } from '@/core/types';
import { useContent } from "@/features/content/content-context";
import { CalendarDays, Egg, Baby } from 'lucide-react';

const localeMap: Record<AppLanguage, Locale> = {
    en: enUS,
    'sr': srLatn,
    ru: ru,
};

interface CyclePredictionsProps {
    nextPeriodDate: Date | null;
    ovulationDate: Date | null;
    fertileStartDate: Date | null;
    fertileEndDate: Date | null;
}

export function CyclePredictions({
    nextPeriodDate,
    ovulationDate,
    fertileStartDate,
    fertileEndDate
}: CyclePredictionsProps) {
    const { language, t } = useContent();
    const locale = localeMap[language as AppLanguage] || srLatn;

    if (!nextPeriodDate) return null;

    return (
        <div className="grid grid-cols-1 gap-3 w-full max-w-md">
            {/* Next Period */}
            <Card className="bg-rose-50 border-rose-100 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 rounded-full text-rose-600">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-rose-600 uppercase tracking-wide">
                                {t.calendar?.period || "Sledeća Menstruacija"}
                            </p>
                            <p className="text-lg font-bold text-rose-900">
                                {format(nextPeriodDate, 'd. MMMM', { locale })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
                {/* Ovulation */}
                {ovulationDate && (
                    <Card className="bg-sky-50 border-sky-100 shadow-sm">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sky-600">
                                <Egg className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase">Ovulacija</span>
                            </div>
                            <p className="text-base font-bold text-sky-900">
                                {format(ovulationDate, 'd. MMM', { locale })}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Fertile Window */}
                {fertileStartDate && fertileEndDate && (
                    <Card className="bg-sky-50/50 border-sky-100 shadow-sm">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sky-500">
                                <Baby className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase">Plodni dani</span>
                            </div>
                            <p className="text-sm font-bold text-sky-900">
                                {format(fertileStartDate, 'd.', { locale })} - {format(fertileEndDate, 'd. MMM', { locale })}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
