
import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 1;

export const tipsContent: { [key: string]: ContentItem & { version: number } } = {
  // Calendar Tips
  daily_tip_title: { en: "Daily Tip", "sr": "Savet Dana", se: "Савет Дана", ru: "Совет дня", version: CURRENT_CONTENT_VERSION },
  tip_period_1: { 
    en: "During your period, your body loses iron. Increase your intake of spinach, red meat, and legumes.", 
    "sr": "Tokom menstruacije, telo gubi gvožđe. Pojačajte unos spanaća, crvenog mesa i mahunarki.", 
    se: "Током менструације, тело губи гвожђе. Појачајте унос спанаћа, црвеног меса и махунарки.", 
    ru: "Во время менструации ваш организм теряет железо. Увеличьте потребление шпината, красного мяса и бобовых.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_period_2: { 
    en: "Mild exercise like walking or yoga can help alleviate cramps and improve your mood.", 
    "sr": "Lagana vežba poput šetnje ili joge može pomoći u ublažavanju grčeva i poboljšanju raspoloženja.", 
    se: "Лагана вежба попут шетње или јоге може помоћи у ублажавању грчева и побољшању расположења.", 
    ru: "Легкие упражнения, такие как ходьба или йога, могут помочь облегчить спазмы и улучшить настроение.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_fertile_1: { 
    en: "Your energy levels are at their peak during the fertile window. It's a great time for more intense workouts.", 
    "sr": "Nivo energije je na vrhuncu tokom plodnih dana. Odlično je vreme za intenzivnije treninge.", 
    se: "Ниво енергије је на врхунцу током плодних дана. Одлично је време за интензивније тренинге.", 
    ru: "Уровень вашей энергии достигает пика во время фертильного окна. Это прекрасное время для более интенсивных тренировок.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_fertile_2: { 
    en: "Libido is often highest around ovulation. Listen to your body.", 
    "sr": "Libido je često najviši oko ovulacije. Slušajte svoje telo.", 
    se: "Либидо је често највиши око овулације. Слушајте своје тело.", 
    ru: "Либидо часто бывает самым высоким во время овуляции. Прислушивайтесь к своему телу.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_pms_1: { 
    en: "In the days before your period, reduce your intake of salt and caffeine to minimize bloating and irritability.", 
    "sr": "U danima pred menstruaciju, smanjite unos soli i kofeina kako biste umanjili nadutost i razdražljivost.", 
    se: "У данима пред менструацију, смањите унос соли и кофеина како бисте умањили надутост и раздражљивост.", 
    ru: "За несколько дней до менструации сократите потребление соли и кофеина, чтобы минимизировать вздутие и раздражительность.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_pms_2: { 
    en: "Foods rich in magnesium, like dark chocolate and nuts, can help with PMS symptoms.", 
    "sr": "Namirnice bogate magnezijumom, poput crne čokolade i orašastih plodova, mogu pomoći kod simptoma PMS-a.", 
    se: "Намирнице богате магнезијумом, попут црне чоколаде и орашастих плодова, могу помоћи код симптома ПМС-а.", 
    ru: "Продукты, богатые магнием, такие как темный шоколад и орехи, могут помочь при симптомах ПМС.", 
    version: CURRENT_CONTENT_VERSION 
  },
  tip_default: { 
    en: "Regularly tracking your cycle helps you understand your body's unique rhythm.", 
    "sr": "Redovno praćenje ciklusa pomaže vam da razumete jedinstveni ritam vašeg tela.", 
    se: "Редовно праћење циклуса помаже вам да разумете јединствени ритам вашег тела.", 
    ru: "Регулярное отслеживание цикла помогает вам понять уникальный ритм вашего тела.", 
    version: CURRENT_CONTENT_VERSION 
  },

  // Health Corner Facts
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

    
