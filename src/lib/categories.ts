// ─── Category System ────────────────────────────────────────────────
// Ported from PalmLondon. Maps curated article slugs to medical categories.
// Used by ArticleHero badge rendering.
// ─────────────────────────────────────────────────────────────────────

export type CategoryKey =
  | 'diagnostics'
  | 'pregnancy'
  | 'infertility'
  | 'contraception'
  | 'surgery'
  | 'conditions'
  | 'clinic';

export interface CategoryConfig {
  key: CategoryKey;
  label: { sr: string; en: string; ru: string };
  color: string;
  /** SVG path(s) for a 24×24 viewBox, stroke-based icon */
  iconPaths: string[];
}

export const CATEGORIES: Record<CategoryKey, CategoryConfig> = {
  diagnostics: {
    key: 'diagnostics',
    label: { sr: 'Dijagnostika', en: 'Diagnostics', ru: 'Диагностика' },
    color: '#1d4ed8',
    iconPaths: [
      'M4.5 12.5l3 3 8-8',
      'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
    ],
  },
  pregnancy: {
    key: 'pregnancy',
    label: { sr: 'Trudnoća', en: 'Pregnancy', ru: 'Беременность' },
    color: '#be185d',
    iconPaths: [
      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    ],
  },
  infertility: {
    key: 'infertility',
    label: { sr: 'Sterilitet', en: 'Infertility', ru: 'Бесплодие' },
    color: '#7c3aed',
    iconPaths: [
      'M22 12h-4l-3 9L9 3l-3 9H2',
    ],
  },
  contraception: {
    key: 'contraception',
    label: { sr: 'Kontracepcija', en: 'Contraception', ru: 'Контрацепция' },
    color: '#0e7490',
    iconPaths: [
      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    ],
  },
  surgery: {
    key: 'surgery',
    label: { sr: 'Hirurgija', en: 'Surgery', ru: 'Хирургия' },
    color: '#b91c1c',
    iconPaths: [
      'M6 9l6 6 6-6',
      'M12 3v12',
    ],
  },
  conditions: {
    key: 'conditions',
    label: { sr: 'Bolesti', en: 'Conditions', ru: 'Заболевания' },
    color: '#b45309',
    iconPaths: [
      'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
      'M12 9v4',
      'M12 17h.01',
    ],
  },
  clinic: {
    key: 'clinic',
    label: { sr: 'Ordinacija', en: 'Clinic', ru: 'Клиника' },
    color: '#0d9488',
    iconPaths: [
      'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      'M9 22V12h6v10',
    ],
  },
};

// ─── Slug → Category mapping ────────────────────────────────────────
// Only curated article slugs mapped here. Extend as new articles are added.

const SLUG_TO_CATEGORY: Record<string, CategoryKey> = {
  'histeroskopija': 'diagnostics',
  'endometrioza': 'conditions',
};

// Slugs that belong to two categories (primary from SLUG_TO_CATEGORY, secondary here)
const SLUG_SECONDARY_CATEGORY: Record<string, CategoryKey> = {
  'histeroskopija': 'surgery',
};

export function getCategoryForSlug(slug: string): CategoryConfig | null {
  const key = SLUG_TO_CATEGORY[slug];
  if (!key) return null;
  return CATEGORIES[key];
}

export function getAllCategoriesForSlug(slug: string): CategoryConfig[] {
  const primaryKey = SLUG_TO_CATEGORY[slug];
  if (!primaryKey) return [];
  const result = [CATEGORIES[primaryKey]];
  const secondaryKey = SLUG_SECONDARY_CATEGORY[slug];
  if (secondaryKey && secondaryKey !== primaryKey) {
    result.push(CATEGORIES[secondaryKey]);
  }
  return result;
}

export function getCategoryLabel(slug: string, locale: string): string | null {
  const cat = getCategoryForSlug(slug);
  if (!cat) return null;
  const lang = (locale === 'en' || locale === 'ru') ? locale : 'sr';
  return cat.label[lang];
}
