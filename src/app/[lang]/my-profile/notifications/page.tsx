
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getNotifications, markNotificationsAsRead, type NotificationWithId } from '@/lib/actions/user-actions';
import { Loader2, Bell, FileText, CalendarClock, Handshake, BellRing } from 'lucide-react';
import { format, type Locale } from 'date-fns';
import { useLanguage } from '@/context/language-context';
import { sr, ru, srLatn, enUS } from 'date-fns/locale';
import type { LanguageCode } from '@/types/content';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { setupNotifications } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const localeMap: Record<LanguageCode, Locale> = {
  "en": enUS,
  "se": sr,
  "ru": ru,
  "se-lat": srLatn,
};

const iconMap = {
    new_result: <FileText className="h-5 w-5 text-primary" />,
    cycle_late: <CalendarClock className="h-5 w-5 text-destructive" />,
    welcome: <Handshake className="h-5 w-5 text-green-500" />,
    appointment_reminder: <FileText className="h-5 w-5 text-blue-500" />,
};

function NotificationsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function MyNotificationsPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(`/${language}/`);
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);
      const result = await getNotifications(user.uid);
      if (result.error) {
        setError(result.error);
      } else if (result.notifications) {
        setNotifications(result.notifications);
        // Mark as read after fetching and displaying them
        if (userProfile?.unreadNotifications && userProfile.unreadNotifications > 0) {
            await markNotificationsAsRead(user.uid);
        }
      }
      setIsLoading(false);
    };

    fetchNotifications();
  }, [user, loading, language, router, userProfile?.unreadNotifications]);

  const handleEnableNotifications = async () => {
    if (!user) return;
    try {
      await setupNotifications(user);
      setNotificationPermission(Notification.permission);
       toast({
        title: "Uspeh!",
        description: "Uspešno ste se prijavili za obaveštenja.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije uspelo omogućavanje obaveštenja.",
      });
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <NotificationsPageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Moja Obaveštenja</h2>
        <p className="text-muted-foreground">Istorija svih vaših obaveštenja u aplikaciji.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Sva Obaveštenja</CardTitle>
            </CardHeader>
            <CardContent>
              {notificationPermission === 'default' && (
                <Alert className="mb-6">
                  <BellRing className="h-4 w-4" />
                  <AlertTitle>Uključite notifikacije</AlertTitle>
                  <AlertDescription>
                    Dozvolite nam da Vam šaljemo važne podsetnike o ciklusima i zdravlju.
                    <Button onClick={handleEnableNotifications} size="sm" className="mt-2 w-full sm:w-auto">Uključi obaveštenja</Button>
                  </AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Greška</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : notifications.length === 0 ? (
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertTitle>Nema novih obaveštenja</AlertTitle>
                  <AlertDescription>
                    Sva vaša obaveštenja će se pojaviti ovde.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <Link key={n.id} href={`/${language}${n.link}`} className="block">
                      <Card className={cn("hover:bg-muted/50 transition-colors", !n.read && "bg-primary/5 border-primary/20")}>
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {iconMap[n.type] || <Bell className="h-5 w-5 text-muted-foreground" />}
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{n.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(n.createdAt), 'dd. MMM yyyy, HH:mm', { locale: localeMap[language] })}
                            </p>
                          </div>
                           {!n.read && <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0 mt-2 animate-pulse"></div>}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
