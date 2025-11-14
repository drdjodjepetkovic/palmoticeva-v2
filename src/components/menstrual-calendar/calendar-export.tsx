
"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Droplet } from 'lucide-react';
import { generateCalendarLinks } from '@/lib/actions/user-actions';
import { useContent } from '@/hooks/use-content';
import Image from 'next/image';

const contentIds = [
    'calendar_export_fertile',
    'calendar_export_period',
    'calendar_export_subtitle',
];

const GOOGLE_ICON_URL = "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fgoogle.jpg?alt=media&token=42d1844b-4c5c-4340-98b6-3b603d6d06d3";
const APPLE_ICON_URL = "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fapple.jpg?alt=media&token=c191a620-618d-4a1d-847e-8c3e80e90956";

export function CalendarExport() {
    const { user } = useAuth();
    const { language } = useLanguage();
    const { toast } = useToast();
    const { content, loading: contentLoading } = useContent(contentIds);
    
    const [loadingExport, setLoadingExport] = useState<string | null>(null);

    const t = (key: string) => content[key] || `[${key}]`;

    const handleExport = async (exportType: 'google-period' | 'google-fertile' | 'ics-period' | 'ics-fertile') => {
        if (!user) return;
        setLoadingExport(exportType);

        const isPeriod = exportType.includes('period');
        const isGoogle = exportType.includes('google');

        try {
            const result = await generateCalendarLinks({
                userId: user.uid,
                lang: language,
            });
            if (result.error) throw new Error(result.error);
            
            let urlToOpen: string | undefined;

            if (isGoogle) {
                urlToOpen = isPeriod ? result.google?.periodUrl : result.google?.fertileUrl;
                if (urlToOpen) {
                    window.open(urlToOpen, '_blank');
                } else {
                    throw new Error("Could not generate Google Calendar link.");
                }
            } else { // ICS export
                const icsData = isPeriod ? result.icsData?.period : result.icsData?.fertile;
                const fileName = isPeriod ? 'palmoticeva_ciklus.ics' : 'palmoticeva_plodni_dani.ics';
                if (icsData) {
                    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
                    urlToOpen = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = urlToOpen;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(urlToOpen);
                } else {
                     throw new Error("Could not generate ICS file.");
                }
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Greška pri izvozu", description: error.message });
        } finally {
            setLoadingExport(null);
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        {t('calendar_export_fertile')}
                    </h4>
                    <span className="text-xs text-muted-foreground">{t('calendar_export_subtitle')}</span>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2" disabled={!!loadingExport || contentLoading} onClick={() => handleExport('google-fertile')}>
                    {loadingExport === 'google-fertile' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image src={GOOGLE_ICON_URL} alt="Google Calendar" width={20} height={20} />}
                    Google Kalendar
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" disabled={!!loadingExport || contentLoading} onClick={() => handleExport('ics-fertile')}>
                    {loadingExport === 'ics-fertile' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image src={APPLE_ICON_URL} alt="Apple Calendar" width={20} height={20} />}
                    Apple / Outlook
                </Button>
            </div>
            <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-destructive" />
                        {t('calendar_export_period')}
                    </h4>
                    <span className="text-xs text-muted-foreground">{t('calendar_export_subtitle')}</span>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2" disabled={!!loadingExport || contentLoading} onClick={() => handleExport('google-period')}>
                     {loadingExport === 'google-period' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image src={GOOGLE_ICON_URL} alt="Google Calendar" width={20} height={20} />}
                    Google Kalendar
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" disabled={!!loadingExport || contentLoading} onClick={() => handleExport('ics-period')}>
                    {loadingExport === 'ics-period' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image src={APPLE_ICON_URL} alt="Apple Calendar" width={20} height={20} />}
                    Apple / Outlook
                </Button>
            </div>
        </div>
    );
}
