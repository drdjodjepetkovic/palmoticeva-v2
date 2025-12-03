"use client";

import { useEffect, useState } from "react";
import { MyProfileSidebarNav } from "@/components/layout/my-profile-sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-context";
import { Bell, CheckCircle } from "lucide-react";
import { getNotifications, markNotificationsAsRead, type NotificationWithId } from "@/lib/actions/user-actions";
import { formatDistanceToNow } from "date-fns";
import { sr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
    const { user, refreshProfile } = useAuth();
    const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        if (!user) return;
        setLoading(true);
        const result = await getNotifications(user.uid);
        if (result.notifications) {
            setNotifications(result.notifications);
        }
        setLoading(false);
    };

    const handleMarkAsRead = async () => {
        if (!user) return;
        await markNotificationsAsRead(user.uid);
        await refreshProfile(); // Update badge in sidebar
        loadNotifications();
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Obaveštenja</h2>
                <p className="text-muted-foreground">Pregled vaših obaveštenja i poruka.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-2xl space-y-4">
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={handleMarkAsRead}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Označi sve kao pročitano
                        </Button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Nema novih obaveštenja
                                </CardTitle>
                                <CardDescription>Trenutno nemate novih obaveštenja.</CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <Card key={notif.id} className={notif.read ? "opacity-60" : "border-l-4 border-l-primary"}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="font-medium">{notif.text}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: sr })}
                                                </p>
                                            </div>
                                            {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
