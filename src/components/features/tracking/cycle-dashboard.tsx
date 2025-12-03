"use client";

import { useState } from 'react';
import { useContent } from "@/features/content/content-context";
import { CycleWheel } from './cycle-wheel';
import { CycleStats } from './cycle-stats';
import { CycleHistory } from './cycle-history';
import { CycleLegend } from './cycle-legend';
import { CyclePredictions } from './cycle-predictions';
import { MonthlyCalendarView } from "@/features/cycle/components/monthly-calendar-view";
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, RotateCcw, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCycle } from "@/features/cycle/use-cycle";
import { useDailyEvents } from "@/features/cycle/use-daily-events";
import { formatISO, addDays, eachDayOfInterval } from "date-fns";
import { LogEntryDialog } from "@/features/cycle/components/log-entry-dialog";

interface CycleDashboardProps {
    periodDays: Set<string>;
    predictedPeriodDays: Set<string>;
    fertileDays: Set<string>;
    ovulationDays: Set<string>;
    dailyEvents: any;
    onDayClick: (day: Date) => void;
    selectedDay: Date | null;
}

export function CycleDashboard({
    periodDays,
    predictedPeriodDays,
    fertileDays,
    ovulationDays,
    dailyEvents,
    onDayClick,
    selectedDay
}: CycleDashboardProps) {
    const { t, language } = useContent();
    const [viewMode, setViewMode] = useState<'wheel' | 'calendar'>('wheel');
    const { history, stats, logPeriod, togglePeriodEnd } = useCycle();
    const { saveEvent } = useDailyEvents();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogDate, setDialogDate] = useState<Date | null>(null);

    const activeCycle = history.find(c => !c.endDate);
    const daysUntilPeriod = stats?.avgCycleLength ?
        (activeCycle ? stats.avgCycleLength - Math.floor((new Date().getTime() - activeCycle.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0)
        : null;

    // Calculate prediction dates
    const today = new Date();
    const nextPeriodDate = daysUntilPeriod !== null ? addDays(today, daysUntilPeriod) : null;

    // Find next ovulation date from set
    const ovulationDateStr = Array.from(ovulationDays).sort().find(d => d >= formatISO(today, { representation: 'date' }));
    const ovulationDate = ovulationDateStr ? new Date(ovulationDateStr) : null;

    // Find next fertile window
    const fertileDates = Array.from(fertileDays).sort().filter(d => d >= formatISO(today, { representation: 'date' }));
    const fertileStartDate = fertileDates.length > 0 ? new Date(fertileDates[0]) : null;
    const fertileEndDate = fertileDates.length > 0 ? new Date(fertileDates[fertileDates.length - 1]) : null; // Simplified, ideally group by contiguous

    const handleLogClick = () => {
        setDialogDate(new Date());
        setIsDialogOpen(true);
    };

    const handleDayClickInternal = (day: Date) => {
        setDialogDate(day);
        setIsDialogOpen(true);
        onDayClick(day);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* View Toggle */}
            <div className="flex justify-center">
                <div className="bg-muted p-1 rounded-full flex items-center">
                    <Button
                        variant={viewMode === 'wheel' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('wheel')}
                        className="rounded-full px-6"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Ciklus
                    </Button>
                    <Button
                        variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('calendar')}
                        className="rounded-full px-6"
                    >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Kalendar
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                {viewMode === 'wheel' ? (
                    <div className="w-full flex flex-col items-center space-y-8">
                        <CycleWheel
                            avgCycleLength={stats?.avgCycleLength || 28}
                            daysUntilPeriod={daysUntilPeriod}
                            activeCycle={activeCycle}
                            periodDays={periodDays}
                            predictedPeriodDays={predictedPeriodDays}
                            fertileDays={fertileDays}
                            ovulationDays={ovulationDays}
                            t={t}
                        />

                        <CycleLegend />

                        <CyclePredictions
                            nextPeriodDate={nextPeriodDate}
                            ovulationDate={ovulationDate}
                            fertileStartDate={fertileStartDate}
                            fertileEndDate={fertileEndDate}
                        />

                        <div className="w-full max-w-md space-y-6">

                            <CycleStats
                                avgCycleLength={stats?.avgCycleLength || 28}
                                avgPeriodLength={stats?.avgPeriodLength || 5}
                                t={t}
                            />

                            {/* Tip of the Day Placeholder - Could be dynamic */}
                            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-100">
                                <CardContent className="p-4 flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-teal-500" />
                                    </div>
                                    <div>
                                        <p className="font-serif font-bold text-teal-900 mb-1">Savet Dana</p>
                                        <p className="text-sm text-teal-700 leading-relaxed">
                                            U danima pred menstruaciju, smanjite unos soli i kofeina kako biste umanjili nadutost i razdražljivost.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <CycleHistory cycles={history} t={t} />
                        </div>
                    </div>
                ) : (
                    <MonthlyCalendarView
                        periodDays={periodDays}
                        predictedPeriodDays={predictedPeriodDays}
                        fertileDays={fertileDays}
                        ovulationDays={ovulationDays}
                        dailyEvents={dailyEvents}
                        onDayClick={handleDayClickInternal}
                        language={language}
                        selectedDay={selectedDay}
                    />
                )}
            </div>

            <LogEntryDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                day={dialogDate || new Date()}
                cycles={history}
                event={dialogDate ? dailyEvents[formatISO(dialogDate, { representation: 'date' })] : undefined}
                onSaveEvent={async (event) => {
                    if (dialogDate) {
                        const dateKey = formatISO(dialogDate, { representation: 'date' });
                        await saveEvent(dateKey, event);
                    }
                }}
                onPeriodLog={(start, end) => logPeriod(start, end || undefined)}
                onPeriodEndToggle={(end, id) => togglePeriodEnd(end || undefined, id)}
                language={language}
            />
        </div>
    );
}
