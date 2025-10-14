'use client';

import React, { useState } from 'react';

export default function ThemePage() {
  const [selectedTab, setSelectedTab] = useState<'colors' | 'typography' | 'components'>('colors');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Design System & Theme Showcase
          </h1>
          <p className="text-xl text-gray-600">
            颜色、字体、组件样式展示 · Colors, Typography & Components
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setSelectedTab('colors')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                selectedTab === 'colors'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Colors 颜色
            </button>
            <button
              onClick={() => setSelectedTab('typography')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                selectedTab === 'typography'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Typography 字体
            </button>
            <button
              onClick={() => setSelectedTab('components')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                selectedTab === 'components'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Components 组件
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Colors Section */}
          {selectedTab === 'colors' && <ColorPalette />}

          {/* Typography Section */}
          {selectedTab === 'typography' && <TypographyShowcase />}

          {/* Components Section */}
          {selectedTab === 'components' && <ComponentsShowcase />}
        </div>
      </div>
    </div>
  );
}

// Color Palette Component
function ColorPalette() {
  const colorGroups = [
    {
      name: 'Primary 主色',
      colors: [
        { name: 'Blue 50', value: '#eff6ff', text: 'text-gray-900' },
        { name: 'Blue 100', value: '#dbeafe', text: 'text-gray-900' },
        { name: 'Blue 200', value: '#bfdbfe', text: 'text-gray-900' },
        { name: 'Blue 300', value: '#93c5fd', text: 'text-gray-900' },
        { name: 'Blue 400', value: '#60a5fa', text: 'text-white' },
        { name: 'Blue 500', value: '#3b82f6', text: 'text-white' },
        { name: 'Blue 600', value: '#2563eb', text: 'text-white' },
        { name: 'Blue 700', value: '#1d4ed8', text: 'text-white' },
        { name: 'Blue 800', value: '#1e40af', text: 'text-white' },
        { name: 'Blue 900', value: '#1e3a8a', text: 'text-white' },
      ],
    },
    {
      name: 'Success 成功',
      colors: [
        { name: 'Green 50', value: '#f0fdf4', text: 'text-gray-900' },
        { name: 'Green 100', value: '#dcfce7', text: 'text-gray-900' },
        { name: 'Green 200', value: '#bbf7d0', text: 'text-gray-900' },
        { name: 'Green 300', value: '#86efac', text: 'text-gray-900' },
        { name: 'Green 400', value: '#4ade80', text: 'text-white' },
        { name: 'Green 500', value: '#22c55e', text: 'text-white' },
        { name: 'Green 600', value: '#16a34a', text: 'text-white' },
        { name: 'Green 700', value: '#15803d', text: 'text-white' },
        { name: 'Green 800', value: '#166534', text: 'text-white' },
        { name: 'Green 900', value: '#14532d', text: 'text-white' },
      ],
    },
    {
      name: 'Warning 警告',
      colors: [
        { name: 'Yellow 50', value: '#fefce8', text: 'text-gray-900' },
        { name: 'Yellow 100', value: '#fef9c3', text: 'text-gray-900' },
        { name: 'Yellow 200', value: '#fef08a', text: 'text-gray-900' },
        { name: 'Yellow 300', value: '#fde047', text: 'text-gray-900' },
        { name: 'Yellow 400', value: '#facc15', text: 'text-gray-900' },
        { name: 'Yellow 500', value: '#eab308', text: 'text-white' },
        { name: 'Yellow 600', value: '#ca8a04', text: 'text-white' },
        { name: 'Yellow 700', value: '#a16207', text: 'text-white' },
        { name: 'Yellow 800', value: '#854d0e', text: 'text-white' },
        { name: 'Yellow 900', value: '#713f12', text: 'text-white' },
      ],
    },
    {
      name: 'Danger 危险',
      colors: [
        { name: 'Red 50', value: '#fef2f2', text: 'text-gray-900' },
        { name: 'Red 100', value: '#fee2e2', text: 'text-gray-900' },
        { name: 'Red 200', value: '#fecaca', text: 'text-gray-900' },
        { name: 'Red 300', value: '#fca5a5', text: 'text-gray-900' },
        { name: 'Red 400', value: '#f87171', text: 'text-white' },
        { name: 'Red 500', value: '#ef4444', text: 'text-white' },
        { name: 'Red 600', value: '#dc2626', text: 'text-white' },
        { name: 'Red 700', value: '#b91c1c', text: 'text-white' },
        { name: 'Red 800', value: '#991b1b', text: 'text-white' },
        { name: 'Red 900', value: '#7f1d1d', text: 'text-white' },
      ],
    },
    {
      name: 'Neutral 中性',
      colors: [
        { name: 'Gray 50', value: '#f9fafb', text: 'text-gray-900' },
        { name: 'Gray 100', value: '#f3f4f6', text: 'text-gray-900' },
        { name: 'Gray 200', value: '#e5e7eb', text: 'text-gray-900' },
        { name: 'Gray 300', value: '#d1d5db', text: 'text-gray-900' },
        { name: 'Gray 400', value: '#9ca3af', text: 'text-white' },
        { name: 'Gray 500', value: '#6b7280', text: 'text-white' },
        { name: 'Gray 600', value: '#4b5563', text: 'text-white' },
        { name: 'Gray 700', value: '#374151', text: 'text-white' },
        { name: 'Gray 800', value: '#1f2937', text: 'text-white' },
        { name: 'Gray 900', value: '#111827', text: 'text-white' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {colorGroups.map((group) => (
        <div key={group.name} className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{group.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
            {group.colors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div
                  className={`h-20 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center ${color.text}`}
                  style={{ backgroundColor: color.value }}
                >
                  <span className="text-xs font-medium">{color.name.split(' ')[1]}</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-900">{color.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Typography Showcase Component
function TypographyShowcase() {
  return (
    <div className="space-y-8">
      {/* Headings */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Headings 标题</h3>
        <div className="space-y-4">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">
              Heading 1 标题一级 (5xl)
            </h1>
            <p className="text-sm text-gray-500 mt-1">Font size: 3rem (48px)</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Heading 2 标题二级 (4xl)
            </h2>
            <p className="text-sm text-gray-500 mt-1">Font size: 2.25rem (36px)</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">
              Heading 3 标题三级 (3xl)
            </h3>
            <p className="text-sm text-gray-500 mt-1">Font size: 1.875rem (30px)</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900">
              Heading 4 标题四级 (2xl)
            </h4>
            <p className="text-sm text-gray-500 mt-1">Font size: 1.5rem (24px)</p>
          </div>
          <div>
            <h5 className="text-xl font-bold text-gray-900">
              Heading 5 标题五级 (xl)
            </h5>
            <p className="text-sm text-gray-500 mt-1">Font size: 1.25rem (20px)</p>
          </div>
          <div>
            <h6 className="text-lg font-bold text-gray-900">
              Heading 6 标题六级 (lg)
            </h6>
            <p className="text-sm text-gray-500 mt-1">Font size: 1.125rem (18px)</p>
          </div>
        </div>
      </div>

      {/* Body Text */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Body Text 正文</h3>
        <div className="space-y-6">
          <div>
            <p className="text-xl text-gray-900">
              Large text 大号文本 (xl) - The quick brown fox jumps over the lazy dog.
              快速的棕色狐狸跳过懒狗。中文字体测试显示效果。
            </p>
            <p className="text-sm text-gray-500 mt-1">Font size: 1.25rem (20px)</p>
          </div>
          <div>
            <p className="text-lg text-gray-900">
              Medium text 中号文本 (lg) - The quick brown fox jumps over the lazy dog.
              快速的棕色狐狸跳过懒狗。中文字体测试显示效果。
            </p>
            <p className="text-sm text-gray-500 mt-1">Font size: 1.125rem (18px)</p>
          </div>
          <div>
            <p className="text-base text-gray-900">
              Regular text 常规文本 (base) - The quick brown fox jumps over the lazy dog.
              快速的棕色狐狸跳过懒狗。中文字体测试显示效果。
            </p>
            <p className="text-sm text-gray-500 mt-1">Font size: 1rem (16px)</p>
          </div>
          <div>
            <p className="text-sm text-gray-900">
              Small text 小号文本 (sm) - The quick brown fox jumps over the lazy dog.
              快速的棕色狐狸跳过懒狗。中文字体测试显示效果。
            </p>
            <p className="text-xs text-gray-500 mt-1">Font size: 0.875rem (14px)</p>
          </div>
          <div>
            <p className="text-xs text-gray-900">
              Extra small text 超小文本 (xs) - The quick brown fox jumps over the lazy dog.
              快速的棕色狐狸跳过懒狗。中文字体测试显示效果。
            </p>
            <p className="text-xs text-gray-500 mt-1">Font size: 0.75rem (12px)</p>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Font Weights 字重</h3>
        <div className="space-y-4">
          <p className="text-lg font-thin text-gray-900">
            Thin (100) - 细体字重 · The quick brown fox
          </p>
          <p className="text-lg font-extralight text-gray-900">
            Extra Light (200) - 超细字重 · The quick brown fox
          </p>
          <p className="text-lg font-light text-gray-900">
            Light (300) - 轻字重 · The quick brown fox
          </p>
          <p className="text-lg font-normal text-gray-900">
            Normal (400) - 常规字重 · The quick brown fox
          </p>
          <p className="text-lg font-medium text-gray-900">
            Medium (500) - 中等字重 · The quick brown fox
          </p>
          <p className="text-lg font-semibold text-gray-900">
            Semi Bold (600) - 半粗字重 · The quick brown fox
          </p>
          <p className="text-lg font-bold text-gray-900">
            Bold (700) - 粗体字重 · The quick brown fox
          </p>
          <p className="text-lg font-extrabold text-gray-900">
            Extra Bold (800) - 超粗字重 · The quick brown fox
          </p>
          <p className="text-lg font-black text-gray-900">
            Black (900) - 最粗字重 · The quick brown fox
          </p>
        </div>
      </div>

      {/* Monospace Font */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Monospace 等宽字体</h3>
        <div className="space-y-4">
          <p className="text-lg font-mono text-gray-900">
            Code font example: const hello = &quot;world&quot;; 代码示例
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <code>
              function generateFlashcards(text: string) &#123;<br />
              &nbsp;&nbsp;// 生成闪卡的函数<br />
              &nbsp;&nbsp;return processText(text);<br />
              &#125;
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components Showcase
function ComponentsShowcase() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Buttons 按钮</h3>
        <div className="space-y-6">
          {/* Primary Buttons */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Primary Buttons 主要按钮</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Small 小
              </button>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Medium 中
              </button>
              <button className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg">
                Large 大
              </button>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed">
                Disabled 禁用
              </button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Secondary Buttons 次要按钮</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                Small 小
              </button>
              <button className="px-8 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                Medium 中
              </button>
              <button className="px-10 py-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-lg">
                Large 大
              </button>
            </div>
          </div>

          {/* Outline Buttons */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Outline Buttons 描边按钮</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Primary 主要
              </button>
              <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                Success 成功
              </button>
              <button className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Danger 危险
              </button>
              <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Neutral 中性
              </button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Icon Buttons 图标按钮</h4>
            <div className="flex flex-wrap gap-3">
              <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button className="p-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Input Fields 输入框</h3>
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Input 默认输入框
            </label>
            <input
              type="text"
              placeholder="Enter your text here... 在此输入文本"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Input 邮箱输入框
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Input 密码输入框
            </label>
            <input
              type="password"
              placeholder="Enter password... 输入密码"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Textarea 文本域
            </label>
            <textarea
              rows={4}
              placeholder="Enter long text here... 在此输入长文本"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disabled Input 禁用状态
            </label>
            <input
              type="text"
              placeholder="Disabled input 禁用的输入框"
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Cards 卡片</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Basic Card 基础卡片</h4>
            <p className="text-gray-600">
              This is a basic card component with border.
              这是一个带边框的基础卡片组件。
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-bold mb-2">Gradient Card 渐变卡片</h4>
            <p className="text-blue-100">
              This card has a gradient background.
              这个卡片有渐变背景。
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Shadow Card 阴影卡片</h4>
            <p className="text-gray-600">
              This card uses shadow for depth.
              这个卡片使用阴影来增加深度。
            </p>
          </div>
        </div>
      </div>

      {/* Badges & Pills */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Badges & Pills 徽章和标签</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Primary 主要
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Success 成功
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Warning 警告
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Danger 危险
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              Neutral 中性
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium">
              Solid Badge
            </span>
            <span className="px-3 py-1 border-2 border-blue-600 text-blue-600 rounded-md text-sm font-medium">
              Outline Badge
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium">
              Gradient Badge
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Alerts 提示框</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong className="font-bold">Info 信息:</strong> This is an informational message. 这是一条信息提示。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong className="font-bold">Success 成功:</strong> Operation completed successfully! 操作成功完成！
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong className="font-bold">Warning 警告:</strong> Please review before proceeding. 请在继续之前仔细检查。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong className="font-bold">Error 错误:</strong> Something went wrong. Please try again. 出现错误，请重试。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Counter Example */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Interactive Example 交互示例</h3>
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={() => setCount(count - 1)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xl font-bold"
          >
            -
          </button>
          <div className="text-5xl font-bold text-gray-900 min-w-[120px] text-center">
            {count}
          </div>
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xl font-bold"
          >
            +
          </button>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => setCount(0)}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset 重置
          </button>
        </div>
      </div>
    </div>
  );
}
