import { translations, type Lang, type TranslationKey } from './translations';

export type { Lang, TranslationKey };

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] ?? translations['en'][key] ?? key;
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Lang;
  return 'en';
}

export function getLocalizedPath(lang: Lang, path: string): string {
  return `/${lang}${path}`;
}

export const languages: Record<Lang, string> = {
  en: 'EN',
  de: 'DE',
  fr: 'FR',
  it: 'IT',
};
