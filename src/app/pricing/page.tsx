'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocale } from '@/hooks/useLocale';

/**
 * Pricing page component
 * Displays different subscription plans and pricing options
 */
export default function Pricing() {
  const { t } = useLocale();
  // Billing cycle state (monthly/yearly)
  const [isAnnual, setIsAnnual] = useState(false);

  /**
   * Pricing plans configuration
   */
  const pricingPlans = [
    {
      name: t('pricing.freePlan.name'),
      description: t('pricing.freePlan.description'),
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: t('pricing.freePlan.features', { returnObjects: true }),
      cta: t('pricing.freePlan.cta'),
      ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    {
      name: t('pricing.proPlan.name'),
      description: t('pricing.proPlan.description'),
      monthlyPrice: 29,
      annualPrice: 290,
      popular: true,
      features: t('pricing.proPlan.features', { returnObjects: true }),
      cta: t('pricing.proPlan.cta'),
      ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      name: t('pricing.teamPlan.name'),
      description: t('pricing.teamPlan.description'),
      monthlyPrice: 99,
      annualPrice: 990,
      popular: false,
      features: t('pricing.teamPlan.features', { returnObjects: true }),
      cta: t('pricing.teamPlan.cta'),
      ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    }
  ];

  /**
   * FAQ configuration
   */
  const faqs = [
    {
      question: t('pricing.cancelAnytime'),
      answer: t('pricing.cancelAnytimeAnswer')
    },
    {
      question: t('pricing.annualDiscount'),
      answer: t('pricing.annualDiscountAnswer')
    },
    {
      question: t('pricing.paymentMethods'),
      answer: t('pricing.paymentMethodsAnswer')
    },
    {
      question: t('pricing.freeForever'),
      answer: t('pricing.freeForeverAnswer')
    },
    {
      question: t('pricing.upgradeDowngrade'),
      answer: t('pricing.upgradeDowngradeAnswer')
    },
    {
      question: t('pricing.teamSeats'),
      answer: t('pricing.teamSeatsAnswer')
    }
  ];

  /**
   * Calculate display price
   */
  const getDisplayPrice = (plan: typeof pricingPlans[0]) => {
    if (plan.monthlyPrice === 0) return t('pricing.free');
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    const period = isAnnual ? t('pricing.year') : t('pricing.month');
    return `¥${price}/${period}`;
  };

  /**
   * Calculate annual savings
   */
  const getSavings = (plan: typeof pricingPlans[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const annualTotal = plan.monthlyPrice * 12;
    const savings = annualTotal - plan.annualPrice;
    return savings;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              {t('pricing.choosePlan')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              {t('pricing.description')}
            </p>
          </div>

          {/* Billing cycle toggle */}
          <div className="mt-12 flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                    !isAnnual
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('pricing.monthlyPay')}
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-colors relative ${
                    isAnnual
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('pricing.yearlyPay')}
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {t('pricing.savePercentage')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'border-blue-500 scale-105'
                    : 'border-gray-200'
                }`}
              >
                {/* Popular tag */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {t('pricing.mostPopular')}
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan name and description */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {getDisplayPrice(plan)}
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <div className="text-sm text-green-600">
                        {t('pricing.saveAmount', { amount: getSavings(plan) })}
                      </div>
                    )}
                  </div>

                  {/* Features list */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature: any, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {feature.included ? (
                            <CheckIcon className="w-5 h-5 text-green-500" />
                          ) : (
                            <XMarkIcon className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <span
                          className={`ml-3 text-sm ${
                            feature.included ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise customization */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('pricing.enterpriseTitle')}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {t('pricing.enterpriseDescription')}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{t('pricing.enterpriseFeatures.0')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{t('pricing.enterpriseFeatures.1')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{t('pricing.enterpriseFeatures.2')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{t('pricing.enterpriseFeatures.3')}</span>
                  </li>
                </ul>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  {t('pricing.enterpriseContact')}
                </button>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{t('pricing.customQuote')}</div>
                  <div className="text-gray-600 mb-4">{t('pricing.basedOnRequirements')}</div>
                  <div className="text-sm text-gray-500">
                    {t('pricing.costSavings')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('pricing.faqTitle')}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('pricing.faqSubtitle')}
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('pricing.readyToStart')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('pricing.freeTrial7Days')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {t('pricing.freeTrialButton')}
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              {t('pricing.viewDemo')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}