import React, { createContext, useContext, useState } from 'react';
import translations from './translations.json';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;
  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
