'use client';

import { useEffect } from 'react';
import { useLocale } from '@/hooks/useLocale';

/**
 * HTML Lang 设置组件
 * 根据当前语言动态更新 HTML lang 属性
 */
export default function HtmlLang() {
  const { currentLanguage } = useLocale();

  useEffect(() => {
    // 更新 html 元素的 lang 属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  return null;
}
