import React, { createContext, useContext } from 'react';
import translations from './translations.json';
const I18nContext = createContext(translations.en);
export function I18nProvider({ children }) {
  return <I18nContext.Provider value={translations.en}>{children}</I18nContext.Provider>;
}
export function useT() { return useContext(I18nContext); }
