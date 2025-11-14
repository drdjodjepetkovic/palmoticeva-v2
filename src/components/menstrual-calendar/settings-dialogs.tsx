// src/components/menstrual-calendar/settings-dialogs.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings, Bell, CalendarClock, CalendarIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { TrackingMode } from '@/types/user';
import type { LanguageCode } from '@/types/content';
import { enUS, sr, srLatn, ru, type Locale } from 'date-fns/locale';

import { ReminderSettings } from './reminder-settings';
import { CalendarExport } from './calendar-export';


const localeMap: Record<LanguageCode, Locale> = {
    en: enUS,
    'se-lat': srLatn,
    se: sr,
    ru: ru,
};

export function TrackingModeDialog({ t, language, onUpdate }: { t: (key: string) => string; language: LanguageCode; onUpdate: () => void; }) {
    const { user, userProfile } = useAuth();
    const { toast } = useToast();
    
    const [mode, setMode] = useState<TrackingMode>(userProfile?.trackingMode || 'cycling');
    const [lastPeriod, setLastPeriod] = useState<Date | undefined>(userProfile?.lastPeriodDate?.toDate());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleSaveChanges = async () => {
        if (!user) return;
        if ((mode === 'menopause' || mode === 'pregnancy') && !lastPeriod) {
            toast({ title: "Greška", description: "Molimo unesite datum poslednje menstruacije.", variant: 'destructive'});
            return;
        }

        const updates: { trackingMode: TrackingMode, lastPeriodDate?: Date | null } = {
            trackingMode: mode,
        };

        if (mode === 'menopause' || mode === 'pregnancy') {
            updates.lastPeriodDate = lastPeriod;
        } else {
            updates.lastPeriodDate = null;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, updates);
            toast({ title: t('modeUpdated') });
            onUpdate();
        } catch (error) {
            console.error("Error updating settings:", error);
            toast({ variant: 'destructive', title: "Greška", description: "Nije moguće sačuvati izmene." });
        }
    };
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4"/> {t('trackingMode')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('trackingMode')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <RadioGroup value={mode} onValueChange={(v) => setMode(v as TrackingMode)} className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="cycling" id="cycling" /><Label htmlFor="cycling">{t('modeCycle')}</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="pregnancy" id="pregnancy" /><Label htmlFor="pregnancy">{t('modePregnancy')}</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="menopause" id="menopause" /><Label htmlFor="menopause">{t('modeMenopause')}</Label></div>
                    </RadioGroup>

                    {(mode === 'menopause' || mode === 'pregnancy') && (
                        <div className="flex flex-col space-y-2">
                            <Label>{t('lastPeriodDate')}</Label>
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !lastPeriod && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {lastPeriod ? format(lastPeriod, "PPP", { locale: localeMap[language] }) : <span>{t('appointments_date_placeholder')}</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={lastPeriod} onSelect={(d) => { setLastPeriod(d); setIsCalendarOpen(false); }} initialFocus locale={localeMap[language]} weekStartsOn={1}/></PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button onClick={handleSaveChanges} className="w-full">{t('saveChanges')}</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export const ReminderDialog = React.memo(({ t }: { t: (key: string) => string }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
                <Bell className="h-4 w-4"/> {t('reminders_title')}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('reminders_title')}</DialogTitle>
            </DialogHeader>
            <ReminderSettings t={t} />
        </DialogContent>
    </Dialog>
));
ReminderDialog.displayName = 'ReminderDialog';

export const ExportDialog = React.memo(({ t }: { t: (key: string) => string }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
                <CalendarClock className="h-4 w-4"/> {t('calendar_export_title')}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('calendar_export_title')}</DialogTitle>
            </DialogHeader>
            <CalendarExport />
        </DialogContent>
    </Dialog>
));
ExportDialog.displayName = 'ExportDialog';
