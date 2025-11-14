
import type { LanguageCode } from "@/types/content";
import type { UserProfile } from "@/types/user";
import { Award, CalendarCheck, Clock, Download, HeartPulse, Share2, Star } from "lucide-react";

type LocalizedString = {
    [key in LanguageCode]?: string;
} & { en: string; "se-lat": string; se: string; ru: string; };

export type HomeCard = {
    key: string;
    icon: string;
    titleKey: string;
    descKey: string;
    link: string;
    external: boolean;
};

export type GamificationBadge = {
  key: string;
  titleKey: string;
  descKey: string;
  icon: React.ElementType;
  unlocked: boolean;
  colorClass: string;
};

type TeamMember = {
    avatar: string;
    name: LocalizedString;
    specialization: LocalizedString;
    bio: LocalizedString;
};

type Testimonial = {
    author: string;
    meta: string;
    rating: number;
    quote: LocalizedString;
};

export type AboutPageContent = {
    version: number;
    title: LocalizedString;
    story: {
        title: LocalizedString;
        content: LocalizedString;
        imageUrl: string;
    };
    contact: {
        addressTitle: LocalizedString;
        addressLine1: LocalizedString;
        addressLine2: LocalizedString;
        email: LocalizedString;
        phone1: LocalizedString;
        phone2: LocalizedString;
        hoursTitle: LocalizedString;
        weekdays: LocalizedString;
        weekdaysHours: LocalizedString;
        saturday: LocalizedString;
        saturdayHours: LocalizedString;
    };
    team: {
        title: LocalizedString;
        subtitle: LocalizedString;
        members: TeamMember[];
    };
    testimonialsPage: {
        title: LocalizedString;
        averageRating: number;
        basedOn: LocalizedString;
        items: Testimonial[];
    };
    map: {
        title: LocalizedString;
    };
    footer: {
        copyright: LocalizedString;
        address: LocalizedString;
        phones: LocalizedString;
        email: LocalizedString;
    };
    home_cards: HomeCard[];
};


