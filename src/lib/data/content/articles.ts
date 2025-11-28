
import type { LanguageCode } from '@/types/content';

type LocalizedString = {
    [key in LanguageCode]?: string;
} & { "sr": string };

export type Article = {
    slug: string;
    title: LocalizedString;
    summary: LocalizedString;
    content: LocalizedString;
    image: string;
    author: LocalizedString;
    date: string; // ISO format string
};

export type ArticlesContent = {
    version: number;
    articles: Article[];
};


export const articlesContent: { [key: string]: { en: string, "sr": string, se: string, ru: string } & { version: number } } = {
    articles_title: { en: "Our Articles", "sr": "Naši Članci", se: "Наши Чланци", ru: "Наши Статьи", version: 1 },
    articles_subtitle: { en: "Learn more about women's health, prevention, and the latest treatment methods.", "sr": "Saznajte više o ženskom zdravlju, prevenciji i najnovijim metodama lečenja.", se: "Сазнајте више о женском здрављу, превенцији и најновијим методама лечења.", ru: "Узнайте больше о женском здоровье, профилактике и новейших методах лечения.", version: 1 },
    homepage_articles_card_title: { en: "Health Blog", "sr": "Blog o Zdravlju", se: "Блог о Здрављу", ru: "Блог о Здоровье", version: 1 },
    homepage_articles_card_desc: { en: "Read our articles on women's health.", "sr": "Pročitajte naše članke o ženskom zdravlju.", se: "Прочитајте наше чланке о женском здрављу.", ru: "Читайте наши статьи о женском здоровье.", version: 1 },
    article_back_button: { en: "Back to all articles", "sr": "Nazad na sve članke", se: "Назад на све чланке", ru: "Назад ко всем статьям", version: 1 },
    articles_read_more: { en: "Read more", "sr": "Pročitaj više", se: "Прочитај више", ru: "Читать далее", version: 1 },
};

