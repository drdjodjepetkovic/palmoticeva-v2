"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface GreetingSectionProps {
    t: (key: string, fallback?: string) => React.ReactNode;
}

export function GreetingSection({ t }: GreetingSectionProps) {
    const { userProfile, loading } = useAuth();
    const [greetingKey, setGreetingKey] = useState('greeting_default');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreetingKey('greeting_morning');
        } else if (hour >= 12 && hour < 18) {
            setGreetingKey('greeting_afternoon');
        } else if (hour >= 18 || hour < 5) {
            setGreetingKey('greeting_evening');
        }
    }, []);

    if (loading) {
        return (
            <div className="mb-6">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>
        );
    }

    const displayName = userProfile?.displayName?.split(' ')[0] || '';

    return (
        <div className="mb-8 mt-4">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary tracking-tight">
                {t(greetingKey)}
                {displayName ? `, ${displayName}` : ''}.
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
                {t('homepage_smart_calendar_desc')}
            </p>
        </div>
    );
}
