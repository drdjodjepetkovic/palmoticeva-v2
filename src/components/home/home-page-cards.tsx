"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEventBus } from "@/context/event-bus-context";
import { UserEventType } from "@/lib/events";
import { defaultAboutPageContent, type HomeCard } from '@/lib/data/content';
import { Award, CalendarCheck, Clock, HeartPulse, Share2, Star, Lightbulb, ClipboardCheck, Bell, Newspaper, ArrowRight, Home, BookOpen, CalendarPlus, Phone, Tag, HelpCircle, Info, Download, CalendarHeart, User } from 'lucide-react';
import * as LucideIcons from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
    Tag, HelpCircle, Star, Share2, Home, BookOpen, CalendarPlus, Phone,
    Newspaper,
    User: LucideIcons.User,
};

interface HomePageCardsProps {
    t: (id: string, fallback?: string) => React.ReactNode;
    language: string;
}

export function HomePageCards({ t, language }: HomePageCardsProps) {
    const { emit } = useEventBus();
    const [cards] = useState<HomeCard[]>(defaultAboutPageContent.home_cards);

    const handleShareClick = async (e: React.MouseEvent, link: string) => {
        e.preventDefault();
        emit(UserEventType.BadgeUnlocked, { badgeKey: 'ambassador' });

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Ginekologija Palmotićeva',
                    text: 'Preuzmi aplikaciju Ginekološke ordinacije Palmotićeva!',
                    url: window.location.origin
                });
            } catch (error: any) {
                // This error is often a "AbortError" if the user closes the share dialog.
                // We'll fall back to clipboard to be safe.
                console.log('Share failed, falling back to clipboard:', error.name, error.message);
                navigator.clipboard.writeText(window.location.origin);
                emit(UserEventType.ToastShow, { title: t('share_link_copied_toast') as string });
            }
        } else {
            navigator.clipboard.writeText(window.location.origin);
            emit(UserEventType.ToastShow, { title: t('share_link_copied_toast') as string });
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {cards.map(card => {
                const Icon = iconMap[card.icon] || HeartPulse;
                const isShare = card.key === 'share';
                const isRate = card.key === 'rate_us';

                return (
                    <Link
                        href={card.external ? card.link : `/${language}${card.link}`}
                        key={card.key}
                        target={card.external ? "_blank" : "_self"}
                        rel={card.external ? "noopener noreferrer" : ""}
                        onClick={(e) => {
                            if (isShare) handleShareClick(e, card.link);
                            if (isRate) emit(UserEventType.BadgeUnlocked, { badgeKey: 'golden_recommendation' });
                        }}
                        className="block"
                    >
                        <Card className="h-full hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                <Icon className="h-6 w-6 text-primary mb-1" />
                                <h3 className="text-sm font-bold leading-tight">{t(card.titleKey, card.titleKey)}</h3>
                                <div className="text-xs text-muted-foreground">{t(card.descKey, card.descKey)}</div>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
