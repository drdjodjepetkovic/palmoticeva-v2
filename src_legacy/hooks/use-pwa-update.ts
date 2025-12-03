
"use client";

import { useState, useEffect } from "react";

export const usePwaUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [wb, setWb] = useState<any>(null);

  useEffect(() => {
    // This effect runs only on the client side
    if (typeof window !== "undefined" && "workbox" in window) {
      const { Workbox } = window.workbox as any;

      if (Workbox) {
        const workbox = new Workbox("/sw.js");
        setWb(workbox);

        const handleWaiting = () => {
          setUpdateAvailable(true);
        };

        workbox.addEventListener("waiting", handleWaiting);

        // This is a crucial step. It tells the Workbox instance to check for updates.
        workbox.register();

        return () => {
          workbox.removeEventListener("waiting", handleWaiting);
        };
      }
    }
  }, []);

  const refresh = () => {
    if (wb) {
      // This sends a message to the waiting service worker to activate itself.
      // Combined with skipWaiting: true in next.config.js, this ensures the new
      // service worker takes control.
      wb.messageSkipWaiting();
      // Reload the page to load the new content from the activated service worker.
      window.location.reload();
    }
  };

  return { updateAvailable, refresh };
};
