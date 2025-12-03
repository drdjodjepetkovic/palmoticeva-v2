"use client";

import { useDialog } from "@/features/cycle/context/dialog-context";
import { LogEntryDialog } from "@/features/cycle/components/log-entry-dialog";
import { useCycle } from "@/features/cycle/use-cycle";
import { useDailyEvents } from "@/features/cycle/use-daily-events";
import { useContent } from "@/features/content/content-context";
import { formatISO } from "date-fns";

export function GlobalCycleDialog() {
    const { isOpen, selectedDate, closeDialog } = useDialog();
    const { history, logPeriod, togglePeriodEnd } = useCycle();
    const { events: dailyEvents, saveEvent } = useDailyEvents();
    const { language } = useContent();

    const handleSaveEvent = async (event: any) => {
        if (selectedDate) {
            const dateKey = formatISO(selectedDate, { representation: 'date' });
            await saveEvent(dateKey, event);
        }
    };

    return (
        <LogEntryDialog
            isOpen={isOpen}
            onOpenChange={(open) => !open && closeDialog()}
            day={selectedDate}
            cycles={history}
            event={selectedDate ? dailyEvents[formatISO(selectedDate, { representation: 'date' })] : undefined}
            onSaveEvent={handleSaveEvent}
            onPeriodLog={(start, end) => logPeriod(start, end || undefined)}
            onPeriodEndToggle={(end, id) => togglePeriodEnd(end || undefined, id)}
            language={language}
        />
    );
}
