"use client";

import { useLanguage } from "@/features/content/context/language-context";
import { cn } from "@/lib/utils";
import type { AppLanguage } from "@/core/types";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const languages: { code: AppLanguage; label: string }[] = [
        { code: 'sr', label: 'SRB' },
        { code: 'en', label: 'ENG' },
        { code: 'ru', label: 'РУС' },
    ];

    return (
        <div className="flex items-center rounded-lg border bg-muted p-1">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                        "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                        language === lang.code
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    )}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
}
