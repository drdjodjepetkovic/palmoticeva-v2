"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { GamificationBadge } from '@/lib/data/content';

interface GamificationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    badges: GamificationBadge[];
    t: (id: string, fallback?: string) => React.ReactNode;
}

export function GamificationDialog({ open, onOpenChange, badges, t }: GamificationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('gamification_dialog_title')}</DialogTitle>
                    <DialogDescription>
                        {t('gamification_dialog_desc')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {badges.map((badge) => (
                        <div key={badge.key} className={cn("flex flex-col gap-2 transition-opacity", !badge.unlocked && "opacity-60")}>
                            <div className="flex items-start gap-4">
                                <div className={cn("flex-shrink-0 rounded-full h-12 w-12 flex items-center justify-center", badge.unlocked ? `${badge.colorClass} bg-opacity-10` : 'bg-muted')}>
                                    <badge.icon className={cn("h-6 w-6", badge.unlocked ? badge.colorClass : 'text-muted-foreground')} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        {t(badge.titleKey)}
                                        {badge.unlocked && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Unlocked</span>}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{t(badge.descKey)}</p>
                                </div>
                            </div>
                            {badge.progress && !badge.unlocked && (
                                <div className="pl-16 pr-2">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>Progress</span>
                                        <span>{badge.progress.current} / {badge.progress.target}</span>
                                    </div>
                                    <Progress value={(badge.progress.current / badge.progress.target) * 100} className="h-2" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>{t('gamification_dialog_button')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
