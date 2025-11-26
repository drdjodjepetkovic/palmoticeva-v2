
"use client";

import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContent } from "@/hooks/use-content";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, logAnalyticsEvent } from '@/lib/firebase/client';
import type { Cycle } from '@/types/user';
import * as LucideIcons from "lucide-react";
import { Award, CalendarCheck, Clock, HeartPulse, Share2, Star, Lightbulb, ClipboardCheck, Bell, Newspaper, ArrowRight, Home, BookOpen, CalendarPlus, Phone, Tag, HelpCircle, Info, Download, CalendarHeart, User } from 'lucide-react';
import { CycleStats } from '@/components/menstrual-calendar/cycle-stats';
import { CycleLegend } from '@/components/menstrual-calendar/cycle-legend';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import dynamic from "next/dynamic";
import type { HomeCard, GamificationBadge } from '@/lib/data/content';
import { defaultAboutPageContent, getAllBadges } from '@/lib/data/content';
import { useSearchParams } from "next/navigation";
import AppWalkthrough from "@/components/onboarding/app-walkthrough";
import { useEventBus } from "@/context/event-bus-context";
import { UserEventType } from "@/lib/events";
import { LoginScreen } from "@/components/auth/login-screen";


const AiAssistant = dynamic(() => import("@/components/ai/ai-assistant"), {
  ssr: false,
});


const contentIds = [
  'hero_main_text',
  'hero_button_text',
  'homepage_notifications_title',
  'homepage_notifications_view_all',
  'homepage_notifications_none',
  'homepage_calendar_card_title',
  'homepage_calendar_card_desc',
  'homepage_smart_calendar_title',
  'homepage_smart_calendar_desc',
  'homepage_about_card_title',
  'homepage_about_card_desc',
  'badge_our_patient_title',
  'badge_our_patient_desc',
  'badge_explorer_title',
  'badge_explorer_desc',
  'badge_routine_queen_title',
  'badge_routine_queen_desc',
  'badge_punctual_title',
  'badge_punctual_desc',
  'badge_ambassador_title',
  'badge_ambassador_desc',
  'badge_golden_recommendation_title',
  'badge_golden_recommendation_desc',
  'badge_installer_title',
  'badge_installer_desc',
  'averagePeriod',
  'averageCycle',
  'days',
  'legendPeriodStart',
  'legendFertileStart',
  'legendOvulation',
  'legendFertileEnd',
  'homepage_appointment_card_title',
  'homepage_appointment_card_desc',
  'promotions_card_title',
  'promotions_card_desc',
  'faq_card_title',
  'faq_card_desc',
  'rate_us_card_title',
  'rate_us_card_desc',
  'share_app_card_title',
  'share_app_card_desc',
  'share_link_copied_toast',
  'gamification_dialog_title',
  'gamification_dialog_desc',
  'gamification_dialog_button',
  'homepage_articles_card_title',
  'homepage_articles_card_desc',
  'health_corner_title',
  'health_corner_read_more',
  'fact_1',
  'fact_2',
  'fact_3',
  'fact_4',
  'fact_5',
  'gamification_title',
  'gamification_details_button'
];


