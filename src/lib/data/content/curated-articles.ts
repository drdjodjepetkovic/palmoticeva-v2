// Curated article manifest — slugs fetched live from palmoticeva.com
// Adds preview metadata so the list page can render hero cards without fetching.

export interface CuratedArticle {
  slug: string;
  title: { 'se-lat': string; se: string; en: string; ru: string };
  excerpt: { 'se-lat': string; se: string; en: string; ru: string };
  headerImage: string; // /page-headers/{slug}.webp
}

export const CURATED_ARTICLES: CuratedArticle[] = [
  {
    slug: 'histeroskopija',
    title: {
      'se-lat': 'Histeroskopija',
      se: 'Хистероскопија',
      en: 'Hysteroscopy',
      ru: 'Гистероскопия',
    },
    excerpt: {
      'se-lat':
        'Zlatni standard za pregled i operaciju unutrašnjosti materice — bez reza, kroz prirodni kanal.',
      se: 'Златни стандард за преглед и операцију унутрашњости материце — без реза, кроз природни канал.',
      en: 'The gold standard for examining and operating on the inside of the uterus — no incisions, through the natural canal.',
      ru: 'Золотой стандарт для осмотра и операций внутри матки — без разрезов, через естественный канал.',
    },
    headerImage: '/page-headers/histeroskopija.webp',
  },
  {
    slug: 'endometrioza',
    title: {
      'se-lat': 'Endometrioza',
      se: 'Ендометриоза',
      en: 'Endometriosis',
      ru: 'Эндометриоз',
    },
    excerpt: {
      'se-lat':
        'Hronično oboljenje koje pogađa 1 od 10 žena — uzroci, simptomi, dijagnostika i moderno lečenje.',
      se: 'Хронично обољење које погађа 1 од 10 жена — узроци, симптоми, дијагностика и модерно лечење.',
      en: 'A chronic condition affecting 1 in 10 women — causes, symptoms, diagnosis and modern treatment.',
      ru: 'Хроническое заболевание, поражающее 1 из 10 женщин — причины, симптомы, диагностика и современное лечение.',
    },
    headerImage: '/page-headers/endometrioza.webp',
  },
];

export function getCuratedArticle(slug: string): CuratedArticle | null {
  return CURATED_ARTICLES.find((a) => a.slug === slug) ?? null;
}

/**
 * Build the live URL on palmoticeva.com for a given slug + locale.
 * SR (se-lat, se) → /{slug}, EN → /en/{slug}, RU → /ru/{slug}
 */
export function getLiveUrl(slug: string, locale: string): string {
  const base = 'https://www.palmoticeva.com';
  if (locale === 'en') return `${base}/en/${slug}`;
  if (locale === 'ru') return `${base}/ru/${slug}`;
  return `${base}/${slug}`;
}
