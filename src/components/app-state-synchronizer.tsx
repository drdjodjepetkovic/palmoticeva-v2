
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppStateSynchronizer() {
    const { userProfile, loading } = useAuth();
    const { language } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        if (loading) return;

        // Apply theme from user profile or local storage
        const theme = userProfile?.preferredTheme || localStorage.getItem("app-theme") || "theme-default";
        const currentTheme = document.body.className.match(/theme-\w+/)?.[0];
        if (theme !== currentTheme) {
            document.body.className = cn(document.body.className.replace(/theme-\w+/g, ''), theme);
        }

        // Redirect user to their preferred language ONCE after login
        const hasRedirected = sessionStorage.getItem('lang_redirected');

        if (userProfile && userProfile.preferredLanguage && userProfile.preferredLanguage !== language && !hasRedirected) {
          const newPathname = pathname.replace(`/${language}`, `/${userProfile.preferredLanguage}`);
          if (pathname !== newPathname) {
             sessionStorage.setItem('lang_redirected', 'true');
             router.replace(newPathname);
          }
        }
        
        // If user logs out, clear the flag
        if (!userProfile && hasRedirected) {
            sessionStorage.removeItem('lang_redirected');
        }

    }, [userProfile, language, pathname, router, loading]);

    return null;
}
