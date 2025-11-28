"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GamificationBadge } from '@/lib/data/content';

interface GamificationSectionProps {
    t: (id: string, fallback?: string) => React.ReactNode;
    onOpenDialog: () => void;
    badges: GamificationBadge[];
}

export function GamificationSection({ t, onOpenDialog, badges }: GamificationSectionProps) {
    return (
        <Card className="bg-muted/50 cursor-pointer hover:bg-muted/80 transition-colors" onClick={onOpenDialog}>
            <CardContent className="p-3">
                <div className="grid grid-cols-7 gap-1 text-center">
                    {badges.map(badge => {
                        const BadgeIcon = badge.icon;
                        return (
                            <div key={badge.key} className="flex flex-col items-center gap-1">
                                <div className={cn("rounded-full p-1.5 transition-colors", badge.unlocked ? `${badge.colorClass} bg-opacity-10` : 'bg-muted')}>
                                    <BadgeIcon className={cn("h-5 w-5", badge.unlocked ? badge.colorClass : 'text-muted-foreground')} />
                                </div>
                                <span className={cn("text-[10px] leading-tight font-semibold hidden md:block", badge.unlocked ? badge.colorClass : 'text-muted-foreground')}>
                                    {t(badge.titleKey)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
