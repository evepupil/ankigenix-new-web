import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '../locales/en/translation.json';
import zhTranslation from '../locales/zh/translation.json';

// Declare the resources type to TypeScript
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof enTranslation;
    };
  }
}

// i18n configuration
i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    fallbackLng: 'zh', // Default language
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      // Options for language detection
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'], // Cache the detected language
    },
  });

export default i18n;