export const defaultArticlesData: ArticlesContent = {
    version: 2,
    articles: [
        {
            slug: 'sta-je-papa-test',
            title: {
                "sr": "Šta je PAPA test i zašto je važan?",
                en: "What is a PAP test and why is it important?",
                se: "Шта је ПАПА тест и зашто је важан?",
                ru: "Что такое ПАП-тест и почему он важен?"
            },
            summary: {
                "sr": "Saznajte sve o PAPA testu, ključnom pregledu za rano otkrivanje raka grlića materice. Redovni pregledi spasavaju živote.",
                en: "Learn all about the PAP test, a key screening for the early detection of cervical cancer. Regular check-ups save lives.",
                se: "Сазнајте све о ПАПА тесту, кључном прегледу за рано откривање рака грлића материце. Редовни прегледи спасавају животе.",
                ru: "Узнайте все о ПАП-тесте, ключевом обследовании для раннего выявления рака шейки матки. Регулярные осмотры спасают жизни."
            },
            content: {
                "sr": `
                <h2>PAPA test: Vaš ključni saveznik u očuvanju zdravlja</h2>
                <p>PAPA test (Papanikolau test) je jednostavna, bezbolna i brza dijagnostička procedura koja služi za rano otkrivanje premalignih i malignih promena na grliću materice. Ove promene su najčešće izazvane Humanim Papiloma Virusom (HPV). Redovnim obavljanjem ovog testa, promene se mogu otkriti u najranijoj fazi, kada su potpuno izlečive.</p>
                <h3>Kako se izvodi?</h3>
                <p>Tokom redovnog ginekološkog pregleda, lekar specijalnim štapićem i četkicom uzima bris sa površine i iz kanala grlića materice. Uzorak se zatim šalje u citološku laboratoriju gde se analizira pod mikroskopom.</p>
                <h3>Kada i koliko često raditi PAPA test?</h3>
                <ul>
                    <li>Prvi PAPA test treba uraditi najkasnije tri godine nakon prvog seksualnog odnosa, a ne kasnije od 21. godine života.</li>
                    <li>Preporučuje se da se test radi jednom godišnje.</li>
                    <li>Nakon tri uzastopna uredna nalaza, ginekolog može preporučiti ređe kontrole (na 2-3 godine), u zavisnosti od individualnih faktora rizika.</li>
                </ul>
                <h3>Tumačenje rezultata</h3>
                <p>Rezultati se klasifikuju po Bethesda sistemu i mogu biti uredni, atipični ili ukazivati na lezije niskog ili visokog stepena. Vaš ginekolog će vam detaljno objasniti nalaz i preporučiti dalje korake ako su potrebni, što najčešće uključuje kolposkopiju i eventualnu biopsiju.</p>
                <p><strong>Ne zaboravite:</strong> Rak grlića materice je bolest koja se može sprečiti. Redovni PAPA testovi su najbolji način da zaštitite svoje reproduktivno zdravlje.</p>
            `,
                en: `
                <h2>The PAP Test: Your Key Ally in Health Preservation</h2>
                <p>The PAP test (Papanicolaou test) is a simple, painless, and quick diagnostic procedure used for the early detection of precancerous and cancerous changes on the cervix. These changes are most often caused by the Human Papillomavirus (HPV). By performing this test regularly, changes can be detected at the earliest stage when they are completely curable.</p>
                <h3>How is it performed?</h3>
                <p>During a routine gynecological exam, the doctor uses a special spatula and brush to take a smear from the surface and canal of the cervix. The sample is then sent to a cytology laboratory where it is analyzed under a microscope.</p>
                <h3>When and how often should you do a PAP test?</h3>
                <ul>
                    <li>The first PAP test should be done no later than three years after the first sexual intercourse, and no later than the age of 21.</li>
                    <li>It is recommended to have the test done once a year.</li>
                    <li>After three consecutive normal findings, the gynecologist may recommend less frequent check-ups (every 2-3 years), depending on individual risk factors.</li>
                </ul>
                <h3>Interpreting the results</h3>
                <p>The results are classified according to the Bethesda system and can be normal, atypical, or indicate low-grade or high-grade lesions. Your gynecologist will explain the findings in detail and recommend further steps if necessary, which most often include colposcopy and a possible biopsy.</p>
                <p><strong>Do not forget:</strong> Cervical cancer is a preventable disease. Regular PAP tests are the best way to protect your reproductive health.</p>
            `,
                se: `
                <h2>ПАПА тест: Ваш кључни савезник у очувању здравља</h2>
                <p>ПАПА тест (Папаниколау тест) је једноставна, безболна и брза дијагностичка процедура која служи за рано откривање премалигних и малигних промена на грлићу материце. Ове промене су најчешће изазване Хуманим Папилома Вирусом (ХПВ). Редовним обављањем овог теста, промене се могу открити у најранијој фази, када су потпуно излечиве.</p>
                <h3>Како се изводи?</h3>
                <p>Током редовног гинеколошког прегледа, лекар специјалним штапићем и четкицом узима брис са површине и из канала грлића материце. Узорак се затим шаље у цитолошку лабораторију где се анализира под микроскопом.</p>
                <h3>Када и колико често радити ПАПА тест?</h3>
                <ul>
                    <li>Први ПАПА тест треба урадити најкасније три године након првог сексуалног односа, а не касније од 21. године живота.</li>
                    <li>Препоручује се да се тест ради једном годишње.</li>
                    <li>Након три узастопна уредна налаза, гинеколог може препоручити ређе контроле (на 2-3 године), у зависности од индивидуалних фактора ризика.</li>
                </ul>
                <h3>Тумачење резултата</h3>
                <p>Резултати се класификују по Bethesda систему и могу бити уредни, атипични или указивати на лезије ниског или високог степена. Ваш гинеколог ће вам детаљно објаснити налаз и препоручити даље кораке ако су потребни, што најчешће укључује колпоскопију и евентуалну биопсију.</p>
                <p><strong>Не заборавите:</strong> Рак грлића материце је болест која се може спречити. Редовни ПАПА тестови су најбољи начин да заштитите своје репродуктивно здравље.</p>
            `,
                ru: `
                <h2>ПАП-тест: Ваш ключевой союзник в сохранении здоровья</h2>
                <p>ПАП-тест (тест Папаниколау) — это простая, безболезненная и быстрая диагностическая процедура, которая служит для раннего выявления предраковых и раковых изменений на шейке матки. Эти изменения чаще всего вызываются вирусом папилломы человека (ВПЧ). При регулярном проведении этого теста изменения можно обнаружить на самой ранней стадии, когда они полностью излечимы.</p>
                <h3>Как он проводится?</h3>
                <p>Во время обычного гинекологического осмотра врач с помощью специального шпателя и щеточки берет мазок с поверхности и из канала шейки матки. Затем образец отправляется в цитологическую лабораторию, где его анализируют под микроскопом.</p>
                <h3>Когда и как часто делать ПАП-тест?</h3>
                <ul>
                    <li>Первый ПАП-тест следует делать не позднее чем через три года после первого полового акта и не позднее 21 года.</li>
                    <li>Рекомендуется проходить тест раз в год.</li>
                    <li>После трех последовательных нормальных результатов гинеколог может порекомендовать более редкие осмотры (каждые 2-3 года), в зависимости от индивидуальных факторов риска.</li>
                </ul>
                <h3>Интерпретация результатов</h3>
                <p>Результаты классифицируются по системе Бетесда и могут быть нормальными, атипичными или указывать на поражения низкой или высокой степени. Ваш гинеколог подробно объяснит вам результаты и порекомендует дальнейшие шаги, если они необходимы, что чаще всего включает кольпоскопию и возможную биопсию.</p>
                <p><strong>Не забывайте:</strong> Рак шейки матки — это заболевание, которое можно предотвратить. Регулярные ПАП-тесты — лучший способ защитить ваше репродуктивное здоровье.</p>
            `
            },
            image: "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fusluga-ginekoloske-operacije.png?alt=media&token=2b169b0b-b0a3-4a1d-bed2-d461843d00be",
            author: {
                "sr": "Ginekološka ordinacija Palmotićeva",
                en: "Palmotićeva Gynecology Clinic",
                se: "Гинеколошка ординација Палмотићева",
                ru: "Гинекологическая клиника «Палмотичева»"
            },
            date: "2024-09-12T10:00:00Z"
        },
        {
            slug: 'histeroskopija',
            title: {
                "sr": "Histeroskopija",
                en: "Hysteroscopy",
                se: "Хистероскопија",
                ru: "Гистероскопия"
            },
            summary: {
                "sr": "Histeroskopija je 'zlatni standard' u dijagnostici i lečenju promena u materici. Saznajte sve o ovoj minimalno invazivnoj proceduri.",
                en: "Hysteroscopy is the 'gold standard' in the diagnosis and treatment of uterine changes. Learn all about this minimally invasive procedure.",
                se: "Хистероскопија је 'златни стандард' у дијагностици и лечењу промена у материци. Сазнајте све о овој минимално инвазивној процедури.",
                ru: "Гистероскопия — «золотой стандарт» в диагностике и лечении изменений в матке. Узнайте все об этой минимально инвазивной процедуре."
            },
            content: {
                "sr": `
                <h2>Histeroskopija: Zlatni Standard za Zdravlje Materice</h2>
                <p>Histeroskopija je minimalno invazivna i kratkotrajna procedura koja predstavlja „zlatni standard“ u dijagnostici i lečenju promena u šupljini materice. Ova metoda omogućava ginekologu da izvrši inspekciju unutrašnjosti materice pomoću tankog endoskopskog instrumenta sa mikro kamerom, poznatog kao histeroskop, kako bi dijagnostikovao i izlečio uzroke poremećaja i bolesti materice. Ginekološka ordinacija Palmotićeva je opremljena modernim histeroskopom marke Karl Storz, što omogućava izvođenje dijagnostičke i operativne histeroskopije uz minimalno proširenje grlića materice.</p>
                <h3>Svrha i Prednosti Histeroskopije</h3>
                <p>Histeroskopija se koristi kako u dijagnostičke, tako i u terapijske svrhe. Značajno povećava dijagnostičke mogućnosti kod bolesti materice i omogućava odabir najefikasnijeg metoda lečenja (konzervativnog ili hirurškog). Takođe, pruža kontrolu nad efektivnošću terapije i omogućava izvođenje operativnih manipulacija pod vizuelnom kontrolom, što značajno povećava bezbednost i smanjuje broj komplikacija.</p>
                <h3>Bolesti i Stanja koja se Leče Histeroskopijom</h3>
                <p>Operativna histeroskopija omogućava lekaru da pažljivo ukloni uzroke bolesti materice. To uključuje:</p>
                <ul>
                    <li><strong>Polipektomiju</strong> – uklanjanje polipa endometrijuma, koji su najčešće benigne promene na sluzokoži materice. Kod mlađih žena, polipi mogu predstavljati prepreku za začeće, dok kod starijih mogu uzrokovati krvarenje ili malignu alteraciju. Dr Đorđe Petković uklanja polipe endoskopskim makazicama i grasperom pod direktnom vizualizacijom.</li>
                    <li>Uklanjanje <strong>priraslica (sinehija)</strong> i <strong>pregrada</strong> u materici, koje mogu otežavati trudnoću.</li>
                    <li>Uklanjanje nekih <strong>submukoznih mioma</strong> uz pomoć dodatnog instrumenta resektoskopa.</li>
                    <li>Uklanjanje <strong>spirale (IUD)</strong> koja je urasla u miometrijum.</li>
                    <li><strong>Ciljanu biopsiju endometrijuma</strong> radi histopatološke analize, što je važno u pripremi za vantelesnu oplodnju (VTO) i u slučajevima sumnje na premaligne i maligne promene materice.</li>
                </ul>
                <p>Histeroskopija može pomoći i u sprečavanju prelaska benignih promena u maligne, te izbegavanju kiretaže ciljanim uklanjanjem polipa ili uzimanjem biopsije bez traumiranja cele unutrašnjosti materice. Ova metoda takođe može pomoći u dijagnostici i eliminisanju uzroka neplodnosti, bolova u maloj karlici i nepravilnog menstrualnog ciklusa.</p>
                <h3>Priprema i Oporavak</h3>
                <p>Priprema za histeroskopiju je jednostavna: pacijentkinja treba da se uzdrži od jela i pića (uključujući vodu) najmanje šest sati pre intervencije. Neophodan je i uredan nalaz vaginalnog i cervikalnog brisa, a lekar može zatražiti i briseve na hlamidiju, mikoplazmu i ureaplazmu. Preporučuje se da se histeroskopska intervencija uradi u prvoj fazi ciklusa (do 10. dana menstruacije). Sama procedura, dijagnostička ili operativna, traje od pola sata do dva sata, uključujući pripremu i oporavak. Oporavak je kratak, jer se histeroskopija radi ambulantno, bez zadržavanja u ordinaciji nakon intervencije. Nakon prestanka dejstva anestezije (koja može izazvati ošamućenost, pospanost ili blagu vrtoglavicu), mogu se osetiti grčevi u donjem delu stomaka. Većina pacijentkinja može se vratiti uobičajenim aktivnostima već sledećeg dana. Cenu histeroskopije možete pogledati u cenovniku, a moguće je i zakazivanje termina. Ordinacija nudi i "Histeroskopija popust".</p>
                <p>Ginekološka ordinacija Palmotićeva, moderna klinika u Beogradu, već 25 godina posvećena je zaštiti ženskog zdravlja, nudeći širok spektar usluga ženama svih dobi. Histeroskopija se ističe kao jedna od ključnih usluga, a Dr Đorđe Petković, specijalista ginekologije i akušerstva, posebno se specijalizovao u oblasti endoskopske i operativne ginekologije, uključujući laparoskopiju, histeroskopiju i histeroresektoskopiju.</p>
            `,
                en: `
                <h2>Hysteroscopy: The Gold Standard for Uterine Health</h2>
                <p>Hysteroscopy is a minimally invasive and short procedure that represents the "gold standard" in the diagnosis and treatment of changes in the uterine cavity. This method allows the gynecologist to inspect the inside of the uterus using a thin endoscopic instrument with a micro-camera, known as a hysteroscope, to diagnose and treat the causes of uterine disorders and diseases. The Palmotićeva Gynecology Clinic is equipped with a modern Karl Storz hysteroscope, which allows for diagnostic and operative hysteroscopy with minimal cervical dilation.</p>
                <h3>Purpose and Advantages of Hysteroscopy</h3>
                <p>Hysteroscopy is used for both diagnostic and therapeutic purposes. It significantly increases diagnostic capabilities for uterine diseases and allows for the selection of the most effective treatment method (conservative or surgical). It also provides control over the effectiveness of therapy and enables the performance of operative manipulations under visual control, which significantly increases safety and reduces the number of complications.</p>
                <h3>Diseases and Conditions Treated with Hysteroscopy</h3>
                <p>Operative hysteroscopy allows the doctor to carefully remove the causes of uterine disease. This includes:</p>
                <ul>
                    <li><strong>Polypectomy</strong> – removal of endometrial polyps, which are most often benign changes on the uterine lining. In younger women, polyps can be an obstacle to conception, while in older women, they can cause bleeding or malignant alteration. Dr. Đorđe Petković removes polyps with endoscopic scissors and graspers under direct visualization.</li>
                    <li>Removal of <strong>adhesions (synechiae)</strong> and <strong>septa</strong> in the uterus, which can complicate pregnancy.</li>
                    <li>Removal of some <strong>submucosal fibroids</strong> with the help of an additional instrument, the resectoscope.</li>
                    <li>Removal of an <strong>IUD</strong> that has grown into the myometrium.</li>
                    <li><strong>Targeted endometrial biopsy</strong> for histopathological analysis, which is important in preparation for in vitro fertilization (IVF) and in cases of suspected premalignant and malignant uterine changes.</li>
                </ul>
                <p>Hysteroscopy can also help prevent the transition of benign changes to malignant ones, and avoid curettage by targeted removal of polyps or taking a biopsy without traumatizing the entire inside of the uterus. This method can also help in diagnosing and eliminating the causes of infertility, pelvic pain, and irregular menstrual cycles.</p>
                <h3>Preparation and Recovery</h3>
                <p>Preparation for hysteroscopy is simple: the patient should refrain from eating and drinking (including water) for at least six hours before the intervention. A normal vaginal and cervical swab result is also necessary, and the doctor may request swabs for chlamydia, mycoplasma, and ureaplasma. It is recommended that the hysteroscopic intervention be performed in the first phase of the cycle (up to the 10th day of menstruation). The procedure itself, whether diagnostic or operative, lasts from half an hour to two hours, including preparation and recovery. Recovery is short, as hysteroscopy is performed on an outpatient basis, without being kept in the clinic after the intervention. After the anesthesia wears off (which can cause dizziness, drowsiness, or mild vertigo), cramps may be felt in the lower abdomen. Most patients can return to their usual activities the very next day. You can view the price of hysteroscopy in the price list, and it is also possible to schedule an appointment. The clinic also offers a "Hysteroscopy discount".</p>
                <p>The Palmotićeva Gynecology Clinic, a modern clinic in Belgrade, has been dedicated to protecting women's health for 25 years, offering a wide range of services to women of all ages. Hysteroscopy stands out as one of the key services, and Dr. Đorđe Petković, a specialist in gynecology and obstetrics, has specially specialized in the field of endoscopic and operative gynecology, including laparoscopy, hysteroscopy, and hysteroresectoscopy.</p>
            `,
                se: `
                <h2>Хистероскопија: Златни Стандард за Здравље Материце</h2>
                <p>Хистероскопија је минимално инвазивна и краткотрајна процедура која представља „златни стандард“ у дијагностици и лечењу промена у шупљини материце. Ова метода омогућава гинекологу да изврши инспекцију унутрашњости материце помоћу танког ендоскопског инструмента са микро камером, познатог као хистероскоп, како би дијагностиковао и излечио узроке поремећаја и болести материце. Гинеколошка ординација Палмотићева је опремљена модерним хистероскопом марке Карл Сторз, што омогућава извођење дијагностичке и оперативне хистероскопије уз минимално проширење грлића материце.</p>
                <h3>Сврха и Предности Хистероскопије</h3>
                <p>Хистероскопија се користи како у дијагностичке, тако и у терапијске сврхе. Значајно повећава дијагностичке могућности код болести материце и омогућава одабир најефикаснијег метода лечења (конзервативног или хируршког). Такође, пружа контролу над ефективношћу терапије и омогућава извођење оперативних манипулација под визуелном контролом, што значајно повећава безбедност и смањује број компликација.</p>
                <h3>Болести и Стања која се Лече Хистероскопијом</h3>
                <p>Оперативна хистероскопија омогућава лекару да пажљиво уклони узроке болести материце. То укључује:</p>
                <ul>
                    <li><strong>Полипектомију</strong> – уклањање полипа ендометријума, који су најчешће бенигне промене на слузокожи материце. Код млађих жена, полипи могу представљати препреку за зачеће, док код старијих могу узроковати крварење или малигну алтерацију. Др Ђорђе Петковић уклања полипе ендоскопским маказицама и граспером под директном визуализацијом.</li>
                    <li>Уклањање <strong>прираслица (синехија)</strong> и <strong>преграда</strong> у материци, које могу отежавати трудноћу.</li>
                    <li>Уклањање неких <strong>субмукозних миома</strong> уз помоћ додатног инструмента ресектоскопа.</li>
                    <li>Уклањање <strong>спирале (ИУД)</strong> која је урасла у миометријум.</li>
                    <li><strong>Циљану биопсију ендометријума</strong> ради хистопатолошке анализе, што је важно у припреми за вантелесну оплодњу (ВТО) и у случајевима сумње на премалигне и малигне промене материце.</li>
                </ul>
                <p>Хистероскопија може помоћи и у спречавању преласка бенигних промена у малигне, те избегавању киретаже циљаним уклањањем полипа или узимањем биопсије без траумирања целе унутрашњости материце. Ова метода такође може помоћи у дијагностици и елиминисању узрока неплодности, болова у малој карлици и неправилног менструалног циклуса.</p>
                <h3>Припрема и Опоравак</h3>
                <p>Припрема за хистероскопију је једноставна: пацијенткиња треба да се уздржи од јела и пића (укључујући воду) најмање шест сати пре интервенције. Неопходан је и уредан налаз вагиналног и цервикалног бриса, а лекар може затражити и брисеве на хламидију, микоплазму и уреаплазму. Препоручује се да се хистероскопска интервенција уради у првој фази циклуса (до 10. дана менструације). Сама процедура, дијагностичка или оперативна, траје од пола сата до два сата, укључујући припрему и опоравак. Опоравак је кратак, јер се хистероскопија ради амбулантно, без задржавања у ординацији након интервенције. Након престанка дејства анестезије (која може изазвати ошамућеност, поспаност или благу вртоглавицу), могу се осетити грчеви у доњем делу стомака. Већина пацијенткиња може се вратити уобичајеним активностима већ следећег дана. Цену хистероскопије можете погледати у ценовнику, а могуће је и заказивање термина. Ординација нуди и "Хистероскопија попуст".</p>
                <p>Гинеколошка ординација Палмотићева, модерна клиника у Београду, већ 25 година посвећена је заштити женског здравља, нудећи широк спектар услуга женама свих доби. Хистероскопија се истиче као једна од кључних услуга, а Др Ђорђе Петковић, специјалиста гинекологије и акушерства, посебно се специјализовао у области ендоскопске и оперативне гинекологије, укључујући лапароскопију, хистероскопију и хистероресектоскопију.</p>
            `,
                ru: `
                <h2>Гистероскопия: Золотой Стандарт для Здоровья Матки</h2>
                <p>Гистероскопия — это минимально инвазивная и кратковременная процедура, которая является «золотым стандартом» в диагностике и лечении изменений в полости матки. Этот метод позволяет гинекологу осмотреть внутреннюю часть матки с помощью тонкого эндоскопического инструмента с микрокамерой, известного как гистероскоп, для диагностики и лечения причин нарушений и заболеваний матки. Гинекологическая клиника «Палмотичева» оснащена современным гистероскопом марки Karl Storz, что позволяет проводить диагностическую и оперативную гистероскопию с минимальным расширением шейки матки.</p>
                <h3>Цель и Преимущества Гистероскопии</h3>
                <p>Гистероскопия используется как в диагностических, так и в терапевтических целях. Она значительно расширяет диагностические возможности при заболеваниях матки и позволяет выбрать наиболее эффективный метод лечения (консервативный или хирургический). Также она обеспечивает контроль за эффективностью терапии и позволяет выполнять оперативные вмешательства под визуальным контролем, что значительно повышает безопасность и снижает количество осложнений.</p>
                <h3>Заболевания и Состояния, Лечимые с Помощью Гистероскопии</h3>
                <p>Оперативная гистероскопия позволяет врачу аккуратно устранить причины заболеваний матки. К ним относятся:</p>
                <ul>
                    <li><strong>Полипэктомия</strong> – удаление полипов эндометрия, которые чаще всего являются доброкачественными образованиями на слизистой оболочке матки. У молодых женщин полипы могут препятствовать зачатию, а у пожилых — вызывать кровотечение или злокачественное перерождение. Доктор Джордже Петкович удаляет полипы с помощью эндоскопических ножниц и захвата под прямым визуальным контролем.</li>
                    <li>Удаление <strong>спаек (синехий)</strong> и <strong>перегородок</strong> в матке, которые могут затруднять беременность.</li>
                    <li>Удаление некоторых <strong>субмукозных миом</strong> с помощью дополнительного инструмента — резектоскопа.</li>
                    <li>Удаление <strong>ВМС (IUD)</strong>, вросшей в миометрий.</li>
                    <li><strong>Прицельная биопсия эндометрия</strong> для гистопатологического анализа, что важно при подготовке к экстракорпоральному оплодотворению (ЭКО) и в случаях подозрения на предраковые и злокачественные изменения матки.</li>
                </ul>
                <p>Гистероскопия также может помочь предотвратить переход доброкачественных изменений в злокачественные и избежать выскабливания путем прицельного удаления полипов или взятия биопсии без травмирования всей внутренней поверхности матки. Этот метод также может помочь в диагностике и устранении причин бесплодия, болей в малом тазу и нерегулярного менструального цикла.</p>
                <h3>Подготовка и Восстановление</h3>
                <p>Подготовка к гистероскопии проста: пациентке следует воздерживаться от еды и питья (включая воду) не менее шести часов до вмешательства. Также необходим нормальный результат мазков из влагалища и шейки матки, а врач может запросить и мазки на хламидии, микоплазму и уреаплазму. Рекомендуется проводить гистероскопическое вмешательство в первой фазе цикла (до 10-го дня менструации). Сама процедура, диагностическая или оперативная, длится от получаса до двух часов, включая подготовку и восстановление. Восстановление короткое, так как гистероскопия проводится амбулаторно, без пребывания в клинике после вмешательства. После прекращения действия анестезии (которая может вызвать головокружение, сонливость или легкую дурноту), могут ощущаться спазмы в нижней части живота. Большинство пациенток могут вернуться к обычной деятельности уже на следующий день. Цену на гистероскопию можно посмотреть в прайс-листе, также возможна запись на прием. Клиника также предлагает "Скидку на гистероскопию".</p>
                <p>Гинекологическая клиника «Палмотичева», современная клиника в Белграде, уже 25 лет посвящена защите женского здоровья, предлагая широкий спектр услуг женщинам всех возрастов. Гистероскопия выделяется как одна из ключевых услуг, а доктор Джордже Петкович, специалист по гинекологии и акушерству, особо специализируется в области эндоскопической и оперативной гинекологии, включая лапароскопию, гистероскопию и гистерорезектоскопию.</p>
            `
            },
            image: "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fusluga-histeroskopija.png?alt=media&token=c191316b-a255-4654-bd65-8b89e32f50c0",
            author: {
                "sr": "Dr Đorđe Petković",
                en: "Dr. Đorđe Petković",
                se: "Др Ђорђе Петковић",
                ru: "Д-р Джордже Петкович"
            },
            date: "2024-09-13T10:00:00Z"
        },
        {
            slug: 'bezbedan-prekid-trudnoce',
            title: {
                "sr": "Bezbedni Prekid Trudnoće (Abortus)",
                en: "Safe Termination of Pregnancy (Abortion)",
                se: "Безбедни Прекид Трудноће (Абортус)",
                ru: "Безопасное Прерывание Беременности (Аборт)"
            },
            summary: {
                "sr": "Sve što treba da znate o medicinskom prekidu trudnoće: do kada se može uraditi, kako se izvodi, da li je bezbedno i kakav je oporavak.",
                en: "Everything you need to know about medical termination of pregnancy: until when it can be performed, how it is done, whether it is safe, and what recovery is like.",
                se: "Све што треба да знате о медицинском прекиду трудноће: до када се може урадити, како се изводи, да ли је безбедно и какав је опоравак.",
                ru: "Все, что вам нужно знать о медикаментозном прерывании беременности: до какого срока его можно сделать, как оно проводится, безопасно ли это и каково восстановление."
            },
            content: {
                "sr": `
                <h2>Razumevanje Procedure</h2>
                <p>Abortus, ili medicinski poznat kao prekid trudnoće, je postupak prekida neželjene ili medicinski neophodne trudnoće.</p>
                
                <h3>Do kada je moguće uraditi prekid trudnoće?</h3>
                <p>Do <strong>10. nedelje trudnoće</strong>: Na zahtev trudnice starije od 16 godina, bez dodatnih obrazloženja. Prekid trudnoće starije od deset nedelja može se izvršiti samo na osnovu medicinskih indikacija, moralno-правних разлога, kao i saznanja o mogućnosti rođenja deteta sa teškim telesnim ili duševnim nedostacima u specijalizovanoj klinici.</p>

                <h3>Mogu li posle abortusa ponovo ostati trudna?</h3>
                <p>Rani abortus ne povećava šanse za spontanim pobačajem, vanmateričnom trudnoćom ili sterilitetom u budućnosti, osim ukoliko ne dođe do infekcije što je retko. Mogućnost komplikacija nakon veštačkog prekida trudnoće do 10 nedelja vrlo je mala. Abortus je bezbedan medicinski postupak, posebno ako se izvodi u ranom stadijumu trudnoće (do 10. nedelje).</p>

                <h3>Kako se abortus izvodi?</h3>
                <p>Intervencija se izvodi u opštoj kratkotrajnoj anesteziji, u klinici se ostaje oko sat vremena. U Ginekološkoj ordinaciji Palmotićeva prekid trudnoće se radi <strong>Karmanovim kanilama</strong> (tankim savitljivim plastičnim kanilama) kao najsigurnijom metodom hirurškog prekida trudnoće. Sama procedura traje oko 10 minuta. Isti dan se možete vratiti svojim normalnim svakodnevnim aktivnostima. Nakon 7-12 dana se dolazi na redovnu kontrolu koja je u ordinaciji Palmotićeva besplatna.</p>

                <h3>Da li partner ili roditelji moraju da znaju?</h3>
                <p>Ne, oni ne moraju da znaju (ukoliko trudnica ima više od 16 godina). Prema važećem Zakonu o postupku prekida trudnoće, abortus se u Srbiji dozvoljava isključivo na zahtev trudne žene. U slučaju da je trudnica mlađa od 16 godina potrebna je pismena saglasnost roditelja. Klinika u kojoj se radi prekid trudnoće obavezna je da čuva poverljivost podataka.</p>

                <h2>Priprema za prekid trudnoće</h2>
                <ul>
                    <li><strong>Ultrazvučni pregled:</strong> Pre intervencije obavezno se radi ginekološki ultrazvuk kako bi se potvrdila trudnoća i utvrdila njena starost.</li>
                    <li><strong>Krvna grupa i Rh faktor:</strong> Sa sobom treba doneti potvrdu o vašoj krvnoj grupi i Rh faktoru. Kod svih žena koje su RhD (-) potrebno je najkasnije do 72 sata nakon intervencije uraditi zaštitu Anti-D imunoglobulinom.</li>
                    <li>Pacijentkinja ne sme da uzima hranu 6 sati pre procedure, a vodu i ostale tečnosti 4 sata pre uvođenja u anesteziju.</li>
                    <li>Pacijentkinje na terapiji lekovima koji utiču na razređivanje krvi (Aspirin, Cardiopirin, Farin, Sintrom, Sincum, Pradaxa itd) bi trebalo da prestanu da ih uzimaju 2-3 dana pre procedure, kako bi se smanjio rizik od krvarenja.</li>
                </ul>
            `,
                en: `
                <h2>Understanding the Procedure</h2>
                <p>Abortion, medically known as termination of pregnancy, is a procedure to end an unwanted or medically necessary pregnancy.</p>

                <h3>Until when can a termination of pregnancy be performed?</h3>
                <p>Up to the <strong>10th week of pregnancy</strong>: At the request of a pregnant woman over 16 years of age, without additional explanations. Termination of a pregnancy older than ten weeks can only be performed based on medical indications, moral-legal reasons, as well as knowledge about the possibility of giving birth to a child with severe physical or mental disabilities in a specialized clinic.</p>

                <h3>Can I get pregnant again after an abortion?</h3>
                <p>Early abortion does not increase the chances of spontaneous miscarriage, ectopic pregnancy, or future sterility, unless an infection occurs, which is rare. The possibility of complications after an artificial termination of pregnancy up to 10 weeks is very small. Abortion is a safe medical procedure, especially if performed in the early stages of pregnancy (up to the 10th week).</p>

                <h3>How is an abortion performed?</h3>
                <p>The intervention is performed under short-term general anesthesia, with a hospital stay of about one hour. At the Palmotićeva Gynecology Clinic, termination of pregnancy is done using <strong>Karman cannulas</strong> (thin, flexible plastic cannulas) as the safest method of surgical termination. The procedure itself lasts about 10 minutes. You can return to your normal daily activities the same day. A follow-up check-up is scheduled for 7-12 days later, which is free of charge at the Palmotićeva clinic.</p>

                <h3>Do my partner or parents have to know?</h3>
                <p>No, they do not have to know (if the pregnant woman is over 16 years old). According to the current Law on the Procedure for Termination of Pregnancy, abortion in Serbia is permitted exclusively at the request of the pregnant woman. In the case that the pregnant woman is under 16 years old, written consent from the parents is required. The clinic where the termination of pregnancy is performed is obliged to maintain the confidentiality of the data.</p>

                <h2>Preparation for Termination of Pregnancy</h2>
                <ul>
                    <li><strong>Ultrasound examination:</strong> Before the intervention, a gynecological ultrasound is mandatory to confirm the pregnancy and determine its age.</li>
                    <li><strong>Blood type and Rh factor:</strong> You should bring a certificate of your blood type and Rh factor. For all women who are RhD (-), it is necessary to receive Anti-D immunoglobulin protection no later than 72 hours after the intervention.</li>
                    <li>The patient must not take food for 6 hours before the procedure, and water and other liquids for 4 hours before the introduction of anesthesia.</li>
                    <li>Patients on medication that thins the blood (Aspirin, Cardiopirin, Farin, Sintrom, Sincum, Pradaxa, etc.) should stop taking them 2-3 days before the procedure to reduce the risk of bleeding.</li>
                </ul>
            `,
                se: `
                <h2>Разумевање Процедуре</h2>
                <p>Абортус, или медицински познат као прекид трудноће, је поступак прекида нежељене или медицински неопходне трудноће.</p>
                
                <h3>До када је могуће урадити прекид трудноће?</h3>
                <p>До <strong>10. недеље трудноће</strong>: На захтев труднице старије од 16 година, без додатних образложења. Прекид трудноће старије од десет недеља може се извршити само на основу медицинских индикација, морално-правних разлога, као и сазнања о могућности рођења детета са тешким телесним или душевним недостацима у специјализованој клиници.</p>

                <h3>Могу ли после абортуса поново остати трудна?</h3>
                <p>Рани абортус не повећава шансе за спонтаним побачајем, ванматеричном трудноћом или стерилитетом у будућности, осим уколико не дође до инфекције што је ретко. Могућност компликација након вештачког прекида трудноће до 10 недеља врло је мала. Абортус је безбедан медицински поступак, посебно ако се изводи у раном стадијуму трудноће (до 10. недеље).</p>

                <h3>Како се абортус изводи?</h3>
                <p>Интервенција се изводи у општој краткотрајној анестезији, у клиници се остаје око сат времена. У Гинеколошкој ординацији Палмотићева прекид трудноће се ради <strong>Кармановим канилама</strong> (танким савитљивим пластичним канилама) као најсигурнијом методом хируршког прекида трудноће. Сама процедура траје око 10 минута. Исти дан се можете вратити својим нормалним свакодневним активносима. Након 7-12 дана се долази на редовну контролу која је у ординацији Палмотићева бесплатна.</p>

                <h3>Да ли партнер или родитељи морају да знају?</h3>
                <p>Не, они не морају да знају (уколико трудница има више од 16 година). Према важећем Закону о поступку прекида трудноће, абортус се у Србији дозвољава искључиво на захтев трудне жене. У случају да је трудница млађа од 16 година потребна је писмена сагласност родитеља. Клиника у којој се ради прекид трудноће обавезна је да чува поверљивост података.</p>

                <h2>Припрема за прекид трудноће</h2>
                <ul>
                    <li><strong>Ултразвучни преглед:</strong> Пре интервенције обавезно се ради гинеколошки ултразвук како би се потврдила трудноћа и утврдила њена старост.</li>
                    <li><strong>Крвна група и Рх фактор:</strong> Са собом треба донети потврду о вашој крвној групи и Рх фактору. Код свих жена које су РхД (-) потребно је најкасније до 72 сата након интервенције урадити заштиту Анти-Д имуноглобулином.</li>
                    <li>Пацијенткиња не сме да узима храну 6 сати пре процедуре, а воду и остале течности 4 сата пре увођења у анестезију.</li>
                    <li>Пацијенткиње на терапији лековима који утичу на разређивање крви (Аспирин, Цардиопирин, Фарин, Синтром, Синцум, Прадаxа итд) би требало да престану да их узимају 2-3 дана пре процедуре, како би се смањио ризик од крварења.</li>
                </ul>
            `,
                ru: `
                <h2>Понимание Процедуры</h2>
                <p>Аборт, или медицинское прерывание беременности, — это процедура прекращения нежелательной или необходимой по медицинским показаниям беременности.</p>

                <h3>До какого срока можно сделать прерывание беременности?</h3>
                <p>До <strong>10-й недели беременности</strong>: По желанию беременной женщины старше 16 лет, без дополнительных объяснений. Прерывание беременности сроком более десяти недель может быть выполнено только по медицинским показаниям, морально-правовым причинам, а также при выявлении возможности рождения ребенка с тяжелыми физическими или психическими недостатками в специализированной клинике.</p>

                <h3>Смогу ли я забеременеть снова после аборта?</h3>
                <p>Ранний аборт не увеличивает шансы на самопроизвольный выкидыш, внематочную беременность или будущее бесплодие, за исключением случаев инфекции, что случается редко. Вероятность осложнений после искусственного прерывания беременности до 10 недель очень мала. Аборт является безопасной медицинской процедурой, особенно если он проводится на ранних сроках беременности (до 10-й недели).</p>

                <h3>Как проводится аборт?</h3>
                <p>Вмешательство проводится под кратковременной общей анестезией, пребывание в клинике составляет около часа. В гинекологической клинике «Палмотичева» прерывание беременности выполняется с использованием <strong>канюль Кармана</strong> (тонких гибких пластиковых канюль) как самого безопасного метода хирургического прерывания. Сама процедура длится около 10 минут. В тот же день вы можете вернуться к своей обычной повседневной деятельности. Через 7-12 дней необходимо прийти на плановый осмотр, который в клинике «Палмотичева» является бесплатным.</p>

                <h3>Должны ли знать партнер или родители?</h3>
                <p>Нет, они не обязаны знать (если беременной женщине больше 16 лет). Согласно действующему Закону о процедуре прерывания беременности, в Сербии аборт разрешается исключительно по желанию беременной женщины. В случае, если беременной менее 16 лет, требуется письменное согласие родителей. Клиника, в которой проводится прерывание беременности, обязана сохранять конфиденциальность данных.</p>

                <h2>Подготовка к прерыванию беременности</h2>
                <ul>
                    <li><strong>Ультразвуковое исследование:</strong> Перед вмешательством обязательно проводится гинекологическое УЗИ для подтверждения беременности и определения ее срока.</li>
                    <li><strong>Группа крови и резус-фактор:</strong> С собой необходимо принести справку о вашей группе крови и резус-факторе. Всем женщинам с RhD (-) необходимо в течение 72 часов после вмешательства ввести анти-D иммуноглобулин.</li>
                    <li>Пациентке нельзя принимать пищу за 6 часов до процедуры, а воду и другие жидкости — за 4 часа до введения в анестезию.</li>
                    <li>Пациенткам, принимающим препараты, разжижающие кровь (Аспирин, Кардиопирин, Фарин, Синтром, Синкум, Прадакса и др.), следует прекратить их прием за 2-3 дня до процедуры, чтобы снизить риск кровотечения.</li>
                </ul>
            `
            },
            image: "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fusluga-prekid-trudnoce.png?alt=media&token=b6c96360-ba3a-404f-8231-904c5482e118",
            author: {
                "sr": "Ginekološka ordinacija Palmotićeva",
                en: "Palmotićeva Gynecology Clinic",
                se: "Гинеколошка ординација Палмотићева",
                ru: "Гинекологическая клиника «Палмотичева»"
            },
            date: "2024-09-14T10:00:00Z"
        },
        {
            slug: 'labioplastika-smanjenje-malih-usana',
            title: {
                "sr": "Labioplastika (Smanjenje malih usana)",
                en: "Labiaplasty (Reduction of the labia minora)",
                se: "Лабиопластика (Смањење малих усана)",
                ru: "Лабиопластика (уменьшение малых половых губ)"
            },
            summary: {
                "sr": "Labioplastika je estetska ginekološka procedura koja rešava funkcionalne i estetske probleme. Saznajte sve o proceduri, oporavku i prednostima.",
                en: "Labiaplasty is an aesthetic gynecological procedure that solves functional and aesthetic problems. Learn all about the procedure, recovery, and benefits.",
                se: "Лабиопластика је естетска гинеколошка процедура која решава функционалне и естетске проблеме. Сазнајте све о процедури, опоравку и предностима.",
                ru: "Лабиопластика — это эстетическая гинекологическая процедура, которая решает функциональные и эстетические проблемы. Узнайте все о процедуре, восстановлении и преимуществах."
            },
            content: {
                "sr": `
                <h2>Šta je labioplastika?</h2>
                <p>Labioplastika je procedura estetske ginekologije koja podrazumeva hiruršku korekciju (smanjenje) malih usana (labia minora). Intervencija se najčešće izvodi iz estetskih, ali i funkcionalnih razloga, kao što su bol i iritacija prilikom nošenja uske odeće, bavljenja sportom ili tokom seksualnih odnosa.</p>
                
                <h3>Kada se preporučuje labioplastika?</h3>
                <p>Žene se najčešće odlučuju za labioplastiku zbog osećaja neprijatnosti ili nezadovoljstva izgledom svojih malih usana koje su veće od velikih (labia majora). Indikacije mogu biti:</p>
                <ul>
                    <li><strong>Estetske:</strong> Asimetrija ili hipertrofija (uvećanje) malih usana koje žena doživljava kao estetski problem.</li>
                    <li><strong>Funkcionalne:</strong> Fizička nelagodnost, bol pri trenju, problemi sa higijenom, smetnje tokom sportskih aktivnosti (vožnja bicikla, jahanje) ili seksualnih odnosa.</li>
                </ul>

                <h3>Kako izgleda procedura?</h3>
                <p>U Ginekološkoj ordinaciji Palmotićeva, labioplastiku izvodi <strong>dr Đorđe Petković</strong>, specijalista sa bogatim iskustvom u estetskoj ginekologiji. Procedura se obavlja u lokalnoj anesteziji ili kratkotrajnoj intravenskoj analgosedaciji, što je čini potpuno bezbolnom. Postoji više hirurških tehnika, a najčešće se koristi trim tehnika (edge excision) ili wedge resekcija, u zavisnosti od anatomije pacijentkinje.</p>
                <p>Koriste se resorptivni konci koji sami otpadaju, tako da nema potrebe za njihovim uklanjanjem. Intervencija traje u proseku <strong>30-60 minuta</strong>.</p>

                <h3>Oporavak nakon labioplastike</h3>
                <p>Oporavak je individualan, ali uglavnom brz. Pacijentkinja može da ide kući istog dana. U prvih nekoliko dana preporučuje se mirovanje i hladni oblozi kako bi se smanjio otok. Otok obično splasne u roku od <strong>7 do 10 dana</strong>.</p>
                <ul>
                    <li><strong>Bol:</strong> Minimalan i lako se kontroliše standardnim analgeticima.</li>
                    <li><strong>Higijena:</strong> Strogo se vodi računa o higijeni rane, uz tuširanje i korišćenje blagih antiseptičkih rastvora.</li>
                    <li><strong>Aktivnosti:</strong> Povratak na posao i lakše aktivnosti je moguć nakon par dana. Teže fizičke aktivnosti i seksualni odnosi se izbegavaju <strong>4-6 nedelja</strong>.</li>
                </ul>
                <p>Besplatne kontrole nakon intervencije su uključene u cenu i obavljaju se po dogovoru sa lekarom.</p>
                
                <h3>Koje su prednosti labioplastike?</h3>
                <p>Osim estetskog poboljšanja, labioplastika donosi značajno poboljšanje kvaliteta života. Pacijentkinje navode veće samopouzdanje, odsustvo bola i nelagodnosti, kao i poboljšanje seksualne funkcije. Zadovoljstvo pacijentkinja nakon ove procedure je izuzetno visoko.</p>
                
                <p>Cena procedure je 69.000 RSD i uključuje besplatnu preoperativnu konsultaciju, samu intervenciju i sve neophodne kontrole. Zakažite svoj termin za konsultaciju i saznajte da li je labioplastika pravo rešenje za vas.</p>
            `,
                en: `
                <h2>What is labiaplasty?</h2>
                <p>Labiaplasty is an aesthetic gynecology procedure that involves the surgical correction (reduction) of the labia minora. The intervention is most often performed for aesthetic, but also functional reasons, such as pain and irritation when wearing tight clothing, playing sports, or during sexual intercourse.</p>
                
                <h3>When is labiaplasty recommended?</h3>
                <p>Women most often opt for labiaplasty due to a feeling of discomfort or dissatisfaction with the appearance of their labia minora, which are larger than the labia majora. Indications can be:</p>
                <ul>
                    <li><strong>Aesthetic:</strong> Asymmetry or hypertrophy (enlargement) of the labia minora that the woman perceives as an aesthetic problem.</li>
                    <li><strong>Functional:</strong> Physical discomfort, pain from friction, hygiene problems, interference during sports activities (cycling, horse riding) or sexual intercourse.</li>
                </ul>

                <h3>What does the procedure look like?</h3>
                <p>At the Palmotićeva Gynecology Clinic, labiaplasty is performed by <strong>Dr. Đorđe Petković</strong>, a specialist with extensive experience in aesthetic gynecology. The procedure is performed under local anesthesia or short-term intravenous analgosedation, which makes it completely painless. There are several surgical techniques, and the most commonly used are the trim technique (edge excision) or wedge resection, depending on the patient's anatomy.</p>
                <p>Resorbable sutures are used, which fall out on their own, so there is no need to remove them. The intervention lasts an average of <strong>30-60 minutes</strong>.</p>

                <h3>Recovery after labiaplasty</h3>
                <p>Recovery is individual, but mostly quick. The patient can go home the same day. In the first few days, rest and cold compresses are recommended to reduce swelling. The swelling usually subsides within <strong>7 to 10 days</strong>.</p>
                <ul>
                    <li><strong>Pain:</strong> Minimal and easily controlled with standard analgesics.</li>
                    <li><strong>Hygiene:</strong> Strict attention is paid to wound hygiene, with showering and the use of mild antiseptic solutions.</li>
                    <li><strong>Activities:</strong> A return to work and lighter activities is possible after a few days. Strenuous physical activities and sexual intercourse are avoided for <strong>4-6 weeks</strong>.</li>
                </ul>
                <p>Free follow-up checks after the intervention are included in the price and are carried out in agreement with the doctor.</p>
                
                <h3>What are the benefits of labiaplasty?</h3>
                <p>In addition to aesthetic improvement, labiaplasty brings a significant improvement in quality of life. Patients report increased self-confidence, absence of pain and discomfort, as well as improved sexual function. Patient satisfaction after this procedure is extremely high.</p>
                
                <p>The price of the procedure is 69,000 RSD and includes a free preoperative consultation, the intervention itself, and all necessary follow-up checks. Schedule your consultation appointment and find out if labiaplasty is the right solution for you.</p>
            `,
                se: `
                <h2>Шта је лабиопластика?</h2>
                <p>Лабиопластика је процедура естетске гинекологије која подразумева хируршку корекцију (смањење) малих усана (labia minora). Интервенција се најчешће изводи из естетских, али и функционалних разлога, као што су бол и иритација приликом ношења уске одеће, бављења спортом или током сексуалних односа.</p>
                
                <h3>Када се препоручује лабиопластика?</h3>
                <p>Жене се најчешће одлучују за лабиопластику због осећаја непријатности или незадовољства изгледом својих малих усана које су веће од великих (labia majora). Индикације могу бити:</p>
                <ul>
                    <li><strong>Естетске:</strong> Асиметрија или хипертрофија (увећање) малих усана које жена доживљава као естетски проблем.</li>
                    <li><strong>Функционалне:</strong> Физичка нелагодност, бол при трењу, проблеми са хигијеном, сметње током спортских активности (вожња бицикла, јахање) или сексуалних односа.</li>
                </ul>

                <h3>Како изгледа процедура?</h3>
                <p>У Гинеколошкој ординацији Палмотићева, лабиопластику изводи <strong>др Ђорђе Петковић</strong>, специјалиста са богатим искуством у естетској гинекологији. Процедура се обавља у локалној анестезији или краткотрајној интравенској аналгоседацији, што је чини потпуно безболном. Постоји више хируршких техника, а најчешће се користи трим техника (edge excision) или wedge ресекција, у зависности од анатомије пацијенткиње.</p>
                <p>Користе се ресорптивни конци који сами отпадају, тако да нема потребе за њиховим уклањањем. Интервенција траје у просеку <strong>30-60 минута</strong>.</p>

                <h3>Опоравак након лабиопластике</h3>
                <p>Опоравак је индивидуалан, али углавном брз. Пацијенткиња може да иде кући истог дана. У првих неколико дана препоручује се мировање и хладни облози како би се смањио оток. Оток обично спласне у року од <strong>7 до 10 дана</strong>.</p>
                <ul>
                    <li><strong>Бол:</strong> Минималан и лако се контролише стандардним аналгетицима.</li>
                    <li><strong>Хигијена:</strong> Строго се води рачуна о хигијени ране, уз туширање и коришћење благих антисептичких раствора.</li>
                    <li><strong>Активности:</strong> Повратак на посао и лакше активности је могућ након пар дана. Теже физичке активности и сексуални односи се избегавају <strong>4-6 недеља</strong>.</li>
                </ul>
                <p>Бесплатне контроле након интервенције су укључене у цену и обављају се по договору са лекаром.</p>
                
                <h3>Које су предности лабиопластике?</h3>
                <p>Осим естетског побољшања, лабиопластика доноси значајно побољшање квалитета живота. Пацијенткиње наводе веће самопоуздање, одсуство бола и нелагодности, као и побољшање сексуалне функције. Задовољство пацијенткиња након ове процедуре је изузетно високо.</p>
                
                <p>Цена процедуре је 69.000 РСД и укључује бесплатну преоперативну консултацију, саму интервенцију и све неопходне контроле. Закажите свој термин за консултацију и сазнајте да ли је лабиопластика право решење за вас.</p>
            `,
                ru: `
                <h2>Что такое лабиопластика?</h2>
                <p>Лабиопластика — это процедура эстетической гинекологии, которая включает в себя хирургическую коррекцию (уменьшение) малых половых губ (labia minora). Вмешательство чаще всего проводится по эстетическим, а также по функциональным причинам, таким как боль и раздражение при ношении тесной одежды, занятиях спортом или во время полового акта.</p>
                
                <h3>Когда рекомендуется лабиопластика?</h3>
                <p>Женщины чаще всего решаются на лабиопластику из-за чувства дискомфорта или недовольства внешним видом своих малых половых губ, которые больше больших (labia majora). Показания могут быть:</p>
                <ul>
                    <li><strong>Эстетические:</strong> Асимметрия или гипертрофия (увеличение) малых половых губ, которые женщина воспринимает как эстетическую проблему.</li>
                    <li><strong>Функциональные:</strong> Физический дискомфорт, боль от трения, проблемы с гигиеной, помехи во время занятий спортом (езда на велосипеде, верховая езда) или половых актов.</li>
                </ul>

                <h3>Как выглядит процедура?</h3>
                <p>В гинекологической клинике «Палмотичева» лабиопластику проводит <strong>доктор Джордже Петкович</strong>, специалист с богатым опытом в области эстетической гинекологии. Процедура проводится под местной анестезией или кратковременной внутривенной анальгоседацией, что делает ее полностью безболезненной. Существует несколько хирургических техник, и чаще всего используется техника тримминга (edge excision) или клиновидная резекция, в зависимости от анатомии пациентки.</p>
                <p>Используются рассасывающиеся швы, которые выпадают сами, поэтому их не нужно снимать. Вмешательство длится в среднем <strong>30-60 минут</strong>.</p>

                <h3>Восстановление после лабиопластики</h3>
                <p>Восстановление индивидуально, но в основном быстрое. Пациентка может отправиться домой в тот же день. В первые несколько дней рекомендуется покой и холодные компрессы для уменьшения отека. Отек обычно спадает в течение <strong>7-10 дней</strong>.</p>
                <ul>
                    <li><strong>Боль:</strong> Минимальная и легко контролируется стандартными анальгетиками.</li>
                    <li><strong>Гигиена:</strong> Строго соблюдается гигиена раны с принятием душа и использованием мягких антисептических растворов.</li>
                </ul>
            `,
            },
            author: {
                "se": "Гинеколошка ординација Палмотићева",
                "sr": "Ginekološka ordinacija Palmotićeva",
                "ru": "Гинекологическая клиника «Палмотичева»",
                "en": "Palmotićeva Gynecology Clinic"
            },
            image: "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fusluga-labioplastika.png?alt=media&token=82a5dba4-e25f-4ac0-a18d-b362068e11b6",
            date: "2024-09-14T10:00:00Z"
        },
        {
            "date": "2025-10-30T00:00:00+01:00",
            "title": {
                "sr": "LOOP i konizacija grlića materice",
                "se": "ЛООП и конизација грлића материце",
                "ru": "ЛООП и конизация шейки матки",
                "en": "LOOP and Cervical Conization"
            },
            "summary": {
                "ru": "ЛООП (LEEP) и конизация — это минимально инвазивные процедуры, которые удаляют аномальные клетки с шейки матки, предотвращают развитие предраковых и злокачественных изменений и обеспечивают точную диагностику. Узнайте, когда они проводятся, как выглядят и что ожидать во время восстановления.",
                "en": "LOOP (LEEP) and conization are minimally invasive procedures that remove abnormal cells from the cervix, prevent the development of premalignant and malignant changes, and enable precise diagnostics. Find out when they are performed, what they involve, and what to expect during recovery.",
                "sr": "LOOP (LEEP) i konizacija su minimalno invazivne procedure koje uklanjaju abnormalne ćelije sa grlića materice, sprečavaju razvoj premalignih i malignih promena i omogućavaju preciznu dijagnostiku. Saznajte kada se rade, kako izgledaju i šta očekivati tokom oporavka.",
                "se": "ЛООП (ЛЕЕП) и конизација су минимално инвазивне процедуре које уклањају абнормалне ћелије са грлића материце, спречавају развој премалигних и малигних промена и омогућавају прецизну дијагностику. Сазнајте када се раде, како изгледају и шта очекивати током опоравка."
            },
            "slug": "loop",
            "author": {
                "se": "Гинеколошка ординација Палмотићева",
                "sr": "Ginekološka ordinacija Palmotićeva",
                "ru": "Гинекологическая клиника «Палмотичева»",
                "en": "Palmotićeva Gynecology Clinic"
            },
            "content": {
                "ru": "<p>Конизация и LEEP — это процедуры, при которых удаляется часть ткани шейки матки для диагностики или лечения изменений, которые могут быть предраковыми или иметь потенциал к прогрессированию.</p><p>Конизация удаляет конусообразную часть шейки матки, чаще всего с помощью скальпеля или радионожа.</p><p>LEEP использует тонкую металлическую петлю, через которую проходит энергия радиоволн, точно удаляющая изменение на поверхности шейки матки.</p><p>Обе процедуры имеют одну и ту же цель: удалить область, содержащую аномальную ткань, получить точный диагноз и предотвратить прогрессирование изменений.</p><h2>Когда рекомендуются эти процедуры?</h2><p>Чаще всего они рекомендуются после таких результатов, как CIN 2, CIN 3, устойчивые изменения, вызванные ВПЧ, неясные биопсии или кольпоскопические результаты, указывающие на риск развития более серьезных поражений. Оценка индивидуальна для каждой пациентки, с учетом планов на беременность и желания сохранить функцию шейки матки.</p><h2>Как это выглядит — шаг за шагом</h2><p><strong>Подготовка</strong></p><p>Осмотр, ПАП/ВПЧ и результаты кольпоскопии уже сделаны. Процедура проводится чаще всего амбулаторно, под местной или краткой анестезией. При необходимости мы договариваемся об анализах крови.</p><p><strong>Продолжительность и восстановление</strong></p><p>Сама процедура длится около 20–40 минут. В клинике Палмотићева вы остаетесь примерно на час.</p><p><strong>После процедуры</strong></p><p>Скудные кровянистые выделения в течение 1–7 дней являются ожидаемыми. Мы предоставляем письменные рекомендации (гигиена, избегание нагрузок и половых контактов в течение 3–4 недель). После проведенной процедуры обязателен контрольный осмотр и окончательный результат гистологического исследования (PH) по договоренности.</p><h2>LEEP и конизация в Гинекологической клинике Палмотићева</h2><p>В нашей клинике все процедуры проводятся с использованием современного подхода, включая:</p><ul><li>Радионожа,</li><li>техники LEEP,</li><li>и классической конизации, когда это является наилучшим медицинским вариантом.</li></ul><h2>Часто задаваемые вопросы о конизации</h2><p><strong>Болезненна ли процедура?</strong></p><p>Процедура проводится под анестезией (местной или краткой) — во время вмешательства вы не чувствуете боли; позже возможен легкий дискомфорт.</p><p><strong>Когда я получу результат гистологии (PH)?</strong></p><p>В сроки, зависящие от лаборатории; результат и дальнейшие шаги подробно объясняются на контрольном осмотре.</p><p><strong>Влияет ли это на будущую беременность?</strong></p><p>Большинство женщин благополучно беременеют и вынашивают беременность. При необходимости мы контролируем длину шейки матки во время последующей беременности.</p><p><strong>Чего следует избегать после процедуры?</strong></p><p>Тяжелых нагрузок, ванн/бассейнов и половых контактов в течение 3–4 недель или по рекомендации врача.</p><h2>Заключение</h2><p>Конизация и LEEP являются надежными, эффективными и безопасными методами для удаления изменений на шейке матки и предотвращения их прогрессирования. При адекватном ведении и регулярных осмотрах большинство пациенток добиваются полного излечения.</p>",
                "se": "<p>Конизација и ЛЕЕП су поступци којима се уклања део ткива грлића материце ради дијагностике или лечења промена које могу бити премалигне или показивати потенцијал за напредовање.</p><p>Конизација уклања конусни део цервикса, најчешће скалпелом или радио-ножем.</p><p>ЛЕЕП користи танку металну петљу кроз коју пролази радио-таласа енергија која прецизно одстрањује промену на површини грлића.</p><p>Оба поступка имају исти циљ: уклонити подручје у којем се налази абнормално ткиво, добити прецизну дијагнозу и спречити прогресију промене.</p><h2>Када се препоручују ове процедуре?</h2><p>Најчешће се саветују након налаза попут ЦИН 2, ЦИН 3, перзистентних ХПВ промена, нејасних биопсија или колпоскопских налаза који указују на ризик развоја озбиљнијих лезија. Код сваке пацијенткиње процена је индивидуална, уз поштовање планова за трудноћу и жеље да се очува функција цервикса.</p><h2>Како изгледа — корак по корак</h2><p><strong>Припрема</strong></p><p>Преглед, ПАПА/ХПВ и колпоскопски налаз су већ урађени. Захват се обавља најчешће амбулантно, уз локалну или кратку анестезију. По потреби договарамо анализе крви.</p><p><strong>Трајање и опоравак</strong></p><p>Сам захват траје око 20–40 мин. У ординацији Палмотићева остајете око сат времена.</p><p><strong>Након захвата</strong></p><p>Оскудно крварење 1–7 дана је очекивано. Дајемо писане смернице (хигијена, избегавање напора и односа 3–4 недеље). Након спроведеног захвата обавезан је контролни преглед и дефинитивни ПХ налаз по договору.</p><h2>ЛЕЕП и конизација у Гинеколошкој ординацији Палмотићева</h2><p>У нашој ординацији се све процедуре изводе савременим приступом, уз коришћење:</p><ul><li>Радио-ножа,</li><li>ЛЕЕП технике,</li><li>и класичне конизације када је то најбоља медицинска опција.</li></ul><h2>Најчешћа питања о конизацији</h2><p><strong>Да ли захват боли?</strong></p><p>Радимо у анестезији (локалној или краткој) — током захвата не осећате бол; касније је могућа блага нелагодност.</p><p><strong>Када добијам ПХ налаз?</strong></p><p>У року који зависи од лабораторије; резултат и даље кораке детаљно објашњавамо на контроли.</p><p><strong>Да ли утиче на будућу трудноћу?</strong></p><p>Већина жена уредно остаје трудна и износи трудноћу. По процени пратимо дужину грлића у наредној трудноћи.</p><p><strong>Шта да избегавам након захвата?</strong></p><p>Тегли напор, купке/базене и односе 3–4 недеље или по препоруци лекара.</p><h2>Закључак</h2><p>Конизација и LEEP су поуздане, ефикасне и безбедне методе за уклањање промена на грлићу материце и спречавање њиховог напредовања. Уз адекватно вођење и редовне контроле, већина пацијенткиња постиже потпуно излечење.</p>",
                "sr": "<p>Konizacija i LEEP su postupci kojima se uklanja deo tkiva grlića materice radi dijagnostike ili lečenja promena koje mogu biti premaligne ili pokazivati potencijal za napredovanje.</p><p>Konizacija uklanja konusni deo cerviksa, najčešće skalpelom ili radio-nožem.</p><p>LEEP koristi tanku metalnu petlju kroz koju prolazi radio-talasa energija koja precizno odstranjuje promenu na površini grlića.</p><p>Oba postupka imaju isti cilj: ukloniti područje u kojem se nalazi abnormalno tkivo, dobiti preciznu dijagnozu i sprečiti progresiju promene.</p><h2>Kada se preporučuju ove procedure?</h2><p>Najčešće se savetuju nakon nalaza poput CIN 2, CIN 3, perzistentnih HPV promena, nejasnih biopsija ili kolposkopskih nalaza koji ukazuju na rizik razvoja ozbiljnijih lezija. Kod svake pacijentkinje procena je individualna, uz poštovanje planova za trudnoću i želje da se očuva funkcija cerviksa.</p><h2>Kako izgleda — korak po korak</h2><p><strong>Priprema</strong></p><p>Pregled, PAPA/HPV i kolposkopski nalaz su već urađeni. Zahvat se obavlja najčešće ambulantno, uz lokalnu ili kratku anesteziju. Po potrebi dogovaramo analize krvi.</p><p><strong>Trajanje i oporavak</strong></p><p>Sam zahvat traje oko 20–40 min. U ordinaciji Palmotićeva ostajete oko sat vremena.</p><p><strong>Nakon zahvata</strong></p><p>Oskudno krvarenje 1–7 dana je očekivano. Dajemo pisane smernice (higijena, izbegavanje napora i odnosa 3–4 nedelje). Nakon sprovedenog zahvata obavezan je kontrolni pregled i definitivni PH nalaz po dogovoru.</p><h2>LEEP i konizacija u Ginekološkoj ordinaciji Palmotićeva</h2><p>U našoj ordinaciji se sve procedure izvode savremenim pristurom, uz korišćenje:</p><ul><li>Radio-noža,</li><li>LEEP tehnike,</li><li>i klasične konizacije kada je to najbolja medicinska opcija.</li></ul><h2>Najčešća pitanja o konizaciji</h2><p><strong>Da li zahvat boli?</strong></p><p>Radimo u anesteziji (lokalnoj ili kratkoj) — tokom zahvata ne osećate bol; kasnije je moguća blaga neugodnost.</p><p><strong>Kada dobijam PH nalaz?</strong></p><p>U roku koji zavisi od laboratorije; rezultat i dalje korake detaljno objašnjavamo na kontroli.</p><p><strong>Da li utiče na buduću trudnoću?</strong></p><p>Većina žena uredno ostaje trudna i iznosi trudnoću. Po proceni pratimo dužinu grlića u narednoj trudnoći.</p><p><strong>Šta da izbegavam nakon zahvata?</strong></p><p>Tegli napor, kupke/bazene i odnose 3–4 nedelje ili po preporuci lekara.</p><h2>Zaključak</h2><p>Konizacija i LEEP su pouzdane, efikasne i bezbedne metode za uklanjanje promena na grliću materice i sprečavanje njihovog napredovanja. Uz adekvatno vođenje i redovne kontrole, većina pacijentkinja postiže potpuno izlečenje.</p>",
                "en": "<p>Conization and LEEP are procedures used to remove a part of the cervical tissue for the purpose of diagnosing or treating changes that may be premalignant or show potential for progression.</p><p>Conization removes a conical portion of the cervix, usually using a scalpel or a radio knife (electrosurgical unit).</p><p>LEEP uses a thin metal loop through which radio-wave energy passes, precisely removing the change on the surface of the cervix.</p><p>Both procedures share the same goal: to remove the area containing abnormal tissue, obtain a precise diagnosis, and prevent the progression of the change.</p><h2>When are these procedures recommended?</h2><p>They are most often advised following findings such as CIN 2, CIN 3, persistent HPV changes, unclear biopsies, or colposcopy results indicating a risk of developing more serious lesions. The assessment is individual for each patient, respecting plans for future pregnancy and the desire to preserve cervical function.</p><h2>How it looks — step by step</h2><p><strong>Preparation</strong></p><p>The examination, PAP/HPV test, and colposcopy findings have already been completed. The procedure is usually performed on an outpatient basis, using local or brief general anesthesia. If necessary, blood tests are arranged.</p><p><strong>Duration and recovery</strong></p><p>The procedure itself lasts about 20–40 minutes. You will stay in the Palmotićeva clinic for about an hour.</p><p><strong>After the procedure</strong></p><p>Scanty bleeding for 1–7 days is expected. We provide written guidelines (hygiene, avoidance of strenuous effort and intercourse for 3–4 weeks). After the procedure, a follow-up examination and the final pathology result are mandatory by appointment.</p><h2>LEEP and Conization at Palmotićeva Gynecology Clinic</h2><p>In our clinic, all procedures are performed using a modern approach, utilizing:</p><ul><li>Radio knife (electrosurgery),</li><li>LEEP technique,</li><li>and classical conization when it is the best medical option.</li></ul><h2>Frequently Asked Questions about Conization</h2><p><strong>Is the procedure painful?</strong></p><p>We work under anesthesia (local or short general) — you do not feel pain during the procedure; mild discomfort may occur later.</p><p><strong>When do I receive the pathology result (PH)?</strong></p><p>Within a timeframe that depends on the laboratory; we explain the result and further steps in detail during the follow-up appointment.</p><p><strong>Does it affect future pregnancy?</strong></p><p>Most women successfully become pregnant and carry the pregnancy to term. We monitor the cervical length during subsequent pregnancies as needed.</p><p><strong>What should I avoid after the procedure?</strong></p><p>Strenuous effort, baths/swimming pools, and intercourse for 3–4 weeks or as recommended by the doctor.</p><h2>Conclusion</h2><p>Conization and LEEP are reliable, effective, and safe methods for removing changes on the cervix and preventing their progression. With adequate management and regular check-ups, most patients achieve complete cure.</p>"
            },
            "image": "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2FLEEP.webp?alt=media&token=af0c079c-0210-4a7d-8f8f-e381516b535b"
        }
    ]
}
