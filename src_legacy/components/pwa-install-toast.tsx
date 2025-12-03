
"use client";

import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { useEventBus } from "@/context/event-bus-context";
import { UserEventType } from "@/lib/events";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const DISMISS_KEY = 'pwa_install_dismissed_at';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function PwaInstallToast() {
  const { install, canInstall, isIOS, isStandalone } = usePwaInstall();
  const { on } = useEventBus();
  const { user } = useAuth();
  const { content } = useContent(['pwa_install_title', 'pwa_install_desc', 'pwa_install_button', 'pwa_ios_install_title', 'pwa_ios_install_desc']);
  const [isOpen, setIsOpen] = useState(false);

  // Track state for triggers
  const aiQuestionsCount = useRef(0);
  const timeOnSiteTriggered = useRef(false);

  const shouldShowPrompt = () => {
    // 1. Check if already installed (standalone)
    if (isStandalone) return false;

    // 2. Check technical readiness (Android/Desktop needs event, iOS just needs detection)
    if (!canInstall && !isIOS) return false;

    // 3. Check persistence (if dismissed recently)
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const diff = Date.now() - parseInt(dismissedAt);
      if (diff < DISMISS_DURATION) return false;
    }

    return true;
  };

  const triggerPrompt = () => {
    if (shouldShowPrompt()) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    // TRIGGER 1: Time on Site (> 500s)
    const timer = setTimeout(() => {
      if (!timeOnSiteTriggered.current) {
        timeOnSiteTriggered.current = true;
        triggerPrompt();
      }
    }, 500000);

    return () => clearTimeout(timer);
  }, [canInstall, isIOS, isStandalone]); // Re-check if dependencies change, but timer is stable

  // TRIGGER 2: Login
  useEffect(() => {
    if (user) {
      // Small delay to let the UI settle after login
      const timer = setTimeout(() => triggerPrompt(), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, canInstall, isIOS, isStandalone]); // Fixed: Added dependencies to avoid stale closure

  useEffect(() => {
    // TRIGGER 3: AI Interaction (3 questions)
    const unsubAi = on(UserEventType.AiQuestionAsked, () => {
      aiQuestionsCount.current += 1;
      if (aiQuestionsCount.current === 3) {
        triggerPrompt();
      }
    });

    // TRIGGER 4: Cycle Logged
    const unsubCycle = on(UserEventType.CycleLogged, () => {
      triggerPrompt();
    });

    // TRIGGER 5: Booking Inquiry (AppointmentInquirySent)
    const unsubBooking = on(UserEventType.AppointmentInquirySent, () => {
      triggerPrompt();
    });

    // Manual Trigger (e.g. from a button)
    const unsubManual = on(UserEventType.PwaInstallPrompt, () => {
      setIsOpen(true); // Force open for manual trigger
    });

    return () => {
      unsubAi();
      unsubCycle();
      unsubBooking();
      unsubManual();
    };
  }, [on, canInstall, isIOS, isStandalone]);


  const handleInstall = () => {
    install();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Save dismissal time
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }

  if (!isOpen) return null;

  // iOS Instruction View
  if (isIOS && !isStandalone) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              {content['pwa_ios_install_title'] || 'Install on iPhone'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{content['pwa_ios_install_desc'] || 'To install this app on your iPhone:'}</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Tap the <strong>Share</strong> button <span className="inline-block border rounded px-1 text-xs">⎋</span></li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong> <span className="inline-block border rounded px-1 text-xs">+</span></li>
              </ol>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  // Standard Install View (Android/Desktop)
  if (canInstall) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              {content['pwa_install_title'] || 'Install the App'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {content['pwa_install_desc'] || 'Get a better experience by installing the app on your device.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Možda kasnije</AlertDialogCancel>
            <AlertDialogAction onClick={handleInstall}>{content['pwa_install_button'] || 'Install'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
}
