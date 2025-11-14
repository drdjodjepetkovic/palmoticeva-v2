
"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { LanguageCode } from "@/types/content";

const languageNames: Record<LanguageCode, string> = {
  "en": "ENG",
  "se": "СРБ",
  "se-lat": "SRB",
  "ru": "РУС",
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {languageNames[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("se-lat")}>
          SRB
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("se")}>
          СРБ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          ENG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ru")}>
          РУС
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
