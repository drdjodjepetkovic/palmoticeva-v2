import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 1;

export const onboardingContent: { [key: string]: ContentItem & { version: number } } = {
  onboarding_slide1_title: { en: "Track your cycle with our smart calendar.", "se-lat": "Pratite svoj ciklus pomoću našeg pametnog kalendara.", se: "Пратите свој циклус помоћу нашег паметног календара.", ru: "Отслеживайте свой цикл с помощью нашего умного календаря.", version: CURRENT_CONTENT_VERSION },
  onboarding_slide2_title: { en: "Don't search, ask", "se-lat": "Ne trazite, pitajte", se: "Не тражите, питајте", ru: "Не ищите, спрашивайте", version: CURRENT_CONTENT_VERSION },
  onboarding_slide3_title: { en: "Findings and results directly in your profile", "se-lat": "Nalazi i rezultati direktno u profilu", se: "Налази и резултати директно у профилу", ru: "Результаты анализов прямо в вашем профиле", version: CURRENT_CONTENT_VERSION },
  onboarding_cta_button: { en: "Get Started", "se-lat": "Počni", se: "Почни", ru: "Начать", version: CURRENT_CONTENT_VERSION },
};
