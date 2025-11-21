
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, addDays, differenceInDays, isSameDay, startOfDay, formatISO, startOfWeek, endOfMonth, eachDayOfInterval, addMonths, subMonths, endOfWeek, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { LanguageCode } from '@/types/content';
import type { Cycle, DailyEvent, TrackingMode, ReminderSettings as ReminderSettingsType } from '@/types/user';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { db, logAnalyticsEvent, setupNotifications } from '@/lib/firebase/client';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Info, Pencil } from 'lucide-react';
import { useContent } from '@/hooks/use-content';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

// Modular Components
import { UnauthenticatedCalendarPrompt } from '@/components/menstrual-calendar/views/unauthenticated-prompt';
import { MenopauseModeView } from '@/components/menstrual-calendar/views/menopause-mode-view';
import { PregnancyModeView } from '@/components/menstrual-calendar/views/pregnancy-mode-view';
import { InitialSetupDialog } from '@/components/menstrual-calendar/initial-setup-dialog';
import { LogEntryDialog } from '@/components/menstrual-calendar/log-entry-dialog';
import { DailyTipCard } from '@/components/menstrual-calendar/daily-tip-card';
import { CycleHistory } from '@/components/menstrual-calendar/cycle-history';
import { CycleStats } from '@/components/menstrual-calendar/cycle-stats';
import { CycleLegend } from '@/components/menstrual-calendar/cycle-legend';
import { CycleWheel } from '@/components/menstrual-calendar/cycle-wheel';
import { EditCyclesSheet } from '@/components/moj-ciklus/edit-cycles-sheet';
import { TrackingModeDialog, ReminderDialog, ExportDialog } from '@/components/menstrual-calendar/settings-dialogs';
import { MonthlyCalendarView } from '@/components/menstrual-calendar/monthly-calendar-view';
import { useEventBus } from '@/context/event-bus-context';
import { UserEventType } from '@/lib/events';
import { recalculateAverages } from '@/lib/cycle-utils';


const contentIds = [
  'calendarTitle', 'calendar_usage_instructions', 'logPeriodStart', 'removePeriodLog', 'logPeriodEnd',
  'periodLogged', 'yourPeriod', 'predictedPeriod', 'fertileWindow', 'ovulationDay', 'loggedEvent',
  'currentCycle', 'calendarStartPrompt', 'calendarEndPrompt', 'legendPeriodStart', 'legendFertileStart',
  'legendOvulation', 'legendFertileEnd', 'myCycles', 'averagePeriod',
  'averageCycle', 'days', 'history', 'irregular', 'dangerZone', 'deleteAllData', 'deleteAllDataConfirmTitle',
  'deleteAllDataConfirmDesc', 'cancel', 'continue', 'initialSetupTitle', 'initialSetupDesc',
  'cycleLengthLabel', 'periodLengthLabel', 'first_day_of_last_period_label', 'saveAndContinue', 'logForDate', 'logSymptoms',
  'symptomIntercourse', 'symptomPain', 'symptomSpotting', 'symptomMood', 'clearLog', 'save',
  'firstDayOfPeriod', 'lastDayOfPeriod', 'fertileWindowStarts', 'fertileWindowEnds', 'daysUntilNextPeriod',
  'calendarLearnsTitle', 'calendarLearnsDesc', 'dataDeletedTitle', 'dataDeletedDesc', 'dataDeletedError', 'loading',
  'unauth_calendar_cta_button', 'fertile', 'settings', 'trackingMode', 'modeCycle', 'modeMenopause', 'modePregnancy',
  'symptomHotFlashes', 'symptomInsomnia', 'lastPeriodDate', 'saveChanges', 'modeUpdated',
  'appointments_date_placeholder', 'lmp_prompt_title', 'lmp_prompt_desc', 'pregnancy_week',
  'pregnancy_trimester', 'pregnancy_progress_title', 'pregnancy_baby_title', 'pregnancy_mom_title',
  'trimester_1_baby', 'trimester_1_mom', 'trimester_2_baby', 'trimester_2_mom', 'trimester_3_baby', 'trimester_3_mom',
  'gestational_week', 'estimated_due_date', 'days_left', 'symptomRoutineCheckup', 'symptomProblemCheckup', 'history_empty_placeholder',
  'log_new_cycle_title', 'period_start_date_label',
  'daily_tip_title', 'tip_period_1', 'tip_period_2', 'tip_fertile_1', 'tip_fertile_2', 'tip_pms_1', 'tip_pms_2', 'tip_default',
  'calendar_export_title', 'calendar_export_subtitle',
  'irregular_cycles_label', 'irregular_cycles_info',
  'changePeriodEnd', 'short_cycle_warning_title', 'short_cycle_warning_desc', 'short_cycle_warning_confirm',
  'edit_cycles_button_text', 'tab_current_cycle', 'tab_monthly_view', 'edit_cycles_sheet_title', 'edit_cycles_sheet_desc',
  'reminders_title', 'reminders_period_label', 'reminders_fertile_label', 'reminders_ovulation_label',
  'reminders_notify_me', 'reminders_days_before',
];

