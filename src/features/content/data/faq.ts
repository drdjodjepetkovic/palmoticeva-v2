import type { FAQItem } from "@/core/types";

export const faqData: FAQItem[] = [
    {
        id: 'faq1',
        question: { en: "How often should I have a gynecological exam?", "sr": "Koliko često treba da radim ginekološki pregled?", ru: "Как часто мне следует проходить гинекологический осмотр?" },
        answer: { en: "A preventive gynecological exam is recommended once a year, even if you have no symptoms. This includes bacteriological swabs, a PAPA test, colposcopy, and a pelvic ultrasound.", "sr": "Preporučuje se preventivni ginekološki pregled jednom godišnje, čak i ako nemate tegobe. To uključuje bakteriološke briseve, PAPA test, kolposkopiju, ultrazvučni pregled male karlice.", ru: "Профилактический гинекологический осмотр рекомендуется проводить раз в год, даже при отсутствии жалоб. Он включает в себя бактериологические мазки, ПАП-тест, кольпоскопию и УЗИ органов малого таза." },
        category: { sr: "Pregledi", en: "Examinations", ru: "Осмотры" }
    },
    {
        id: 'faq2',
        question: { en: "What is HPV and how can I protect myself?", "sr": "Šta je HPV i kako da se zaštitim?", ru: "Что такое ВПЧ и как я могу защититься?" },
        answer: { en: "HPV (Human Papillomavirus) is a group of viruses that are very common worldwide. Some types can cause genital warts or cancer. The best protection is regular check-ups and the HPV vaccine, which is recommended for both girls and boys.", "sr": "HPV (Humani Papiloma Virus) je grupa virusa koja je veoma rasprostranjena. Određeni tipovi mogu izazvati kondilome ili karcinom. Najbolja zaštita su redovni pregledi i HPV vakcina koja se preporučuje i devojčicama i dečacima.", ru: "ВПЧ (вирус папилломы человека) — это группа очень распространенных во всем мире вирусов. Некоторые типы могут вызывать генитальные бородавки или рак. Лучшая защита — это регулярные осмотры и вакцина против ВПЧ, которая рекомендуется как девочкам, так и мальчикам." },
        category: { sr: "Zdravlje", en: "Health", ru: "Здоровье" }
    },
    {
        id: 'faq3',
        question: { en: "When should I have my first gynecological exam?", "sr": "Kada treba da obavim prvi ginekološki pregled?", ru: "Когда мне следует пройти первый гинекологический осмотр?" },
        answer: { en: "The first preventive gynecological exam is recommended between the ages of 16 and 21, or after becoming sexually active. It is also recommended in case of any problems such as irregular cycles, painful periods, or other concerns.", "sr": "Prvi preventivni ginekološki pregled se preporučuje između 16. i 21. godine života, ili nakon stupanja u prve seksualne odnose. Takođe, i u slučaju bilo kakvih problema kao što su neredovni ciklusi, bolne menstruacije ili druge tegobe.", ru: "Первый профилактический гинекологический осмотр рекомендуется в возрасте от 16 до 21 года или после начала половой жизни. Также он рекомендуется при наличии каких-либо проблем, таких как нерегулярные циклы, болезненные менструации или другие жалобы." },
        category: { sr: "Pregledi", en: "Examinations", ru: "Осмотры" }
    },
    {
        id: 'faq4',
        question: { en: "Do you have parking?", "sr": "Da li imate parking?", ru: "У вас есть парковка?" },
        answer: { en: "Parking exists, but considering it's the city center, parking can be an issue (it's hard to find a spot). The clinic is in the red zone. Nearby public garages are 'Politika' and 'Pionirski park'.", "sr": "Parking postoji, međutim imajući u vidu da je u pitanju centar grada, sa parkingom može biti problema (teško je naći parking mesto). Ordinacija je u crvenoj zoni. U blizini su i javne garaže 'Politika' i 'Pionirski park'.", ru: "Парковка есть, но, учитывая, что это центр города, с парковкой могут быть проблемы (трудно найти место). Клиника находится в красной зоне. Рядом также находятся общественные гаражи «Политика» и «Пионирски парк»." },
        category: { sr: "Opšte", en: "General", ru: "Общее" }
    },
    {
        id: 'faq6',
        question: { en: "What if my cycle is irregular - does the app still successfully predict fertile days?", "sr": "Šta ako mi je ciklus neredovan – da li aplikacija i dalje uspešno predviđa plodne dane?", ru: "Что делать, если у меня нерегулярный цикл – сможет ли приложение успешно предсказывать фертильные дни?" },
        answer: { en: "Yes. The algorithm learns from each entry and over time uses a weighted average interval + variance. The more cycles you enter, the more accurate the predictions; for very irregular cycles, the app shows a wider 'fertility window' to be safe.", "sr": "Da. Algoritam uči na osnovu svakog unosa i vremenom koristi ponderisani prosečni razmak + varijansu. Što više ciklusa uneseš, to su predviđanja preciznija; kod jako neredovnih ciklusa app prikazuje širi “fertility window” da ne zalutaš.", ru: "Да. Алгоритм учится на каждой записи и со временем использует взвешенный средний интервал + дисперсию. Чем больше циклов вы вводите, тем точнее прогнозы; при очень нерегулярных циклах приложение показывает более широкое «окно фертильности» для безопасности." },
        category: { sr: "Aplikacija", en: "Application", ru: "Приложение" }
    },
    {
        id: 'faq7',
        question: { en: "Can the calendar recognize patterns typical for PCOS or endometriosis?", "sr": "Može li kalendar da prepozna obrasce tipične za PCOS ili endometriozu?", ru: "Может ли календарь распознавать паттерны, типичные для СПКЯ или эндометриоза?" },
        answer: { en: "It cannot make a diagnosis, but the symptom analytics (bleeding duration, pain intensity, spotting) can raise 'red flags'. The calendar then suggests: 'Talk to a gynecologist'.", "sr": "Ne može da postavi dijagnozu, ali analitika simptoma (trajanje krvarenja, intenzitet bola, spotting) može da označi “crvene zastavice”. Kalendar tada predloži: “Razgovaraj sa ginekologom”.", ru: "Он не может поставить диагноз, но аналитика симптомов (длительность кровотечения, интенсивность боли, мажущие выделения) может выявить «красные флажки». Тогда календарь предложит: «Поговорите с гинекологом»." },
        category: { sr: "Aplikacija", en: "Application", ru: "Приложение" }
    },
    {
        id: 'faq8',
        question: { en: "Can I track my pregnancy in the same profile when I get pregnant, or do I need to create a new account?", "sr": "Mogu li u istom profilu pratiti trudnoću kad zatrudnim ili otvaram novi nalog?", ru: "Могу ли я отслеживать беременность в том же профиле, когда забеременею, или нужно создавать новый аккаунт?" },
        answer: { en: "You don't open anything new – you just activate 'Pregnancy' mode. The cycle freezes, and the calendar switches to gestational weeks, appointment reminders, and a guide on what is normal in each trimester.", "sr": "Ne otvaraš ništa novo – samo aktiviraš “Trudnoća” mod. Ciklus se zamrzava, a kalendar prebacuje u gestacijske nedelje, podsetnike za preglede i vodič šta je normalno u kom trimestru.", ru: "Вы ничего нового не открываете – просто активируете режим «Беременность». Цикл замораживается, а календарь переключается на гестационные недели, напоминания о приемах и руководство о том, что нормально в каждом триместре." },
        category: { sr: "Aplikacija", en: "Application", ru: "Приложение" }
    },
    {
        id: 'faq9',
        question: { en: "Will the app remind me of a PAPA test or vaccine if I postpone them?", "sr": "Hoće li me aplikacija podsetiti na PAPA test ili vakcinu ako ih odložim?", ru: "Напомнит ли мне приложение о ПАП-тесте или вакцине, если я их отложу?" },
        answer: { en: "Yes, if you enable the Preventive Check-ups option in 'Goals'. You will receive a push notification 30 days before the recommended date and until you confirm it has been done.", "sr": "Da, ako u “Ciljevima” uključiš opciju Preventivni pregledi. Dobijaš push notifikaciju 30 dana pre preporučenog termina i sve dok ne potvrdiš da je urađen.", ru: "Да, если вы включите опцию «Профилактические осмотры» в «Целях». Вы получите push-уведомление за 30 дней до рекомендуемой даты и до тех пор, пока не подтвердите, что это сделано." },
        category: { sr: "Aplikacija", en: "Application", ru: "Приложение" }
    },
    {
        id: 'faq10',
        question: { en: "How secure is my data - where is it stored?", "sr": "Koliko su sigurni moji podaci – gde se čuvaju?", ru: "Насколько защищены мои данные – где они хранятся?" },
        answer: { en: "They are stored on the most secure servers, encrypted with 256-bit AES; only you and the doctor you authorize have the decryption key. We have no ads or selling of data to third parties.", "sr": "Smešteni su na najsigurnijim serverima, šifrovani 256‑bit AES‑om; samo ti i lekar kojem daš dozvolu imate de‑kript ključ. Nemamo reklame ni prodaju podataka trećim stranama.", ru: "Они хранятся на самых защищенных серверах, зашифрованы 256-битным AES; только у вас и у врача, которому вы дадите разрешение, есть ключ для дешифровки. У нас нет рекламы и продажи данных третьим лицам." },
        category: { sr: "Aplikacija", en: "Application", ru: "Приложение" }
    },
    {
        id: 'faq11',
        question: { en: "What if I forget to enter my period?", "sr": "Šta ako zaboravim da unesem menstruaciju?", ru: "Что делать, если я забуду ввести данные о менструации?" },
        answer: { en: "After 35 days without an entry, you will receive a discreet notification 'Has the cycle started?'. If you skip that too, the app assumes a longer cycle but marks it as incomplete and disables predictions until you confirm the date.", "sr": "Nakon 35 dana bez unosa dobijaš diskretnu notifikaciju „Da li je ciklus počeo?“. Ako preskočiš i to, aplikacija pretpostavi duži ciklus, ali označi ga kao nepotpun i isključi predviđanja dok ne potvrdiš datum.", ru: "Через 35 дней без записей вы получите тактичное уведомление «Начался ли цикл?». Если вы и это пропустите, приложение предположит более длительный цикл, но пометит его как неполный и отключит прогнозы, пока вы не подтвердите дату." },
        category: { sr: "Aplikacija", en: "Application", ru: "Приложение" }
    },
    {
        id: 'faq12',
        question: { en: "Is there a 'menopause' or 'perimenopause' mode?", "sr": "Postoji li „menopauza“ ili „perimenopauza“ način rada?", ru: "Есть ли режим «менопауза» или «перименопауза»?" },
        answer: { en: "Yes, when cycles become irregular for > 12 months, the app suggests switching to Perimenopause mode: it tracks hot flashes, insomnia, mood and advises when to consult hormonal status.", "sr": "Da, kad ciklusi postanu neredovni > 12 m, app predlaže prelazak u Perimenopauza modu: prati navale vrućine, nesanicu, raspoloženje i daje savet kada konsultovati hormonski status.", ru: "Да, когда циклы становятся нерегулярными более 12 месяцев, приложение предлагает перейти в режим «Перименопауза»: он отслеживает приливы, бессонницу, настроение и советует, когда проверить гормональный статус." },
        category: { sr: "Zdravlje", en: "Health", ru: "Здоровье" }
    },
    {
        id: 'faq13',
        question: { en: "Can I export all entered data for another doctor?", "sr": "Mogu li da izvezem sve unešene podatke za drugog lekara?", ru: "Могу ли я экспортировать все введенные данные для другого врача?" },
        answer: { en: "If the doctor is employed at the Palmotićeva Gynecological Clinic - yes.", "sr": "Ukoliko je lekar zaposlen u Ginekološkoj ordinaciji Palmotićeva - da.", ru: "Если врач работает в Гинекологической клинике «Палмотичева» - да." },
        category: { sr: "Opšte", en: "General", ru: "Общее" }
    },
    {
        id: 'faq14',
        question: { en: "Does the app suggest an appointment based on symptoms?", "sr": "Da li aplikacija predlaže termin pregleda na osnovu simptoma?", ru: "Предлагает ли приложение запись на прием на основе симптомов?" },
        answer: { en: "When you mark high-intensity symptoms (e.g., pain 7/10 or irregular bleeding), a banner appears 'Recommendation: gynecological examination in the next 7 days' + a link to online booking.", "sr": "Kad označiš simptome visokog intenziteta (npr. bol 7/10 ili nereg. krvarenje), pojavi se banner „Preporuka: ginekološki pregled u narednih 7 dana“ + link do online zakazivanja.", ru: "Когда вы отмечаете симптомы высокой интенсивности (например, боль 7/10 или нерегулярное кровотечение), появляется баннер «Рекомендация: гинекологический осмотр в ближайшие 7 дней» + ссылка на онлайн-запись." },
        category: { sr: "Aplikacija", en: "Application", ru: "Приложение" }
    }
];
