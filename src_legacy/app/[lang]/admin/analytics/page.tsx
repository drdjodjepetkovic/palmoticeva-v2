
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { getAnalyticsDashboardData, type AnalyticsData, type AnalyticsResult } from '@/lib/actions/admin-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Users, Bot, Calendar, Activity, Loader2 } from 'lucide-react';

function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { role, loading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role === 'admin') {
      const fetchData = async () => {
        setIsLoadingData(true);
        const result = await getAnalyticsDashboardData();
        if (!result) {
            setError("Nije moguće dobiti podatke sa servera.");
            setData(null);
        } else if (result.error) {
          setError(result.error);
          setData(null);
        } else {
          setData(result.data ?? null);
          setError(null);
        }
        setIsLoadingData(false);
      };
      fetchData();
    }
  }, [role]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <AnalyticsPageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const analyticsCards = [
    { title: "Ukupno Korisnika", value: data?.totalUsers, icon: Users },
    { title: "Novi Korisnici (30d)", value: data?.newUsers, icon: Users },
    { title: "Aktivni Korisnici (30d)", value: data?.activeUsers, icon: Activity },
    { title: "AI Razgovori", value: data?.totalAiConversations, icon: Bot },
    { title: "Uneti Ciklusi", value: data?.totalCycles, icon: Calendar },
    { title: "Uneti Događaji", value: data?.totalEvents, icon: Calendar },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Analitika</h2>
        <p className="text-muted-foreground">Pregled ključnih metrika aplikacije.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          {isLoadingData ? (
            <AnalyticsPageSkeleton />
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Greška</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : data ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analyticsCards.map((card, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
