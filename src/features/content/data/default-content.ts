import type { AboutPageContent } from "@/core/types";

export const defaultAboutPageContent: AboutPageContent = {
    version: 17,
    title: {
        en: "About Our Clinic",
        "sr": "O Našoj Ordinaciji",
        se: "О Нашој Ординацији",
        ru: "О Нашей Клинике"
    },
    story: {
        title: {
            en: "Over 25 years with you",
            "sr": "Više od 25 godina sa vama",
            se: "Више од 25 година са вама",
            ru: "Более 25 лет с вами"
        },
        content: {
            en: "The Palmotićeva Gynecological and Obstetric Clinic is a reputable private practice in Belgrade, dedicated to women's health. Our team consists of experienced specialist doctors in gynecology and obstetrics, including subspecialists from various fields. We provide comprehensive gynecological services using the most modern methods of diagnosis and treatment. Our mission is to care for the health of our patients with expertise, experience, and dedication.",
            "sr": "Ginekološko akušerska ordinacija Palmotićeva je ugledna privatna ordinacija u Beogradu, posvećena zdravlju žena. Naš tim čine iskusni lekari specijalisti ginekologije i akušerstva, uključujući i subspecijaliste iz različitih oblasti. Pružamo sveobuhvatne ginekološke usluge primenjujući najsavremenije metode dijagnostike i lečenja. Naša misija je da uz stručnost, iskustvo i posvećenost brinemo o zdravlju naših pacijentkinja.",
            se: "Гинеколошко акушерска ординација Палмотићева је угледна приватна ординација у Београду, посвећена здрављу жена. Наш тим чине искусни лекари специјалисти гинекологије и акушерства, укључујући и супспецијалисте из различитих области. Пружамо свеобухватне гинеколошке услуге примењујући најсавременије методе дијагностике и лечења. Наша мисија је да уз стручност, искуство и посвећеност бринемо о здрављу наших пацијенткиња.",
            ru: "Гинекологическая и акушерская клиника «Палмотичева» — это уважаемая частная практика в Белграде, посвященная женскому здоровью. Наша команда состоит из опытных врачей-специалистов в области гинекологии и акушерства, включая узких специалистов из различных областей. Мы предоставляем комплексные гинекологические услуги, используя самые современные методы диагностики и лечения. Наша миссия — заботиться о здоровье наших пациенток, опираясь на профессионализм, опыт и преданность делу."
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fpalmoticeva-cekaonica-mural.webp?alt=media&token=2f09537c-148e-419b-aeb7-e8b5030ead23"
    },
    contact: {
        addressTitle: { en: "Our Address", "sr": "Naša Adresa", se: "Наша Адреса", ru: "Наш Адрес" },
        addressLine1: { en: "Palmotićeva 33", "sr": "Palmotićeva 33", se: "Палмотићева 33", ru: "Палмотичева 33" },
        addressLine2: { en: "11000 Belgrade, Serbia", "sr": "11000 Beograd, Srbija", se: "11000 Београд, Србија", ru: "11000 Белград, Сербия" },
        email: { en: "ordinacija@palmoticeva.com", "sr": "ordinacija@palmoticeva.com", se: "ordinacija@palmoticeva.com", ru: "ordinacija@palmoticeva.com" },
        phone1: { en: "011 322 60 40", "sr": "011 322 60 40", se: "011 322 60 40", ru: "011 322 60 40" },
        phone2: { en: "011 322 69 45", "sr": "011 322 69 45", se: "011 322 69 45", ru: "011 322 69 45" },
        hoursTitle: { en: "Working Hours", "sr": "Radno Vreme", se: "Радно Време", ru: "Рабочее Время" },
        weekdays: { en: "Monday - Friday:", "sr": "Ponedeljak - Petak:", se: "Понедељак - Петак:", ru: "Понедельник - Пятница:" },
        weekdaysHours: { en: "08:00 - 20:00", "sr": "08:00 - 20:00", se: "08:00 - 20:00", ru: "08:00 - 20:00" },
        saturday: { en: "Saturday:", "sr": "Subota:", se: "Субота:", ru: "Суббота:" },
        saturdayHours: { en: "08:00 - 15:00", "sr": "08:00 - 15:00", se: "08:00 - 15:00", ru: "08:00 - 15:00" }
    },
    team: {
        title: { en: "Our Expert Team", "sr": "Naš Stručni Tim", se: "Наш Стручни Тим", ru: "Наша Экспертная Команда" },
        subtitle: {
            en: "Meet the doctors who form the heart of the Palmotićeva Gynecological Clinic. We are dedicated to providing the highest level of care, combining experience, knowledge, and sincere concern for every patient.",
            "sr": "Upoznajte lekare koji čine srce Ginekološke ordinacije Palmotićeva. Posvećeni smo pružanju najvišeg nivoa nege, kombinujući iskustvo, znanje i iskrenu brigu za svaku pacijentkinju.",
            se: "Упознајте лекаре који чине срце Гинеколошке ординације Палмотићева. Посвећени смо пружању највишег нивоа неге, комбинујући искуство, знање и искрену бригу за сваку пацијенткињу.",
            ru: "Познакомьтесь с врачами, которые составляют сердце гинекологической клиники «Палмотичева». Мы стремимся предоставлять самый высокий уровень ухода, сочетая опыт, знания и искреннюю заботу о каждой пациентке."
        },
        members: [
            {
                avatar: "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fboba.webp?alt=media&token=38a83fd8-e02b-448e-b8b0-cdf6e1a50741",
                name: {
                    en: "Mr sci. med. Slobodanka Petković",
                    "sr": "Mr sci. med. Slobodanka Petković",
                    se: "Мр сци. мед. Слободанка Петковић",
                    ru: "М-р сц. мед. Слободанка Петкович"
                },
                specialization: {
                    en: "Founder of the clinic, Specialist in Gynecology and Obstetrics",
                    "sr": "Osnivač ordinacije, Specijalista ginekologije i akušerstva",
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
                    "sr": `Kao osnivač ordinacije 'Palmotićeva', dr Slobodanka Petković je svoju viziju o vrhunskoj i posvećenoj ginekološkoj nezi pretvorila u stvarnost. Njeno višedecenijsko iskustvo i duboko razumevanje zdravlja žene čine temelj na kojem je izgrađeno naše poverenje.

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
                avatar: "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fdjordje.webp?alt=media&token=d071d742-1b66-454c-821a-62d3c5a84b59",
                name: {
                    en: "Spec. dr. med. Đorđe Petković",
                    "sr": "Spec. dr. med. Đorđe Petković",
                    se: "Спец. др мед. Ђорђе Петковић",
                    ru: "Спец. д-р мед. Джордже Петкович"
                },
                specialization: {
                    en: "Specialist in Gynecology and Obstetrics",
                    "sr": "Specijalista ginekologije i akušerstva",
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
                    "sr": `Dr Đorđe Petković donosi novu generaciju znanja u ordinaciju 'Palmotićeva', sa posebnim fokusom na minimalno invazivne procedure i najsavremenije dijagnostičke metode koje postaju standard u svetu.

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
        title: { en: "What Our Patients Say", "sr": "Šta Kažu Naše Pacijentkinje", se: "Шта Кажу Наше Пацијенткиње", ru: "Что говорят наши пациентки" },
        averageRating: 4.9,
        basedOn: { en: "Based on 220+ Google Reviews", "sr": "Na osnovu 220+ Google recenzija", se: "На основу 220+ Гоогле рецензија", ru: "На основе 220+ отзывов в Google" },
        items: [
            { author: "Mina Nikolic", meta: { sr: "Lokalni vodič·21 recenzija", en: "Local Guide·21 reviews", ru: "Местный гид·21 отзыв" }, rating: 5, quote: { "sr": "Neverovatno ljubazan lekar i osoblje, veoma profesionalni. Učinili su da se osećam tako prijatno. Drago mi je što sam konačno pronašla stalnog ginekologa. Preporučiću svima.", en: "Incredibly kind doctor and staff, very professional. They made me feel so comfortable. I’m glad to have finally found a permanent ob/gyn. Will recommend to everyone.", se: "Невероватно љубазан лекар и особље, веома професионални. Учинили су да се осећам тако пријатно. Драго ми је што сам коначно пронашла сталног гинеколога. Препоручићу свима.", ru: "Невероятно добрый врач и персонал, очень профессиональные. Они заставили меня чувствовать себя так комфортно. Я рада, что наконец нашла постоянного гинеколога. Буду рекомендовать всем." } },
            { author: "Jevdokija Hodžajeva", meta: { sr: "14 recenzija", en: "14 reviews", ru: "14 отзывов" }, rating: 5, quote: { "sr": "Najprofesionalniji, dostojanstveniji i najefikasniji tretman koji sam ikada dobila u životu. Recepcionerka je bila veoma uslužna, kao i izvanredna usluga koju je pružio doktor Đorđe. Svaka čast!!", en: "The most professional, dignified and effective treatment i’ve ever received in my entire life. The receptionist was very helpful, as well as the marvelous service provided by doctor djordje. Well done!!", se: "Најпрофесионалнији, достојанственији и најефикаснији третман који сам икада добила у животу. Рецепционерка је била веома услужна, као и изванредна услуга коју је пружио доктор Ђорђе. Свака част!!", ru: "Самое профессиональное, достойное и эффективное лечение, которое я когда-либо получала в своей жизни. Администратор была очень услужлива, как и великолепное обслуживание, предоставленное доктором Джордже. Отлично сработано!!" } },
        ]
    },
    map: {
        title: { en: "Find Us Easily", "sr": "Pronađite Nas Lako", se: "Пронађите Нас Лако", ru: "Найдите Нас Легко" }
    },
    footer: {
        copyright: { en: `© {year} Gynecological practice Palmotićeva`, "sr": `© {year} Ginekološka ordinacija Palmotićeva`, se: `© {year} Гинеколошка ординација Палмотићева`, ru: `© {year} Гинекологическая практика Пальмотичева` },
        address: { en: "Palmotićeva 33, 11000 Belgrade, Serbia", "sr": "Palmotićeva 33, 11000 Beograd, Srbija", se: "Палмотићева 33, 11000 Београд, Србија", ru: "Палмотичева 33, 11000 Белград, Сербия" },
        phones: { en: "Phones: 011 322 60 40, 011 322 69 45", "sr": "Telefoni: 011 322 60 40, 011 322 69 45", se: "Телефони: 011 322 60 40, 011 322 69 45", ru: "Телефоны: 011 322 60 40, 011 322 69 45" },
        email: { en: "Email: ordinacija@palmoticeva.com", "sr": "Email: ordinacija@palmoticeva.com", se: "Email: ordinacija@palmoticeva.com", ru: "Email: ordinacija@palmoticeva.com" }
    },
    home_cards: [
        {
            key: "about",
            icon: "User",
            title: { sr: "O nama", en: "About Us", ru: "О нас" },
            description: { sr: "Saznajte više o našem timu i misiji", en: "Learn more about our team and mission", ru: "Узнайте больше о нашей команде и миссии" },
            link: "/about",
            external: false
        },
        {
            key: "appointments",
            icon: "CalendarPlus",
            title: { sr: "Zakazivanje", en: "Appointments", ru: "Запись" },
            description: { sr: "Zakažite pregled online", en: "Book an appointment online", ru: "Запишитесь на прием онлайн" },
            link: "/appointments",
            external: false
        },
        {
            key: "promotions",
            icon: "Tag",
            title: { sr: "Akcije", en: "Promotions", ru: "Акции" },
            description: { sr: "Pogledajte aktuelne popuste", en: "View current discounts", ru: "Посмотреть текущие скидки" },
            link: "/promotions",
            external: false
        },
        {
            key: "faq",
            icon: "HelpCircle",
            title: { sr: "Česta pitanja", en: "FAQ", ru: "ЧаВо" },
            description: { sr: "Odgovori na vaša pitanja", en: "Answers to your questions", ru: "Ответы на ваши вопросы" },
            link: "/faq",
            external: false
        },
        {
            key: "rate_us",
            icon: "Star",
            title: { sr: "Ocenite nas", en: "Rate Us", ru: "Оцените нас" },
            description: { sr: "Vaše mišljenje nam znači", en: "Your opinion matters to us", ru: "Ваше мнение важно для нас" },
            link: "https://g.page/Ordinacija_Palmoticeva/review?gm",
            external: true
        },
        {
            key: "share",
            icon: "Share2",
            title: { sr: "Podeli aplikaciju", en: "Share App", ru: "Поделиться" },
            description: { sr: "Preporučite nas prijateljima", en: "Recommend us to friends", ru: "Порекомендуйте нас друзьям" },
            link: "#",
            external: false
        }
    ]
};
