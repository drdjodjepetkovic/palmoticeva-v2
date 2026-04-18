
"use client";

import { useEffect } from 'react';
import { useEventBus } from '@/context/event-bus-context';
import { UserEventType, type UserEventPayload } from '@/lib/events';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { usePwaInstall } from '@/hooks/use-pwa-install';

// NOTE: `useContent`, `defaultContent`, `useLanguage` imports + `badgeContentIds` const
// removed 2026-04-18 when badge-unlocked toast was disabled (Package C / option A).
// Restore them if gamification UI is re-enabled.

/**
 * A central component that listens to events and triggers user-facing interactions
 * like toasts, PWA installs, etc. This component is meant to be placed in the root layout.
 */
export function UserInteractionHub() {
  const { on, emit } = useEventBus();
  const { toast } = useToast();
  const { user, userProfile, setShowWalkthrough } = useAuth();
  const { canInstall } = usePwaInstall();

  // Listener for showing toasts
  useEffect(() => {
    const unsubscribe = on(UserEventType.ToastShow, (payload) => {
      toast(payload);
    });
    return unsubscribe;
  }, [on, toast]);

  // Listener for unlocking badges
  useEffect(() => {
    const unsubscribe = on(UserEventType.BadgeUnlocked, async (payload) => {
      if (!user || userProfile?.unlockedBadges?.includes(payload.badgeKey)) {
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          unlockedBadges: arrayUnion(payload.badgeKey)
        });

        // GAMIFICATION UI DISABLED 2026-04-18 per Đole decision (Package C, option A).
        // Firestore write above is retained — badge tracking still happens silently, in case we re-enable UI later.
        // Toast emission + content lookup intentionally commented out.
        //
        // const contentKey = `badge_${payload.badgeKey}_title`;
        // let badgeTitle = content[contentKey];
        // if (!badgeTitle) {
        //   const defaultItem = defaultContent[contentKey];
        //   if (defaultItem) {
        //     badgeTitle = defaultItem[language] || defaultItem['se-lat'];
        //   }
        // }
        // if (!badgeTitle) {
        //   badgeTitle = payload.badgeKey;
        // }
        // emit(UserEventType.ToastShow, {
        //   title: "Novi bedž otključan!",
        //   description: `Zaslužili ste bedž: ${badgeTitle}`
        // });

      } catch (error) {
        console.error("Failed to unlock badge:", error);
      }
    });

    return unsubscribe;
  }, [on, user, userProfile]);

  // Listener for starting the app walkthrough
  useEffect(() => {
    const unsubscribe = on(UserEventType.WalkthroughStart, () => {
      setShowWalkthrough(true);
    });
    return unsubscribe;
  }, [on, setShowWalkthrough]);

  // Listener for handling events after the walkthrough is complete
  useEffect(() => {
    const unsubscribe = on(UserEventType.WalkthroughComplete, () => {
      // After walkthrough, if the user hasn't sent an appointment request yet,
      // and hasn't logged a cycle, we can prompt for notifications as a general setup step.
      const hasSentAppointment = sessionStorage.getItem('appointment_sent') === 'true';
      const hasLoggedCycle = sessionStorage.getItem('cycle_logged') === 'true';

      if (!hasSentAppointment && !hasLoggedCycle) {
        emit(UserEventType.NotificationPermissionRequest);
      }
    });
    return unsubscribe;
  }, [on, emit]);

  // Contextual listener for PWA install prompt
  useEffect(() => {
    const showPwaPrompt = () => {
      const prompted = sessionStorage.getItem('pwa_prompted_this_session') === 'true';
      if (canInstall && !prompted) {
        emit(UserEventType.PwaInstallPrompt);
        sessionStorage.setItem('pwa_prompted_this_session', 'true');
      }
    };
    const unsubscribe = on(UserEventType.FirstCycleLogged, showPwaPrompt);
    return unsubscribe;
  }, [on, canInstall, emit]);

  // Contextual listener for Notification permission
  useEffect(() => {
    const showNotificationPrompt = () => {
      // Notification.permission can be 'granted', 'denied', or 'default'
      if (Notification.permission === 'default') {
        emit(UserEventType.NotificationPermissionRequest);
      }
    };
    const unsubscribe = on(UserEventType.AppointmentInquirySent, showNotificationPrompt);
    return unsubscribe;
  }, [on, emit]);

  return null; // This component does not render anything
}
