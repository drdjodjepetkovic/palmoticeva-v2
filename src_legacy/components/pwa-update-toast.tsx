
"use client";

import { usePwaUpdate } from "@/hooks/use-pwa-update";
import { Button } from "@/components/ui/button";
import { Toast, ToastAction, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { Rocket } from "lucide-react";

export function PwaUpdateToast() {
  const { updateAvailable, refresh } = usePwaUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <Toast duration={Infinity}>
        <div className="grid gap-1">
            <ToastTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                <span>Nova verzija dostupna</span>
            </ToastTitle>
            <ToastDescription>
                Osvežite aplikaciju da vidite najnovije izmene.
            </ToastDescription>
        </div>
        <ToastAction asChild altText="Osveži">
            <Button onClick={refresh}>Osveži</Button>
        </ToastAction>
    </Toast>
  );
}
