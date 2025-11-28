"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, MessageCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

interface AiConciergeCardProps {
    t: (id: string, fallback?: string) => string | React.ReactNode;
    onOpenAi: () => void;
    onBookAppointment: () => void;
}

export function AiConciergeCard({ t, onOpenAi, onBookAppointment }: AiConciergeCardProps) {
    const { userProfile } = useAuth();

    const firstName = userProfile?.displayName?.split(' ')[0] || t('guest', 'Gošća');

    // Time-based greeting logic
    const hour = new Date().getHours();
    let greetingKey = 'greeting_default';
    if (hour < 12) greetingKey = 'greeting_morning';
    else if (hour < 18) greetingKey = 'greeting_afternoon';
    else greetingKey = 'greeting_evening';

    const greeting = t(greetingKey, 'Dobro došli') as string;

    return (
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-stone-50 to-white relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <CardContent className="p-6 relative z-10">
                <div className="flex flex-col gap-4">

                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                                    Palmotićeva AI
                                </span>
                            </div>
                            <h2 className="text-2xl font-headline font-bold text-stone-800">
                                {greeting}, {firstName}.
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm max-w-[280px]">
                                {t('ai_concierge_subtitle', 'Mogu li Vam pomoći da zakažete redovni pregled ili imate pitanje za mene?')}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                        <Button
                            onClick={onBookAppointment}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-sm group"
                        >
                            <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            {t('book_checkup', 'Zakažite Pregled')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onOpenAi}
                            className="flex-1 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary group"
                        >
                            <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            {t('ask_question', 'Postavite Pitanje')}
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
