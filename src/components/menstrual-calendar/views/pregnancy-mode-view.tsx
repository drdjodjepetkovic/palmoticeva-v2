// src/components/menstrual-calendar/views/pregnancy-mode-view.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format, differenceInWeeks, differenceInDays, startOfDay, addDays } from 'date-fns';
import { Baby, UserCircle, Milestone } from 'lucide-react';
import type { LanguageCode } from '@/types/content';
import { enUS, sr, srLatn, ru, type Locale } from 'date-fns/locale';

const localeMap: Record<LanguageCode, Locale> = {
    en: enUS,
    'se-lat': srLatn,
    se: sr,
    ru: ru,
};

interface PregnancyModeProps {
    lmp: Date;
    t: (key: string) => string;
    language: LanguageCode;
}

export function PregnancyModeView({ lmp, t, language }: PregnancyModeProps) {
    const today = startOfDay(new Date());
    const gestationalWeeks = differenceInWeeks(today, lmp);
    const gestationalDays = differenceInDays(today, lmp);
    const remainingDays = 280 - gestationalDays;
    const progressPercentage = (gestationalDays / 280) * 100;
    const dueDate = addDays(lmp, 280);

    let trimester: 1 | 2 | 3 = 1;
    if (gestationalWeeks > 27) {
        trimester = 3;
    } else if (gestationalWeeks > 13) {
        trimester = 2;
    }

    const babyInfoKey = `trimester_${trimester}_baby` as const;
    const momInfoKey = `trimester_${trimester}_mom` as const;
    const trimesterText = `${t('pregnancy_trimester')} ${trimester}`;

    return (
        <div className="space-y-6">
            <Card className="shadow-lg text-center overflow-hidden">
                 <div className="p-6 bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                    <CardTitle className="text-5xl font-bold">{gestationalWeeks}<span className="text-2xl font-medium">w</span> {gestationalDays % 7}<span className="text-2xl font-medium">d</span></CardTitle>
                    <CardDescription className="text-pink-100">{t('gestational_week')}</CardDescription>
                </div>
                 <CardContent className="p-6 space-y-4">
                    <div>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-muted-foreground">{trimesterText}</span>
                             <span className="font-semibold">{t('estimated_due_date')}: {format(dueDate, 'd. MMM yyyy', { locale: localeMap[language] })}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                        <p className="text-xs text-muted-foreground text-right mt-1">{remainingDays} {t('days_left')}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary"><Baby className="h-6 w-6" /> {t('pregnancy_baby_title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                       {t(babyInfoKey)}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary"><UserCircle className="h-6 w-6" /> {t('pregnancy_mom_title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                        {t(momInfoKey)}
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Milestone className="h-5 w-5"/> Budući Koraci</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                    Ovde će biti lista predstojećih pregleda i važnih datuma.
                </CardContent>
            </Card>
        </div>
    )
}