type CycleData = {
  cycles: Cycle[];
  avgCycleLength: number;
  avgPeriodLength: number;
};

function MenstrualCalendarClient() {
  const { language } = useLanguage();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { content, loading: contentLoading } = useContent(contentIds);
  const { emit, on } = useEventBus();

  const t = useCallback((id: string, fallback?: string) => content[id] || fallback || id, [content]);

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [avgCycleLength, setAvgCycleLength] = useState(0);
  const [avgPeriodLength, setAvgPeriodLength] = useState(0);
  const [dailyEvents, setDailyEvents] = useState<Record<string, DailyEvent>>({});
  const [dataLoaded, setDataLoaded] = useState(false);

  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [trackingMode, setTrackingMode] = useState<TrackingMode>('cycling');

  const [shortCycleWarningOpen, setShortCycleWarningOpen] = useState(false);
  const [pendingCycleStart, setPendingCycleStart] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('cycle-view');

  const today = startOfDay(new Date());

  const fetchData = useCallback(async () => {
    if (!user || !userProfile) return;

    // This check is now redundant because the parent handles it, but keep for safety.
    if (!userProfile.hasCompletedOnboarding) {
      setDataLoaded(true);
      return;
    }

    setTrackingMode(userProfile.trackingMode || 'cycling');

    const dataRef = doc(db, 'users', user.uid, 'cycleData', 'main');
    const dataSnap = await getDoc(dataRef);
    if (dataSnap.exists()) {
      const data = dataSnap.data();
      const fetchedCycles = data.cycles?.map((c: any) => ({
        id: c.id,
        startDate: c.startDate.toDate(),
        endDate: c.endDate ? c.endDate.toDate() : null,
        type: c.type || 'regular'
      })) || [];
      setCycles(fetchedCycles);
      setAvgCycleLength(data.avgCycleLength || 0);
      setAvgPeriodLength(data.avgPeriodLength || 0);
    } else {
      // Explicitly set to empty if no data exists
      setCycles([]);
      setAvgCycleLength(0);
      setAvgPeriodLength(0);
    }

    const eventsSnapshot = await getDocs(collection(db, 'users', user.uid, 'dailyEvents'));
    const eventsData: Record<string, DailyEvent> = {};
    eventsSnapshot.forEach(doc => {
      eventsData[doc.id] = doc.data() as DailyEvent;
    });
    setDailyEvents(eventsData);
    setDataLoaded(true);
  }, [user, userProfile]);

  useEffect(() => {
    if (user && userProfile) {
      fetchData();
    }
  }, [user, userProfile, fetchData]);

  // Listen for cycle logged events (e.g. from AI)
  useEffect(() => {
    const unsubscribe = on(UserEventType.CycleLogged, () => {
      console.log('Cycle logged event received, refreshing data...');
      fetchData();
      toast({ title: "Kalendar ažuriran", description: "Novi podaci su učitani." });
    });
    return unsubscribe;
  }, [on, fetchData, toast]);

  const saveCycleData = useCallback(async (data: Partial<CycleData>) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'cycleData', 'main');
    await setDoc(docRef, data, { merge: true });
  }, [user]);

  const saveEventData = useCallback(async (event: DailyEvent) => {
    if (!user || !event.date) return;
    const dateKey = event.date;
    const newEvents = { ...dailyEvents, [dateKey]: event };
    setDailyEvents(newEvents);
    logAnalyticsEvent('symptom_logged', { symptoms: Object.keys(event).filter(k => k !== 'id' && k !== 'date' && event[k as keyof DailyEvent]) });
    const eventDocRef = doc(db, 'users', user.uid, 'dailyEvents', dateKey);
    await setDoc(eventDocRef, event, { merge: true });
  }, [user, dailyEvents]);

  const handleInitialSetupSubmit = async (cycleLength: number, periodLength: number, lastPeriodStartDate: Date, isIrregular: boolean) => {
    if (!user || !userProfile) return;

    const finalCycleLength = isIrregular ? 28 : cycleLength;

    setAvgCycleLength(finalCycleLength);
    setAvgPeriodLength(periodLength);

    const firstCycle: Cycle = {
      id: doc(collection(db, 'users')).id,
      startDate: startOfDay(lastPeriodStartDate),
      endDate: null,
      type: 'regular'
    };

    const userDocRef = doc(db, 'users', user.uid);
    const cycleDataDocRef = doc(db, 'users', user.uid, 'cycleData', 'main');

    const batch = writeBatch(db);
    // Ensure onboarding is marked as complete
    batch.update(userDocRef, { hasCompletedOnboarding: true });
    batch.set(cycleDataDocRef, {
      cycles: [firstCycle],
      avgCycleLength: finalCycleLength,
      avgPeriodLength: periodLength,
      isIrregular: isIrregular
    });

    await batch.commit();

    emit(UserEventType.FirstCycleLogged);
    sessionStorage.setItem('cycle_logged', 'true');

    // Instead of reload, just fetch new data
    fetchData();
  };

  const handlePeriodLog = async (startDate: Date, endDate?: Date | null) => {
    if (!user || !userProfile) return;
    const dayStart = startOfDay(startDate);

    const existingCycle = cycles.find(c => c.id !== 'predicted' && isSameDay(c.startDate, dayStart));
    if (existingCycle) {
      const newCycles = cycles.filter(c => c.id !== existingCycle.id);
      const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(newCycles, avgCycleLength, avgPeriodLength);
      setCycles(newCycles);
      setAvgCycleLength(newAvgCycleLength);
      setAvgPeriodLength(newAvgPeriodLength);
      await saveCycleData({ cycles: newCycles, avgCycleLength: newAvgCycleLength, avgPeriodLength: newAvgPeriodLength });
      toast({ title: "Unos uklonjen" });
      return;
    }

    const lastCycle = cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];
    if (lastCycle && differenceInDays(dayStart, lastCycle.startDate) < 21) {
      setPendingCycleStart(startDate);
      setShortCycleWarningOpen(true);
      return;
    }

    await proceedWithPeriodLog(startDate, endDate);
  };

  const proceedWithPeriodLog = async (startDate: Date, endDate?: Date | null) => {
    if (!user || !userProfile) return;

    logAnalyticsEvent('cycle_logged', { start_date: formatISO(startDate, { representation: 'date' }) });

    // Contextual event for PWA install prompt
    const hadCyclesBefore = cycles.length > 0;

    const newCycle: Cycle = {
      id: doc(collection(db, 'users')).id,
      startDate: startOfDay(startDate),
      endDate: endDate ? startOfDay(endDate) : null,
      type: 'regular'
    };

    const newCycles = [...cycles, newCycle].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(newCycles, avgCycleLength, avgPeriodLength);

    if (newAvgCycleLength !== avgCycleLength || newAvgPeriodLength !== avgPeriodLength) {
      setAvgCycleLength(newAvgCycleLength);
      setAvgPeriodLength(newAvgPeriodLength);
      if (newCycles.filter(c => c.type === 'regular' && c.endDate).length > 1) {
        toast({ title: t('calendarLearnsTitle'), description: t('calendarLearnsDesc') });
      }
    }

    setCycles(newCycles);
    await saveCycleData({ cycles: newCycles, avgCycleLength: newAvgCycleLength, avgPeriodLength: newAvgPeriodLength });
    setIsLogDialogOpen(false);

    if (!hadCyclesBefore && newCycles.length > 0) {
      emit(UserEventType.FirstCycleLogged);
      sessionStorage.setItem('cycle_logged', 'true');
    }
  }

  const handlePeriodEndToggle = async (date: Date, cycleIdToUpdate: string) => {
    const dayEnd = startOfDay(date);
    const newCycles = cycles.map(c =>
      c.id === cycleIdToUpdate
        ? { ...c, endDate: c.endDate && isSameDay(c.endDate, dayEnd) ? null : dayEnd }
        : c
    );

    const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(newCycles, avgCycleLength, avgPeriodLength);

    if (newAvgCycleLength !== avgCycleLength || newAvgPeriodLength !== avgPeriodLength) {
      setAvgCycleLength(newAvgCycleLength);
      setAvgPeriodLength(newAvgPeriodLength);
      toast({ title: t('calendarLearnsTitle'), description: t('calendarLearnsDesc') });
    }

    setCycles(newCycles);
    await saveCycleData({ cycles: newCycles, avgCycleLength: newAvgCycleLength, avgPeriodLength: newAvgPeriodLength });
    setIsLogDialogOpen(false);
  }

  const periodDays = useMemo(() => {
    const days = new Set<string>();
    if (avgPeriodLength === 0 && cycles.length === 0) return days;
    cycles.filter(c => c.type === 'regular').forEach(cycle => {
      const end = cycle.endDate || addDays(cycle.startDate, (avgPeriodLength || 5) - 1);
      for (let d = startOfDay(cycle.startDate); d <= startOfDay(end); d = addDays(d, 1)) {
        days.add(formatISO(d, { representation: 'date' }));
      }
    });
    return days;
  }, [cycles, avgPeriodLength]);

  const predictions = useMemo(() => {
    const predictedPeriodDays = new Set<string>();
    const ovulationDays = new Set<string>();
    const fertileDays = new Set<string>();

    const regularCycles = cycles.filter(c => c.type === 'regular');
    if (regularCycles.length === 0 || !avgCycleLength || avgCycleLength === 0) {
      return { predictedPeriodDays, ovulationDays, fertileDays };
    }

    const lastActualCycle = regularCycles.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];
    if (!lastActualCycle) return { predictedPeriodDays, ovulationDays, fertileDays };

    for (let i = 1; i <= 6; i++) {
      const nextCycleStartDate = addDays(lastActualCycle.startDate, avgCycleLength * i);

      if (avgPeriodLength > 0) {
        for (let j = 0; j < avgPeriodLength; j++) {
          const dayToAdd = addDays(nextCycleStartDate, j);
          if (!periodDays.has(formatISO(dayToAdd, { representation: 'date' }))) {
            predictedPeriodDays.add(formatISO(dayToAdd, { representation: 'date' }));
          }
        }
      }

      const ovulationDate = addDays(nextCycleStartDate, -14);
      ovulationDays.add(formatISO(ovulationDate, { representation: 'date' }));

      for (let j = -4; j <= 1; j++) {
        fertileDays.add(formatISO(addDays(ovulationDate, j), { representation: 'date' }));
      }
    }
    return { predictedPeriodDays, ovulationDays, fertileDays };
  }, [cycles, avgCycleLength, avgPeriodLength, periodDays]);

  const { predictedPeriodDays, ovulationDays, fertileDays } = predictions;

  const daysUntilNextPeriod = useMemo(() => {
    if (!dataLoaded) return null;
    const lastCycle = cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];
    if (!lastCycle) return null;

    const expectedNext = addDays(lastCycle.startDate, avgCycleLength);
    return differenceInDays(expectedNext, today);
  }, [cycles, avgCycleLength, today, dataLoaded]);

  const handleDayClick = useCallback((day: Date) => {
    setSelectedDay(day);
    setIsLogDialogOpen(true);
  }, []);

  const handleLogMissedPeriod = useCallback((date: Date) => {
    setSelectedDay(null);
    setIsLogDialogOpen(true);
  }, []);

  const handleLogIrregularPeriod = useCallback(async (date: Date) => {
    const newCycles = [...cycles];
    newCycles.push({
      id: doc(collection(db, 'users')).id,
      startDate: date,
      endDate: null,
      type: 'irregular'
    });
    newCycles.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    setCycles(newCycles);
    await saveCycleData({ cycles: newCycles, avgCycleLength, avgPeriodLength });
    toast({ title: "Zabeleženo", description: "Neregularan ciklus je zabeležen." });
  }, [cycles, avgCycleLength, avgPeriodLength, saveCycleData, toast]);


  if (contentLoading || !dataLoaded) {
    return (
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <header className="text-center mb-12 flex flex-col items-center gap-4 pt-12">
          <div>
            <Skeleton className="h-10 w-64" />
          </div>
        </header>
        <div className="w-full space-y-8">
          <Skeleton className="w-full h-96" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="w-full h-48" />
        </div>
      </div>
    );
  }

  if (!userProfile?.hasCompletedOnboarding || (dataLoaded && cycles.length === 0)) {
    return <InitialSetupDialog isOpen={true} onSubmit={handleInitialSetupSubmit} t={t} language={language} />
  }

  const activeCycle = cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];

  const MainContent = () => {
    if (userProfile?.trackingMode === 'pregnancy') {
      if (!userProfile.lastPeriodDate) {
        return (
          <Card className="text-center p-8">
            <Info className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle>{t('lmp_prompt_title')}</CardTitle>
            <CardDescription>{t('lmp_prompt_desc')}</CardDescription>
          </Card>
        )
      }
      return <PregnancyModeView lmp={userProfile.lastPeriodDate.toDate()} t={t} language={language} />;
    }

    if (userProfile?.trackingMode === 'menopause') {
      if (!userProfile.lastPeriodDate) {
        return (
          <Card className="text-center p-8">
            <Info className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle>{t('lmp_prompt_title')}</CardTitle>
            <CardDescription>{t('lmp_prompt_desc')}</CardDescription>
          </Card>
        )
      }
      return <MenopauseModeView lmp={userProfile.lastPeriodDate.toDate()} t={t} />;
    }

    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <TabsList>
                  <TabsTrigger value="cycle-view">{t('tab_current_cycle', 'Trenutni Ciklus')}</TabsTrigger>
                  <TabsTrigger value="month-view">{t('tab_monthly_view', 'Mesečni Pregled')}</TabsTrigger>
                </TabsList>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary gap-1 p-0 h-auto">
                      <Pencil className="h-4 w-4" />
                      {t('edit_cycles_button_text', 'Uredi cikluse')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('edit_cycles_sheet_title', 'Izmena Ciklusa')}</DialogTitle>
                      <DialogDescription>
                        {t('edit_cycles_sheet_desc', 'Ovde možete ručno dodati, izmeniti ili obrisati cikluse. Promene će automatski ažurirati predikcije.')}
                      </DialogDescription>
                    </DialogHeader>
                    <EditCyclesSheet
                      cycles={cycles}
                      onCyclesUpdate={(updatedCycles) => {
                        setCycles(updatedCycles);
                        const { newAvgCycleLength, newAvgPeriodLength } = recalculateAverages(updatedCycles, avgCycleLength, avgPeriodLength);
                        saveCycleData({ cycles: updatedCycles, avgCycleLength: newAvgCycleLength, avgPeriodLength: newAvgPeriodLength });
                        setAvgCycleLength(newAvgCycleLength);
                        setAvgPeriodLength(newAvgPeriodLength);
                      }}
                      t={t}
                      language={language}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="cycle-view">
                {cycles.length > 0 || avgCycleLength > 0 ? (
                  <>
                    <CycleWheel
                      avgCycleLength={avgCycleLength}
                      daysUntilPeriod={daysUntilNextPeriod}
                      activeCycle={activeCycle}
                      periodDays={periodDays}
                      predictedPeriodDays={predictedPeriodDays}
                      fertileDays={fertileDays}
                      ovulationDays={ovulationDays}
                      t={t}
                    />
                    <CycleLegend
                      cycles={cycles}
                      avgCycleLength={avgCycleLength}
                      language={language}
                      t={t}
                    />
                  </>
                ) : (
                  <div className="text-center text-muted-foreground p-4 h-[300px] flex flex-col justify-center items-center">
                    <Info className="mx-auto h-8 w-8 mb-2" />
                    <div>{!activeCycle ? t('calendarStartPrompt') : t('calendarEndPrompt')}</div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="month-view">
                <MonthlyCalendarView
                  periodDays={periodDays}
                  predictedPeriodDays={predictedPeriodDays}
                  fertileDays={fertileDays}
                  ovulationDays={ovulationDays}
                  dailyEvents={dailyEvents}
                  onDayClick={handleDayClick}
                  language={language}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
        <DailyTipCard periodDays={periodDays} fertileDays={fertileDays} avgCycleLength={avgCycleLength} activeCycle={activeCycle} t={t} />
        <CycleStats avgPeriodLength={avgPeriodLength} avgCycleLength={avgCycleLength} t={t} />
        <CycleHistory
          cycles={cycles}
          avgPeriodLength={avgPeriodLength}
          avgCycleLength={avgCycleLength}
          t={t}
          language={language}
          onLogMissedPeriod={handleLogMissedPeriod}
          onLogIrregularPeriod={handleLogIrregularPeriod}
        />
      </div>
    )
  }

  return (
    <>
      <AlertDialog open={shortCycleWarningOpen} onOpenChange={setShortCycleWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('short_cycle_warning_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('short_cycle_warning_desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingCycleStart(null)}>
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (pendingCycleStart) {
                proceedWithPeriodLog(pendingCycleStart);
              }
              setPendingCycleStart(null);
            }}>
              {t('short_cycle_warning_confirm', 'Da, sigurna sam')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LogEntryDialog
        isOpen={isLogDialogOpen}
        onOpenChange={setIsLogDialogOpen}
        day={selectedDay}
        cycles={cycles}
        event={selectedDay ? dailyEvents[formatISO(selectedDay, { representation: 'date' })] : undefined}
        onSaveEvent={saveEventData}
        onPeriodLog={handlePeriodLog}
        onPeriodEndToggle={handlePeriodEndToggle}
        t={t}
        language={language}
        trackingMode={userProfile?.trackingMode || 'cycling'}
      />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <header className="text-center mb-12 flex flex-col items-center gap-4 pt-12">
          <div>
            <h1 className="text-4xl font-headline font-bold">{t('calendarTitle')}</h1>
          </div>
        </header>
        <div className="w-full space-y-8">
          <MainContent />
          <div className="space-y-2">
            <TrackingModeDialog t={t} language={language} onUpdate={fetchData} />
            <ReminderDialog t={t} />
            <ExportDialog t={t} />
          </div>
        </div>
      </div>
    </>
  );
}


export default function MenstrualCalendarPage() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex justify-center items-center h-96">
          <Skeleton className="w-full h-64" />
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return <UnauthenticatedCalendarPrompt />;
  }

  return <MenstrualCalendarClient />;
}