function GamificationSection({ t, onOpenDialog, badges }: { t: (id: string, fallback?: string) => React.ReactNode, onOpenDialog: () => void, badges: GamificationBadge[] }) {

  return (
    <Card className="bg-muted/50 cursor-pointer hover:bg-muted/80 transition-colors" onClick={onOpenDialog}>
      <CardContent className="p-3">
        <div className="grid grid-cols-7 gap-1 text-center">
          {badges.map(badge => {
            const BadgeIcon = badge.icon;
            return (
              <div key={badge.key} className={cn("flex flex-col items-center gap-1 transition-opacity", !badge.unlocked && "opacity-40")}>
                <div className={cn("flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center", badge.unlocked ? `${badge.colorClass} bg-opacity-10` : 'bg-muted')}>
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

function DashboardCards({ t, language }: { t: (id: string, fallback?: string) => React.ReactNode; language: string }) {
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

function CycleSummarySection({ t, language, cycleData, loading }: { t: (id: string, fallback?: string) => string | React.ReactNode, language: string, cycleData: { cycles: Cycle[], avgCycleLength: number, avgPeriodLength: number } | null, loading: boolean }) {
  const { user } = useAuth();

  if (!user) return null;

  if (loading) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base"><Skeleton className="h-5 w-32" /></CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-36 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!cycleData || cycleData.cycles.length === 0) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">{t('homepage_cycle_summary_title', 'Pregled Ciklusa')}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-center text-sm text-muted-foreground">
          {t('homepage_cycle_empty_state', 'Unesite svoj prvi ciklus u kalendar da biste ovde videli pregled.')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{t('homepage_cycle_summary_title', 'Pregled Ciklusa')}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CycleStats avgPeriodLength={cycleData.avgPeriodLength} avgCycleLength={cycleData.avgCycleLength} t={t} />
        <div className="mt-4">
          <CycleLegend cycles={cycleData.cycles} avgCycleLength={cycleData.avgCycleLength} language={language as any} t={t as (key: string) => string} />
        </div>
      </CardContent>
    </Card>
  )
}

function HealthCorner({ t, language }: { t: (id: string, fallback?: string) => React.ReactNode, language: string }) {
  const facts = useMemo(() => ['fact_1', 'fact_2', 'fact_3', 'fact_4', 'fact_5'], []);
  const [randomFactId, setRandomFactId] = React.useState('');

  useEffect(() => {
    setRandomFactId(facts[Math.floor(Math.random() * facts.length)]);
  }, [facts]);

  if (!randomFactId) return null;

  return (
    <Card className="bg-blue-500/10 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Lightbulb className="h-6 w-6" />
          {t('health_corner_title', 'Kutak Zdravlja')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-blue-800 dark:text-blue-300">{t(randomFactId)}</div>
        <Button asChild variant="secondary" className="bg-white/80 text-blue-600 hover:bg-white">
          <Link href={`/${language}/articles`}>
            {t('health_corner_read_more', 'Pročitajte sve članke...')} <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const iconMap: { [key: string]: React.ElementType } = {
  Tag, HelpCircle, Star, Share2, Home, BookOpen, CalendarPlus, Phone,
  Newspaper,
  User: LucideIcons.User,
};

function HomePageCards({ t, language }: { t: (id: string, fallback?: string) => React.ReactNode; language: string }) {
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

function HomePageInternal() {
  const { language } = useLanguage();
  const { user, userProfile, loading } = useAuth();
  const searchParams = useSearchParams();
  const { emit } = useEventBus();

  const { content, loading: contentLoading } = useContent(contentIds);
  const [cycleData, setCycleData] = useState<{ cycles: Cycle[], avgCycleLength: number, avgPeriodLength: number } | null>(null);
  const [cycleLoading, setCycleLoading] = useState(true);
  const [isGamificationDialogOpen, setIsGamificationDialogOpen] = useState(false);

  const showTour = searchParams.get('tour') === 'true';

  useEffect(() => {
    if (!user) { setCycleLoading(false); return; }
    const fetchData = async () => {
      setCycleLoading(true);
      const dataRef = doc(db, 'users', user.uid, 'cycleData', 'main');
      const docSnap = await getDoc(dataRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const cycles = data.cycles?.map((c: any) => ({
          id: c.id,
          startDate: c.startDate.toDate(),
          endDate: c.endDate ? c.endDate.toDate() : null,
          type: c.type || 'regular'
        })) || [];
        setCycleData({
          cycles,
          avgCycleLength: data.avgCycleLength || 28,
          avgPeriodLength: data.avgPeriodLength || 5,
        });
        // Badge logic based on cycle data
        if (cycles.length > 0) emit(UserEventType.BadgeUnlocked, { badgeKey: 'explorer' });
        if (cycles.length >= 3) emit(UserEventType.BadgeUnlocked, { badgeKey: 'routine_queen' });
      } else {
        setCycleData(null);
      }
      setCycleLoading(false);
    }
    fetchData();
  }, [user, emit]);


  const T_el = (id: string, fallback?: string): React.ReactNode => {
    if (contentLoading) return <Skeleton className="h-4 w-24 inline-block" />;
    return content[id] || fallback || `[${id}]`;
  };

  if (showTour) {
    return <AppWalkthrough />;
  }



  const allBadges = getAllBadges(userProfile, cycleData?.cycles?.length || 0);

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-4 h-full">
        <h1 className="sr-only">Palmotićeva –– savremena medicina i iskustvo - centar za ginekologiju i hirurgiju</h1>
        <div className="flex flex-col gap-4 h-full">

          <div className="flex-1 min-h-0 h-[500px]">
            <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
              <AiAssistant />
            </Suspense>
          </div>

          {user && <GamificationSection t={T_el} onOpenDialog={() => setIsGamificationDialogOpen(true)} badges={allBadges} />}

          <HealthCorner t={T_el} language={language} />

          <DashboardCards t={T_el} language={language} />

          <CycleSummarySection t={T_el} language={language} cycleData={cycleData} loading={cycleLoading} />

          <HomePageCards t={T_el} language={language} />

        </div>
      </div>
      {user && (
        <Dialog open={isGamificationDialogOpen} onOpenChange={setIsGamificationDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{T_el('gamification_dialog_title')}</DialogTitle>
              <DialogDescription>
                {T_el('gamification_dialog_desc')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {allBadges.map((badge) => (
                <div key={badge.key} className={cn("flex items-center gap-4 transition-opacity", !badge.unlocked && "opacity-40")}>
                  <div className={cn("flex-shrink-0 rounded-full h-12 w-12 flex items-center justify-center", badge.unlocked ? `${badge.colorClass} bg-opacity-10` : 'bg-muted')}>
                    <badge.icon className={cn("h-6 w-6", badge.unlocked ? badge.colorClass : 'text-muted-foreground')} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{T_el(`badge_${badge.key}_title`)}</h3>
                    <p className="text-sm text-muted-foreground">{T_el(`badge_${badge.key}_desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>{T_el('gamification_dialog_button')}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomePageInternal />
    </Suspense>
  );
}
