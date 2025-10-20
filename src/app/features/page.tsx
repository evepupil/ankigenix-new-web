'use client';

import {
  SparklesIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CpuChipIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * 功能特性页面组件
 * 展示Ankigenix的核心功能和优势
 */
export default function Features() {
  const { t } = useLanguage();

  /**
   * 核心功能列表
   */
  const coreFeatures = [
    {
      icon: SparklesIcon,
      key: 'aiGeneration'
    },
    {
      icon: DocumentTextIcon,
      key: 'multiInput'
    },
    {
      icon: CloudArrowUpIcon,
      key: 'export'
    },
    {
      icon: ClockIcon,
      key: 'efficiency'
    }
  ];

  /**
   * 高级功能列表
   */
  const advancedFeatures = [
    {
      icon: DocumentTextIcon,
      key: 'contentExtraction'
    },
    {
      icon: AcademicCapIcon,
      key: 'multiDiscipline'
    },
    {
      icon: ChartBarIcon,
      key: 'taskManagement'
    },
    {
      icon: ShieldCheckIcon,
      key: 'dataSecurity'
    },
    {
      icon: DevicePhoneMobileIcon,
      key: 'responsive'
    },
    {
      icon: ArrowPathIcon,
      key: 'batchEdit'
    }
  ];

  /**
   * 使用场景列表
   */
  const useCases = [
    'examPrep',
    'language',
    'certification',
    'knowledge'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero区域 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              {t('features.hero.title')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              {t('features.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* 核心功能详细介绍 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('features.coreFeatures.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('features.coreFeatures.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              const details = t(`features.coreFeatures.${feature.key}.details`);
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {t(`features.coreFeatures.${feature.key}.title`)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {t(`features.coreFeatures.${feature.key}.description`)}
                  </p>

                  <ul className="space-y-3">
                    {Array.isArray(details) && details.map((detail: string, detailIndex: number) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="ml-3 text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 高级功能网格 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('features.advancedFeatures.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('features.advancedFeatures.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(`features.advancedFeatures.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t(`features.advancedFeatures.${feature.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 使用场景 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('features.useCases.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('features.useCases.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t(`features.useCases.${useCase}.title`)}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(`features.useCases.${useCase}.description`)}
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{t('features.useCases.exampleLabel')}</span>
                    {t(`features.useCases.${useCase}.example`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 技术优势 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">{t('features.technicalAdvantages.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {t('features.technicalAdvantages.easyToUse.title')}
                </div>
                <div className="text-blue-100">
                  {t('features.technicalAdvantages.easyToUse.description')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {t('features.technicalAdvantages.efficient.title')}
                </div>
                <div className="text-blue-100">
                  {t('features.technicalAdvantages.efficient.description')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {t('features.technicalAdvantages.compatible.title')}
                </div>
                <div className="text-blue-100">
                  {t('features.technicalAdvantages.compatible.description')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA区域 */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t('features.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('features.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {t('features.cta.register')}
            </a>
            <a href="/dashboard" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              {t('features.cta.dashboard')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
