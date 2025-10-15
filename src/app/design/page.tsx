'use client';

import React from 'react';
import { useLocale } from '@/hooks/useLocale';

export default function DesignSystemPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{t('design.title')}</h1>
          <p className="text-xl text-blue-100">{t('design.colorScheme')}</p>
          <p className="text-gray-300 mt-2">{t('design.focus')}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Color Palette */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Color Palette 配色方案</h2>

          {/* Primary Blue */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Blue 主色-蓝</h3>
            <p className="text-gray-600 mb-6">用于主要操作按钮、链接、强调内容</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <ColorCard color="#EFF6FF" name="Blue 50" textDark />
              <ColorCard color="#DBEAFE" name="Blue 100" textDark />
              <ColorCard color="#BFDBFE" name="Blue 200" textDark />
              <ColorCard color="#60A5FA" name="Blue 400" />
              <ColorCard color="#3B82F6" name="Blue 600" featured />
              <ColorCard color="#1D4ED8" name="Blue 700" />
            </div>
          </div>

          {/* Neutral Gray */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Neutral Gray 中性-灰</h3>
            <p className="text-gray-600 mb-6">用于文本、边框、背景</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              <ColorCard color="#FFFFFF" name="White" textDark border />
              <ColorCard color="#F9FAFB" name="Gray 50" textDark border />
              <ColorCard color="#F3F4F6" name="Gray 100" textDark />
              <ColorCard color="#E5E7EB" name="Gray 200" textDark />
              <ColorCard color="#D1D5DB" name="Gray 300" textDark />
              <ColorCard color="#6B7280" name="Gray 500" />
              <ColorCard color="#374151" name="Gray 700" />
              <ColorCard color="#111827" name="Gray 900" />
            </div>
          </div>

          {/* Functional Colors */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Functional Colors 功能色</h3>
            <p className="text-gray-600 mb-6">用于状态提示（最小化使用）</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ColorCard color="#10B981" name="Success" subtitle="成功状态" />
              <ColorCard color="#F59E0B" name="Warning" subtitle="警告状态" />
              <ColorCard color="#EF4444" name="Error" subtitle="错误状态" />
              <ColorCard color="#8B5CF6" name="Accent" subtitle="点缀色" />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Typography 字体系统</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">极简标题 Heading 1</h1>
              <p className="text-sm text-gray-500">48px / Bold / Gray 900</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">二级标题 Heading 2</h2>
              <p className="text-sm text-gray-500">36px / Bold / Gray 900</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">三级标题 Heading 3</h3>
              <p className="text-sm text-gray-500">24px / Semibold / Gray 900</p>
            </div>

            <div>
              <p className="text-lg text-gray-900 mb-2">
                这是正文大号文本。适用于重要段落和介绍性文字。Body Large Text.
              </p>
              <p className="text-sm text-gray-500">18px / Regular / Gray 900</p>
            </div>

            <div>
              <p className="text-base text-gray-700 mb-2">
                这是标准正文文本。适用于大部分内容展示。Standard body text for most content.
              </p>
              <p className="text-sm text-gray-500">16px / Regular / Gray 700</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">
                这是辅助文本。用于次要信息、提示文字。Secondary text for hints and labels.
              </p>
              <p className="text-sm text-gray-500">14px / Regular / Gray 600</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">
                这是最小文本。用于标注、时间戳等。Caption text for timestamps and metadata.
              </p>
              <p className="text-sm text-gray-500">12px / Regular / Gray 500</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <code className="text-sm font-mono bg-gray-900 text-blue-400 px-3 py-2 rounded block">
                const code = &quot;monospace font for code&quot;; // 代码字体示例
              </code>
              <p className="text-sm text-gray-500 mt-2">14px / Mono / Blue on Dark</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Buttons 按钮系统</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary 主要按钮</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  生成闪卡
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Create Cards
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed font-medium">
                  Disabled
                </button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Secondary 次要按钮</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  取消
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Cancel
                </button>
                <button className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-medium">
                  返回
                </button>
              </div>
            </div>

            {/* Text Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Text 文本按钮</h3>
              <div className="flex flex-wrap gap-6">
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  了解更多 →
                </button>
                <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  查看详情
                </button>
                <button className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
                  跳过
                </button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Icon 图标按钮</h3>
              <div className="flex flex-wrap gap-3">
                <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Fields */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Input Fields 输入框</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标准输入框 Standard Input
              </label>
              <input
                type="text"
                placeholder="请输入内容..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聚焦状态 Focus State
              </label>
              <input
                type="text"
                placeholder="点击查看聚焦效果"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文本域 Textarea
              </label>
              <textarea
                rows={4}
                placeholder="输入长文本内容..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                禁用状态 Disabled
              </label>
              <input
                type="text"
                placeholder="禁用的输入框"
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Cards 卡片组件</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">基础卡片</h3>
              <p className="text-gray-600 text-sm mb-4">
                带边框的白色卡片，hover 时显示阴影
              </p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                查看详情 →
              </button>
            </div>

            {/* Subtle Card */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-white hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">浅色卡片</h3>
              <p className="text-gray-600 text-sm mb-4">
                灰色背景卡片，适合区分内容区域
              </p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                查看详情 →
              </button>
            </div>

            {/* Dark Card */}
            <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all">
              <h3 className="text-xl font-semibold text-white mb-2">深色卡片</h3>
              <p className="text-gray-300 text-sm mb-4">
                深色背景，适合强调重点内容
              </p>
              <button className="text-blue-400 text-sm font-medium hover:text-blue-300">
                查看详情 →
              </button>
            </div>

            {/* Stat Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">今日生成</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">128</div>
              <div className="text-sm text-green-600">↑ 12% vs 昨天</div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">学习进度</span>
                <span className="text-sm font-bold text-blue-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">开始使用</h3>
              <p className="text-blue-100 text-sm mb-4">
                立即生成你的第一张闪卡
              </p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                立即开始
              </button>
            </div>
          </div>
        </section>

        {/* Badges & Tags */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Badges & Tags 标签</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">状态标签</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  进行中
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  已完成
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                  待处理
                </span>
                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200">
                  失败
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">分类标签</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                  英语
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                  数学
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                  编程
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                  历史
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">计数标签</h3>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm">
                  <span className="text-gray-700">闪卡数量</span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-medium text-xs">
                    156
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm">
                  <span className="text-gray-700">今日复习</span>
                  <span className="px-2 py-0.5 bg-gray-900 text-white rounded font-medium text-xs">
                    24
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts & Messages */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Alerts 提示信息</h2>

          <div className="space-y-4 max-w-3xl">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900">提示信息</div>
                <div className="text-sm text-blue-700 mt-1">这是一条普通的提示信息，用于告知用户相关内容。</div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <div className="text-sm font-medium text-green-900">操作成功</div>
                <div className="text-sm text-green-700 mt-1">你的闪卡已成功生成，可以开始学习了！</div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">系统提示</div>
                <div className="text-sm text-gray-700 mt-1">你有 5 张闪卡需要复习，建议今天完成。</div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <div className="text-sm font-medium text-red-900">操作失败</div>
                <div className="text-sm text-red-700 mt-1">生成失败，请检查输入内容后重试。</div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="pb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Design Principles 设计原则</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 专注</h3>
              <p className="text-gray-600 text-sm">
                极简配色减少视觉干扰，让用户专注于学习内容本身。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📐 一致</h3>
              <p className="text-gray-600 text-sm">
                统一的间距、圆角、阴影系统，保持界面的一致性。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 清晰</h3>
              <p className="text-gray-600 text-sm">
                清晰的视觉层级，重要信息用蓝色强调，次要信息用灰色。
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">⚡ 高效</h3>
              <p className="text-gray-600 text-sm">
                减少认知负载，让用户快速完成操作，回归学习本质。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Color Card Component
interface ColorCardProps {
  color: string;
  name: string;
  subtitle?: string;
  textDark?: boolean;
  border?: boolean;
  featured?: boolean;
}

function ColorCard({ color, name, subtitle, textDark, border, featured }: ColorCardProps) {
  return (
    <div className="space-y-2">
      <div
        className={`h-24 rounded-lg flex items-center justify-center transition-transform hover:scale-105 ${
          textDark ? 'text-gray-900' : 'text-white'
        } ${border ? 'border-2 border-gray-300' : ''} ${
          featured ? 'ring-2 ring-offset-2 ring-blue-600' : ''
        }`}
        style={{ backgroundColor: color }}
      >
        {featured && (
          <span className="text-xs font-bold">PRIMARY</span>
        )}
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-900">{name}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        <div className="text-xs text-gray-500 font-mono">{color}</div>
      </div>
    </div>
  );
}
