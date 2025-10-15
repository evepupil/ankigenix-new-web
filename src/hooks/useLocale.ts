import { useTranslation } from 'react-i18next';

// Custom hook that wraps useTranslation from react-i18next
// This provides type safety and makes it easier to use translations
export const useLocale = () => {
  const { t, i18n } = useTranslation();
  
  // Get current language
  const currentLanguage = i18n.language;
  
  // Function to change language
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  // Return both the translation function and language utilities
  return {
    t, // Translation function
    currentLanguage, // Current language code
    changeLanguage, // Function to change language
  };
};