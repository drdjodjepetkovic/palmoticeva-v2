"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, differenceInDays, isValid, isWithinInterval, startOfDay } from 'date-fns';
import { Save, Trash2, PlusCircle, Pencil, X, CalendarIcon } from 'lucide-react';
import type { Cycle } from '@/types/user';
import type { LanguageCode } from '@/types/content';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { sr, ru, srLatn, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { DialogFooter, DialogClose } from '../ui/dialog';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const localeMap: Record<LanguageCode, Locale> = {
  "en": enUS,
  "se": sr,
  "ru": ru,
  "sr": srLatn,
};

function AddNewCycleForm({ onAdd, language, t, existingCycles }: { onAdd: (start: Date, end: Date | null) => void, language: LanguageCode, t: (key: string) => string, existingCycles: Cycle[] }) {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const locale = localeMap[language];
    const { toast } = useToast();

    const handleAdd = () => {
        if (!startDate) return;

        // Validation check
        const newStart = startOfDay(startDate);
        const newEnd = endDate ? startOfDay(endDate) : newStart; // If no end, treat as a single day for overlap check

        for (const cycle of existingCycles) {
            const existingStart = startOfDay(cycle.startDate);
            const existingEnd = cycle.endDate ? startOfDay(cycle.endDate) : existingStart;
            
            if (isWithinInterval(newStart, { start: existingStart, end: existingEnd }) || 
                isWithinInterval(existingStart, { start: newStart, end: newEnd })) {
                toast({
                    title: "Greška: Preklapanje datuma",
                    description: "Novi ciklus se preklapa sa postojećim. Molimo proverite datume.",
                    variant: "destructive"
                });
                return;
            }
        }

        onAdd(startDate, endDate || null);
        setStartDate(undefined);
        setEndDate(undefined);
    }

    return (
        <div className="p-4 bg-gray-100 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-foreground mb-3">{t('log_new_cycle_title')}</h3>
            <div className="flex flex-col gap-2">
                 <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'dd. MM. yyyy.', { locale }) : t('period_start_date_label')}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={(d) => { setStartDate(d); setIsStartOpen(false); }} initialFocus locale={locale} disabled={(date) => date > new Date()} />
                    </PopoverContent>
                </Popover>

                <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 font-normal">
                             <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'dd. MM. yyyy.', { locale }) : 'Završni datum (opciono)'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={(d) => { setEndDate(d || undefined); setIsEndOpen(false); }} initialFocus locale={locale} disabled={(date) => !startDate || date < startDate || date > new Date()} />
                    </PopoverContent>
                </Popover>

                <Button onClick={handleAdd} disabled={!startDate}>Dodaj</Button>
            </div>
        </div>
    );
}

