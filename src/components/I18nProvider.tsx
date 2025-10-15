'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import initI18n from '@/i18n/i18n';

// Initialize i18n
const i18nInstance = initI18n;

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
}