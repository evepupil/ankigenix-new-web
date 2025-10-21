'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * HTML Lang属性更新器
 * 动态更新HTML标签的lang属性以匹配当前语言
 * 这对于SEO和多语言支持至关重要
 */
export default function HtmlLangUpdater() {
  const { locale } = useLanguage();

  useEffect(() => {
    // 更新HTML标签的lang属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null; // 这个组件不渲染任何内容
}
