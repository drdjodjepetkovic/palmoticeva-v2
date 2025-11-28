
import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 16;

export const homepageContent: { [key: string]: ContentItem & { version: number } } = {
  hero_main_text: { en: "27 years of trust.", "sr": "27 godina poverenja.", se: "27 година поверења.", ru: "27 лет доверия.", version: CURRENT_CONTENT_VERSION },
  hero_button_text: { en: "All about us", "sr": "Sve o nama", se: "Све о нама", ru: "Все о нас", version: CURRENT_CONTENT_VERSION },
  homepage_notifications_title: { en: "My Notifications", "sr": "Moja Obaveštenja", se: "Моја Обавештења", ru: "Мои уведомления", version: CURRENT_CONTENT_VERSION },
  homepage_notifications_view_all: { en: "View all notifications", "sr": "Pogledaj sva obaveštenja", se: "Погледај сва обавештења", ru: "Посмотреть все уведомления", version: CURRENT_CONTENT_VERSION },
  homepage_notifications_none: { en: "No new notifications.", "sr": "Trenutno nema novih obaveštenja.", se: "Тренутно нема нових обавештења.", ru: "Новых уведомлений нет.", version: CURRENT_CONTENT_VERSION },
  homepage_calendar_card_title: { en: "My Calendar", "sr": "Moj Kalendar", se: "Мој Календар", ru: "Мой календарь", version: CURRENT_CONTENT_VERSION },

  greeting_morning: { en: "Good morning", "sr": "Dobro jutro", se: "Добро јутро", ru: "Доброе утро", version: CURRENT_CONTENT_VERSION },
  greeting_afternoon: { en: "Good afternoon", "sr": "Dobar dan", se: "Добар дан", ru: "Добрый день", version: CURRENT_CONTENT_VERSION },
  greeting_evening: { en: "Good evening", "sr": "Dobro veče", se: "Добро вече", ru: "Добрый вечер", version: CURRENT_CONTENT_VERSION },
  greeting_default: { en: "Hello", "sr": "Zdravo", se: "Здраво", ru: "Здравствуйте", version: CURRENT_CONTENT_VERSION },
  homepage_calendar_card_desc: { en: "Track your cycle, symptoms, and fertile days.", "sr": "Pratite ciklus, simptome i plodne dane.", se: "Пратите циклус, симптоме и плодне дане.", ru: "Отслеживайте цикл, симптомы и фертильные дни.", version: CURRENT_CONTENT_VERSION },
  homepage_smart_calendar_title: { en: "Smart Calendar", "sr": "Smart Kalendar", se: "Смарт Календар", ru: "Умный Календарь", version: CURRENT_CONTENT_VERSION },
  homepage_smart_calendar_desc: { en: "Tailored to you...", "sr": "Prilagođen Vama...", se: "Прилагођен Вама...", ru: "Адаптирован для вас...", version: CURRENT_CONTENT_VERSION },
  homepage_cycle_summary_title: { en: "Cycle Summary", "sr": "Pregled Ciklusa", se: "Преглед Циклуса", ru: "Обзор цикла", version: CURRENT_CONTENT_VERSION },
  homepage_cycle_empty_state: { en: "Log your first cycle in the calendar to see a summary here.", "sr": "Unesite svoj prvi ciklus u kalendar da biste ovde videli pregled.", se: "Унесите свој први циклус у календар да бисте овде видели преглед.", ru: "Запишите свой первый цикл в календаре, чтобы увидеть здесь сводку.", version: CURRENT_CONTENT_VERSION },

  averagePeriod: { en: "Average Period", "sr": "Prosečna Menstruacija", se: "Просечна Менструација", ru: "Средняя менструация", version: CURRENT_CONTENT_VERSION },
  averageCycle: { en: "Average Cycle", "sr": "Prosečan Ciklus", se: "Просечан Циклус", ru: "Средний цикл", version: CURRENT_CONTENT_VERSION },
  legendPeriodStart: { en: "Period", "sr": "Menstruacija", se: "Менструација", ru: "Менструация", version: CURRENT_CONTENT_VERSION },
  legendFertileStart: { en: "Fertile Window", "sr": "Plodni Dani", se: "Плодни Дани", ru: "Фертильные дни", version: CURRENT_CONTENT_VERSION },
  legendOvulation: { en: "Ovulation", "sr": "Ovulacija", se: "Овулација", ru: "Овуляция", version: CURRENT_CONTENT_VERSION },
  legendFertileEnd: { en: "End of Fertile", "sr": "Kraj Plodnih Dana", se: "Крај Плодних Дана", ru: "Конец фертильных дней", version: CURRENT_CONTENT_VERSION },
  homepage_about_card_title: { en: "Meet Palmotićeva", "sr": "Upoznajte Palmotićevu", se: "Упознајте Палмотићеву", ru: "Познакомьтесь с Палмотичевой", version: CURRENT_CONTENT_VERSION },
  homepage_about_card_desc: { en: "Learn more about our team and values.", "sr": "Saznajte više o našem timu i vrednostima.", se: "Сазнајте више о нашем тиму и вредностима.", ru: "Узнайте больше о нашей команде и ценностях.", version: CURRENT_CONTENT_VERSION },
  homepage_appointment_card_title: { en: "Become Our Patient", "sr": "Postanite Naš Pacijent", se: "Постаните Наш Пацијент", ru: "Станьте нашим пациентом", version: CURRENT_CONTENT_VERSION },
  homepage_appointment_card_desc: { en: "Easy and fast appointment scheduling.", "sr": "Lako i brzo zakazivanje termina.", se: "Лако и брзо заказивање термина.", ru: "Простая и быстрая запись на прием.", version: CURRENT_CONTENT_VERSION },

  badge_our_patient_title: { en: "Our Patient", "sr": "Naš Pacijent", se: "Наш Пацијент", ru: "Наш пациент", version: CURRENT_CONTENT_VERSION },
  badge_our_patient_desc: { en: "Verified patient of the Palmotićeva clinic.", "sr": "Verifikovani pacijent ordinacije Palmotićeva.", se: "Верификовани пацијент ординације Палмотићева.", ru: "Проверенный пациент клиники Пальмотичева.", version: CURRENT_CONTENT_VERSION },
  badge_explorer_title: { en: "Explorer", "sr": "Istraživač", se: "Истраживач", ru: "Исследователь", version: CURRENT_CONTENT_VERSION },
  badge_explorer_desc: { en: "You have successfully logged your first cycle!", "sr": "Uspešno ste uneli svoj prvi ciklus!", se: "Успешно сте унели свој први циклус!", ru: "Вы успешно записали свой первый цикл!", version: CURRENT_CONTENT_VERSION },
  badge_routine_queen_title: { en: "Routine Queen", "sr": "Kraljica Rutine", se: "Краљица Рутине", ru: "Королева рутины", version: CURRENT_CONTENT_VERSION },
  badge_routine_queen_desc: { en: "You have logged 3 or more cycles. Consistency is key!", "sr": "Uneli ste 3 ili više ciklusa. Redovnost je ključ!", se: "Унели сте 3 или више циклуса. Редовност је кључ!", ru: "Вы записали 3 или более циклов. Постоянство - залог успеха!", version: CURRENT_CONTENT_VERSION },
  badge_punctual_title: { en: "Punctual as a clock", "sr": "Tačna kao sat", se: "Тачна као сат", ru: "Точна как часы", version: CURRENT_CONTENT_VERSION },
  badge_punctual_desc: { en: "You have successfully scheduled your first appointment.", "sr": "Uspešno ste poslali upit za svoj prvi termin.", se: "Успешно сте послали упит за свој први термин.", ru: "Вы успешно отправили запрос на свой первый прием.", version: CURRENT_CONTENT_VERSION },
  badge_ambassador_title: { en: "Ambassador", "sr": "Ambasador", se: "Амбасадор", ru: "Амбассадор", version: CURRENT_CONTENT_VERSION },
  badge_ambassador_desc: { en: "You have shared our app with friends. Thank you!", "sr": "Podelili ste našu aplikaciju sa prijateljima. Hvala!", se: "Поделили сте нашу апликацију са пријатељима. Хвала!", ru: "Вы поделились нашим приложением с друзьями. Спасибо!", version: CURRENT_CONTENT_VERSION },
  badge_golden_recommendation_title: { en: "Golden Recommendation", "sr": "Zlatna Preporuka", se: "Златна Препорука", ru: "Золотая рекомендация", version: CURRENT_CONTENT_VERSION },
  badge_golden_recommendation_desc: { en: "You rated our clinic. Your feedback is valuable!", "sr": "Ocenili ste našu ordinaciju. Vaše mišljenje je dragoceno!", se: "Оценили сте нашу ординацију. Ваше мишљење је драгоцено!", ru: "Вы оценили нашу клинику. Ваш отзыв очень важен!", version: CURRENT_CONTENT_VERSION },
  badge_installer_title: { en: "Installer", "sr": "Instalater", se: "Инсталатер", ru: "Установщик", version: CURRENT_CONTENT_VERSION },
  badge_installer_desc: { en: "You have installed the app on your device.", "sr": "Instalirali ste aplikaciju na svoj uređaj.", se: "Инсталирали сте апликацију на свој уређај.", ru: "Вы установили приложение на свое устройство.", version: CURRENT_CONTENT_VERSION },

  promotions_card_title: { en: 'Promotions and Discounts', 'sr': 'Akcije i popusti', se: 'Акције и попусти', ru: 'Акции и скидки', version: CURRENT_CONTENT_VERSION },
  promotions_card_desc: { en: 'Check out our current special offers.', 'sr': 'Pogledajte naše trenutne specijalne ponude.', se: 'Погледајте наше тренутне специјалне понуде.', ru: 'Ознакомьтесь с нашими текущими специальными предложениями.', version: CURRENT_CONTENT_VERSION },
  faq_card_title: { en: 'Frequently Asked Questions', 'sr': 'Često postavljana pitanja', se: 'Често постављана питања', ru: 'Часто задаваемые вопросы', version: CURRENT_CONTENT_VERSION },
  faq_card_desc: { en: 'Find answers to the most common questions.', 'sr': 'Pronađite odgovore na najčešća pitanja.', se: 'Пронађите одговоре на најчешћа питања.', ru: 'Найдите ответы на самые распространенные вопросы.', version: CURRENT_CONTENT_VERSION },
  rate_us_card_title: { en: 'Rate Us', 'sr': 'Ocenite nas', se: 'Оцените нас', ru: 'Оцените нас', version: CURRENT_CONTENT_VERSION },
  rate_us_card_desc: { en: 'Your feedback is important to us.', 'sr': 'Vaše mišljenje nam je važno.', se: 'Ваше мишљење нам је важно.', ru: 'Ваше мнение важно для нас.', version: CURRENT_CONTENT_VERSION },
  share_app_card_title: { en: 'Share the App', 'sr': 'Podelite aplikaciju', se: 'Поделите апликацију', ru: 'Поделиться приложением', version: CURRENT_CONTENT_VERSION },
  share_app_card_desc: { en: 'Share our app with your friends.', 'sr': 'Podelite našu aplikaciju sa prijateljima.', se: 'Поделите нашу апликацију са пријатељима.', ru: 'Поделитесь нашим приложением с друзьями.', version: CURRENT_CONTENT_VERSION },
  share_link_copied_toast: { en: 'Link copied to clipboard!', 'sr': 'Link kopiran!', se: 'Линк копиран!', ru: 'Ссылка скопирована!', version: CURRENT_CONTENT_VERSION },

  gamification_title: { en: "Your Badges", "sr": "Vaši Bedževi", se: "Ваши Беџеви", ru: "Ваши значки", version: CURRENT_CONTENT_VERSION },
  gamification_details_button: { en: "Details", "sr": "Detalji", se: "Детаљи", ru: "Подробности", version: CURRENT_CONTENT_VERSION },
  gamification_dialog_title: { en: "Collect all the badges!", "sr": "Sakupite sve bedževe!", se: "Сакупите све беџеве!", ru: "Соберите все значки!", version: CURRENT_CONTENT_VERSION },
  gamification_dialog_desc: { en: "The Palmotićeva Clinic has prepared a surprise gift for the most loyal users who collect all the badges. Good luck!", "sr": "Ordinacija Palmotićeva je za najvernije korisnice koje sakupe sve bedževe spremila poklon iznenađenja. Srećno!", se: "Ординација Палмотићева је за најверније кориснице које сакупе све беџеве спремила поклон изненађења. Срећно!", ru: "Клиника «Палмотичева» приготовила подарок-сюрприз для самых преданных пользователей, которые соберут все значки. Удачи!", version: CURRENT_CONTENT_VERSION },
  gamification_dialog_button: { en: "Okay", "sr": "U redu", se: "У реду", ru: "Хорошо", version: CURRENT_CONTENT_VERSION },

  health_corner_title: { en: "Health Corner", "sr": "Kutak Zdravlja", se: "Кутак Здравља", ru: "Уголок Здоровья", version: CURRENT_CONTENT_VERSION },
  health_corner_read_more: { en: "Read all articles...", "sr": "Pročitajte sve članke...", se: "Прочитајте све чланке...", ru: "Читать все статьи...", version: CURRENT_CONTENT_VERSION },

  fact_1: {
    en: "Did you know? The cervix changes position and texture throughout your menstrual cycle.",
    "sr": "Da li ste znali? Grlić materice menja položaj i teksturu tokom menstrualnog ciklusa.",
    se: "Да ли сте знали? Грлић материце мења положај и текстуру током менструалног циклуса.",
    ru: "Знаете ли вы? Шейка матки меняет свое положение и текстуру на протяжении менструального цикла.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_2: {
    en: "Regular physical activity can significantly reduce the intensity of menstrual cramps.",
    "sr": "Redovna fizička aktivnost može značajno smanjiti intenzitet menstrualnih grčeva.",
    se: "Редовна физичка активност може значајно смањити интензитет менструалних грчева.",
    ru: "Регулярная физическая активность может значительно снизить интенсивность менструальных болей.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_3: {
    en: "The HPV vaccine is most effective when administered before the first sexual contact, protecting against the most common causes of cervical cancer.",
    "sr": "HPV vakcina je najefikasnija kada se primi pre prvog seksualnog odnosa, štiteći od najčešćih uzročnika raka grlića materice.",
    se: "ХПВ вакцина је најефикаснија када се прими пре првог сексуалног односа, штитећи од најчешћих узрочника рака грлића материце.",
    ru: "Вакцина против ВПЧ наиболее эффективна, если ее сделать до первого полового контакта, так как она защищает от самых распространенных причин рака шейки матки.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_4: {
    en: "It's completely normal for a menstrual cycle to last anywhere from 21 to 35 days.",
    "sr": "Sasvim je normalno da menstrualni ciklus traje od 21 do 35 dana.",
    se: "Сасвим је нормално да менструални циклус траје од 21 до 35 дана.",
    ru: "Совершенно нормально, что менструальный цикл длится от 21 до 35 дней.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_5: {
    en: "A balanced diet rich in calcium and vitamin D is crucial for preventing osteoporosis, especially in perimenopause and menopause.",
    "sr": "Uravnotežena ishrana bogata kalcijumom i vitaminom D ključna je za prevenciju osteoporoze, posebno u perimenopauzi i menopauzi.",
    se: "Уравнотежена исхрана богата калцијумом и витамином Д кључна је за превенцију остеопорозе, посебно у перименопаузи и менопаузи.",
    ru: "Сбалансированная диета, богатая кальцием и витамином D, имеет решающее значение для профилактики остеопороза, особенно в перименопаузе и менопаузе.",
    version: CURRENT_CONTENT_VERSION
  },
};
