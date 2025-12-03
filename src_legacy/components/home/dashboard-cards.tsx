"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CalendarHeart } from 'lucide-react';
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

interface DashboardCardsProps {
    t: (id: string, fallback?: string) => React.ReactNode;
    language: string;
}

export function DashboardCards({ t, language }: DashboardCardsProps) {
    const { user, userProfile } = useAuth();
    const unreadCount = userProfile?.unreadNotifications || 0;
    const linkTarget = user ? `/${language}/my-profile/notifications` : `/${language}/menstrual-calendar`;


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Smart Calendar Card */}
            <Link href={`/${language}/menstrual-calendar`} className="h-full block group">
                <Card className="flex flex-col h-full hover:shadow-md transition-all duration-300">
                    <CardContent className="flex-grow flex items-center p-6 gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarHeart className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-bold">
                                {t('homepage_smart_calendar_title')}
                            </CardTitle>
                            <div className="text-xs text-muted-foreground mt-1">
                                {t('homepage_smart_calendar_desc')}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Notifications Card */}
            <Link href={linkTarget} className="h-full block group">
                <Card className="flex flex-col h-full hover:shadow-md transition-all duration-300">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="flex items-center justify-between text-base">
                            {t('homepage_notifications_title')}
                            {user && unreadCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {user && unreadCount > 0
                                    ? t('homepage_notifications_view_all')
                                    : t('homepage_notifications_none')}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}
