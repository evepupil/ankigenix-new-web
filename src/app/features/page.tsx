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
import { useLocale } from '@/hooks/useLocale';

/**
 * 功能特性页面组件
 * 展示Ankigenix的核心功能和优势
 */
export default function Features() {
  const { t } = useLocale();

  /**
   * 核心功能列表
   */
  const coreFeatures = [
    {
      icon: SparklesIcon,
      title: t('featuresPage.aiSmartGeneration'),
      description: t('featuresPage.aiSmartGenerationDesc'),
      details: [
        t('featuresPage.aiDetail1'),
        t('featuresPage.aiDetail2'),
        t('featuresPage.aiDetail3'),
        t('featuresPage.aiDetail4')
      ]
    },
    {
      icon: DocumentTextIcon,
      title: t('featuresPage.multipleInputsTitle'),
      description: t('featuresPage.multipleInputsDesc'),
      details: [
        t('featuresPage.inputDetail1'),
        t('featuresPage.inputDetail2'),
        t('featuresPage.inputDetail3'),
        t('featuresPage.inputDetail4')
      ]
    },
    {
      icon: GlobeAltIcon,
      title: t('featuresPage.multiLanguageTitle'),
      description: t('featuresPage.multiLanguageDesc'),
      details: [
        t('featuresPage.langDetail1'),
        t('featuresPage.langDetail2'),
        t('featuresPage.langDetail3'),
        t('featuresPage.langDetail4')
      ]
    },
    {
      icon: CpuChipIcon,
      title: t('featuresPage.smartDifficultyTitle'),
      description: t('featuresPage.smartDifficultyDesc'),
      details: [
        t('featuresPage.difficultyDetail1'),
        t('featuresPage.difficultyDetail2'),
        t('featuresPage.difficultyDetail3'),
        t('featuresPage.difficultyDetail4')
      ]
    }
  ];

  /**
   * 高级功能列表
   */
  const advancedFeatures = [
    {
      icon: ClockIcon,
      title: t('featuresPage.batchProcessing'),
      description: t('featuresPage.batchProcessingDesc')
    },
    {
      icon: AcademicCapIcon,
      title: t('featuresPage.subjectSpecialization'),
      description: t('featuresPage.subjectSpecializationDesc')
    },
    {
      icon: ChartBarIcon,
      title: t('featuresPage.learningAnalytics'),
      description: t('featuresPage.learningAnalyticsDesc')
    },
    {
      icon: CloudArrowUpIcon,
      title: t('featuresPage.cloudSync'),
      description: t('featuresPage.cloudSyncDesc')
    },
    {
      icon: DevicePhoneMobileIcon,
      title: t('featuresPage.mobileOptimization'),
      description: t('featuresPage.mobileOptimizationDesc')
    },
    {
      icon: ShieldCheckIcon,
      title: t('featuresPage.dataSecurity'),
      description: t('featuresPage.dataSecurityDesc')
    },
    {
      icon: UserGroupIcon,
      title: t('featuresPage.teamCollaboration'),
      description: t('featuresPage.teamCollaborationDesc')
    },
    {
      icon: ArrowPathIcon,
      title: t('featuresPage.continuousUpdate'),
      description: t('featuresPage.continuousUpdateDesc')
    }
  ];

  /**
   * 使用场景列表
   */
  const useCases = [
    {
      title: t('featuresPage.examReview'),
      description: t('featuresPage.examReviewDesc'),
      example: `${t('featuresPage.examReviewExample')} ${t('featuresPage.examReviewExampleText')}`
    },
    {
      title: t('featuresPage.languageLearning'),
      description: t('featuresPage.languageLearningDesc'),
      example: `${t('featuresPage.languageLearningExample')} ${t('featuresPage.languageLearningExampleText')}`
    },
    {
      title: t('featuresPage.skillTraining'),
      description: t('featuresPage.skillTrainingDesc'),
      example: `${t('featuresPage.skillTrainingExample')} ${t('featuresPage.skillTrainingExampleText')}`
    },
    {
      title: t('featuresPage.academicResearch'),
      description: t('featuresPage.academicResearchDesc'),
      example: `${t('featuresPage.academicResearchExample')} ${t('featuresPage.academicResearchExampleText')}`
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero区域 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              {t('featuresPage.heroTitle')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              {t('featuresPage.heroDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* 核心功能详细介绍 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('featuresPage.coreFeaturesTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('featuresPage.coreFeaturesDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{feature.description}</p>

                  <ul className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
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
            <h2 className="text-3xl font-bold text-gray-900">{t('featuresPage.advancedFeaturesTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('featuresPage.advancedFeaturesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">{t('featuresPage.useCasesTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('featuresPage.useCasesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">{useCase.example}</p>
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
            <h2 className="text-3xl font-bold text-white mb-8">{t('featuresPage.techAdvantagesTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{t('featuresPage.contentAccuracy')}</div>
                <div className="text-blue-100">{t('featuresPage.contentAccuracyLabel')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{t('featuresPage.avgGenerationTime')}</div>
                <div className="text-blue-100">{t('featuresPage.avgGenerationTimeLabel')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{t('featuresPage.supportedLanguages')}</div>
                <div className="text-blue-100">{t('featuresPage.supportedLanguagesLabel')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA区域 */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t('featuresPage.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('featuresPage.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {t('featuresPage.freeStartButton')}
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              {t('featuresPage.viewDemoButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}