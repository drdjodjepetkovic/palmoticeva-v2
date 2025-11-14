// src/components/menstrual-calendar/views/unauthenticated-prompt.tsx
"use client";

import React from 'react';
import { useContent } from '@/hooks/use-content';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isConfigured } from '@/lib/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, BrainCircuit, HeartPulse, CheckCircle, Smartphone, UserPlus } from 'lucide-react';

const unauthenticatedContentIds = [
    'unauth_calendar_cta_button',
    'unauth_calendar_main_title',
    'unauth_calendar_main_subtitle',
    'unauth_benefit1_title',
    'unauth_benefit1_desc',
    'unauth_benefit2_title',
    'unauth_benefit2_desc',
    'unauth_benefit3_title',
    'unauth_benefit3_desc',
    'unauth_benefit4_title',
    'unauth_benefit4_desc',
    'unauth_benefit5_title',
    'unauth_benefit5_desc',
    'unauth_benefit6_title',
    'unauth_benefit6_desc',
];

export function UnauthenticatedCalendarPrompt() {
    const { content, loading } = useContent(unauthenticatedContentIds);
    const T = (id: string, fallback?: string) => loading ? <Skeleton className="h-5 w-3/4" /> : content[id] || fallback || id;
    const TS = (id: string, className: string = "h-5 w-3/4") => loading ? <Skeleton className={className} /> : content[id] || id;

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                console.error("Error signing in with Google: ", error);
            }
        }
    };
    
    const benefits = [
        { icon: <Lock className="h-8 w-8 text-yellow-500" />, titleKey: "unauth_benefit5_title", descriptionKey: "unauth_benefit5_desc" },
        { icon: <BrainCircuit className="h-8 w-8 text-blue-500" />, titleKey: "unauth_benefit1_title", descriptionKey: "unauth_benefit1_desc" },
        { icon: <HeartPulse className="h-8 w-8 text-red-500" />, titleKey: "unauth_benefit2_title", descriptionKey: "unauth_benefit2_desc" },
        { icon: <CheckCircle className="h-8 w-8 text-green-500" />, titleKey: "unauth_benefit3_title", descriptionKey: "unauth_benefit3_desc" },
        { icon: <Smartphone className="h-8 w-8 text-purple-500" />, titleKey: "unauth_benefit4_title", descriptionKey: "unauth_benefit4_desc" },
        { icon: <UserPlus className="h-8 w-8 text-cyan-500" />, titleKey: "unauth_benefit6_title", descriptionKey: "unauth_benefit6_desc" },
    ];

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <Card className="max-w-4xl mx-auto shadow-2xl">
                        <CardHeader className="text-center">
                            <h1 className="text-2xl font-bold">{TS('unauth_calendar_main_title', 'h-8 w-1/2 mx-auto')}</h1>
                            <div className="text-base text-muted-foreground mt-1">{TS('unauth_calendar_main_subtitle', 'h-4 w-3/4 mx-auto')}</div>
                        </CardHeader>
                        <CardContent className="py-6 px-4 md:px-8">
                            <div className="space-y-6 max-w-2xl mx-auto">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center text-center md:text-left gap-4">
                                        <div className="flex-shrink-0">{benefit.icon}</div>
                                        <div className="w-full">
                                            <h3 className="text-lg font-bold">{T(benefit.titleKey)}</h3>
                                            <div className="text-sm text-muted-foreground mt-1">{T(benefit.descriptionKey)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
             <div className="sticky bottom-16 md:bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-10">
                <Button size="lg" className="w-full whitespace-normal h-auto text-lg py-3 px-6 bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-500 hover:to-violet-600" onClick={handleSignIn} disabled={!isConfigured}>
                   {T('unauth_calendar_cta_button')}
                </Button>
            </div>
        </div>
    );
}