export function EditCyclesSheet({ cycles, onCyclesUpdate, t, language }: { cycles: Cycle[], onCyclesUpdate: (cycles: Cycle[]) => void, t: (key: string) => string, language: LanguageCode }) {
  const [internalCycles, setInternalCycles] = useState<Cycle[]>([]);
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setInternalCycles(cycles.sort((a, b) => b.startDate.getTime() - a.startDate.getTime()));
  }, [cycles]);

  const handleUpdate = (updatedCycle: Cycle) => {
    // Validation
    const newStart = startOfDay(updatedCycle.startDate);
    const newEnd = updatedCycle.endDate ? startOfDay(updatedCycle.endDate) : newStart;
    
    if (updatedCycle.endDate && newEnd < newStart) {
        toast({ title: "Greška", description: "Datum kraja ne može biti pre datuma početka.", variant: "destructive" });
        return;
    }

    for (const cycle of internalCycles) {
        if (cycle.id === updatedCycle.id) continue;
        const existingStart = startOfDay(cycle.startDate);
        const existingEnd = cycle.endDate ? startOfDay(cycle.endDate) : existingStart;
        if (isWithinInterval(newStart, { start: existingStart, end: existingEnd }) || isWithinInterval(existingStart, { start: newStart, end: newEnd })) {
            toast({ title: "Greška: Preklapanje datuma", description: "Izmenjeni ciklus se preklapa sa postojećim.", variant: "destructive" });
            return;
        }
    }

    const updated = internalCycles.map(c => c.id === updatedCycle.id ? updatedCycle : c);
    onCyclesUpdate(updated);
    setEditingCycleId(null);
  };

  const handleAddNew = (startDate: Date, endDate: Date | null) => {
    const newCycle: Cycle = {
        id: `new-${Date.now()}`,
        startDate,
        endDate,
        type: 'regular'
    };
    onCyclesUpdate([newCycle, ...internalCycles]);
  };

  const handleDelete = (cycleId: string) => {
    const updated = internalCycles.filter(c => c.id !== cycleId);
    onCyclesUpdate(updated);
  };
  
  const sortedCycles = [...internalCycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  return (
    <div className="flex flex-col h-full mt-4">
      <div className="px-1">
        <AddNewCycleForm onAdd={handleAddNew} language={language} t={t} existingCycles={internalCycles} />
      </div>

      <ScrollArea className="flex-1 my-4 h-[250px] sm:h-[300px]">
        <div className="space-y-3 pr-4">
          {sortedCycles.length > 0 ? (
            sortedCycles.map(cycle => (
              <CycleEditItem
                key={cycle.id}
                cycle={cycle}
                isEditing={editingCycleId === cycle.id}
                onEditClick={setEditingCycleId}
                onSave={handleUpdate}
                onCancel={() => setEditingCycleId(null)}
                onDelete={handleDelete}
                language={language}
              />
            ))
          ) : (
             <p className="text-center text-muted-foreground py-4">Nema unetih ciklusa.</p>
          )}
        </div>
      </ScrollArea>
      <DialogFooter className="bg-gray-50 dark:bg-slate-900/50 -mx-6 -mb-6 mt-auto px-6 py-4 rounded-b-lg justify-end border-t">
        <DialogClose asChild>
          <Button variant="secondary">Zatvori</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

interface CycleEditItemProps {
    cycle: Cycle;
    isEditing: boolean;
    onEditClick: (id: string) => void;
    onSave: (cycle: Cycle) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
    language: LanguageCode;
}

function CycleEditItem({ cycle, isEditing, onEditClick, onSave, onCancel, onDelete, language }: CycleEditItemProps) {
  const [tempStartDate, setTempStartDate] = useState<Date>(cycle.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(cycle.endDate);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  
  const locale = localeMap[language];
  const duration = (cycle.endDate && cycle.startDate && isValid(cycle.endDate) && isValid(cycle.startDate)) 
    ? differenceInDays(cycle.endDate, cycle.startDate) + 1 
    : null;

  const handleSave = () => {
    if (!isValid(tempStartDate)) return;
    onSave({ ...cycle, startDate: tempStartDate, endDate: tempEndDate });
  }

  useEffect(() => {
    setTempStartDate(cycle.startDate);
    setTempEndDate(cycle.endDate);
  }, [isEditing, cycle]);

  return (
    <Card className="p-3 bg-white dark:bg-slate-900 min-h-[72px] flex flex-col justify-center">
        <div className="flex items-center justify-between w-full">
            {isEditing ? (
                <div className="flex-1 w-full flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                         <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex-1 w-full justify-center text-center font-normal bg-gray-100 border-gray-300 dark:bg-slate-800 dark:border-slate-600">
                                    {format(tempStartDate, 'dd. MM. yyyy.', {locale})}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={tempStartDate} onSelect={(d) => { if(d) setTempStartDate(d); setIsStartOpen(false); }} initialFocus locale={locale} />
                            </PopoverContent>
                        </Popover>
                        <span className="text-muted-foreground hidden sm:block">-</span>
                        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex-1 w-full justify-center text-center font-normal bg-gray-100 border-gray-300 dark:bg-slate-800 dark:border-slate-600">
                                    {tempEndDate ? format(tempEndDate, 'dd. MM. yyyy.', {locale}) : '...'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={tempEndDate || undefined} onSelect={(d) => { setTempEndDate(d || null); setIsEndOpen(false);}} initialFocus locale={locale} disabled={(date) => date < tempStartDate} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex justify-end items-center gap-1 sm:gap-2 mt-1">
                        <Button onClick={handleSave} size="sm">Sačuvaj</Button>
                        <Button onClick={onCancel} size="icon" variant="ghost" className="text-destructive hover:text-destructive h-8 w-8">
                            <X className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {format(cycle.startDate, 'dd. MM. yyyy.', { locale })} - {cycle.endDate ? format(cycle.endDate, 'dd. MM. yyyy.', { locale }) : '...'}
                        </p>
                        {duration && <p className="text-sm text-slate-500 dark:text-slate-400">{duration} dana</p>}
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-pink-600" onClick={() => onEditClick(cycle.id)}>
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                                <AlertDialogDescription>Ova akcija će trajno obrisati ciklus.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Otkaži</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(cycle.id)} className="bg-destructive hover:bg-destructive/90">Obriši</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </>
            )}
        </div>
    </Card>
  );
}