export const defaultAboutPageContent: AboutPageContent = {
    version: 17,
    title: {
        en: "About Our Clinic",
        "se-lat": "O Našoj Ordinaciji",
        se: "О Нашој Ординацији",
        ru: "О Нашей Клинике"
    },
    story: {
        title: {
            en: "Over 25 years with you",
            "se-lat": "Više od 25 godina sa vama",
            se: "Више од 25 година са вама",
            ru: "Более 25 лет с вами"
        },
        content: {
            en: "The Palmotićeva Gynecological and Obstetric Clinic is a reputable private practice in Belgrade, dedicated to women's health. Our team consists of experienced specialist doctors in gynecology and obstetrics, including subspecialists from various fields. We provide comprehensive gynecological services using the most modern methods of diagnosis and treatment. Our mission is to care for the health of our patients with expertise, experience, and dedication.",
            "se-lat": "Ginekološko akušerska ordinacija Palmotićeva je ugledna privatna ordinacija u Beogradu, posvećena zdravlju žena. Naš tim čine iskusni lekari specijalisti ginekologije i akušerstva, uključujući i subspecijaliste iz različitih oblasti. Pružamo sveobuhvatne ginekološke usluge primenjujući najsavremenije metode dijagnostike i lečenja. Naša misija je da uz stručnost, iskustvo i posvećenost brinemo o zdravlju naših pacijentkinja.",
            se: "Гинеколошко акушерска ординација Палмотићева је угледна приватна ординација у Београду, посвећена здрављу жена. Наш тим чине искусни лекари специјалисти гинекологије и акушерства, укључујући и супспецијалисте из различитих области. Пружамо свеобухватне гинеколошке услуге примењујући најсавременије методе дијагностике и лечења. Наша мисија је да уз стручност, искуство и посвећеност бринемо о здрављу наших пацијенткиња.",
            ru: "Гинекологическая и акушерская клиника «Палмотичева» — это уважаемая частная практика в Белграде, посвященная женскому здоровью. Наша команда состоит из опытных врачей-специалистов в области гинекологии и акушерства, включая узких специалистов из различных областей. Мы предоставляем комплексные гинекологические услуги, используя самые современные методы диагностики и лечения. Наша миссия — заботиться о здоровье наших пациенток, опираясь на профессионализм, опыт и преданность делу."
        },
        imageUrl: "/images/palmoticeva-cekaonica-mural.webp"
    },
    contact: {
        addressTitle: { en: "Our Address", "se-lat": "Naša Adresa", se: "Наша Адреса", ru: "Наш Адрес" },
        addressLine1: { en: "Palmotićeva 33", "se-lat": "Palmotićeva 33", se: "Палмотићева 33", ru: "Палмотичева 33" },
        addressLine2: { en: "11000 Belgrade, Serbia", "se-lat": "11000 Beograd, Srbija", se: "11000 Београд, Србија", ru: "11000 Белград, Сербия" },
        email: { en: "ordinacija@palmoticeva.com", "se-lat": "ordinacija@palmoticeva.com", se: "ordinacija@palmoticeva.com", ru: "ordinacija@palmoticeva.com" },
        phone1: { en: "011 322 60 40", "se-lat": "011 322 60 40", se: "011 322 60 40", ru: "011 322 60 40" },
        phone2: { en: "011 322 69 45", "se-lat": "011 322 69 45", se: "011 322 69 45", ru: "011 322 69 45" },
        hoursTitle: { en: "Working Hours", "se-lat": "Radno Vreme", se: "Радно Време", ru: "Рабочее Время" },
        weekdays: { en: "Monday - Friday:", "se-lat": "Ponedeljak - Petak:", se: "Понедељак - Петак:", ru: "Понедельник - Пятница:"},
        weekdaysHours: { en: "08:00 - 20:00", "se-lat": "08:00 - 20:00", se: "08:00 - 20:00", ru: "08:00 - 20:00" },
        saturday: { en: "Saturday:", "se-lat": "Subota:", se: "Субота:", ru: "Суббота:" },
        saturdayHours: { en: "08:00 - 15:00", "se-lat": "08:00 - 15:00", se: "08:00 - 15:00", ru: "08:00 - 15:00" }
    },
    team: {
        title: { en: "Our Expert Team", "se-lat": "Naš Stručni Tim", se: "Наш Стручни Тим", ru: "Наша Экспертная Команда" },
        subtitle: { 
            en: "Meet the doctors who form the heart of the Palmotićeva Gynecological Clinic. We are dedicated to providing the highest level of care, combining experience, knowledge, and sincere concern for every patient.", 
            "se-lat": "Upoznajte lekare koji čine srce Ginekološke ordinacije Palmotićeva. Posvećeni smo pružanju najvišeg nivoa nege, kombinujući iskustvo, znanje i iskrenu brigu za svaku pacijentkinju.", 
            se: "Упознајте лекаре који чине срце Гинеколошке ординације Палмотићева. Посвећени смо пружању највишег нивоа неге, комбинујући искуство, знање и искрену бригу за сваку пацијенткињу.", 
            ru: "Познакомьтесь с врачами, которые составляют сердце гинекологической клиники «Палмотичева». Мы стремимся предоставлять самый высокий уровень ухода, сочетая опыт, знания и искреннюю заботу о каждой пациентке." 
        },
        members: [
            {
                avatar: "/images/boba.webp",
                name: { 
                  en: "Mr sci. med. Slobodanka Petković", 
                  "se-lat": "Mr sci. med. Slobodanka Petković", 
                  se: "Мр сци. мед. Слободанка Петковић", 
                  ru: "М-р сц. мед. Слободанка Петкович" 
                },
                specialization: { 
                  en: "Founder of the clinic, Specialist in Gynecology and Obstetrics", 
                  "se-lat": "Osnivač ordinacije, Specijalista ginekologije i akušerstva", 
                  se: "Оснивач ординације, Специјалиста гинекологије и акушерства", 
                  ru: "Основатель клиники, специалист по гинекологии и акушерству" 
                },
                bio: {
                    en: `As the founder of the 'Palmotićeva' clinic, Dr. Slobodanka Petković turned her vision of top-tier, dedicated gynecological care into a reality. Her decades of experience and deep understanding of women's health form the foundation upon which our trust is built.

After graduating from the Faculty of Medicine in Belgrade, she has continuously perfected her expertise, dedicating her career to the highest standards of treatment.

Key areas of expertise:
* Infertility treatment: Completed subspecialization as a confirmation of her dedication to couples on their path to parenthood.
* Advanced diagnostics: Certified education in colposcopy, cytology, and ultrasound diagnostics.
* Obstetrics and surgery: Master's degree on the topic "Cesarean section and antibiotics" and extensive experience as the head of a women's health clinic.

By founding the clinic in 1998, Dr. Petković created a place where every patient feels safe, respected, and heard.`,
                    "se-lat": `Kao osnivač ordinacije 'Palmotićeva', dr Slobodanka Petković je svoju viziju o vrhunskoj i posvećenoj ginekološkoj nezi pretvorila u stvarnost. Njeno višedecenijsko iskustvo i duboko razumevanje zdravlja žene čine temelj na kojem je izgrađeno naše poverenje.

Nakon diplomiranja na Medicinskom fakultetu u Beogradu, svoju stručnost je neprestano usavršavala, posvećujući karijeru najvišim standardima lečenja.

Ključne oblasti stručnosti:
* Lečenje neplodnosti: Završena subspecijalizacija kao potvrda posvećenosti parovima na putu ka roditeljstvu.
* Napredna dijagnostika: Sertifikovana edukacija iz kolposkopije, citologije i ultrazvučne dijagnostike.
* Akušerstvo i hirurgija: Magistratura na temu "Carski rez i antibiotici" i bogato iskustvo kao šef dispanzera za žene.

Osnivanjem ordinacije 1998. godine, dr Petković je stvorila mesto gde se svaka pacijentkinja oseća sigurno, poštovano i saslušano.`,
                    se: `Као оснивач ординације 'Палмотићева', др Слободанка Петковић је своју визију о врхунској и посвећеној гинеколошкој нези претворила у стварност. Њено вишедеценијско искуство и дубоко разумевање здравља жене чине темељ на којем је изграђено наше поверење.

Након дипломирања на Медицинском факултету у Београду, своју стручност је непрестано усавршавала, посвећујући каријеру највишим стандардима лечења.

Кључне области стручности:
* Лечење неплодности: Завршена субспецијализација као потврда посвећености паровима на путу ка родитељству.
* Напредна дијагностика: Сертификована едукација из колпоскопије, цитологије и ултразвучне дијагностике.
* Акушерство и хирургија: Магистратура на тему "Царски рез и антибиотици" и богато искуство као шеф диспанзера за жене.

Оснивањем ординације 1998. године, др Петковић је створила место где се свака пацијенткиња осећа сигурно, поштовано и саслушано.`,
                    ru: `Как основатель клиники «Палмотичева», доктор Слободанка Петкович воплотила свое видение первоклассной и преданной гинекологической помощи в реальность. Ее многолетний опыт и глубокое понимание женского здоровья составляют основу, на которой построено наше доверие.

После окончания медицинского факультета в Белграде она постоянно совершенствовала свой профессионализм, посвятив свою карьеру высочайшим стандартам лечения.

Ключевые области компетенции:
* Лечение бесплодия: Завершение узкой специализации как подтверждение преданности парам на пути к родительству.
* Передовая диагностика: Сертифицированное обучение по кольпоскопии, цитологии и ультразвуковой диагностике.
* Акушерство и хирургия: Магистерская степень на тему «Кесарево сечение и антибиотики» и богатый опыт работы заведующей женской консультацией.

Основав клинику в 1998 году, доктор Петкович создала место, где каждая пациентка чувствует себя в безопасности, уважаемой и услышанной.`
                }
            },
            {
                avatar: "/images/djordje.webp",
                name: { 
                  en: "Spec. dr. med. Đorđe Petković", 
                  "se-lat": "Spec. dr. med. Đorđe Petković", 
                  se: "Спец. др мед. Ђорђе Петковић", 
                  ru: "Спец. д-р мед. Джордже Петкович" 
                },
                specialization: { 
                  en: "Specialist in Gynecology and Obstetrics", 
                  "se-lat": "Specijalista ginekologije i akušerstva", 
                  se: "Специјалиста гинекологије и акушерства", 
                  ru: "Специалист по гинекологии и акушерству" 
                },
                bio: {
                    en: `Dr. Đorđe Petković brings a new generation of knowledge to the 'Palmotićeva' clinic, with a special focus on minimally invasive procedures and the most modern diagnostic methods that are becoming standard in the world.

He built his education at the Faculty of Medicine in Belgrade and at the prestigious Russian National Research Medical University in Moscow, where he completed his specialization with excellent results.

Key areas of expertise:
* Minimally Invasive Surgery: Expertise in advanced laparoscopic and hysteroxcopic surgery, acquired under the mentorship of leading European experts.
* Pediatric and Adolescent Gynecology: Permanently employed at the 'Dr Vukan Čupić' Institute for Mother and Child, where he is dedicated to solving the most delicate gynecological problems.
* Top-tier Prenatal Diagnostics: Holds a prestigious license from the Fetal Medicine Foundation (FMF) in London for first-trimester pregnancy screening.

His dedication to modern medicine ensures that every patient receives the highest quality and most up-to-date care.`,
                    "se-lat": `Dr Đorđe Petković donosi novu generaciju znanja u ordinaciju 'Palmotićeva', sa posebnim fokusom na minimalno invazivne procedure i najsavremenije dijagnostičke metode koje postaju standard u svetu.

Svoje obrazovanje gradio je na Medicinskom fakultetu u Beogradu i na prestižnom Ruskom Državnom Medicinskom Univerzitetu u Moskvi, gde je sa odličnim uspehom završio specijalizaciju.

Ključne oblasti stručnosti:
* Minimalno Invazivna Hirurgija: Ekspertiza u naprednoj laparoskopskoj i histeroskopskoj hirurgiji, stečena pod mentorstvom vodećih evropskih stručnjaka.
* Dečija i Adolescentna Ginekologija: Stalno zaposlen u Institutu za majku i dete 'Dr Vukan Čupić', gde je posvećen rešavanju najdelikatnijih ginekoloških problema.
* Vrhunska Prenatalna Dijagnostika: Poseduje prestižnu licencu Fondacije za fetalnu medicinu (FMF) iz Londona za skrining u prvom trimestru trudnoće.

Njegova posvećenost modernoj medicini osigurava da svaka pacijentkinja dobije najkvalitetniju i najsavremeniju negu.`,
                    se: `Др Ђорђе Петковић доноси нову генерацију знања у ординацију 'Палмотићева', са посебним фокусом на минимално инвазивне процедуре и најсавременије дијагностичке методе које постају стандард у свету.

Своје образовање градио је на Медицинском факултету у Београду и на престижном Руском Државном Медицинском Универзитету у Москви, где је са одличним успехом завршио специјализацију.

Кључне области стручности:
* Минимално Инвазивна Хирургија: Експертиза у напредној лапароскопској и хистероскопској хирургији, стечена под менторством водећих европских стручњака.
* Дечија и Адолесцентна Гинекологија: Стално запослен у Институту за мајку и дете 'Др Вукан Чупић', где је посвећен решавању најделикатнијих гинеколошких проблема.
* Врхунска Пренатална Дијагностика: Поседује престижну лиценцу Фондације за феталну медицину (ФМФ) из Лондона за скрининг у првом триместру трудноће.

Његова посвећеност модерној медицини осигурава да свака пацијенткиња добије најквалитетнију и најсавременију негу.`,
                    ru: `Доктор Джордже Петкович привносит в клинику «Палмотичева» знания нового поколения, уделяя особое внимание минимально инвазивным процедурам и самым современным методам диагностики, которые становятся мировым стандартом.

Он получил образование на медицинском факультете в Белграде и в престижном Российском национальном исследовательском медицинском университете имени Н. И. Пирогова в Москве, где с отличием окончил специализацию.

Ключевые области компетенции:
* Минимально инвазивная хирургия: Опыт в передовой лапароскопической и гистероскопической хирургии, полученный под руководством ведущих европейских специалистов.
* Детская и подростковая гинекология: Постоянно работает в Институте матери и ребенка «Д-р Вукан Чупич», где занимается решением самых деликатных гинекологических проблем.
* Первоклассная пренатальная диагностика: Обладает престижной лицензией Фонда медицины плода (FMF) в Лондоне на проведение скрининга в первом триместре беременности.

Его приверженность современной медицине гарантирует, что каждая пациентка получит самое качественное и современное обслуживание.`
                }
            }
        ]
    },
    testimonialsPage: {
        title: { en: "What Our Patients Say", "se-lat": "Šta Kažu Naše Pacijentkinje", se: "Шта Кажу Наше Пацијенткиње", ru: "Что говорят наши пациентки" },
        averageRating: 4.9,
        basedOn: { en: "Based on 220+ Google Reviews", "se-lat": "Na osnovu 220+ Google recenzija", se: "На основу 220+ Гоогле рецензија", ru: "На основе 220+ отзывов в Google" },
        items: [
            { author: "Mina Nikolic", meta: "Local Guide·21 reviews", rating: 5, quote: { "se-lat": "Neverovatno ljubazan lekar i osoblje, veoma profesionalni. Učinili su da se osećam tako prijatno. Drago mi je što sam konačno pronašla stalnog ginekologa. Preporučiću svima.", en: "Incredibly kind doctor and staff, very professional. They made me feel so comfortable. I’m glad to have finally found a permanent ob/gyn. Will recommend to everyone.", se: "Невероватно љубазан лекар и особље, веома професионални. Учинили су да се осећам тако пријатно. Драго ми је што сам коначно пронашла сталног гинеколога. Препоручићу свима.", ru: "Невероятно добрый врач и персонал, очень профессиональные. Они заставили меня чувствовать себя так комфортно. Я рада, что наконец нашла постоянного гинеколога. Буду рекомендовать всем." } },
            { author: "Jevdokija Hodžajeva", meta: "14 reviews", rating: 5, quote: { "se-lat": "Najprofesionalniji, dostojanstveniji i najefikasniji tretman koji sam ikada dobila u životu. Recepcionerka je bila veoma uslužna, kao i izvanredna usluga koju je pružio doktor Đorđe. Svaka čast!!", en: "The most professional, dignified and effective treatment i’ve ever received in my entire life. The receptionist was very helpful, as well as the marvelous service provided by doctor djordje. Well done!!", se: "Најпрофесионалнији, достојанственији и најефикаснији третман који сам икада добила у животу. Рецепционерка је била веома услужна, као и изванредна услуга коју је пружио доктор Ђорђе. Свака част!!", ru: "Самое профессиональное, достойное и эффективное лечение, которое я когда-либо получала в своей жизни. Администратор была очень услужлива, как и великолепное обслуживание, предоставленное доктором Джордже. Отлично сработано!!" } },
        ]
    },
    map: {
        title: { en: "Find Us Easily", "se-lat": "Pronađite Nas Lako", se: "Пронађите Нас Лако", ru: "Найдите Нас Легко" }
    },
    footer: {
      copyright: { en: `© {year} Gynecological practice Palmotićeva`, "se-lat": `© {year} Ginekološka ordinacija Palmotićeva`, se: `© {year} Гинеколошка ординација Палмотићева`, ru: `© {year} Гинекологическая практика Пальмотичева` },
      address: { en: "Palmotićeva 33, 11000 Belgrade, Serbia", "se-lat": "Palmotićeva 33, 11000 Beograd, Srbija", se: "Палмотићева 33, 11000 Београд, Србија", ru: "Палмотичева 33, 11000 Белград, Сербия" },
      phones: { en: "Phones: 011 322 60 40, 011 322 69 45", "se-lat": "Telefoni: 011 322 60 40, 011 322 69 45", se: "Телефони: 011 322 60 40, 011 322 69 45", ru: "Телефоны: 011 322 60 40, 011 322 69 45" },
      email: { en: "Email: ordinacija@palmoticeva.com", "se-lat": "Email: ordinacija@palmoticeva.com", se: "Email: ordinacija@palmoticeva.com", ru: "Email: ordinacija@palmoticeva.com" }
    },
    home_cards: [
        { key: "about", icon: "User", titleKey: "homepage_about_card_title", descKey: "homepage_about_card_desc", link: "/about", external: false },
        { key: "appointments", icon: "CalendarPlus", titleKey: "homepage_appointment_card_title", descKey: "homepage_appointment_card_desc", link: "/appointments", external: false },
        { key: "promotions", icon: "Tag", titleKey: "promotions_card_title", descKey: "promotions_card_desc", link: "/promotions", external: false },
        { key: "faq", icon: "HelpCircle", titleKey: "faq_card_title", descKey: "faq_card_desc", link: "/faq", external: false },
        { key: "rate_us", icon: "Star", titleKey: "rate_us_card_title", descKey: "rate_us_card_desc", link: "https://g.page/Ordinacija_Palmoticeva/review?gm", external: true },
        { key: "share", icon: "Share2", titleKey: "share_app_card_title", descKey: "share_app_card_desc", link: "#", external: false }
    ]
};

