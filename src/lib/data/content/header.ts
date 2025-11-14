import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 1;

export const headerContent: { [key: string]: ContentItem & { version: number } } = {
  header_brand: { en: "Palmotićeva", ru: "Палмотичева", se: "Палмотићева", "se-lat": "Palmotićeva", version: CURRENT_CONTENT_VERSION },
  header_nav_home: { en: "Home", ru: "Главная", se: "Почетна", "se-lat": "Početna", version: CURRENT_CONTENT_VERSION },
  header_nav_appointments: { en: "Appointments", ru: "Запись", se: "Заказивање", "se-lat": "Zakazivanje", version: CURRENT_CONTENT_VERSION },
  header_nav_calendar: { en: "Calendar", ru: "Календарь", se: "Календар", "se-lat": "Kalendar", version: CURRENT_CONTENT_VERSION },
  header_nav_pricelist: { en: "Pricelist", ru: "Прайс-лист", se: "Ценовник", "se-lat": "Cenovnik", version: CURRENT_CONTENT_VERSION },
  header_nav_about_us: { en: "About Us", ru: "О нас", se: "О нама", "se-lat": "O nama", version: CURRENT_CONTENT_VERSION },
  header_nav_profile: { en: "My Profile", ru: "Мой профиль", se: "Мој профил", "se-lat": "Moj profil", version: CURRENT_CONTENT_VERSION },
  header_nav_admin: { en: "Admin", ru: "Админ", se: "Админ", "se-lat": "Admin", version: CURRENT_CONTENT_VERSION },
  header_button_signin: { en: "Log In", ru: "Войти", se: "Улогуј се", "se-lat": "Uloguj se", version: CURRENT_CONTENT_VERSION },
  header_menu_logout: { en: "Log Out", ru: "Выйти", se: "Одјава", "se-lat": "Odjava", version: CURRENT_CONTENT_VERSION },
};
