import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 1;

export const headerContent: { [key: string]: ContentItem & { version: number } } = {
  header_brand: { en: "Palmotićeva", ru: "Палмотичева", se: "Палмотићева", "sr": "Palmotićeva", version: CURRENT_CONTENT_VERSION },
  header_nav_home: { en: "Home", ru: "Главная", se: "Почетна", "sr": "Početna", version: CURRENT_CONTENT_VERSION },
  header_nav_appointments: { en: "Appointments", ru: "Запись", se: "Заказивање", "sr": "Zakazivanje", version: CURRENT_CONTENT_VERSION },
  header_nav_calendar: { en: "Calendar", ru: "Календарь", se: "Календар", "sr": "Kalendar", version: CURRENT_CONTENT_VERSION },
  header_nav_pricelist: { en: "Pricelist", ru: "Прайс-лист", se: "Ценовник", "sr": "Cenovnik", version: CURRENT_CONTENT_VERSION },
  header_nav_about_us: { en: "About Us", ru: "О нас", se: "О нама", "sr": "O nama", version: CURRENT_CONTENT_VERSION },
  header_nav_profile: { en: "My Profile", ru: "Мой профиль", se: "Мој профил", "sr": "Moj profil", version: CURRENT_CONTENT_VERSION },
  header_nav_admin: { en: "Admin", ru: "Админ", se: "Админ", "sr": "Admin", version: CURRENT_CONTENT_VERSION },
  header_button_signin: { en: "Log In", ru: "Войти", se: "Улогуј се", "sr": "Uloguj se", version: CURRENT_CONTENT_VERSION },
  header_menu_logout: { en: "Log Out", ru: "Выйти", se: "Одјава", "sr": "Odjava", version: CURRENT_CONTENT_VERSION },
  header_nav_results: { en: "Results", ru: "Результаты", se: "Резултати", "sr": "Rezultati", version: CURRENT_CONTENT_VERSION },
};
