'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
  page: 'home' | 'features' | 'dashboard' | 'login' | 'register';
}

/**
 * SEO Head组件
 * 动态更新页面的meta标签以支持多语言SEO
 * 包括hreflang标签和canonical URL优化
 */
export default function SEOHead({ page }: SEOHeadProps) {
  const { t, locale } = useLanguage();

  useEffect(() => {
    // 更新页面标题
    document.title = t(`seo.${page}.title`);

    // 更新或创建meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', t(`seo.${page}.description`));

    // 更新或创建meta keywords (如果存在)
    const keywords = t(`seo.${page}.keywords`);
    if (keywords && keywords !== `seo.${page}.keywords`) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', t(`seo.${page}.title`));

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', t(`seo.${page}.description`));

    let ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (!ogSiteName) {
      ogSiteName = document.createElement('meta');
      ogSiteName.setAttribute('property', 'og:site_name');
      document.head.appendChild(ogSiteName);
    }
    ogSiteName.setAttribute('content', t('seo.siteName'));

    // Twitter Card tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', t(`seo.${page}.title`));

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', t(`seo.${page}.description`));

    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      twitterCard.setAttribute('content', 'summary_large_image');
      document.head.appendChild(twitterCard);
    }

    // ===== 新增：Canonical URL =====
    // 设置当前页面的canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    // 使用当前URL但移除查询参数，保持干净的URL
    const canonicalUrl = window.location.origin + window.location.pathname;
    canonical.setAttribute('href', canonicalUrl);

    // ===== 新增：hreflang标签 =====
    // 为多语言SEO添加hreflang标签
    const languages = ['zh', 'en', 'ja'] as const;
    const baseUrl = window.location.origin + window.location.pathname;

    // 移除旧的hreflang标签
    document.querySelectorAll('link[hreflang]').forEach(link => link.remove());

    // 为每种语言添加hreflang标签
    languages.forEach(lang => {
      const hreflang = document.createElement('link');
      hreflang.setAttribute('rel', 'alternate');
      hreflang.setAttribute('hreflang', lang);
      hreflang.setAttribute('href', `${baseUrl}?lang=${lang}`);
      document.head.appendChild(hreflang);
    });

    // 添加x-default hreflang（默认语言为英文）
    const hreflangDefault = document.createElement('link');
    hreflangDefault.setAttribute('rel', 'alternate');
    hreflangDefault.setAttribute('hreflang', 'x-default');
    hreflangDefault.setAttribute('href', `${baseUrl}?lang=en`);
    document.head.appendChild(hreflangDefault);

    // 更新OG locale根据当前语言
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    const localeMap = {
      zh: 'zh_CN',
      en: 'en_US',
      ja: 'ja_JP'
    };
    ogLocale.setAttribute('content', localeMap[locale]);

  }, [t, page, locale]);

  return null; // 这个组件不渲染任何内容
}
