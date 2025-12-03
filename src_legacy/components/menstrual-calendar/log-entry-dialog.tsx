// src/components/menstrual-calendar/log-entry-dialog.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Heart, Droplet, Frown, Smile, Sun, Moon, UserCheck, ShieldAlert, CalendarIcon } from 'lucide-react';
import { format, formatISO, isSameDay, isWithinInterval, startOfDay, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Cycle, DailyEvent, TrackingMode } from '@/types/user';
import type { LanguageCode } from '@/types/content';
import { enUS, sr, srLatn, ru, type Locale } from 'date-fns/locale';

const localeMap: Record<LanguageCode, Locale> = {
    en: enUS,
    'sr': srLatn,
    se: sr,
    ru: ru,
};

interface LogEntryDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    day: Date | null;
    cycles: Cycle[];
    event?: DailyEvent;
    onSaveEvent: (event: DailyEvent) => void;
    onPeriodLog: (startDate: Date, endDate?: Date | null) => void;
    onPeriodEndToggle: (endDate: Date, cycleId: string) => void;
    t: (key: string) => string;
    language: LanguageCode;
    trackingMode: TrackingMode;
}

export function LogEntryDialog({ isOpen, onOpenChange, day, cycles, event, onSaveEvent, onPeriodLog, onPeriodEndToggle, t, language, trackingMode }: LogEntryDialogProps) {
    const [currentEvent, setCurrentEvent] = useState<Omit<DailyEvent, 'date' | 'id'>>({});
    
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
    const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

    useEffect(() => {
        if (event) {
            const { date, ...rest } = event;
            setCurrentEvent(rest);
        } else {
            setCurrentEvent({});
        }

        if (day) {
            setStartDate(day);
        } else {
            setStartDate(undefined);
        }
        setEndDate(undefined);
    }, [event, isOpen, day]);

    const handleSave = () => {
        if (!day) return;
        const dateKey = formatISO(day, { representation: 'date' });
        onSaveEvent({ id: event?.id || dateKey, date: dateKey, ...currentEvent });
        onOpenChange(false);
    };

    const handleSaveNewCycle = () => {
        if (!startDate) return;
        onPeriodLog(startDate, endDate);
        onOpenChange(false);
    };

    const handleSymptomToggle = (symptom: keyof Omit<DailyEvent, 'date' | 'id'>) => {
        setCurrentEvent(prev => ({ ...prev, [symptom]: !prev[symptom] }));
    };

    const generalSymptoms: { key: keyof Omit<DailyEvent, 'date'|'id'>, icon: React.ElementType, label: string }[] = [
        { key: 'routineCheckup', icon: UserCheck, label: t('symptomRoutineCheckup') },
        { key: 'problemCheckup', icon: ShieldAlert, label: t('symptomProblemCheckup') },
    ];

    const cycleSymptoms: { key: keyof Omit<DailyEvent, 'date'|'id'>, icon: React.ElementType, label: string }[] = [
        { key: 'intercourse', icon: Heart, label: t('symptomIntercourse') },
        { key: 'pain', icon: Frown, label: t('symptomPain') },
        { key: 'spotting', icon: Droplet, label: t('symptomSpotting') },
        { key: 'mood', icon: Smile, label: t('symptomMood') },
    ];
    
    const menopauseSymptoms: { key: keyof Omit<DailyEvent, 'date'|'id'>, icon: React.ElementType, label: string }[] = [
        { key: 'hotFlashes', icon: Sun, label: t('symptomHotFlashes') },
        { key: 'insomnia', icon: Moon, label: t('symptomInsomnia') },
        { key: 'mood', icon: Smile, label: t('symptomMood') },
        { key: 'spotting', icon: Droplet, label: t('symptomSpotting') },
    ];
    
    const getSymptomConfig = () => {
      let modeSymptoms: { key: keyof Omit<DailyEvent, 'date'|'id'>, icon: React.ElementType, label: string }[] = [];
      if (trackingMode === 'cycling') modeSymptoms = cycleSymptoms;
      else if (trackingMode === 'menopause') modeSymptoms = menopauseSymptoms;
      return [...generalSymptoms, ...modeSymptoms];
    }
    
    const symptomConfig = getSymptomConfig();

    if (day) {
        const dayStart = startOfDay(day);
        const cycleOnDay = cycles.find(c => c.type === 'regular' && isSameDay(dayStart, c.startDate));
        const cycleContainingDay = cycles.find(c => 
            c.type === 'regular' &&
            isWithinInterval(dayStart, { start: c.startDate, end: c.endDate || addDays(c.startDate, 90) })
        );

        const handlePeriodButtonClick = () => {
            onPeriodLog(dayStart); 
            onOpenChange(false);
        }

        const handlePeriodEndClick = () => {
            if (!cycleContainingDay) return;
            onPeriodEndToggle(dayStart, cycleContainingDay.id);
            onOpenChange(false);
        }

        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('logForDate')} {format(day, 'PPP', { locale: localeMap[language] })}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        {trackingMode === 'cycling' && (
                          <div className="space-y-4">
                            <Button onClick={handlePeriodButtonClick} variant={cycleOnDay ? "destructive" : "default"} className="w-full">
                               {cycleOnDay ? t('removePeriodLog') : t('logPeriodStart')}
                            </Button>
                            {cycleContainingDay && !cycleOnDay && (
                               <Button onClick={handlePeriodEndClick} variant="outline" className="w-full">
                                {t(cycleContainingDay.endDate && isSameDay(cycleContainingDay.endDate, day) ? 'changePeriodEnd' : 'logPeriodEnd')}
                               </Button>
                            )}
                          </div>
                        )}
                        
                        {symptomConfig.length > 0 && (
                            <div>
                                <Label>{t('logSymptoms')}</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {symptomConfig.map(({ key, icon: Icon, label }) => (
                                        <Button
                                            key={key}
                                            variant="outline"
                                            onClick={() => handleSymptomToggle(key)}
                                            className={cn("h-16 flex-col gap-1", currentEvent[key] && "bg-primary/20 border-primary")}
                                        >
                                            <Icon />
                                            <span className="text-xs">{label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                     <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">{t('cancel')}</Button>
                        </DialogClose>
                        <Button onClick={handleSave}>{t('save')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    // Dialog for a new, unselected cycle from history
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('log_new_cycle_title') || 'Unos Novog Ciklusa'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
                <Label>{t('period_start_date_label') || 'Početak menstruacije'}</Label>
                <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                  <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: localeMap[language] }) : <span>{t('appointments_date_placeholder')}</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => { setStartDate(d); setIsStartCalendarOpen(false); }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      locale={localeMap[language]}
                      weekStartsOn={1}
                      
                    />
                  </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label>Kraj menstruacije (opciono)</Label>
                <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                  <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: localeMap[language] }) : <span>{t('appointments_date_placeholder')}</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => { setEndDate(d || undefined); setIsEndCalendarOpen(false); }}
                      disabled={(date) => !startDate || date < startDate || date > new Date() }
                      initialFocus
                      locale={localeMap[language]}
                      weekStartsOn={1}
                      
                    />
                  </PopoverContent>
                </Popover>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
              <DialogClose asChild><Button variant="outline">{t('cancel')}</Button></DialogClose>
              <Button onClick={handleSaveNewCycle} disabled={!startDate}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
