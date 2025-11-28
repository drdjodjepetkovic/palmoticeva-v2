"use client";

import { useLanguage } from "@/context/language-context";
import React, { useState, Suspense, useMemo } from "react";
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

// Hooks
import { useCycleData } from "@/hooks/use-cycle-data";
import { GamificationDialog } from "@/components/gamification/gamification-dialog";
import { UserService } from "@/lib/services/user-service";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

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
