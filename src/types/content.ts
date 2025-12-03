
export type LanguageCode = 'en' | 'se' | 'ru' | 'sr';

export interface ContentItem {
    en: string;
    se: string;
    ru: string;
    sr: string;
    version?: number;
}

export interface ContentMap {
    [id: string]: string;
}