export const getAllBadges = (userProfile: UserProfile | null, cycleCount: number): GamificationBadge[] => {
    const unlockedSet = new Set(userProfile?.unlockedBadges || []);

    return [
        { key: 'our_patient', titleKey: 'badge_our_patient_title', descKey: 'badge_our_patient_desc', icon: Award, unlocked: userProfile?.role === 'verified' || userProfile?.role === 'admin', colorClass: 'text-yellow-500' },
        { key: 'explorer', titleKey: 'badge_explorer_title', descKey: 'badge_explorer_desc', icon: HeartPulse, unlocked: unlockedSet.has('explorer') || cycleCount > 0, colorClass: 'text-red-500' },
        { key: 'routine_queen', titleKey: 'badge_routine_queen_title', descKey: 'badge_routine_queen_desc', icon: CalendarCheck, unlocked: unlockedSet.has('routine_queen') || cycleCount >= 3, colorClass: 'text-green-500' },
        { key: 'punctual', titleKey: 'badge_punctual_title', descKey: 'badge_punctual_desc', icon: Clock, unlocked: unlockedSet.has('punctual'), colorClass: 'text-blue-500' },
        { key: 'ambassador', titleKey: 'badge_ambassador_title', descKey: 'badge_ambassador_desc', icon: Share2, unlocked: unlockedSet.has('ambassador'), colorClass: 'text-purple-500' },
        { key: 'golden_recommendation', titleKey: 'badge_golden_recommendation_title', descKey: 'badge_golden_recommendation_desc', icon: Star, unlocked: unlockedSet.has('golden_recommendation'), colorClass: 'text-orange-400' },
        { key: 'installer', titleKey: 'badge_installer_title', descKey: 'badge_installer_desc', icon: Download, unlocked: unlockedSet.has('installer'), colorClass: 'text-teal-500' },
    ];
};
  


    
