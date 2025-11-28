"use client";

import { useLanguage } from "@/context/language-context";
import React, { useState, Suspense, useMemo, useEffect } from "react";
import { useContent } from "@/hooks/use-content";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { getAllBadges } from '@/lib/data/content';
import { useSearchParams } from "next/navigation";
import AppWalkthrough from "@/components/onboarding/app-walkthrough";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Components
import { GamificationSection } from "@/components/home/gamification-section";
import { HealthCorner } from "@/components/home/health-corner";
import { DashboardCards } from "@/components/home/dashboard-cards";
import { CycleSummarySection } from "@/components/home/cycle-summary-section";
import { HomePageCards } from "@/components/home/home-page-cards";
import { GreetingSection } from "@/components/home/greeting-section";
import { AiConciergeCard } from "@/components/home/ai-concierge-card";
import { CircularCycleTracker } from "@/components/home/circular-cycle-tracker";

// Hooks
import { useCycleData } from "@/hooks/use-cycle-data";
import { GamificationDialog } from "@/components/gamification/gamification-dialog";
import { UserService } from "@/lib/services/user-service";
import { useToast } from "@/hooks/use-toast";

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
  'homepage_cycle_summary_title',
  'homepage_cycle_empty_state',
  'averagePeriod',
  'averageCycle',
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
  'greeting_morning',
  'greeting_afternoon',
  'greeting_evening',
  'greeting_default',
];

function HomePageInternal() {
  const { language } = useLanguage();
  const { user, userProfile } = useAuth();
  const searchParams = useSearchParams();

  const { content, loading: contentLoading } = useContent(contentIds);
  const { cycleData, loading: cycleLoading } = useCycleData();
  const [isGamificationDialogOpen, setIsGamificationDialogOpen] = useState(false);
  const { toast } = useToast();

  const showTour = searchParams.get('tour') === 'true';

  const T_el = (id: string, fallback?: string): React.ReactNode => {
    if (contentLoading) return <Skeleton className="h-4 w-24 inline-block" />;
    return content[id] || fallback || `[${id}]`;
  };

  if (showTour) {
    return <AppWalkthrough />;
  }

  const allBadges = useMemo(() => getAllBadges(userProfile, cycleData?.cycles?.length || 0), [userProfile, cycleData?.cycles?.length]);

  useEffect(() => {
    if (!userProfile || !user) return;

    const currentUnlocked = new Set(userProfile.unlockedBadges || []);
    const newBadges: string[] = [];

    allBadges.forEach(badge => {
      if (badge.unlocked && !currentUnlocked.has(badge.key)) {
        newBadges.push(badge.key);
      }
    });

    if (newBadges.length > 0) {
      // Update user profile
      const updatedUnlockedBadges = [...(userProfile.unlockedBadges || []), ...newBadges];
      UserService.updateUserProfile(user.uid, { unlockedBadges: updatedUnlockedBadges });

      // Show toast for each new badge
      newBadges.forEach(badgeKey => {
        const badge = allBadges.find(b => b.key === badgeKey);
        if (badge) {
          toast({
            title: T_el('gamification_dialog_title') as string, // Or a specific "New Badge Unlocked!" string
            description: `${T_el(badge.titleKey)}`,
            variant: "default", // or "success" if available
          });
        }
      });
    }
  }, [userProfile, user, toast, allBadges]);

  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Calculate cycle data for the tracker
  const lastCycle = cycleData?.cycles?.[0];
  const lastPeriodStart = lastCycle ? new Date(lastCycle.startDate) : null;
  const today = new Date();
  const currentDay = lastPeriodStart
    ? Math.floor((today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1;

  // Simple estimation for fertile window (standard 14 days before next period)
  const cycleLen = cycleData?.avgCycleLength || 28;
  const ovulationDay = cycleLen - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-4 h-full">
        <h1 className="sr-only">Palmotićeva –– savremena medicina i iskustvo - centar za ginekologiju i hirurgiju</h1>
        <div className="flex flex-col gap-6 h-full">

          {/* AI Concierge Card */}
          <AiConciergeCard
            t={T_el}
            onOpenAi={() => setIsAiAssistantOpen(true)}
            onBookAppointment={() => setIsAiAssistantOpen(true)} // For now, open AI to help book
          />

          {/* Circular Cycle Tracker */}
          {user && (
            <CircularCycleTracker
              currentDay={currentDay}
              cycleLength={cycleLen}
              periodLength={cycleData?.avgPeriodLength || 5}
              fertileWindowStart={fertileStart}
              fertileWindowEnd={fertileEnd}
              ovulationDay={ovulationDay}
              t={T_el}
            />
          )}

          {user && <GamificationSection t={T_el} onOpenDialog={() => setIsGamificationDialogOpen(true)} badges={allBadges} />}

          <HealthCorner t={T_el} language={language} />

          <DashboardCards t={T_el} language={language} />

          <HomePageCards t={T_el} language={language} />

        </div>
      </div>

      {/* AI Assistant Modal */}
      <Dialog open={isAiAssistantOpen} onOpenChange={setIsAiAssistantOpen}>
        <DialogContent className="sm:max-w-[425px] h-[80vh] p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-none shadow-2xl">
          <div className="h-full w-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg text-primary">Palmotićeva AI</span>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5">
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </Button>
              </DialogClose>
            </div>
            <div className="flex-1 min-h-0 relative">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <AiAssistant />
              </Suspense>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {user && (
        <GamificationDialog
          open={isGamificationDialogOpen}
          onOpenChange={setIsGamificationDialogOpen}
          badges={allBadges}
          t={T_el}
        />
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
