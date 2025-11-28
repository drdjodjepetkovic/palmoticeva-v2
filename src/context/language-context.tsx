
"use client";

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import type { LanguageCode } from '@/types/content';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './auth-context';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'se-lat', 'se', 'ru'];
const DEFAULT_LANGUAGE: LanguageCode = 'se-lat';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, userProfile } = useAuth();

  const langFromParam = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const initialLang = (langFromParam && SUPPORTED_LANGUAGES.includes(langFromParam as LanguageCode)) ? (langFromParam as LanguageCode) : DEFAULT_LANGUAGE;

  const [language, setLanguageState] = useState<LanguageCode>(initialLang);

  // Update state when URL parameter changes
  useEffect(() => {
    if (initialLang !== language) {
      setLanguageState(initialLang);
    }
  }, [initialLang, language]);

  // Handle initial language detection for guests
  useEffect(() => {
    if (!loading && !user) {
      const storedLang = localStorage.getItem('language') as LanguageCode;
      if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang) && storedLang !== initialLang) {
        const newPathname = pathname.replace(`/${initialLang}`, `/${storedLang}`);
        router.push(newPathname);
      } else if (!storedLang) {
        const browserLang = navigator.language.split('-')[0] as LanguageCode;
        const detectedLang = SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE;
        if (detectedLang !== initialLang) {
          const newPathname = pathname.replace(`/${initialLang}`, `/${detectedLang}`);
          router.push(newPathname);
        }
      }
    }
  }, [loading, user, initialLang, pathname, router]);

  const setLanguage = useCallback(async (newLang: LanguageCode) => {
    if (newLang === language) return;

    // Update state immediately for instant UI feedback
    setLanguageState(newLang);

    // Update persistence layer
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        // We don't await this so the UI is not blocked
        updateDoc(userDocRef, { preferredLanguage: newLang });
      } catch (error) {
        console.error("Failed to save language preference:", error);
      }
    } else {
      localStorage.setItem('language', newLang);
    }

    // Update URL
    const newPathname = pathname.replace(`/${language}`, `/${newLang}`);
    router.push(newPathname);

  }, [language, pathname, router, user]);

  // The context now provides the state variable, which is always up-to-date
  const value = { language, setLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
