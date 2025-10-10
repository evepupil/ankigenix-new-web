'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * 定价页面组件
 * 展示不同的订阅计划和价格选项
 */
export default function Pricing() {
  // 计费周期状态（月付/年付）
  const [isAnnual, setIsAnnual] = useState(false);

  /**
   * 定价计划配置
   */
  const pricingPlans = [
    {
      name: '免费版',
      description: '适合个人用户试用',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        { name: '每月10张闪卡', included: true },
        { name: '基础AI生成', included: true },
        { name: '文本输入', included: true },
        { name: '标准模板', included: true },
        { name: '基础导出格式', included: true },
        { name: '文件上传', included: false },
        { name: '网页链接解析', included: false },
        { name: '高级AI模型', included: false },
        { name: '批量处理', included: false },
        { name: '优先客服支持', included: false },
        { name: '团队协作', included: false },
        { name: 'API访问', included: false }
      ],
      cta: '免费开始',
      ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    {
      name: '专业版',
      description: '适合学生和个人学习者',
      monthlyPrice: 29,
      annualPrice: 290,
      popular: true,
      features: [
        { name: '每月500张闪卡', included: true },
        { name: '高级AI生成', included: true },
        { name: '所有输入方式', included: true },
        { name: '自定义模板', included: true },
        { name: '多种导出格式', included: true },
        { name: '文件上传（PDF、Word等）', included: true },
        { name: '网页链接解析', included: true },
        { name: '高级AI模型', included: true },
        { name: '批量处理', included: true },
        { name: '优先客服支持', included: true },
        { name: '团队协作', included: false },
        { name: 'API访问', included: false }
      ],
      cta: '选择专业版',
      ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      name: '团队版',
      description: '适合教育机构和企业团队',
      monthlyPrice: 99,
      annualPrice: 990,
      popular: false,
      features: [
        { name: '无限制闪卡生成', included: true },
        { name: '最高级AI生成', included: true },
        { name: '所有输入方式', included: true },
        { name: '企业级模板库', included: true },
        { name: '所有导出格式', included: true },
        { name: '批量文件上传', included: true },
        { name: '高级网页解析', included: true },
        { name: '最新AI模型', included: true },
        { name: '高级批量处理', included: true },
        { name: '24/7专属客服', included: true },
        { name: '团队协作功能', included: true },
        { name: 'API访问权限', included: true }
      ],
      cta: '联系销售',
      ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    }
  ];

  /**
   * 常见问题配置
   */
  const faqs = [
    {
      question: '可以随时取消订阅吗？',
      answer: '是的，您可以随时取消订阅。取消后，您的账户将在当前计费周期结束时降级为免费版。'
    },
    {
      question: '年付有什么优惠吗？',
      answer: '选择年付可享受2个月免费，相当于83折优惠。年付用户还可获得优先功能更新。'
    },
    {
      question: '支持哪些支付方式？',
      answer: '我们支持信用卡、借记卡、PayPal、支付宝、微信支付等多种支付方式。'
    },
    {
      question: '免费版有使用期限吗？',
      answer: '免费版没有使用期限，您可以永久使用基础功能。但每月有生成数量限制。'
    },
    {
      question: '可以升级或降级计划吗？',
      answer: '可以随时升级或降级您的订阅计划。升级立即生效，降级在下个计费周期生效。'
    },
    {
      question: '团队版支持多少用户？',
      answer: '团队版基础包含10个用户席位，可根据需要购买额外席位，每个额外席位每月9.9元。'
    }
  ];

  /**
   * 计算显示价格
   */
  const getDisplayPrice = (plan: typeof pricingPlans[0]) => {
    if (plan.monthlyPrice === 0) return '免费';
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    const period = isAnnual ? '年' : '月';
    return `¥${price}/${period}`;
  };

  /**
   * 计算年付节省金额
   */
  const getSavings = (plan: typeof pricingPlans[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const annualTotal = plan.monthlyPrice * 12;
    const savings = annualTotal - plan.annualPrice;
    return savings;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero区域 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              选择适合您的计划
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              从免费试用到企业级解决方案，我们为每个学习需求提供合适的定价计划
            </p>
          </div>

          {/* 计费周期切换 */}
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
                  月付
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-colors relative ${
                    isAnnual
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  年付
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    省17%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 定价卡片 */}
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
                {/* 推荐标签 */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      最受欢迎
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* 计划名称和描述 */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* 价格 */}
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {getDisplayPrice(plan)}
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <div className="text-sm text-green-600">
                        节省 ¥{getSavings(plan)} /年
                      </div>
                    )}
                  </div>

                  {/* 功能列表 */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
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

                  {/* CTA按钮 */}
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

      {/* 企业定制 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  需要企业定制方案？
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  我们为大型教育机构和企业提供定制化解决方案，包括私有部署、定制功能开发、专属技术支持等。
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">私有云部署</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">定制功能开发</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">专属技术支持</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">SLA服务保障</span>
                  </li>
                </ul>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  联系企业销售
                </button>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">定制报价</div>
                  <div className="text-gray-600 mb-4">根据需求量身定制</div>
                  <div className="text-sm text-gray-500">
                    通常比标准计划节省30%以上成本
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 常见问题 */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">常见问题</h2>
            <p className="mt-4 text-lg text-gray-600">
              关于定价和订阅的常见问题解答
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

      {/* 最终CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好开始您的学习之旅了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            立即注册，享受7天免费试用专业版功能
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              免费试用
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              查看演示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}