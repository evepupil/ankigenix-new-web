'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, CreditCardIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ResultsList from '@/components/ResultsList';
import { apiService } from '@/services/api';
import { Flashcard, FlashcardSet } from '@/types/flashcard';

/**
 * Dashboard页面组件
 * 提供用户的主要工作界面，包含积分信息、任务状态和核心操作区域
 */
export default function Dashboard() {
  const router = useRouter();

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  // 处理状态
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState('');

  // 生成的闪卡列表
  const [generatedCards, setGeneratedCards] = useState<Flashcard[]>([]);
  
  // 任务历史记录
  const [taskHistory, setTaskHistory] = useState<any[]>([]);

  // 从 localStorage 加载任务历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('ankiTaskHistory');
    if (savedHistory) {
      try {
        setTaskHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('加载任务历史失败:', e);
      }
    }
  }, []);

  // 保存任务历史到 localStorage
  useEffect(() => {
    localStorage.setItem('ankiTaskHistory', JSON.stringify(taskHistory));
  }, [taskHistory]);

  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 处理生成闪卡的操作
   */
  const handleGenerateCards = async () => {
    if (isProcessing) return; // 防止重复提交

    setIsProcessing(true);
    setProcessMessage('正在生成闪卡...');

    try {
      let result;
      let inputTitle = '';

      if (activeTab === 'text' && textInput.trim()) {
        // 文本生成
        result = await apiService.generateFlashcardsFromText(textInput);
        inputTitle = `文本生成 - ${textInput.substring(0, 30)}${textInput.length > 30 ? '...' : ''}`;
      } else if (activeTab === 'file' && selectedFile) {
        // 文件生成
        result = await apiService.generateFlashcardsFromFile(selectedFile);
        inputTitle = `文件生成 - ${selectedFile.name}`;
      } else if (activeTab === 'url' && urlInput.trim()) {
        // 网页生成
        result = await apiService.generateFlashcardsFromUrl(urlInput, 10, 'zh');
        inputTitle = `网页生成 - ${urlInput}`;
      } else {
        setProcessMessage('请提供有效的输入内容');
        setIsProcessing(false);
        return;
      }

      if (result.success && result.cards) {
        // 为每张卡片添加唯一ID
        const cardsWithIds = result.cards.map((card: Flashcard, index: number) => ({
          ...card,
          id: `card-${Date.now()}-${index}`,
          qualityScore: 85 + Math.floor(Math.random() * 15), // 模拟质量评分 85-100
        }));

        setGeneratedCards(cardsWithIds);

        // 创建闪卡集数据结构
        const flashcardSet: FlashcardSet = {
          id: `set-${Date.now()}`,
          title: inputTitle,
          topic: activeTab === 'text'
            ? textInput.substring(0, 50)
            : activeTab === 'url'
            ? urlInput
            : selectedFile?.name || '未知主题',
          createdAt: new Date().toLocaleString('zh-CN'),
          totalCards: cardsWithIds.length,
          averageQuality: Math.floor(cardsWithIds.reduce((sum: number, card: any) => sum + (card.qualityScore || 0), 0) / cardsWithIds.length),
          chapters: [
            {
              id: 'ch-default',
              title: '默认章节',
              description: '自动生成的闪卡',
              isExpanded: true,
              cards: cardsWithIds,
            },
          ],
        };

        // 保存到 localStorage
        localStorage.setItem('currentFlashcardSet', JSON.stringify(flashcardSet));

        // 添加到任务历史
        const newTask = {
          id: Date.now().toString(),
          title: inputTitle,
          inputType: activeTab,
          status: 'completed' as const,
          createdAt: new Date().toLocaleString('zh-CN'),
          completedAt: new Date().toLocaleString('zh-CN'),
          cardCount: cardsWithIds.length,
          qualityScore: flashcardSet.averageQuality,
          flashcardSetId: flashcardSet.id, // 保存闪卡集ID用于后续访问
        };

        setTaskHistory(prev => [newTask, ...prev]);
        setProcessMessage(`成功生成 ${cardsWithIds.length} 张闪卡`);

        // 延迟后跳转到预览页面
        setTimeout(() => {
          router.push('/preview');
        }, 1000);
      } else {
        setProcessMessage(result.error || '生成闪卡失败');
      }
    } catch (error) {
      console.error('生成闪卡时出错:', error);
      setProcessMessage('生成闪卡时发生错误');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 处理文件选择
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // 文件类型验证
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt|md)$/i)) {
        setProcessMessage('不支持的文件类型。请上传 PDF, DOC, DOCX, TXT, 或 MD 文件。');
        return;
      }
      
      // 文件大小限制 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setProcessMessage('文件大小不能超过 10MB');
        return;
      }
      
      setSelectedFile(file);
      setProcessMessage(`已选择文件: ${file.name}`);
    }
  };

  /**
   * 触发文件选择
   */
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={triggerFileSelect}
            >
              <div className="space-y-2">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    点击上传文件
                  </span>
                  <span> 或拖拽文件到此处</span>
                </div>
                <p className="text-xs text-gray-500">
                  支持 PDF, DOC, DOCX, TXT, MD 等格式，最大 10MB
                </p>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-gray-700">
                    已选择: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>
            {/* 隐藏的文件输入框 */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
            />
          </div>
        );
      case 'url':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              输入网页链接
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500">
              支持网页文章、博客等内容源，AI将自动爬取网页内容并生成闪卡
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
        {/* 核心操作区域 */}
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
                  网页
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
            <div className="flex flex-col items-center">
              <button
                onClick={handleGenerateCards}
                disabled={isProcessing}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <span>生成闪卡</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>

              {/* 状态消息 */}
              {processMessage && (
                <div className={`mt-3 text-center text-sm ${processMessage.includes('失败') || processMessage.includes('错误') ? 'text-red-600' : 'text-blue-600'}`}>
                  {processMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 生成结果列表 */}
        <div className="mt-8">
          <ResultsList taskHistory={taskHistory} />
        </div>
      </div>
    </div>
  );
}