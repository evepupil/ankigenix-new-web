'use client';

import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';

/**
 * 首页内容组件
 * 包含Hero部分、功能特性、定价CTA和使用说明区域
 */
export default function HomeContent() {
  const { t } = useLocale();

  return (
    <>
      {/* Hero 部分 */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              {t('home.heroTitle')}
              <span className="text-blue-600">{t('home.heroTitleHighlight')}</span>
              {t('home.heroTitleEnd') && <br />}
              {t('home.heroTitleEnd')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.startGenerating')}
              </Link>
              <Link
                href="/features"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                {t('home.learnMoreFeatures')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特性部分 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('home.powerfulAI')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.powerfulAIDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 功能卡片1 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.multipleInputs')}</h3>
              <p className="text-gray-600">
                {t('home.multipleInputsDescription')}
              </p>
            </div>

            {/* 功能卡片2 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.aiGeneration')}</h3>
              <p className="text-gray-600">
                {t('home.aiGenerationDescription')}
              </p>
            </div>

            {/* 功能卡片3 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.qualityScoring')}</h3>
              <p className="text-gray-600">
                {t('home.qualityScoringDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 定价CTA部分 */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {t('home.startJourney')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('home.startJourneyDescription')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* 免费计划 */}
            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.freeVersion')}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {t('home.freePerMonth')}<span className="text-lg font-normal text-gray-600">{t('home.perMonth')}</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('home.cards50PerMonth')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('home.basicAIGeneration')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('home.textInput')}
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors block text-center"
              >
                {t('home.freeStart')}
              </Link>
            </div>

            {/* 专业计划 */}
            <div className="bg-white rounded-xl p-8 border-2 border-blue-500 hover:border-blue-600 transition-colors relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {t('home.recommended')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.proVersion')}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {t('home.proPerMonth')}<span className="text-lg font-normal text-gray-600">{t('home.perMonth')}</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('home.unlimitedCards')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('home.advancedAIGeneration')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('home.allInputMethods')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('home.topicGeneration')}
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
              >
                {t('home.upgradeNow')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 使用说明部分 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('home.howToUse')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.simpleThreeSteps')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 步骤1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.step1Title')}</h3>
              <p className="text-gray-600">
                {t('home.step1Description')}
              </p>
            </div>

            {/* 步骤2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.step2Title')}</h3>
              <p className="text-gray-600">
                {t('home.step2Description')}
              </p>
            </div>

            {/* 步骤3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.step3Title')}</h3>
              <p className="text-gray-600">
                {t('home.step3Description')}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('home.startExperience')}
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{t('appName')}</span>
            </div>
            <p className="text-gray-600 mb-6">
              {t('home.footerSlogan')}
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('home.featuresLink')}
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('home.pricingLink')}
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('home.helpDocLink')}
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                {t('home.copyright')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
