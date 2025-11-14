
export type LanguageCode = 'en' | 'se' | 'ru' | 'se-lat';

export interface ContentItem {
  en: string;
  se: string;
  ru: string;
  "se-lat": string;
  version?: number;
}

export interface ContentMap {
  [id: string]: string;
}

    