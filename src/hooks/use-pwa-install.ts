
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useEventBus } from "@/context/event-bus-context";
import { UserEventType } from "@/lib/events";


interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isReady = false;

if (typeof window !== 'undefined') {
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e as BeforeInstallPromptEvent;
        isReady = true;
    });
}

// Global check for other components
export const isPwaInstallReady = () => isReady;


export const usePwaInstall = () => {
  const { emit } = useEventBus();
  const [canInstall, setCanInstall] = useState(isReady);
  
  useEffect(() => {
    const handleInstallReady = () => setCanInstall(true);
    
    if (isReady) {
      handleInstallReady();
    } else {
       window.addEventListener('beforeinstallprompt', handleInstallReady, { once: true });
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallReady);
    }
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        emit(UserEventType.BadgeUnlocked, { badgeKey: 'installer' });
    }

    deferredPrompt = null;
    isReady = false;
    setCanInstall(false);
  }, [emit]);

  return { canInstall, install };
};
