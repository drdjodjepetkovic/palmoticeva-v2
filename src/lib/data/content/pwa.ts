
import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 1;

export const pwaContent: { [key: string]: ContentItem & { version: number } } = {
  pwa_install_title: { en: "Install App", "se-lat": "Instaliraj Aplikaciju", se: "Инсталирај Апликацију", ru: "Установить приложение", version: CURRENT_CONTENT_VERSION },
  pwa_install_desc: { en: "For the best experience, add our app to your home screen.", "se-lat": "Za najbolje iskustvo, dodajte našu aplikaciju na početni ekran.", se: "За најбоље искуство, додајте нашу апликацију на почетни екран.", ru: "Для наилучшего опыта добавьте наше приложение на главный экран.", version: CURRENT_CONTENT_VERSION },
  pwa_install_button: { en: "Install", "se-lat": "Instaliraj", se: "Инсталирај", ru: "Установить", version: CURRENT_CONTENT_VERSION },
};
