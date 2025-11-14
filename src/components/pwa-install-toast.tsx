
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
  const { install, canInstall } = usePwaInstall();
  const { on } = useEventBus();
  const { content } = useContent(['pwa_install_title', 'pwa_install_desc', 'pwa_install_button']);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = on(UserEventType.PwaInstallPrompt, () => {
      if (canInstall) {
        setIsOpen(true);
      }
    });
    return unsubscribe;
  }, [on, canInstall]);


  const handleInstall = () => {
    install();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  }

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
