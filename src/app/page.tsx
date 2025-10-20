import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ankigenix - AI驱动的科学闪卡生成器 | 高效学习Anki卡片",
  description: "Ankigenix 是一款AI驱动的科学闪卡生成器，支持文本、文件、URL、视频等多种输入方式，智能生成高质量学习闪卡。提升学习效率，轻松创建Anki卡片。",
  keywords: ["Anki", "闪卡生成器", "AI学习工具", "智能卡片", "高效学习", "间隔重复", "记忆卡片", "学习助手", "知识管理"],
  openGraph: {
    title: "Ankigenix - AI驱动的科学闪卡生成器",
    description: "用最高质量的Anki卡片，加速你的学习效率。支持多种输入方式，AI智能生成高质量学习闪卡。",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Ankigenix 首页",
      },
    ],
  },
};

/**
 * 首页组件
 * 包含Hero部分、功能特性和使用说明区域
 */
export default function Home() {
  // JSON-LD 结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Ankigenix",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "description": "AI驱动的科学闪卡生成器，支持多种输入方式，智能生成高质量学习闪卡",
    "featureList": [
      "多种输入方式：文本、文件、URL、主题",
      "AI智能生成高质量闪卡",
      "质量评分系统",
      "导出为Anki格式(.apkg)",
      "章节目录管理"
    ],
    "screenshot": "/og-home.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "120"
    }
  };

  return (
    <div className="bg-white">
      {/* 添加 JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero 部分 */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              用最高质量的
              <span className="text-blue-600"> Anki 卡片</span>
              <br />
              加速你的学习效率
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ankigenix 是一款AI驱动的科学闪卡生成器，支持多种输入方式，
              智能生成高质量学习闪卡，让你的学习更高效、更科学。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                开始生成闪卡
              </Link>
              <Link
                href="/features"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                了解更多功能
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
              强大的AI功能
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              利用先进的人工智能技术，为你提供最优质的学习体验
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">多种输入方式</h3>
              <p className="text-gray-600">
                支持文本、文件、网页、主题等多种输入方式，轻松导入学习材料生成高质量闪卡
              </p>
            </div>

            {/* 功能卡片2 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI智能生成</h3>
              <p className="text-gray-600">
                基于先进的AI大模型，自动生成高质量的问答卡片，提升学习效果
              </p>
            </div>

            {/* 功能卡片3 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">质量评分</h3>
              <p className="text-gray-600">
                智能评估卡片质量，确保每张卡片都能有效提升你的学习效率
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用说明部分 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              如何使用 Ankigenix
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              简单三步，开始你的高效学习之旅
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 步骤1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">输入学习材料</h3>
              <p className="text-gray-600">
                支持文本、文件、网页或主题，选择最适合你的输入方式
              </p>
            </div>

            {/* 步骤2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI智能处理</h3>
              <p className="text-gray-600">
                我们的AI会分析你的材料，自动生成高质量的问答卡片
              </p>
            </div>

            {/* 步骤3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">导出使用</h3>
              <p className="text-gray-600">
                导出为.apkg文件，直接导入Anki开始高效学习
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              立即开始体验
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
              <span className="text-xl font-bold text-gray-900">Ankigenix</span>
            </div>
            <p className="text-gray-600 mb-6">
              用最高质量的Anki卡片，加速你的学习效率
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
                功能特性
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                控制台
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                © 2024 Ankigenix. 保留所有权利。
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
