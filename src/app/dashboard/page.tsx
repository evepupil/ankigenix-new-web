'use client';

import { useState } from 'react';
import { ChevronDownIcon, CreditCardIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ResultsList from '@/components/ResultsList';

/**
 * Dashboard页面组件
 * 提供用户的主要工作界面，包含积分信息、任务状态和核心操作区域
 */
export default function Dashboard() {
  // 模拟用户数据
  const [userCredits] = useState({
    remaining: 150,
    total: 200,
    plan: 'Pro'
  });

  // 模拟任务状态数据
  const [taskStatus] = useState({
    pending: 2,
    processing: 1,
    completed: 15,
    failed: 0
  });

  // 当前选中的输入方式
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url' | 'topic'>('text');

  // 输入内容状态
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [topicInput, setTopicInput] = useState('');

  // AI配置状态
  const [aiConfig, setAiConfig] = useState({
    difficulty: 'medium',
    cardCount: 10,
    language: 'zh',
    includeImages: false
  });

  /**
   * 处理生成闪卡的操作
   */
  const handleGenerateCards = () => {
    console.log('生成闪卡', { activeTab, textInput, urlInput, topicInput, aiConfig });
    // 这里将来会调用API
  };

  /**
   * 渲染输入区域内容
   */
  const renderInputContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              输入学习内容
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="粘贴您的学习材料，支持文本、笔记、文档内容等..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        );
      case 'file':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              上传文件
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <div className="space-y-2">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                    点击上传文件
                  </span>
                  <span> 或拖拽文件到此处</span>
                </div>
                <p className="text-xs text-gray-500">
                  支持 PDF, DOC, TXT, MD 等格式，最大 10MB
                </p>
              </div>
            </div>
          </div>
        );
      case 'url':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              输入网页链接或视频地址
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com 或 YouTube/Bilibili 视频链接"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500">
              支持网页文章、YouTube视频、Bilibili视频等内容源
            </p>
          </div>
        );
      case 'topic':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              主题生成 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">Pro</span>
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="例如：高中数学函数、英语语法、历史事件等"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500">
              AI将根据主题自动生成相关的学习内容和闪卡
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部信息栏 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 积分信息 */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CreditCardIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">剩余积分:</span>
                <span className="text-lg font-bold text-blue-600">{userCredits.remaining}</span>
                <span className="text-sm text-gray-500">/ {userCredits.total}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {userCredits.plan}
                </span>
              </div>
            </div>

            {/* 任务状态 */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">处理中: {taskStatus.processing}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-4 w-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">等待中: {taskStatus.pending}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">已完成: {taskStatus.completed}</span>
                </div>
                {taskStatus.failed > 0 && (
                  <div className="flex items-center space-x-1">
                    <XCircleIcon className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">失败: {taskStatus.failed}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 核心操作区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">创建新的闪卡集</h2>
                
                {/* Tab切换 */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'text'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      文本输入
                    </button>
                    <button
                      onClick={() => setActiveTab('file')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'file'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      文件上传
                    </button>
                    <button
                      onClick={() => setActiveTab('url')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'url'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      网页/视频
                    </button>
                    <button
                      onClick={() => setActiveTab('topic')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'topic'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      主题生成 <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded ml-1">Pro</span>
                    </button>
                  </nav>
                </div>

                {/* 输入内容区域 */}
                <div className="mb-8">
                  {renderInputContent()}
                </div>

                {/* 生成按钮 */}
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerateCards}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>生成闪卡</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI配置侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI 配置</h3>
                
                <div className="space-y-4">
                  {/* 难度设置 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      难度级别
                    </label>
                    <select
                      value={aiConfig.difficulty}
                      onChange={(e) => setAiConfig({...aiConfig, difficulty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="easy">简单</option>
                      <option value="medium">中等</option>
                      <option value="hard">困难</option>
                    </select>
                  </div>

                  {/* 卡片数量 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      卡片数量
                    </label>
                    <select
                      value={aiConfig.cardCount}
                      onChange={(e) => setAiConfig({...aiConfig, cardCount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={5}>5 张</option>
                      <option value={10}>10 张</option>
                      <option value={20}>20 张</option>
                      <option value={50}>50 张</option>
                    </select>
                  </div>

                  {/* 语言设置 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      卡片语言
                    </label>
                    <select
                      value={aiConfig.language}
                      onChange={(e) => setAiConfig({...aiConfig, language: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="zh">中文</option>
                      <option value="en">English</option>
                      <option value="auto">自动检测</option>
                    </select>
                  </div>

                  {/* 包含图片 */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={aiConfig.includeImages}
                        onChange={(e) => setAiConfig({...aiConfig, includeImages: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">包含图片</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      AI将尝试为卡片添加相关图片
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 生成结果列表 */}
        <div className="mt-8">
          <ResultsList />
        </div>
      </div>
    </div>
  );
}