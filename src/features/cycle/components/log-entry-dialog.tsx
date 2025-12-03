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
import type { Cycle, DailyEvent } from '@/core/types';
import { enUS, sr, srLatn, ru, type Locale } from 'date-fns/locale';
import { useContent } from '@/features/content/content-context';

const localeMap: Record<string, Locale> = {
    'en': enUS,
    'sr': srLatn,
    'se': sr,
    'ru': ru
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
    language: string;
}

export function LogEntryDialog({ isOpen, onOpenChange, day, cycles, event, onSaveEvent, onPeriodLog, onPeriodEndToggle, language }: LogEntryDialogProps) {
    const { t } = useContent();
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

    // Hardcoded for now, can be dynamic later
    const trackingMode: string = 'cycling';

    const generalSymptoms: { key: keyof Omit<DailyEvent, 'date' | 'id'>, icon: React.ElementType, label: string }[] = [
        { key: 'routineCheckup', icon: UserCheck, label: t.cycle.symptomRoutineCheckup },
        { key: 'problemCheckup', icon: ShieldAlert, label: t.cycle.symptomProblemCheckup },
    ];

    const cycleSymptoms: { key: keyof Omit<DailyEvent, 'date' | 'id'>, icon: React.ElementType, label: string }[] = [
        { key: 'intercourse', icon: Heart, label: t.cycle.symptomIntercourse },
        { key: 'pain', icon: Frown, label: t.cycle.symptomPain },
        { key: 'spotting', icon: Droplet, label: t.cycle.symptomSpotting },
        { key: 'mood', icon: Smile, label: t.cycle.symptomMood },
    ];

    const menopauseSymptoms: { key: keyof Omit<DailyEvent, 'date' | 'id'>, icon: React.ElementType, label: string }[] = [
        { key: 'hotFlashes', icon: Sun, label: t.cycle.symptomHotFlashes },
        { key: 'insomnia', icon: Moon, label: t.cycle.symptomInsomnia },
        { key: 'mood', icon: Smile, label: t.cycle.symptomMood },
        { key: 'spotting', icon: Droplet, label: t.cycle.symptomSpotting },
    ];

    const currentLocale = localeMap[language] || enUS;

    const activeCycle = cycles.find(cycle => day && isSameDay(cycle.startDate, day));
    const isPeriodStartDay = day && activeCycle;
    const isPeriodEndDay = day && cycles.some(cycle => cycle.endDate && isSameDay(cycle.endDate, day));

    if (day) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t.cycle.logForDate} {format(day, 'PPP', { locale: currentLocale })}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {isPeriodStartDay && (
                            <div className="flex flex-col gap-2">
                                <Label>{t.cycle.logPeriodStart}</Label>
                                <div className="flex items-center gap-2">
                                    <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP", { locale: currentLocale }) : <span>{t.common.save}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={(date) => {
                                                    setStartDate(date || undefined);
                                                    setIsStartCalendarOpen(false);
                                                }}
                                                initialFocus
                                                locale={currentLocale}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Button onClick={handleSaveNewCycle}>{t.common.save}</Button>
                                </div>
                            </div>
                        )}

                        {isPeriodEndDay && activeCycle && (
                            <div className="flex flex-col gap-2">
                                <Label>{t.cycle.logPeriodEnd}</Label>
                                <div className="flex items-center gap-2">
                                    <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP", { locale: currentLocale }) : <span>{t.common.save}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={(date) => {
                                                    setEndDate(date || undefined);
                                                    setIsEndCalendarOpen(false);
                                                }}
                                                initialFocus
                                                locale={currentLocale}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Button onClick={() => {
                                        if (endDate && activeCycle) {
                                            onPeriodEndToggle(endDate, activeCycle.id);
                                            onOpenChange(false);
                                        }
                                    }}>{t.common.save}</Button>
                                </div>
                            </div>
                        )}

                        {!isPeriodStartDay && !isPeriodEndDay && (
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {generalSymptoms.map(({ key, icon: Icon, label }) => (
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
                                <div className="grid grid-cols-2 gap-2">
                                    {trackingMode === 'cycling' && cycleSymptoms.map(({ key, icon: Icon, label }) => (
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
                                    {trackingMode === 'menopause' && menopauseSymptoms.map(({ key, icon: Icon, label }) => (
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
                            <Button variant="outline">{t.common.cancel}</Button>
                        </DialogClose>
                        <Button onClick={handleSave}>{t.common.save}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return null;
}
