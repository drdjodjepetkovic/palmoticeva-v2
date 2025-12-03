import { useLanguage } from "@/features/content/context/language-context";
import { dictionaries } from "@/features/content/dictionaries";
import type { AppLanguage } from "@/core/types";

export const useContent = () => {
  const { language } = useLanguage();
  const t = dictionaries[language as AppLanguage] || dictionaries['sr'];

  if (!t) {
    console.error(`Dictionary not found for language: ${language}`);
    // Fallback to empty object to prevent crash, though UI will be broken
    return { t: {} as any, language };
  }

  return { t, language };
};
