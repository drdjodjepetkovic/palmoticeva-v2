"use client";

import { MyProfileSidebarNav } from "@/components/layout/my-profile-sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsDashboardData } from "@/lib/actions/admin-actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalyticsDashboardData().then(res => {
            if (res.data) setData(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Analitika</h2>
                <p className="text-muted-foreground">Pregled statistike aplikacije.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-5xl">
                    {loading ? <Skeleton className="h-60 w-full" /> : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ukupno Korisnika</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{data?.totalUsers || 0}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Novi (30 dana)</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{data?.newUsers || 0}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Aktivni (AI)</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{data?.activeUsers || 0}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">AI Konverzacije</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{data?.totalAiConversations || 0}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ukupno Ciklusa</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{data?.totalCycles || 0}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ukupno Događaja</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{data?.totalEvents || 0}</div></CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
