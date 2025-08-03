import React, { createContext, useContext } from 'react';
import translations from './translations.json';
const I18nContext = createContext(translations.en);
export function I18nProvider({ lang, children }) {
  const dict = translations[lang] || translations.en;
  return <I18nContext.Provider value={dict}>{children}</I18nContext.Provider>;
}
export function useT() { return useContext(I18nContext); }
