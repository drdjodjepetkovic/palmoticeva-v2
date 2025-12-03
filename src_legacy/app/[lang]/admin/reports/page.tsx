
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download, Loader2 } from 'lucide-react';
import { format, subDays, type Locale } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { generateAiConversationsReport, generateUsersReport } from '@/lib/actions/admin-actions';
import { useLanguage } from '@/context/language-context';
import { sr, ru, srLatn, enUS } from 'date-fns/locale';
import type { LanguageCode } from '@/types/content';
import { cn } from '@/lib/utils';

const localeMap: Record<LanguageCode, Locale> = {
  "en": enUS,
  "se": sr,
  "ru": ru,
  "sr": srLatn,
};

function ReportsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

const downloadCsv = (csvData: string, baseFilename: string) => {
    const blob = new Blob([`\uFEFF${csvData}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = `${baseFilename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export default function AdminReportsPage() {
  const { role, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();

  const [aiDateRange, setAiDateRange] = useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
  const [userDateRange, setUserDateRange] = useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
  
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isGeneratingUsers, setIsGeneratingUsers] = useState(false);


  if (loading || (role !== 'admin' && role !== 'verified')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <ReportsPageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateAiReport = async () => {
    if (!aiDateRange || !aiDateRange.from || !aiDateRange.to) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Morate izabrati opseg datuma.' });
      return;
    }

    setIsGeneratingAi(true);
    try {
      const result = await generateAiConversationsReport({ startDate: aiDateRange.from, endDate: aiDateRange.to });
      if (result.error) throw new Error(result.error);
      if (result.csvData) {
        downloadCsv(result.csvData, 'ai_conversations_report');
        toast({ title: 'Izveštaj generisan!', description: `Preuzimanje fajla je počelo.` });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Greška pri generisanju izveštaja', description: error.message });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleGenerateUsersReport = async () => {
    if (!userDateRange || !userDateRange.from || !userDateRange.to) {
      toast({ variant: 'destructive', title: 'Greška', description: 'Morate izabrati opseg datuma.' });
      return;
    }

    setIsGeneratingUsers(true);
    try {
      const result = await generateUsersReport({ startDate: userDateRange.from, endDate: userDateRange.to });
      if (result.error) throw new Error(result.error);
      if (result.csvData) {
        downloadCsv(result.csvData, 'users_report');
        toast({ title: 'Izveštaj generisan!', description: `Preuzimanje fajla je počelo.` });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Greška pri generisanju izveštaja', description: error.message });
    } finally {
      setIsGeneratingUsers(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Izveštaji</h2>
        <p className="text-muted-foreground">Generišite i preuzmite izveštaje iz sistema.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Izveštaj o AI Razgovorima</CardTitle>
              <CardDescription>
                Izaberite period i preuzmite CSV fajl sa svim razgovorima koje su korisnici vodili sa AI asistentom.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="aiDate" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !aiDateRange && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {aiDateRange?.from ? (aiDateRange.to ? (<>{format(aiDateRange.from, "LLL dd, y", { locale: localeMap[language] })} - {format(aiDateRange.to, "LLL dd, y", { locale: localeMap[language] })}</>) : (format(aiDateRange.from, "LLL dd, y", { locale: localeMap[language] }))) : (<span>Izaberite datum</span>)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="range" defaultMonth={aiDateRange?.from} selected={aiDateRange} onSelect={setAiDateRange} numberOfMonths={2} locale={localeMap[language]} />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleGenerateAiReport} disabled={isGeneratingAi} className="w-full">
                {isGeneratingAi ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Download className="mr-2 h-4 w-4" />)}
                {isGeneratingAi ? 'Generisanje...' : 'Generiši Izveštaj o Razgovorima'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Izveštaj o Korisnicima</CardTitle>
              <CardDescription>
                Izaberite period i preuzmite CSV fajl sa svim korisnicima koji su se registrovali u tom periodu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="userDate" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !userDateRange && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {userDateRange?.from ? (userDateRange.to ? (<>{format(userDateRange.from, "LLL dd, y", { locale: localeMap[language] })} - {format(userDateRange.to, "LLL dd, y", { locale: localeMap[language] })}</>) : (format(userDateRange.from, "LLL dd, y", { locale: localeMap[language] }))) : (<span>Izaberite datum</span>)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="range" defaultMonth={userDateRange?.from} selected={userDateRange} onSelect={setUserDateRange} numberOfMonths={2} locale={localeMap[language]} />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleGenerateUsersReport} disabled={isGeneratingUsers} className="w-full">
                {isGeneratingUsers ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Download className="mr-2 h-4 w-4" />)}
                {isGeneratingUsers ? 'Generisanje...' : 'Generiši Izveštaj o Korisnicima'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
