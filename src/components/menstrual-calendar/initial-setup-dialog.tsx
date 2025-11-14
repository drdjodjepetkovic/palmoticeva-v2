// src/components/menstrual-calendar/initial-setup-dialog.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { LanguageCode } from '@/types/content';
import { enUS, sr, srLatn, ru, type Locale } from 'date-fns/locale';

const localeMap: Record<LanguageCode, Locale> = {
    en: enUS,
    'se-lat': srLatn,
    se: sr,
    ru: ru,
};

interface InitialSetupDialogProps {
  isOpen: boolean;
  onSubmit: (cycle: number, period: number, lastPeriodStartDate: Date, isIrregular: boolean) => void;
  t: (key: string) => string;
  language: LanguageCode;
}

export function InitialSetupDialog({ isOpen, onSubmit, t, language }: InitialSetupDialogProps) {
  const [cycle, setCycle] = useState(28);
  const [period, setPeriod] = useState(5);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isIrregular, setIsIrregular] = useState(false);

  useEffect(() => {
    if (cycle < 21 || cycle > 35) {
        setIsIrregular(true);
    }
  }, [cycle]);

  const handleCycleChange = (value: number[]) => {
    const cycleNum = value[0];
    setCycle(cycleNum);
    if (cycleNum < 21 || cycleNum > 35) {
        setIsIrregular(true);
    } else {
        setIsIrregular(false);
    }
  };

  const handleSubmit = () => {
    if (lastPeriodDate) {
      onSubmit(isIrregular ? 28 : cycle, period, lastPeriodDate, isIrregular);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('initialSetupTitle')}</DialogTitle>
          <DialogDescription>{t('initialSetupDesc')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="cycle-length">{t('cycleLengthLabel')}</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="cycle-length"
                min={15}
                max={50}
                step={1}
                value={[cycle]}
                onValueChange={handleCycleChange}
                disabled={isIrregular}
                className={cn(isIrregular && "opacity-50")}
              />
              <div className="w-12 text-center font-bold text-lg text-primary">{cycle}</div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="period-length">{t('periodLengthLabel')}</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="period-length"
                min={1}
                max={15}
                step={1}
                value={[period]}
                onValueChange={(value) => setPeriod(value[0])}
              />
              <div className="w-12 text-center font-bold text-lg text-primary">{period}</div>
            </div>
          </div>

          <div className="grid gap-2">
              <Label htmlFor="last-period-date">{t('first_day_of_last_period_label')}</Label>
              <div className="flex items-center gap-4">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} size="icon" className="h-12 w-12 flex-shrink-0">
                      <CalendarIcon className="h-6 w-6" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={lastPeriodDate}
                      onSelect={(d) => { if (d) setLastPeriodDate(d); setIsCalendarOpen(false); }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      locale={localeMap[language]}
                      weekStartsOn={1}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex-grow h-12 flex items-center justify-center rounded-md border text-lg font-semibold">
                  {lastPeriodDate ? format(lastPeriodDate, "d. MMM yyyy", { locale: localeMap[language] }) : "..."}
                </div>
              </div>
          </div>
          
          <div className="flex items-center space-x-2 justify-center pt-2">
            <Checkbox id="irregular" checked={isIrregular} onCheckedChange={(checked) => setIsIrregular(checked as boolean)} />
            <label htmlFor="irregular" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('irregular_cycles_label')}</label>
          </div>
          {isIrregular && (
            <p className="text-xs text-center text-muted-foreground -mt-2">{t('irregular_cycles_info')}</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!lastPeriodDate} className="w-full">{t('saveAndContinue')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
