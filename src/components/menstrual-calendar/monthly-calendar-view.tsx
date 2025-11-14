"use client";

import React, { useState, useMemo } from 'react';
import { format, addDays, isSameDay, startOfDay, formatISO, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DailyEvent, Cycle } from '@/types/user';
import { Heart, Droplet, Frown, Smile, Sun, Moon, UserCheck, ShieldAlert } from 'lucide-react';
import { enUS, sr, srLatn, ru, type Locale } from 'date-fns/locale';

const localeMap: Record<string, Locale> = {
    'en': enUS,
    'se-lat': srLatn,
    'se': sr,
    'ru': ru
};

const eventIcons: { [key in keyof Omit<DailyEvent, 'id' | 'date'>]: React.ElementType } = {
    intercourse: Heart,
    pain: Frown,
    spotting: Droplet,
    mood: Smile,
    hotFlashes: Sun,
    insomnia: Moon,
    routineCheckup: UserCheck,
    problemCheckup: ShieldAlert
};

interface MonthlyCalendarViewProps {
  periodDays: Set<string>;
  predictedPeriodDays: Set<string>;
  fertileDays: Set<string>;
  ovulationDays: Set<string>;
  dailyEvents: Record<string, DailyEvent>;
  onDayClick: (day: Date) => void;
  language: string;
}

const weekDaysMap: { [key: string]: string[] } = {
    'en': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    'se-lat': ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'],
    'se': ['Пон', 'Уто', 'Сре', 'Чет', 'Пет', 'Суб', 'Нед'],
    'ru': ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
};


export function MonthlyCalendarView({ 
    periodDays, 
    predictedPeriodDays, 
    fertileDays, 
    ovulationDays,
    dailyEvents,
    onDayClick,
    language
}: MonthlyCalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

    const daysInMonth = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);
    
    // Create an array of 42 days (6 weeks) to represent the calendar grid
    const calendarGridDays = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const startDate = startOfWeek(start, { weekStartsOn: 1 });
        const endDate = endOfWeek(end, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);


    const weekDays = weekDaysMap[language] || weekDaysMap['se-lat'];

    const getDayClassNames = (day: Date) => {
        const dateKey = formatISO(day, { representation: 'date' });
        return cn(
            'h-12 w-12 flex flex-col items-center justify-center rounded-full text-sm relative',
            !isSameMonth(day, currentMonth) && 'text-muted-foreground/50',
            isToday(day) && 'bg-primary/20 text-primary-foreground font-bold',
            {
                'bg-destructive/80 text-destructive-foreground': periodDays.has(dateKey),
                'bg-destructive/30': predictedPeriodDays.has(dateKey),
                'bg-primary/40': fertileDays.has(dateKey),
                'border-2 border-primary': ovulationDays.has(dateKey),
            }
        );
    };
    
    const renderEventDots = (day: Date) => {
        const dateKey = formatISO(day, { representation: 'date' });
        const event = dailyEvents[dateKey];
        if (!event) return null;

        const loggedSymptoms = Object.entries(event)
            .filter(([key, value]) => key !== 'id' && key !== 'date' && value === true)
            .map(([key]) => key);
        
        if (loggedSymptoms.length === 0) return null;
        
        return (
            <div className="absolute bottom-1 flex gap-0.5">
                {loggedSymptoms.slice(0, 3).map(symptom => {
                     const Icon = eventIcons[symptom as keyof typeof eventIcons];
                     if(Icon) return <Icon key={symptom} className="h-2 w-2 text-muted-foreground" />
                     return <div key={symptom} className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></div>
                })}
            </div>
        )
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h3 className="text-lg font-semibold capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: localeMap[language] })}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarGridDays.map((day, index) => (
                    <div key={index} className="flex justify-center items-center">
                        <button onClick={() => onDayClick(day)} className={getDayClassNames(day)}>
                           <span>{format(day, 'd')}</span>
                           {renderEventDots(day)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
