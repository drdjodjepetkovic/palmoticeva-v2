
"use client";

import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";
import { Toast, ToastAction, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { Download } from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { useEventBus } from "@/context/event-bus-context";
import { UserEventType } from "@/lib/events";
import { useEffect, useState } from "react";
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

export function PwaInstallToast() {
  const { install, canInstall, isIOS, isStandalone } = usePwaInstall();
  const { on } = useEventBus();
  const { content } = useContent(['pwa_install_title', 'pwa_install_desc', 'pwa_install_button', 'pwa_ios_install_title', 'pwa_ios_install_desc']);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show prompt if:
    // 1. Android/Desktop: canInstall is true (beforeinstallprompt fired)
    // 2. iOS: isIOS is true AND isStandalone is false (not installed yet)
    // We use a small delay to not annoy immediately on load
    const timer = setTimeout(() => {
      if (canInstall || (isIOS && !isStandalone)) {
        // Check if user has already dismissed it recently (optional, skipping for now)
        setIsOpen(true);
      }
    }, 3000);

    const unsubscribe = on(UserEventType.PwaInstallPrompt, () => {
      setIsOpen(true);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [on, canInstall, isIOS, isStandalone]);


  const handleInstall = () => {
    install();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
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
