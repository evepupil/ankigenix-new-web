'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * 公共头部导航栏组件 - 极简设计
 * 蓝·黑·灰·白配色方案
 */
export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  /**
   * 切换移动端菜单显示状态
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * 切换用户下拉菜单
   */
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  /**
   * 切换语言菜单
   */
  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  /**
   * 切换语言设置
   */
  const changeLanguage = (lang: 'zh' | 'en' | 'ja') => {
    setLocale(lang);
    setIsLangMenuOpen(false);
  };

  /**
   * 获取语言显示信息
   */
  const getLanguageInfo = (lang: string) => {
    const languages: { [key: string]: { name: string; flag: string } } = {
      zh: { name: '简体中文', flag: '🇨🇳' },
      en: { name: 'English', flag: '🇺🇸' },
      ja: { name: '日本語', flag: '🇯🇵' },
    };
    return languages[lang] || languages['zh'];
  };

  /**
   * 处理登出
   */
  const handleLogout = () => {
    signOut();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  /**
   * 检查当前路径是否为活跃状态
   */
  const isActive = (path: string) => {
    return pathname === path;
  };

  // 获取用户名首字母
  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  // 获取用户显示名称
  const getUserDisplayName = () => {
    // 优先级：full_name > name > username > email前缀
    return (
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.user_metadata?.username ||
      user?.email?.split('@')[0] ||
      '用户'
    );
  };

  // 获取用户头像URL
  const getUserAvatar = () => {
    return (
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      null
    );
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    if (isUserMenuOpen || isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isLangMenuOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 左侧：Logo + 导航菜单 */}
          <div className="flex items-center space-x-8">
            {/* Logo - 极简设计 */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{t('header.appName')}</span>
              </Link>
            </div>

            {/* 桌面端导航菜单 - 极简风格 */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('common.home')}
              </Link>
              <Link
                href="/features"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/features')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('common.features')}
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t('common.dashboard')}
                </Link>
              )}
            </nav>
          </div>

          {/* 右侧工具栏 - 极简设计 */}
          <div className="hidden md:flex items-center space-x-3">
            {/* 语言切换下拉菜单 */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-1.5 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <span className="text-sm">{getLanguageInfo(locale).flag}</span>
                <span>{locale === 'zh' ? '中文' : locale === 'en' ? 'EN' : '日'}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 语言下拉菜单 */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-slide-in">
                  {(['zh', 'en', 'ja'] as const).map((lang) => {
                    const langInfo = getLanguageInfo(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`flex items-center w-full px-3 py-1.5 text-xs transition-colors ${
                          locale === lang
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-2 text-sm">{langInfo.flag}</span>
                        <span className="flex-1 text-left">{langInfo.name}</span>
                        {locale === lang && (
                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 登录状态 - 仅显示头像 */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                {/* 头像按钮 */}
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()!}
                      alt="用户头像"
                      className="w-9 h-9 rounded-full shadow-sm group-hover:shadow-md transition-all cursor-pointer object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all cursor-pointer">
                      <span className="text-sm font-semibold text-white">{getUserInitial()}</span>
                    </div>
                  )}
                </button>

                {/* 下拉菜单 */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-slide-in">
                    {/* 用户信息 */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        {getUserAvatar() ? (
                          <img
                            src={getUserAvatar()!}
                            alt="用户头像"
                            className="w-10 h-10 rounded-full shadow-sm object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-base font-bold text-white">{getUserInitial()}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 菜单项 */}
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {t('common.dashboard')}
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {t('common.settings')}
                      </Link>

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t('common.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('common.login')}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                >
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 - 极简设计 */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单 - 极简设计 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-in">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link
                href="/features"
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/features')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.features')}
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('common.dashboard')}
                </Link>
              )}

              {/* 移动端工具栏 */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                {/* 移动端语言选择 */}
                <div className="px-1">
                  <label className="block text-xs font-medium text-gray-500 mb-2 px-1">{t('common.language')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['zh', 'en', 'ja'] as const).map((lang) => {
                      const langInfo = getLanguageInfo(lang);
                      return (
                        <button
                          key={lang}
                          onClick={() => changeLanguage(lang)}
                          className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            locale === lang
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span className="text-xl mb-1">{langInfo.flag}</span>
                          <span className="text-xs">{lang === 'zh' ? '中文' : lang === 'en' ? 'EN' : '日本語'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAuthenticated ? (
                  <div className="space-y-2">
                    {/* 用户信息卡片 */}
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        {getUserAvatar() ? (
                          <img
                            src={getUserAvatar()!}
                            alt="用户头像"
                            className="w-10 h-10 rounded-full shadow-sm object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-base font-bold text-white">{getUserInitial()}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      {/* 移动端菜单项 */}
                      <div className="space-y-1">
                        <Link
                          href="/settings"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t('common.settings')}
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t('common.logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 px-1">
                    <Link
                      href="/login"
                      className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('common.login')}
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 px-4 py-2.5 text-center bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('common.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}