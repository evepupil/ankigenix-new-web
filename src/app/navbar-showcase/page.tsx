'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NavbarShowcase() {
  const [selectedStyle, setSelectedStyle] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 页面标题 */}
      <div className="py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">导航栏设计展示</h1>
        <p className="text-gray-600 mb-8">选择你喜欢的导航栏风格</p>

        {/* 风格选择器 */}
        <div className="flex justify-center gap-4 mb-12">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedStyle(num)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedStyle === num
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              风格 {num}
            </button>
          ))}
        </div>
      </div>

      {/* 导航栏展示区域 */}
      <div className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* 风格1：现代简约 - 黑白灰配色 */}
          {selectedStyle === 1 && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">风格1：现代简约</h2>

                {/* 导航栏预览 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <nav className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                      <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                          <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            AnkiGenix
                          </div>
                        </div>

                        {/* 导航链接 */}
                        <div className="hidden md:flex items-center space-x-8">
                          <Link href="/" className="text-gray-900 hover:text-gray-600 font-medium transition-colors relative group">
                            首页
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                          <Link href="/features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group">
                            功能
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group">
                            价格
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group">
                            控制台
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
                          </Link>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-4">
                          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            登录
                          </Link>
                          <Link
                            href="/register"
                            className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                          >
                            注册
                          </Link>
                        </div>
                      </div>
                    </div>
                  </nav>

                  {/* 示例内容 */}
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                    <p className="text-gray-400">页面内容区域</p>
                  </div>
                </div>

                {/* 特点说明 */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">简洁设计</div>
                    <div className="text-xs text-gray-500 mt-1">黑白灰配色，专业简约</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">下划线动效</div>
                    <div className="text-xs text-gray-500 mt-1">悬停时流畅的下划线过渡</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">清晰层次</div>
                    <div className="text-xs text-gray-500 mt-1">边框分隔，结构清晰</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 风格2：玻璃态 - 白色磨砂玻璃 + 蓝色点缀 */}
          {selectedStyle === 2 && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">风格2：玻璃态</h2>

                {/* 导航栏预览 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden relative">
                  {/* 背景图片模拟 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50"></div>

                  <nav className="relative backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6">
                      <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-gray-900 bg-clip-text text-transparent">
                              AnkiGenix
                            </span>
                          </div>
                        </div>

                        {/* 导航链接 */}
                        <div className="hidden md:flex items-center space-x-2">
                          <Link
                            href="/"
                            className="px-4 py-2 text-blue-600 font-medium bg-blue-50/80 rounded-lg transition-all hover:bg-blue-100/80"
                          >
                            首页
                          </Link>
                          <Link
                            href="/features"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg transition-all hover:bg-white/60"
                          >
                            功能
                          </Link>
                          <Link
                            href="/pricing"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg transition-all hover:bg-white/60"
                          >
                            价格
                          </Link>
                          <Link
                            href="/dashboard"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg transition-all hover:bg-white/60"
                          >
                            控制台
                          </Link>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-3">
                          <Link
                            href="/login"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-white/60 transition-all"
                          >
                            登录
                          </Link>
                          <Link
                            href="/register"
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105"
                          >
                            开始使用
                          </Link>
                        </div>
                      </div>
                    </div>
                  </nav>

                  {/* 示例内容 */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
                    <p className="text-gray-400">页面内容区域</p>
                  </div>
                </div>

                {/* 特点说明 */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">磨砂玻璃</div>
                    <div className="text-xs text-gray-500 mt-1">backdrop-blur 现代质感</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">蓝色点缀</div>
                    <div className="text-xs text-gray-500 mt-1">渐变按钮，科技感强</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">圆角设计</div>
                    <div className="text-xs text-gray-500 mt-1">柔和圆角，亲和力强</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 风格3：渐变科技 - 深色渐变 + 蓝色高光 */}
          {selectedStyle === 3 && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">风格3：渐变科技</h2>

                {/* 导航栏预览 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                    {/* 背景光效 */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-6 relative">
                      <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                                <span className="text-white font-bold text-sm">A</span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg blur opacity-50"></div>
                            </div>
                            <span className="text-xl font-bold text-white">
                              Anki<span className="text-blue-400">Genix</span>
                            </span>
                          </div>
                        </div>

                        {/* 导航链接 */}
                        <div className="hidden md:flex items-center space-x-6">
                          <Link
                            href="/"
                            className="text-white font-medium relative group"
                          >
                            首页
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-100 group-hover:scale-x-110 transition-transform"></span>
                          </Link>
                          <Link
                            href="/features"
                            className="text-gray-300 hover:text-white font-medium relative group transition-colors"
                          >
                            功能
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all"></span>
                          </Link>
                          <Link
                            href="/pricing"
                            className="text-gray-300 hover:text-white font-medium relative group transition-colors"
                          >
                            价格
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all"></span>
                          </Link>
                          <Link
                            href="/dashboard"
                            className="text-gray-300 hover:text-white font-medium relative group transition-colors"
                          >
                            控制台
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all"></span>
                          </Link>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-4">
                          <Link
                            href="/login"
                            className="text-gray-300 hover:text-white font-medium transition-colors"
                          >
                            登录
                          </Link>
                          <Link
                            href="/register"
                            className="relative px-5 py-2 rounded-lg font-medium text-white overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:from-blue-500 group-hover:to-blue-400 transition-all"></div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-400 to-blue-600 blur-xl transition-opacity"></div>
                            <span className="relative z-10">开始探索</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </nav>

                  {/* 示例内容 */}
                  <div className="h-64 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <p className="text-gray-500">页面内容区域</p>
                  </div>
                </div>

                {/* 特点说明 */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">深色主题</div>
                    <div className="text-xs text-gray-500 mt-1">渐变背景，科技感十足</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">光效点缀</div>
                    <div className="text-xs text-gray-500 mt-1">蓝色光晕，视觉焦点</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">渐变动效</div>
                    <div className="text-xs text-gray-500 mt-1">悬停渐变过渡效果</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 返回首页 */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
