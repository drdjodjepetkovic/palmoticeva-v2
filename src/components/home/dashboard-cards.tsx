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
            <div className="relative rounded-xl p-1.5 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 animate-gradient">
                <Link href={`/${language}/menstrual-calendar`} className="h-full block">
                    <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 bg-card text-card-foreground">
                        <CardContent className="flex-grow flex items-center p-4 gap-4">
                            <CalendarHeart className="h-10 w-10 text-primary flex-shrink-0" />
                            <div>
                                <CardTitle className="text-base font-bold">{t('homepage_smart_calendar_title')}</CardTitle>
                                <div className="text-xs text-muted-foreground">{t('homepage_smart_calendar_desc')}</div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Link href={linkTarget} className="h-full block">
                <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                    <CardHeader className="p-4">
                        <CardTitle className="flex items-center justify-between text-base">
                            {t('homepage_notifications_title')}
                            {user && unreadCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{unreadCount}</span>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-4 pt-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <span className="text-sm">
                                {user && unreadCount > 0 ? (
                                    `${unreadCount} ${unreadCount === 1 ? 'novo obaveštenje' : 'novih obaveštenja'}`
                                ) : (
                                    t('homepage_notifications_none')
                                )}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}
