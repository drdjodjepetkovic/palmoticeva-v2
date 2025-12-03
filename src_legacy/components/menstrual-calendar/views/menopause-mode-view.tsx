// src/components/menstrual-calendar/views/menopause-mode-view.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInYears, differenceInMonths, startOfDay } from 'date-fns';
import { BarChart, Info } from 'lucide-react';

interface MenopauseModeProps {
    lmp: Date;
    t: (key: string) => string;
}

export function MenopauseModeView({ lmp, t }: MenopauseModeProps) {
    const today = startOfDay(new Date());
    const years = differenceInYears(today, lmp);
    const months = differenceInMonths(today, lmp) % 12;

    const timeSinceText = `${years} godina i ${months} meseci od poslednje menstruacije`;

    return (
        <div className="space-y-6">
            <Card className="shadow-lg text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2"><BarChart className="h-6 w-6 text-primary" /> Menopauza</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                     <p className="text-2xl font-bold">{timeSinceText}</p>
                     <p className="text-sm text-muted-foreground">Ovaj mod je prilagođen za praćenje simptoma u perimenopauzi i menopauzi.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5"/> Važno je znati</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm space-y-2">
                    <p>Redovno praćenje simptoma poput valunga, nesanice i promena raspoloženja može pomoći vašem lekaru da vam pruži najbolju moguću negu.</p>
                    <p>Ne zaboravite na redovne preventivne preglede i konsultacije o hormonskoj terapiji ukoliko je potrebna.</p>
                </CardContent>
            </Card>
        </div>
    )
}
