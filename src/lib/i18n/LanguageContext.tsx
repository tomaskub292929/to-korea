'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translations, getTranslation, type Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languages = [
  { code: 'ko' as Language, label: '한국어', flag: '🇰🇷' },
  { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
  { code: 'ru' as Language, label: 'Русский', flag: '🇷🇺' },
  { code: 'zh' as Language, label: '中文', flag: '🇨🇳' },
  { code: 'uz' as Language, label: "O'zbek", flag: '🇺🇿' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Optionally save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
    }
  }, []);

  const t = useCallback((key: string) => {
    return getTranslation(language, key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
