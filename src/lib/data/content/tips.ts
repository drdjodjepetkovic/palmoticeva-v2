
import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 1;

export const tipsContent: { [key: string]: ContentItem & { version: number } } = {
  // Calendar Tips
  daily_tip_title: { en: "Daily Tip", "se-lat": "Savet Dana", se: "Савет Дана", ru: "Совет дня", version: CURRENT_CONTENT_VERSION },
  tip_period_1: { 
    en: "During your period, your body loses iron. Increase your intake of spinach, red meat, and legumes.", 
    "se-lat": "Tokom menstruacije, telo gubi gvožđe. Pojačajte unos spanaća, crvenog mesa i mahunarki.", 
    se: "Током менструације, тело губи гвожђе. Појачајте унос спанаћа, црвеног меса и махунарки.", 
    ru: "Во время менструации ваш организм теряет железо. Увеличьте потребление шпината, красного мяса и бобовых.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_period_2: { 
    en: "Mild exercise like walking or yoga can help alleviate cramps and improve your mood.", 
    "se-lat": "Lagana vežba poput šetnje ili joge može pomoći u ublažavanju grčeva i poboljšanju raspoloženja.", 
    se: "Лагана вежба попут шетње или јоге може помоћи у ублажавању грчева и побољшању расположења.", 
    ru: "Легкие упражнения, такие как ходьба или йога, могут помочь облегчить спазмы и улучшить настроение.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_fertile_1: { 
    en: "Your energy levels are at their peak during the fertile window. It's a great time for more intense workouts.", 
    "se-lat": "Nivo energije je na vrhuncu tokom plodnih dana. Odlično je vreme za intenzivnije treninge.", 
    se: "Ниво енергије је на врхунцу током плодних дана. Одлично је време за интензивније тренинге.", 
    ru: "Уровень вашей энергии достигает пика во время фертильного окна. Это прекрасное время для более интенсивных тренировок.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_fertile_2: { 
    en: "Libido is often highest around ovulation. Listen to your body.", 
    "se-lat": "Libido je često najviši oko ovulacije. Slušajte svoje telo.", 
    se: "Либидо је често највиши око овулације. Слушајте своје тело.", 
    ru: "Либидо часто бывает самым высоким во время овуляции. Прислушивайтесь к своему телу.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_pms_1: { 
    en: "In the days before your period, reduce your intake of salt and caffeine to minimize bloating and irritability.", 
    "se-lat": "U danima pred menstruaciju, smanjite unos soli i kofeina kako biste umanjili nadutost i razdražljivost.", 
    se: "У данима пред менструацију, смањите унос соли и кофеина како бисте умањили надутост и раздражљивост.", 
    ru: "За несколько дней до менструации сократите потребление соли и кофеина, чтобы минимизировать вздутие и раздражительность.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_pms_2: { 
    en: "Foods rich in magnesium, like dark chocolate and nuts, can help with PMS symptoms.", 
    "se-lat": "Namirnice bogate magnezijumom, poput crne čokolade i orašastih plodova, mogu pomoći kod simptoma PMS-a.", 
    se: "Намирнице богате магнезијумом, попут црне чоколаде и орашастих плодова, могу помоћи код симптома ПМС-а.", 
    ru: "Продукты, богатые магнием, такие как темный шоколад и орехи, могут помочь при симптомах ПМС.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_default: { 
    en: "Regularly tracking your cycle helps you understand your body's unique rhythm.", 
    "se-lat": "Redovno praćenje ciklusa pomaže vam da razumete jedinstveni ritam vašeg tela.", 
    se: "Редовно праћење циклуса помаже вам да разумете јединствени ритам вашег тела.", 
    ru: "Регулярное отслеживание цикла помогает вам понять уникальный ритм вашего тела.", 
    version: CURRENT_CONTENT_VERSION 
  },

  // Health Corner Facts
  fact_1: {
    en: "Did you know? The cervix changes position and texture throughout your menstrual cycle.",
    "se-lat": "Da li ste znali? Grlić materice menja položaj i teksturu tokom menstrualnog ciklusa.",
    se: "Да ли сте знали? Грлић материце мења положај и текстуру током менструалног циклуса.",
    ru: "Знаете ли вы? Шейка матки меняет свое положение и текстуру на протяжении менструального цикла.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_2: {
    en: "Regular physical activity can significantly reduce the intensity of menstrual cramps.",
    "se-lat": "Redovna fizička aktivnost može značajno smanjiti intenzitet menstrualnih grčeva.",
    se: "Редовна физичка активност може значајно смањити интензитет менструалних грчева.",
    ru: "Регулярная физическая активность может значительно снизить интенсивность менструальных болей.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_3: {
    en: "The HPV vaccine is most effective when administered before the first sexual contact, protecting against the most common causes of cervical cancer.",
    "se-lat": "HPV vakcina je najefikasnija kada se primi pre prvog seksualnog odnosa, štiteći od najčešćih uzročnika raka grlića materice.",
    se: "ХПВ вакцина је најефикаснија када се прими пре првог сексуалног односа, штитећи од најчешћих узрочника рака грлића материце.",
    ru: "Вакцина против ВПЧ наиболее эффективна, если ее сделать до первого полового контакта, так как она защищает от самых распространенных причин рака шейки матки.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_4: {
    en: "It's completely normal for a menstrual cycle to last anywhere from 21 to 35 days.",
    "se-lat": "Sasvim je normalno da menstrualni ciklus traje od 21 do 35 dana.",
    se: "Сасвим је нормално да менструални циклус траје од 21 до 35 дана.",
    ru: "Совершенно нормально, что менструальный цикл длится от 21 до 35 дней.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_5: {
    en: "A balanced diet rich in calcium and vitamin D is crucial for preventing osteoporosis, especially in perimenopause and menopause.",
    "se-lat": "Uravnotežena ishrana bogata kalcijumom i vitaminom D ključna je za prevenciju osteoporoze, posebno u perimenopauzi i menopauzi.",
    se: "Уравнотежена исхрана богата калцијумом и витамином Д кључна је за превенцију остеопорозе, посебно у перименопаузи и менопаузи.",
    ru: "Сбалансированная диета, богатая кальцием и витамином D, имеет решающее значение для профилактики остеопороза, особенно в перименопаузе и менопаузе.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_6: {
    en: "A healthy menstrual cycle lasts 21–35 days. Deviations of more than 7 days warrant a check-up.",
    "se-lat": "Zdrav menstrualni ciklus traje 21–35 dana. Odstupanja više od 7 dana zaslužuju pregled.",
    se: "Здрав менструални циклус траје 21–35 дана. Одступања више од 7 дана заслужују преглед.",
    ru: "Здоровый менструальный цикл длится 21–35 дней. Отклонения более чем на 7 дней требуют обследования.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_7: {
    en: "Ovulation occurs approximately 14 days before your next period, not 14 days after the previous one.",
    "se-lat": "Ovulacija se dešava otprilike 14 dana pre sledeće menstruacije, ne 14 dana posle prethodne.",
    se: "Овулација се дешава отприлике 14 дана пре следеће менструације, не 14 дана после претходне.",
    ru: "Овуляция происходит примерно за 14 дней до следующей менструации, а не через 14 дней после предыдущей.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_8: {
    en: "Perform a breast self-exam 7–10 days after the first day of your period, when breasts are least tender.",
    "se-lat": "Samopregled dojki radite 7–10 dana posle prvog dana menstruacije, kad su dojke najmanje osetljive.",
    se: "Самопреглед дојки радите 7–10 дана после првог дана менструације, кад су дојке најмање осетљиве.",
    ru: "Самообследование груди проводите через 7–10 дней после первого дня менструации, когда грудь наименее чувствительна.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_9: {
    en: "The first PAP test is recommended by age 21 or three years after first intercourse — whichever comes first.",
    "se-lat": "Prvi PAPA test preporučuje se do 21. godine ili 3 godine posle prvog odnosa — šta god nastupi ranije.",
    se: "Први ПАПА тест препоручује се до 21. године или 3 године после првог односа — шта год наступи раније.",
    ru: "Первый ПАП-тест рекомендуется сделать до 21 года или через три года после первого полового акта — в зависимости от того, что наступит раньше.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_10: {
    en: "The HPV test is more accurate than the PAP test after age 30; the combination offers the best prevention.",
    "se-lat": "HPV test je precizniji od PAPA testa posle 30. godine; kombinacija daje najbolju prevenciju.",
    se: "ХПВ тест је прецизнији од ПАПА теста после 30. године; комбинација даје најбољу превенцију.",
    ru: "ВПЧ-тест точнее ПАП-теста после 30 лет; комбинация обеспечивает наилучшую профилактику.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_11: {
    en: "The HPV vaccine is most effective before the first sexual contact, but it also offers protection later.",
    "se-lat": "HPV vakcina je najefikasnija pre prvog seksualnog odnosa, ali štiti i kasnije.",
    se: "ХПВ вакцина је најефикаснија пре првог сексуалног односа, али штити и касније.",
    ru: "Вакцина против ВПЧ наиболее эффективна до первого полового контакта, но защищает и позже.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_12: {
    en: "Folic acid (400–800 mcg daily) should be started at least 3 months before a planned pregnancy.",
    "se-lat": "Folna kiselina (400–800 mcg dnevno) počinje najmanje 3 meseca pre planirane trudnoće.",
    se: "Фолна киселина (400–800 мцг дневно) почиње најмање 3 месеца пре планиране трудноће.",
    ru: "Фолиевую кислоту (400–800 мкг в день) следует начинать принимать не менее чем за 3 месяца до планируемой беременности.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_13: {
    en: "The first ultrasound examination in pregnancy is performed between the 6th and 9th week.",
    "se-lat": "Prvi ultrazvučni pregled u trudnoći ide između 6. i 9. nedelje.",
    se: "Први ултразвучни преглед у трудноћи иде између 6. и 9. недеље.",
    ru: "Первое ультразвуковое исследование при беременности проводится между 6-й и 9-й неделями.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_14: {
    en: "First-trimester screening (double test + NT) is performed between weeks 11 and 13+6.",
    "se-lat": "Skrining prvog trimestra (double test + NT) radi se između 11. i 13+6. nedelje.",
    se: "Скрининг првог триместра (double test + NT) ради се између 11. и 13+6. недеље.",
    ru: "Скрининг первого триместра (двойной тест + NT) проводится между 11-й и 13+6 неделями.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_15: {
    en: "Mammography is recommended from age 40, every 1–2 years; earlier if there is a family history.",
    "se-lat": "Mamografija se preporučuje od 40. godine, svake 1–2 godine; ranije ako postoji porodična istorija.",
    se: "Мамографија се препоручује од 40. године, сваке 1–2 године; раније ако постоји породична историја.",
    ru: "Маммография рекомендуется с 40 лет, раз в 1–2 года; раньше при наличии семейного анамнеза.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_16: {
    en: "Endometriosis affects about 1 in 10 women; diagnosis is on average delayed by 7–8 years — don't ignore chronic pain.",
    "se-lat": "Endometrioza pogađa oko 1 od 10 žena; dijagnoza u proseku kasni 7–8 godina — ne ignorišite hroničan bol.",
    se: "Ендометриоза погађа око 1 од 10 жена; дијагноза у просеку касни 7–8 година — не игноришите хроничан бол.",
    ru: "Эндометриоз поражает примерно 1 из 10 женщин; диагностика в среднем задерживается на 7–8 лет — не игнорируйте хроническую боль.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_17: {
    en: "Uterine fibroids are benign; about 30% of women of reproductive age have them, most without symptoms.",
    "se-lat": "Miomi materice su benigni; oko 30% žena reproduktivne dobi ih ima, većina bez simptoma.",
    se: "Миоми материце су бенигни; око 30% жена репродуктивне доби их има, већина без симптома.",
    ru: "Миомы матки являются доброкачественными; около 30% женщин репродуктивного возраста имеют их, большинство без симптомов.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_18: {
    en: "PCOS typically presents with irregular cycles, acne, and excess hair growth — lab work and ultrasound confirm the diagnosis.",
    "se-lat": "PCOS se najčešće manifestuje neredovnim ciklusima, aknama i viškom malja — laboratorija i ultrazvuk potvrđuju dijagnozu.",
    se: "ПЦОС се најчешће манифестује нередовним циклусима, акнама и вишком маља — лабораторија и ултразвук потврђују дијагнозу.",
    ru: "СПКЯ обычно проявляется нерегулярными циклами, акне и избыточным ростом волос — лабораторные анализы и УЗИ подтверждают диагноз.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_19: {
    en: "Hormonal contraception does not cause long-term infertility; fertility returns within a few cycles.",
    "se-lat": "Hormonska kontracepcija ne uzrokuje dugoročnu neplodnost; plodnost se vraća u roku od nekoliko ciklusa.",
    se: "Хормонска контрацепција не узрокује дугорочну неплодност; плодност се враћа у року од неколико циклуса.",
    ru: "Гормональная контрацепция не вызывает длительное бесплодие; фертильность восстанавливается в течение нескольких циклов.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_20: {
    en: "Kegel exercises strengthen the pelvic floor and reduce the risk of incontinence after childbirth and during menopause.",
    "se-lat": "Kegelove vežbe jačaju karlično dno i smanjuju rizik od inkontinencije posle porođaja i u menopauzi.",
    se: "Кегелове вежбе јачају карлично дно и смањују ризик од инконтиненције после порођаја и у менопаузи.",
    ru: "Упражнения Кегеля укрепляют тазовое дно и снижают риск недержания после родов и во время менопаузы.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_21: {
    en: "Perimenopause can begin as early as age 40 and last 4–10 years before actual menopause.",
    "se-lat": "Perimenopauza može početi već od 40. godine i trajati 4–10 godina pre stvarne menopauze.",
    se: "Перименопауза може почети већ од 40. године и трајати 4–10 година пре стварне менопаузе.",
    ru: "Перименопауза может начаться уже в 40 лет и длиться 4–10 лет до наступления самой менопаузы.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_22: {
    en: "Urinary tract infections are 30x more common in women — urinating after intercourse reduces the risk.",
    "se-lat": "Urinarne infekcije su 30x češće kod žena — mokrenje posle odnosa smanjuje rizik.",
    se: "Уринарне инфекције су 30x чешће код жена — мокрење после односа смањује ризик.",
    ru: "Инфекции мочевыводящих путей встречаются у женщин в 30 раз чаще — мочеиспускание после полового акта снижает риск.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_23: {
    en: "The vaginal microbiome depends on lactobacilli; douching and fragranced gels disrupt it.",
    "se-lat": "Vaginalni mikrobiom zavisi od laktobacila; ispiranja i aromatizirani gelovi ga narušavaju.",
    se: "Вагинални микробиом зависи од лактобацила; испирања и ароматизирани гелови га нарушавају.",
    ru: "Вагинальный микробиом зависит от лактобактерий; спринцевания и ароматизированные гели нарушают его.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_24: {
    en: "Condyloma (genital warts) are caused by HPV types 6 and 11; the vaccine covers them.",
    "se-lat": "Kondilomi (genitalne bradavice) izazvani su HPV tipovima 6 i 11; vakcina ih pokriva.",
    se: "Кондиломи (гениталне брадавице) изазвани су ХПВ типовима 6 и 11; вакцина их покрива.",
    ru: "Кондиломы (генитальные бородавки) вызываются ВПЧ типов 6 и 11; вакцина их покрывает.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_25: {
    en: "Laparoscopy leaves scars of 5–10 mm and typical recovery takes 1–2 weeks.",
    "se-lat": "Laparoskopija ostavlja ožiljke od 5–10 mm i tipičan oporavak je 1–2 nedelje.",
    se: "Лапароскопија оставља ожиљке од 5–10 мм и типичан опоравак је 1–2 недеље.",
    ru: "Лапароскопия оставляет рубцы размером 5–10 мм, а типичное восстановление занимает 1–2 недели.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_26: {
    en: "Hysteroscopy is the gold standard for assessing the interior of the uterus; it can be both diagnostic and operative in the same procedure.",
    "se-lat": "Histeroskopija je zlatni standard za procenu unutrašnjosti materice; u istom zahvatu može biti i dijagnostička i operativna.",
    se: "Хистероскопија је златни стандард за процену унутрашњости материце; у истом захвату може бити и дијагностичка и оперативна.",
    ru: "Гистероскопия — это золотой стандарт для оценки полости матки; в рамках одной процедуры может быть как диагностической, так и оперативной.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_27: {
    en: "Stress raises cortisol and can delay ovulation — one stressful cycle is not a reason to panic.",
    "se-lat": "Stres podiže kortizol i može da odloži ovulaciju — jedan stresan ciklus nije razlog za paniku.",
    se: "Стрес подиже кортизол и може да одложи овулацију — један стресан циклус није разлог за панику.",
    ru: "Стресс повышает кортизол и может задержать овуляцию — один стрессовый цикл не повод для паники.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_28: {
    en: "Less than 6 hours of sleep increases ghrelin and alters hormonal balance; fertility is directly affected.",
    "se-lat": "San manje od 6 sati povećava grelin i menja hormonski balans; plodnost je direktno pogođena.",
    se: "Сан мање од 6 сати повећава грелин и мења хормонски баланс; плодност је директно погођена.",
    ru: "Менее 6 часов сна повышают уровень грелина и нарушают гормональный баланс; фертильность страдает напрямую.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_29: {
    en: "Regular physical activity (150 minutes per week) reduces the risk of breast cancer by about 20%.",
    "se-lat": "Redovna fizička aktivnost (150 min nedeljno) smanjuje rizik od raka dojke za oko 20%.",
    se: "Редовна физичка активност (150 мин недељно) смањује ризик од рака дојке за око 20%.",
    ru: "Регулярная физическая активность (150 минут в неделю) снижает риск рака молочной железы примерно на 20%.",
    version: CURRENT_CONTENT_VERSION
  },
  fact_30: {
    en: "A Mediterranean diet combined with vitamin D and calcium protects bones during perimenopause and menopause.",
    "se-lat": "Mediteranska ishrana uz vitamin D i kalcijum štiti kosti u perimenopauzi i menopauzi.",
    se: "Медитеранска исхрана уз витамин Д и калцијум штити кости у перименопаузи и менопаузи.",
    ru: "Средиземноморская диета вместе с витамином D и кальцием защищает кости в перименопаузе и менопаузе.",
    version: CURRENT_CONTENT_VERSION
  },
};

    