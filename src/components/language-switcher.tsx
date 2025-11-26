
"use client";

import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import type { LanguageCode } from "@/types/content";

const languageNames: Record<LanguageCode, string> = {
  "en": "ENG",
  "se": "СРБ",
  "se-lat": "SRB",
  "ru": "РУС",
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'se', label: 'SRB (Ćir)' },
    { code: 'se-lat', label: 'SRB (Lat)' },
    { code: 'en', label: 'ENG' },
    { code: 'ru', label: 'РУС' },
  ];

  return (
    <div className="flex items-center rounded-lg border bg-muted p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as LanguageCode)}
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
