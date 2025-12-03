// @/lib/data/pricelist.ts

import type { LanguageCode } from '@/types/content';

export type LocalizedString = {
  [key in LanguageCode]?: string;
} & { "sr": string };

export interface Service {
  name: LocalizedString;
  price: string;
  description?: LocalizedString;
  slug?: string;
}

export interface ServiceCategory {
  category_key: string;
  category_name: LocalizedString;
  icon: string;
  services: Service[];
}

export const defaultPricelistData: { categories: ServiceCategory[], version: number } = {
  version: 5, // Povećana verzija da se pokrene ažuriranje
  categories: [
     {
      category_key: "examinations_and_consultations",
      icon: "Stethoscope",
      category_name: { en: "Examinations and Consultations", "sr": "Pregledi i Konsultacije", se: "Прегледи и Консултације", ru: "Осмотры и консультации" },
      services: [
        { name: { "sr": "OSNOVNI GINEKOLOŠKI PREGLED", en: "Basic Gynecological Exam", se: "ОСНОВНИ ГИНЕКОЛОШКИ ПРЕГЛЕД", ru: "Базовый гинекологический осмотр" }, price: "3.000 RSD", description: { "sr": "Standardni ginekološki pregled: razgovor, bimanuelni pregled i pregled pod spekulumom.", en: "Standard gynecological exam: interview, bimanual exam, and speculum exam.", se: "Стандардни гинеколошки преглед: разговор, бимануелни преглед и преглед под спекулумом.", ru: "Стандартный гинекологический осмотр: беседа, бимануальное исследование и осмотр в зеркалах." } },
        { name: { "sr": "KONTROLNI GINEKOLOŠKI PREGLED", en: "Follow-up Gynecological Exam", se: "КОНТРОЛНИ ГИНЕКОЛОШКИ ПРЕГЛЕД", ru: "Контрольный гинекологический осмотр" }, price: "2.000 RSD", description: { "sr": "Kraći pregled radi praćenja stanja nakon terapije ili prethodnog pregleda.", en: "Shorter exam to monitor condition after therapy or previous exam.", se: "Краћи преглед ради праћења стања након терапије или претходног прегледа.", ru: "Краткий осмотр для контроля состояния после терапии или предыдущего осмотра." } },
        { name: { "sr": "KOMPLETAN GINEKOLOŠKI PREGLED", en: "Complete Gynecological Exam", se: "КОМПЛЕТАН ГИНЕКОЛОШКИ ПРЕГЛЕД", ru: "Полный гинекологический осмотр" }, price: "8.500 RSD", description: { "sr": "Paket: Ultrazvuk, ginekološki pregled, brisevi, kolposkopija i PAPA test.", en: "Package: Ultrasound, gynecological exam, swabs, colposcopy, and PAPA test.", se: "Пакет: Ултразвук, гинеколошки преглед, брисеви, колпоскопија и ПАПА тест.", ru: "Пакет: УЗИ, гинекологический осмотр, мазки, кольпоскопия и ПАП-тест." } },
        { name: { "sr": "KONSULTACIJA GINEKOLOGA", en: "Gynecologist Consultation", se: "КОНСУЛТАЦИЈА ГИНЕКОЛОГА", ru: "Консультация гинеколога" }, price: "2.500 RSD", description: { "sr": "Razgovor i savetovanje sa ginekologom bez fizičkog pregleda.", en: "Discussion and counseling with a gynecologist without a physical exam.", se: "Разговор и саветовање са гинекологом без физичког прегледа.", ru: "Беседа и консультирование с гинекологом без физического осмотра." } },
      ],
    },
    {
      category_key: "diagnostics_and_swabs",
      icon: "FlaskConical",
      category_name: { en: "Diagnostics and Swabs", "sr": "Dijagnostika i Brisevi", se: "Дијагностика и Брисеви", ru: "Диагностика и мазки" },
      services: [
        { name: { "sr": "KOLPOSKOPSKI PREGLED", en: "Colposcopy Exam", se: "КОЛПОСКОПСКИ ПРЕГЛЕД", ru: "Кольпоскопическое исследование" }, price: "3.000 RSD", description: { "sr": "Detaljan pregled grlića materice, vagine i vulve kolposkopom.", en: "Detailed examination of the cervix, vagina, and vulva with a colposcope.", se: "Детаљан преглед грлића материце, вагине и вулве колпоскопом.", ru: "Детальное исследование шейки матки, влагалища и вульвы с помощью кольпоскопа." } },
        { name: { "sr": "PAPA TEST", en: "PAPA Test", se: "ПАПА ТЕСТ", ru: "ПАП-тест" }, price: "2.000 RSD", slug: "sta-je-papa-test", description: { "sr": "Citološka analiza za rano otkrivanje promena na grliću materice.", en: "Cytological analysis for early detection of changes on the cervix.", se: "Цитолошка анализа за рано откривање промена на грлићу материце.", ru: "Цитологический анализ для раннего выявления изменений на шейке матки." } },
        { name: { "sr": "PAPA LIQUID (LBC)", en: "Liquid-Based Cytology (LBC)", se: "ПАПА ЛИКУИД (ЛБЦ)", ru: "Жидкостная цитология (LBC)" }, price: "4.000 RSD", description: { "sr": "Tečna citologija – preciznija analiza PAPA testa.", en: "Liquid-based cytology - a more precise PAPA test analysis.", se: "Течна цитологија – прецизнија анализа ПАПА теста.", ru: "Жидкостная цитология – более точный анализ ПАП-теста." } },
        { name: { "sr": "BAKTERIOLOŠKI BRISEVI (Cervikalni i Vaginalni)", en: "Bacteriological Swabs (Cervical and Vaginal)", se: "БАКТЕРИОЛОШКИ БРИСЕВИ (Цервикални и Вагинални)", ru: "Бактериологические мазки (цервикальный и вагинальный)" }, price: "1.000 - 1.500 RSD", description: { "sr": "Analiza briseva radi identifikacije bakterija i određivanja antibiograma.", en: "Swab analysis to identify bacteria and determine an antibiogram.", se: "Анализа брисева ради идентификације бактерија и одређивања антибиограма.", ru: "Анализ мазков для выявления бактерий и определения антибиотикограммы." } },
        { name: { "sr": "HPV TIPIZACIJA PCR", en: "HPV PCR Typing", se: "ХПВ ТИПИЗАЦИЈА ПЦР", ru: "ПЦР-типирование ВПЧ" }, price: "5.000 - 9.500 RSD", description: { "sr": "Detekcija i tipizacija Humanog papiloma virusa visoko osetljivom PCR metodom.", en: "Detection and typing of Human Papillomavirus with a highly sensitive PCR method.", se: "Детекција и типизација Хуманог папилома вируса високо осетљивом ПЦР методом.", ru: "Обнаружение и типирование вируса папилломы человека высокочувствительным методом ПЦР." } },
        { name: { "sr": "PCR STD 4 (CT, UU, MH, TV)", en: "PCR STD 4 (CT, UU, MH, TV)", se: "ПЦР СТД 4 (ЦТ, УУ, МХ, ТВ)", ru: "ПЦР на 4 ИППП (CT, UU, MH, TV)" }, price: "4.500 RSD", description: { "sr": "PCR panel na 4 najčešće polno prenosive infekcije.", en: "PCR panel for the 4 most common sexually transmitted infections.", se: "ПЦР панел на 4 најчешће полно преносиве инфекције.", ru: "ПЦР-панель на 4 наиболее распространенные инфекции, передающиеся половым путем." } },
        { name: { "sr": "PCR STD BASIC (6 infekcija)", en: "PCR STD BASIC (6 infections)", se: "ПЦР СТД БАСИЦ (6 инфекција)", ru: "Базовый ПЦР на 6 ИППП" }, price: "7.500 RSD", description: { "sr": "Prošireni PCR panel na 6 uzročnika polno prenosivih bolesti.", en: "Expanded PCR panel for 6 causative agents of STDs.", se: "Проширени ПЦР панел на 6 узрочника полно преносивих болести.", ru: "Расширенная ПЦR-панель на 6 возбудителей ЗППП." } },
        { name: { "sr": "PCR STD 11", en: "PCR STD 11", se: "ПЦР СТД 11", ru: "ПЦР на 11 ИППП" }, price: "10.500 RSD", description: { "sr": "Sveobuhvatan PCR panel na 11 uzročnika polno prenosivih infekcija.", en: "Comprehensive PCR panel for 11 causative agents of STIs.", se: "Свеобухватан ПЦР панел на 11 узрочника полно преносивих инфекција.", ru: "Комплексная ПЦР-панель на 11 возбудителей ИППП." } },
        { name: { "sr": "PCR Mycoplasma hominis", en: "PCR Mycoplasma hominis", se: "ПЦР Mycoplasma hominis", ru: "ПЦР на Mycoplasma hominis" }, price: "2.200 RSD", description: { "sr": "Pojedinačni PCR test za Mycoplasma hominis.", en: "Individual PCR test for Mycoplasma hominis.", se: "Појединачни ПЦР тест за Mycoplasma hominis.", ru: "Индивидуальный ПЦР-тест на Mycoplasma hominis." } },
        { name: { "sr": "PCR Chlamydia trachomatis", en: "PCR Chlamydia trachomatis", se: "ПЦР Chlamydia trachomatis", ru: "ПЦР на Chlamydia trachomatis" }, price: "2.200 RSD", description: { "sr": "Pojedinačni PCR test za Chlamydia trachomatis.", en: "Individual PCR test for Chlamydia trachomatis.", se: "Појединачни ПЦР тест за Chlamydia trachomatis.", ru: "Индивидуальный ПЦР-тест на Chlamydia trachomatis." } },
        { name: { "sr": "PCR Ureaplasma urealytica", en: "PCR Ureaplasma urealytica", se: "ПЦР Ureaplasma urealytica", ru: "ПЦР на Ureaplasma urealytica" }, price: "2.200 RSD", description: { "sr": "Pojedinačni PCR test za Ureaplasma urealytica.", en: "Individual PCR test for Ureaplasma urealytica.", se: "Појединачни ПЦР тест за Ureaplasma urealytica.", ru: "Индивидуальный ПЦР-тест на Ureaplasma urealytica." } },
        { name: { "sr": "PCR Trichomonas vaginalis", en: "PCR Trichomonas vaginalis", se: "ПЦР Trichomonas vaginalis", ru: "ПЦР на Trichomonas vaginalis" }, price: "2.200 RSD", description: { "sr": "Pojedinačni PCR test za Trichomonas vaginalis.", en: "Individual PCR test for Trichomonas vaginalis.", se: "Појединачни ПЦР тест за Trichomonas vaginalis.", ru: "Индивидуальный ПЦР-тест на Trichomonas vaginalis." } },
        { name: { "sr": "PCR Gonoreja", en: "PCR Gonorrhea", se: "ПЦР Гонореја", ru: "ПЦР на гонорею" }, price: "2.200 RSD", description: { "sr": "Pojedinačni PCR test za Neisseria gonorrhoeae.", en: "Individual PCR test for Neisseria gonorrhoeae.", se: "Појединачни ПЦР тест за Neisseria gonorrhoeae.", ru: "Индивидуальный ПЦР-тест на Neisseria gonorrhoeae." } },
        { name: { "sr": "URINOKULTURA", en: "Urine Culture", se: "УРИНОКУЛТУРА", ru: "Посев мочи" }, price: "1.000 RSD", description: { "sr": "Analiza urina za detekciju i antibiogram bakterija.", en: "Urine analysis for bacterial detection and antibiogram.", se: "Анализа урина за детекцију и антибиограм бактерија.", ru: "Анализ мочи на выявление бактерий и антибиотикограмму." } },
        { name: { "sr": "FEMINA FLORA TEST", en: "Femina Flora Test", se: "ФЕМИНА ФЛОРА ТЕСТ", ru: "Тест Femina Flora" }, price: "8.000 RSD", description: { "sr": "Detaljna analiza vaginalne mikroflore.", en: "Detailed analysis of vaginal microflora.", se: "Детаљна анализа вагиналне микрофлоре.", ru: "Детальный анализ микрофлоры влагалища." } },
      ],
    },
    {
      category_key: "ultrasound_examinations",
      icon: "Waves",
      category_name: { en: "Ultrasound Examinations", "sr": "Ultrazvučni Pregledi", se: "Ултразвучни Прегледи", ru: "Ультразвуковые исследования" },
      services: [
        { name: { "sr": "ULTRAZVUČNI PREGLED (GINEKOLOŠKI)", en: "Ultrasound Exam (Gynecological)", se: "УЛТРАЗВУЧНИ ПРЕГЛЕД (ГИНЕКОЛОШКИ)", ru: "УЗИ (гинекологическое)" }, price: "4.000 RSD", description: { "sr": "Transvaginalni ili abdominalni ultrazvuk materice i jajnika.", en: "Transvaginal or abdominal ultrasound of the uterus and ovaries.", se: "Трансвагинални или абдоминални ултразвук материце и јајника.", ru: "Трансвагинальное или абдоминальное УЗИ матки и яичников." } },
        { name: { "sr": "RADIOLOG ULTRAZVUK (Abdomen, Štitna, Dojka)", en: "Radiologist Ultrasound (Abdomen, Thyroid, Breast)", se: "РАДИОЛОГ УЛТРАЗВУК (Абдомен, Штитна, Дојка)", ru: "УЗИ у радиолога (брюшная полость, щитовидная железа, молочная железа)" }, price: "5.000 RSD", description: { "sr": "Pojedinačni ultrazvučni pregledi koje obavlja radiolog.", en: "Individual ultrasound exams performed by a radiologist.", se: "Појединачни ултразвучни прегледи које обавља радиолог.", ru: "Индивидуальные ультразвуковые исследования, проводимые радиологом." } },
        { name: { "sr": "ULTRAZVUK ZA INTERVENCIJE", en: "Ultrasound for Interventions", se: "УЛТРАЗВУК ЗА ИНТЕРВЕНЦИЈЕ", ru: "УЗИ для вмешательств" }, price: "2.500 RSD", description: { "sr": "Ultrazvučno navođenje pri izvođenju medicinskih intervencija.", en: "Ultrasound guidance during medical interventions.", se: "Ултразвучно навођење при извођењу медицинских интервенција.", ru: "Ультразвуковое сопровождение при выполнении медицинских вмешательств." } },
        { name: { "sr": "FOLIKULOMETRIJA", en: "Folliculometry", se: "ФОЛИКУЛОМЕТРИЈА", ru: "Фолликулометрия" }, price: "2.500 RSD", description: { "sr": "Serija ultrazvukova za praćenje rasta folikula.", en: "Series of ultrasounds to monitor follicle growth.", se: "Серија ултразвукова за праћење раста фоликула.", ru: "Серия ультразвуковых исследований для отслеживания роста фолликулов." } },
      ],
    },
    {
      category_key: "pregnancy_monitoring",
      icon: "Baby",
      category_name: { en: "Pregnancy Monitoring", "sr": "Praćenje Trudnoće", se: "Праћење Трудноће", ru: "Ведение беременности" },
      services: [
        { name: { "sr": "KONTROLNI PREGLED TRUDNICE (TT, TA, P, OT)", en: "Routine Pregnancy Check-up (Weight, BP, P, Edema)", se: "КОНТРОЛНИ ПРЕГЛЕД ТРУДНИЦЕ (ТТ, ТА, П, ОТ)", ru: "Контрольный осмотр беременной (вес, АД, пульс, отеки)" }, price: "1.500 RSD", description: { "sr": "Rutinski pregled trudnice: težina, pritisak, opšte stanje.", en: "Routine check-up for pregnant women: weight, blood pressure, general condition.", se: "Рутински преглед труднице: тежина, притисак, опште стање.", ru: "Плановый осмотр беременной: вес, давление, общее состояние." } },
        { name: { "sr": "ULTRAZVUČNI PREGLED TRUDNICE", en: "Pregnancy Ultrasound Exam", se: "УЛТРАЗВУЧНИ ПРЕГЛЕД ТРУДНИЦЕ", ru: "УЗИ беременной" }, price: "6.000 RSD", description: { "sr": "Detaljan ultrazvuk za praćenje rasta ploda.", en: "Detailed ultrasound to monitor fetal growth.", se: "Детаљан ултразвук за праћење раста плода.", ru: "Детальное УЗИ для контроля роста плода." } },
        { name: { "sr": "ULTRAZVUK TRUDNICE (Blizanci)", en: "Twin Pregnancy Ultrasound", se: "УЛТРАЗВУК ТРУДНИЦЕ (Близанци)", ru: "УЗИ при двойне" }, price: "7.500 RSD", description: { "sr": "Ultrazvučni pregled kod blizanačke trudnoće.", en: "Ultrasound exam for a twin pregnancy.", se: "Ултразвучни преглед код близаначке трудноће.", ru: "Ультразвуковое исследование при многоплодной беременности." } },
        { name: { "sr": "4D ULTRAZVUK", en: "4D Ultrasound", se: "4Д УЛТРАЗВУК", ru: "4D УЗИ" }, price: "8.000 RSD", description: { "sr": "Trodimenzionalni prikaz ploda u realnom vremenu.", en: "Three-dimensional view of the fetus in real time.", se: "Тродимензионални приказ плода у реалном времену.", ru: "Трехмерное изображение плода в реальном времени." } },
        { name: { "sr": "4D ULTRAZVUK (Blizanci)", en: "4D Ultrasound (Twins)", se: "4Д УЛТРАЗВУК (Близанци)", ru: "4D УЗИ (двойня)" }, price: "9.500 RSD", description: { "sr": "4D ultrazvuk kod blizanačke trudnoće.", en: "4D ultrasound for a twin pregnancy.", se: "4Д ултразвук код близаначке трудноће.", ru: "4D УЗИ при многоплодной беременности." } },
        { name: { "sr": "CTG (Kardiotokografija)", en: "CTG (Cardiotocography)", se: "ЦТГ (Кардиотокографија)", ru: "КТГ (Кардиотокография)" }, price: "2.000 RSD", description: { "sr": "Praćenje srčanih tonova bebe i kontrakcija materice.", en: "Monitoring of the baby's heart tones and uterine contractions.", se: "Праћење срчаних тонова бебе и контракција материце.", ru: "Мониторинг сердечных тонов ребенка и сокращений матки." } },
        { name: { "sr": "AMNIOCENTEZA", en: "Amniocentesis", se: "АМНИОЦЕНТЕЗА", ru: "Амниоцентез" }, price: "42.000 RSD", description: { "sr": "Prenatalna dijagnostička metoda uzimanja uzorka plodove vode.", en: "Prenatal diagnostic method of taking a sample of amniotic fluid.", se: "Пренатална дијагностичка метода узимања узорка плодове воде.", ru: "Пренатальный диагностический метод взятия образца околоплодных вод." } },
        { name: { "sr": "AMNIOCENTEZA (Blizanci)", en: "Amniocentesis (Twins)", se: "АМНИОЦЕНТЕЗА (Близанци)", ru: "Амниоцентез (двойня)" }, price: "60.000 RSD", description: { "sr": "Amniocenteza kod blizanačke trudnoće.", en: "Amniocentesis for a twin pregnancy.", se: "Амниоцентеза код близаначке трудноће.", ru: "Амниоцентез при многоплодной беременности." } },
        { name: { "sr": "BIOPSIJA HORIONSKIH ČUPICA (CVS)", en: "Chorionic Villus Sampling (CVS)", se: "БИОПСИЈА ХОРИОНСКИХ ЧУПИЦА (ЦВС)", ru: "Биопсия хориона (CVS)" }, price: "36.000 RSD", description: { "sr": "Rana prenatalna dijagnostika uzorka posteljice.", en: "Early prenatal diagnosis from a placental sample.", se: "Рана пренатална дијагностика узорка постељице.", ru: "Ранняя пренатальная диагностика по образцу плаценты." } },
      ],
    },
    {
      category_key: "interventions",
      icon: "Scissors",
      category_name: { en: "Interventions", "sr": "Intervencije", se: "Интервенције", ru: "Вмешательства" },
      services: [
        { name: { "sr": "HISTEROSKOPIJA (dijagnostička)", en: "Hysteroscopy (diagnostic)", se: "ХИСТЕРОСКОПИЈА (дијагностичка)", ru: "Гистероскопия (диагностическая)" }, price: "39.000 RSD", slug: "histeroskopija" },
        { name: { "sr": "HISTEROSKOPIJA + HP (operativna)", en: "Hysteroscopy + HP (operative)", se: "ХИСТЕРОСКОПИЈА + ХП (оперативна)", ru: "Гистероскопия + ГП (оперативная)" }, price: "53.000 + 5.500 RSD", slug: "histeroskopija" },
        { name: { "sr": "BIOPSIJA GRLIĆA + HP (lokalna)", en: "Cervical Biopsy + HP (local)", se: "БИОПСИЈА ГРЛИЋА + ХП (локална)", ru: "Биопсия шейки матки + ГП (местная)" }, price: "21.600 + 5.500 RSD", description: { "sr": "Uzimanje uzorka tkiva sa grlića za HP analizu.", en: "Taking a tissue sample from the cervix for HP analysis.", se: "Узимање узорка ткива са грлића за ХП анализу.", ru: "Взятие образца ткани с шейки матки для гистопатологического анализа." } },
        { name: { "sr": "BIOPSIJA GRLIĆA SA KIRETAŽOM + 2x HP", en: "Cervical Biopsy with Curettage + 2x HP", se: "БИОПСИЈА ГРЛИЋА СА КИРЕТАЖОМ + 2x ХП", ru: "Биопсия шейки матки с кюретажем + 2x ГП" }, price: "30.000 + 11.000 RSD", description: { "sr": "Proširena biopsija i kiretaža kanala grlića.", en: "Extended biopsy and curettage of the cervical canal.", se: "Проширена биопсија и киретажа канала грлића.", ru: "Расширенная биопсия и кюретаж цервикального канала." } },
        { name: { "sr": "EKSPLORATIVNA KIRETAŽA + HP (opšta)", en: "Exploratory Curettage + HP (general)", se: "ЕКСПЛОРАТИВНА КИРЕТАЖА + ХП (општа)", ru: "Диагностическое выскабливание + ГП (общее)" }, price: "30.000 + 5.500 RSD", description: { "sr": "Uklanjanje sadržaja materice radi dijagnostike.", en: "Removal of uterine contents for diagnostic purposes.", se: "Уклањање садржаја материце ради дијагностике.", ru: "Удаление содержимого матки в диагностических целях." } },
        { name: { "sr": "BIOPSIJA ENDOMETRIJUMA + HP", en: "Endometrial Biopsy + HP", se: "БИОПСИЈА ЕНДОМЕТРИЈУМА + ХП", ru: "Биопсия эндометрия + ГП" }, price: "5.000 + 5.500 RSD", description: { "sr": "Uzorkovanje sluzokože materice za HP analizu.", en: "Sampling of the uterine lining for HP analysis.", se: "Узорковање слузокоже материце за ХП анализу.", ru: "Взятие образца слизистой оболочки матки для гистопатологического анализа." } },
        { name: { "sr": "PREKID TRUDNOĆE (vakuum aspiracija)", en: "Termination of Pregnancy (vacuum aspiration)", se: "ПРЕКИД ТРУДНОЋЕ (вакуум аспирација)", ru: "Прерывание беременности (вакуум-аспирация)" }, price: "30.000 RSD", slug: "bezbedan-prekid-trudnoce" },
        { name: { "sr": "STAVLJANJE SPIRALE (IUD)", en: "IUD Insertion", se: "СТАВЉАЊЕ СПИРАЛЕ (ИУД)", ru: "Установка ВМС" }, price: "8.000 RSD + cena spirale", description: { "sr": "Postavljanje intrauterinog uloška kao kontracepcije.", en: "Insertion of an intrauterine device as contraception.", se: "Постављање интраутериног улошка као контрацепције.", ru: "Установка внутриматочной спирали в качестве контрацепции." } },
        { name: { "sr": "SKIDANJE SPIRALE (IUD)", en: "IUD Removal", se: "СКИДАЊЕ СПИРАЛЕ (ИУД)", ru: "Удаление ВМС" }, price: "6.000 RSD", description: { "sr": "Uklanjanje intrauterinog uloška.", en: "Removal of an intrauterine device.", se: "Уклањање интраутериног улошка.", ru: "Удаление внутриматочной спирали." } },
        { name: { "sr": "UKLANJANJE KONDILOMA (do 10 promena)", en: "Condyloma Removal (up to 10 lesions)", se: "УКЛАЊАЊЕ КОНДИЛОМА (до 10 промена)", ru: "Удаление кондилом (до 10 образований)" }, price: "6.900 RSD", description: { "sr": "Uklanjanje do 10 kondiloma lokalnom anestezijom.", en: "Removal of up to 10 condylomas under local anesthesia.", se: "Уклањање до 10 кондилома локалном анестезијом.", ru: "Удаление до 10 кондилом под местной анестезией." } },
        { name: { "sr": "UKLANJANJE KONDILOMA (opšta anestezija)", en: "Condyloma Removal (general anesthesia)", se: "УКЛАЊАЊЕ КОНДИЛОМА (општа анестезија)", ru: "Удаление кондилом (общая анестезия)" }, price: "23.000 - 33.000 RSD", description: { "sr": "Uklanjanje većeg broja kondiloma u opštoj anesteziji.", en: "Removal of a larger number of condylomas under general anesthesia.", se: "Уклањање већег броја кондилома у општој анестезији.", ru: "Удаление большого количества кондилом под общей анестезией." } },
        { name: { "sr": "UKLANJANJE CERVIKALNOG POLIPA + HP", en: "Cervical Polyp Removal + HP", se: "УКЛАЊАЊЕ ЦЕРВИКАЛНОГ ПОЛИПА + ХП", ru: "Удаление полипа шейки матки + ГП" }, price: "18.000 + 5.500 RSD", description: { "sr": "Uklanjanje polipa sa grlića materice uz HP analizu.", en: "Removal of a polyp from the cervix with HP analysis.", se: "Уклањање полипа са грлића материце уз ХП анализу.", ru: "Удаление полипа с шейки матки с гистопатологическим анализом." } },
        { name: { "sr": "KONIZACIJA + HP", en: "Conization + HP", se: "КОНИЗАЦИЈА + ХП", ru: "Конизация + ГП" }, price: "60.000 + 5.500 RSD", description: { "sr": "Hirurško uklanjanje konusnog dela tkiva grlića.", en: "Surgical removal of a cone-shaped piece of cervical tissue.", se: "Хируршко уклањање конусног дела ткива грлића.", ru: "Хирургическое удаление конусовидного участка ткани шейки матки." } },
        { name: { "sr": "LOOP PROCEDURA (KONIZACIJA) + HP", en: "LOOP Procedure (Conization) + HP", se: "ЛООП ПРОЦЕДУРА (КОНИЗАЦИЈА) + ХП", ru: "Петлевая процедура (конизация) + ГП" }, price: "54.000 + 5.500 RSD", description: { "sr": "Radiotalasna omčica (LEEP/LOOP) uz HP analizu.", en: "Radiowave loop (LEEP/LOOP) with HP analysis.", se: "Радиоталасна омчица (ЛЕЕП/ЛООП) уз ХП анализу.", ru: "Радиоволновая петля (LEEP/LOOP) с гистопатологическим анализом." } },
        { name: { "sr": "UKLANJANJE PROMENA NA GRLIĆU (radiotalasi)", en: "Removal of Cervical Lesions (radiowaves)", se: "УКЛАЊАЊЕ ПРОМЕНА НА ГРЛИЋУ (радиоталаси)", ru: "Удаление образований на шейке матки (радиоволны)" }, price: "36.000 RSD", description: { "sr": "Tretman promena/ektopije na grliću materice.", en: "Treatment of lesions/ectropion on the cervix.", se: "Треман промена/ектопије на грлићу материце.", ru: "Лечение образований/эктопии на шейке матки." } },
        { name: { "sr": '"RANICA" NA GRLIĆU (radiotalasi)', en: '"Erosion" on the Cervix (radiowaves)', se: '"РАНИЦА" НА ГРЛИЋУ (радиоталаси)', ru: '"Эрозия" шейки матки (радиоволны)' }, price: "36.000 RSD", description: { "sr": "Radiotalasni tretman ektopije grlića.", en: "Radiowave treatment of cervical ectropion.", se: "Радиоталасни третман ектопије грлића.", ru: "Радиоволновое лечение эктропиона шейки матки." } },
        { name: { "sr": "INCIZIJA BARTOLINIJEVE ŽLEZDE", en: "Bartholin's Gland Incision", se: "ИНЦИЗИЈА БАРТОЛИНИЈЕВЕ ЖЛЕЗДЕ", ru: "Вскрытие бартолиновой железы" }, price: "12.000 RSD", description: { "sr": "Dreniranje apscesa Bartolinijeve žlezde.", en: "Draining of a Bartholin's gland abscess.", se: "Дренирање апсцеса Бартолинијеве жлезде.", ru: "Дренирование абсцесса бартолиновой железы." } },
        { name: { "sr": "MARSUPIJELIZACIJA BARTOLINIJEVE ŽLEZDE", en: "Bartholin's Gland Marsupialization", se: "МАРСУПИЈЕЛИЗАЦИЈА БАРТОЛИНИЈЕВЕ ЖЛЕЗДЕ", ru: "Марсупиализация бартолиновой железы" }, price: "43.000 RSD", description: { "sr": "Kreiranje trajnog otvora za drenažu ciste.", en: "Creating a permanent opening for cyst drainage.", se: "Креирање трајног отвора за дренажу цисте.", ru: "Создание постоянного отверстия для дренирования кисты." } },
        { name: { "sr": "PUNKCIJA BARTOLINIJEVE ŽLEZDE", en: "Bartholin's Gland Puncture", se: "ПУНКЦИЈА БАРТОЛИНИЈЕВЕ ЖЛЕЗДЕ", ru: "Пункция бартолиновой железы" }, price: "5.000 RSD", description: { "sr": "Pražnjenje ciste iglom.", en: "Draining a cyst with a needle.", se: "Пражњење цисте иглом.", ru: "Опорожнение кисты иглой." } },
        { name: { "sr": "UKLANJANJE CISTE VAGINE", en: "Vaginal Cyst Removal", se: "УКЛАЊАЊЕ ЦИСТЕ ВАГИНЕ", ru: "Удаление кисты влагалища" }, price: "41.000 RSD", description: { "sr": "Hirurško uklanjanje ciste vaginalnog zida.", en: "Surgical removal of a vaginal wall cyst.", se: "Хируршко уклањање цисте вагиналног зида.", ru: "Хирургическое удаление кисты стенки влагалища." } },
      ],
    },
    {
      category_key: "aesthetic_gynecology",
      icon: "Sparkles",
      category_name: { en: "Aesthetic Gynecology", "sr": "Estetska Ginekologija", se: "Естетска Гинекологија", ru: "Эстетическая гинекология" },
      services: [
        { name: { "sr": "LABIOPLASTIKA", en: "Labiaplasty", se: "ЛАБИОПЛАСТИКА", ru: "Лабиопластика" }, price: "69.000 RSD", slug: "labioplastika-smanjenje-malih-usana" },
        { name: { "sr": "INCIZIJA HIMENALNOG PRSTENA", en: "Hymenal Ring Incision", se: "ИНЦИЗИЈА ХИМЕНАЛНОГ ПРСТЕНА", ru: "Рассечение гименального кольца" }, price: "10.000 RSD", description: { "sr": "Proširenje otvora himena.", en: "Widening of the hymenal opening.", se: "Проширење отвора химена.", ru: "Расширение гименального отверстия." } },
      ],
    },
    {
      category_key: "assisted_reproduction_and_paternity",
      icon: "TestTube",
      category_name: { en: "Assisted Reproduction and Paternity", "sr": "Potpomognuta Oplodnja i Očinstvo", se: "Потпомогнута Оплодња и Очинство", ru: "Вспомогательная репродукция и отцовство" },
      services: [
        { name: { "sr": "INSEMINACIJA (IUI)", en: "Insemination (IUI)", se: "ИНСЕМИНАЦИЈА (ИУИ)", ru: "Инсеминация (ВМИ)" }, price: "29.000 RSD", description: { "sr": "Unos obrađene sperme direktno u matericu.", en: "Introduction of processed sperm directly into the uterus.", se: "Унос обрађене сперме директно у материцу.", ru: "Введение обработанной спермы непосредственно в матку." } },
        { name: { "sr": "UTVRĐIVANJE OČINSTVA", en: "Paternity Testing", se: "УТВРЂИВАЊЕ ОЧИНСТВА", ru: "Установление отцовства" }, price: "48.000 RSD", description: { "sr": "DNK analiza otac‑dete.", en: "DNA analysis father-child.", se: "ДНК анализа отац‑дете.", ru: "ДНК-анализ отец-ребенок." } },
        { name: { "sr": "UTVRĐIVANJE OČINSTVA (iz CVS ili AC)", en: "Paternity Testing (from CVS or AC)", se: "УТВРЂИВАЊЕ ОЧИНСТВА (из ЦВС или АЦ)", ru: "Установление отцовства (из CVS или AC)" }, price: "59.000 RSD", description: { "sr": "Prenatalna analiza horionskih čupica ili plodove vode.", en: "Prenatal analysis of chorionic villi or amniotic fluid.", se: "Пренатална анализа хорионских чупица или плодове воде.", ru: "Пренатальный анализ ворсин хориона или околоплодных вод." } },
        { name: { "sr": "UTVRĐIVANJE OČINSTVA (Kordocenteza)", en: "Paternity Testing (Cordocentesis)", se: "УТВРЂИВАЊЕ ОЧИНСТВА (Кордоцентеза)", ru: "Установление отцовства (Кордоцентез)" }, price: "65.000 RSD", description: { "sr": "Prenatalna analiza krvi iz pupčane vrpce.", en: "Prenatal analysis of umbilical cord blood.", se: "Пренатална анализа крви из пупчане врпце.", ru: "Пренатальный анализ крови из пуповины." } },
      ],
    },
    {
      category_key: "other_services",
      icon: "Syringe",
      category_name: { en: "Other Services", "sr": "Ostale Usluge", se: "Остале Услуге", ru: "Прочие услуги" },
      services: [
        { name: { "sr": "HP (Histopatološki nalaz)", en: "Histopathology Report", se: "ХП (Хистопатолошки налаз)", ru: "Гистопатологическое заключение" }, price: "5.500 RSD", description: { "sr": "Cena pojedinačne histopatološke analize.", en: "Price of a single histopathological analysis.", se: "Цена појединачне хистопатолошке анализе.", ru: "Цена одного гистопатологического анализа." } },
        { name: { "sr": "ANALGOSEDACIJA - ANESTEZIJA", en: "Analgosedation - Anesthesia", se: "АНАЛГОСЕДАЦИЈА - АНЕСТЕЗИЈА", ru: "Анальгоседация - Анестезия" }, price: "6.500 RSD", description: { "sr": "Anestezija radi komfora tokom intervencija.", en: "Anesthesia for comfort during interventions.", se: "Анестезија ради комфора током интервенција.", ru: "Анестезия для комфорта во время вмешательств." } },
        { name: { "sr": "INFUZIJA (lekovi posebno)", en: "Infusion (meds separate)", se: "ИНФУЗИЈА (лекови посебно)", ru: "Инфузия (лекарства отдельно)" }, price: "2.500 RSD", description: { "sr": "Intravenska primena terapije (cena bez lekova).", en: "Intravenous therapy administration (price without drugs).", se: "Инравенска примена терапије (цена без лекова).", ru: "Внутривенное введение терапии (цена без лекарств)." } },
        { name: { "sr": "IM INJEKCIJA (usluga)", en: "IM Injection (service)", se: "ИМ ИЊЕКЦИЈА (услуга)", ru: "ВМ инъекция (услуга)" }, price: "500 RSD", description: { "sr": "Usluga davanja intramuskularne injekcije.", en: "Service of giving an intramuscular injection.", se: "Услуга давања интрамускуларне ињекције.", ru: "Услуга внутримышечной инъекции." } },
        { name: { "sr": "IV INJEKCIJA (usluga)", en: "IV Injection (service)", se: "ИВ ИЊЕКЦИЈА (услуга)", ru: "ВВ инъекция (услуга)" }, price: "1.500 - 2.000 RSD", description: { "sr": "Usluga davanja intravenske injekcije.", en: "Service of giving an intravenous injection.", se: "Услуга давања интравенске ињекције.", ru: "Услуга внутривенной инъекции." } },
      ],
    }
  ],
};
