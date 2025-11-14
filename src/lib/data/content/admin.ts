import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 1;

export const adminContent: { [key: string]: ContentItem & { version: number } } = {
  admin_title: { en: "Admin Dashboard", ru: "Панель администратора", se: "Админ табла", "se-lat": "Admin tabla", version: CURRENT_CONTENT_VERSION },
  admin_description: { en: "Welcome to the admin area. Only the designated admin can see this.", ru: "Добро пожаловать в админ-зону. Только назначенный администратор может видеть это.", se: "Добродошли у администраторску област. Само одређени администратор може ово видети.", "se-lat": "Dobrodošli u administratorsku oblast. Samo određeni administrator može ovo videti.", version: CURRENT_CONTENT_VERSION },
  admin_alert_title: { en: "Admin Access Granted!", ru: "Доступ администратора предоставлен!", se: "Приступ администратора одорен!", "se-lat": "Pristup administratora odobren!", version: CURRENT_CONTENT_VERSION },
  admin_alert_desc: { en: "You have special privileges because you are the designated application administrator.", ru: "У вас есть особые привилегии, потому что вы являетесь назначенным администратором приложения.", se: "Имате посебне привилегије јер сте ви одређени администратор апликације.", "se-lat": "Imate posebne privilegije jer ste vi određeni administrator aplikacije.", version: CURRENT_CONTENT_VERSION },
  admin_body_text: { en: "Here you would typically find tools to manage users, view application-wide analytics, or configure settings.", ru: "Здесь вы обычно найдете инструменты для управления пользователями, просмотра аналитики по всему приложению или настройки параметров.", se: "Овде бисте обично пронашли алатке за управљање корисницима, преглед аналитике на нивоу целе апликације или конфигурисање подешавања.", "se-lat": "Ovde biste obično pronašli alatke za upravljanje korisnicima, pregled analitike na nivou cele aplikacije ili konfigurisanje podešavanja.", version: CURRENT_CONTENT_VERSION },
  profile_nav_ai_feedback: { en: "AI Feedback", ru: "AI-отзывы", se: "АИ Повратне Информације", "se-lat": "AI Povratne Informacije", version: CURRENT_CONTENT_VERSION },
  ai_feedback_title: { en: "AI Feedback", "se-lat": "AI Povratne Informacije", se: "АИ Повратне Информације", ru: "AI-отзывы", version: CURRENT_CONTENT_VERSION },
  ai_feedback_description: { en: "Review conversations where the AI assistant could not provide a sufficient answer. Use this to improve the knowledge base.", "se-lat": "Pregledajte razgovore u kojima AI asistent nije mogao da pruži dovoljan odgovor. Iskoristite ovo da poboljšate bazu znanja.", se: "Прегледајте разговоре у којима АИ асистент није могао да пружи довољан одговор. Искористите ово да побољшате базу знања.", ru: "Просмотрите разговоры, в которых ИИ-помощник не смог дать достаточный ответ. Используйте это для улучшения базы знаний.", version: CURRENT_CONTENT_VERSION },
  ai_feedback_question_col: { en: "User Question", "se-lat": "Pitanje Korisnika", se: "Питање Корисника", ru: "Вопрос пользователя", version: CURRENT_CONTENT_VERSION },
  ai_feedback_answer_col: { en: "AI's Answer", "se-lat": "Odgovor AI", se: "Одговор АИ", ru: "Ответ ИИ", version: CURRENT_CONTENT_VERSION },
  ai_feedback_no_results: { en: "No questions needing feedback were found.", "se-lat": "Nisu pronađena pitanja koja zahtevaju povratne informacije.", se: "Нису пронађена питања која захтевају повратне информације.", ru: "Вопросы, требующие обратной связи, не найдены.", version: CURRENT_CONTENT_VERSION },
  ai_feedback_user_col: { en: "User", "se-lat": "Korisnik", se: "Корисник", ru: "Пользователь", version: CURRENT_CONTENT_VERSION },
  ai_feedback_date_col: { en: "Date", "se-lat": "Datum", se: "Датум", ru: "Дата", version: CURRENT_CONTENT_VERSION },
};
