"use client";

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import type { AppLanguage } from '@/core/types';
import { useParams, usePathname, useRouter } from 'next/navigation';

interface LanguageContextType {
    language: AppLanguage;
    setLanguage: (language: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

const SUPPORTED_LANGUAGES: AppLanguage[] = ['en', 'sr', 'ru'];
const DEFAULT_LANGUAGE: AppLanguage = 'sr';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();

    const langFromParam = Array.isArray(params.lang) ? params.lang[0] : params.lang;
    const initialLang = (langFromParam && SUPPORTED_LANGUAGES.includes(langFromParam as AppLanguage)) ? (langFromParam as AppLanguage) : DEFAULT_LANGUAGE;

    const [language, setLanguageState] = useState<AppLanguage>(initialLang);

    // Update state when URL parameter changes
    useEffect(() => {
        if (initialLang !== language) {
            setLanguageState(initialLang);
        }
    }, [initialLang, language]);

    const setLanguage = useCallback((newLang: AppLanguage) => {
        if (newLang === language) return;

        // Update state immediately for instant UI feedback
        setLanguageState(newLang);

        // Update URL
        const newPathname = pathname.replace(`/${language}`, `/${newLang}`);
        router.push(newPathname);

    }, [language, pathname, router]);

    const value = { language, setLanguage };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
