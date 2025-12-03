"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { enUS, sr, srLatn, ru } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import type { AppLanguage, Cycle } from '@/core/types';
import { useContent } from "@/features/content/content-context";
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCycle } from '@/lib/actions/cycle-actions';
import { useAuth } from '@/features/auth/auth-context';

const localeMap: Record<AppLanguage, Locale> = {
    en: enUS,
    'sr': srLatn,
    ru: ru,
};

interface CycleHistoryProps {
    cycles: Cycle[];
    t: any;
}

export function CycleHistory({ cycles, t }: CycleHistoryProps) {
    const { language } = useContent();
    const { user } = useAuth();
    const locale = localeMap[language as AppLanguage] || srLatn;

    // Filter only completed cycles for history, or show active one differently
    const historyCycles = cycles.slice(0, 12); // Show last 12 cycles

    const handleDelete = async (cycleId: string) => {
        if (user?.uid) {
            await deleteCycle(user.uid, cycleId);
        }
    };

    return (
        <Card className="w-full bg-white/50 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Istorija Ciklusa
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-4">
                        {historyCycles.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Nema zabeleženih ciklusa.</p>
                        ) : (
                            historyCycles.map((cycle, index) => {
                                const isCurrent = !cycle.endDate;
                                return (
                                    <div key={cycle.id || index} className="flex items-center justify-between text-sm border-b last:border-0 pb-3 last:pb-0 group">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">
                                                {format(cycle.startDate, 'd. MMMM yyyy.', { locale })}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {isCurrent ? 'Trenutni ciklus' : `${format(cycle.endDate!, 'd. MMMM', { locale })}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isCurrent ? (
                                                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                    Aktivno
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground font-mono">
                                                    {cycle.endDate ? Math.ceil((cycle.endDate.getTime() - cycle.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : '?'} dana
                                                </span>
                                            )}

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Obriši ciklus?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Da li ste sigurni da želite da obrišete ovaj ciklus? Ovo će uticati na statistiku i predviđanja.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Odustani</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(cycle.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Obriši
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
