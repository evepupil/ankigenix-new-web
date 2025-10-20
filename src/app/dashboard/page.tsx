'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResultsList from '@/components/ResultsList';
import ToastContainer, { ToastMessage } from '@/components/Toast';
import CatalogSelectionModal from '@/components/CatalogSelectionModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiService, Chapter } from '@/services/api';
import { Flashcard, FlashcardSet } from '@/types/flashcard';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/SEOHead';

/**
 * Dashboard页面组件
 * 提供用户的主要工作界面，包含任务操作和核心功能区域
 */
function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // 当前选中的输入方式
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url' | 'topic'>('text');

  // 输入内容状态
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  // 处理状态
  const [isProcessing, setIsProcessing] = useState(false);

  // Toast 通知列表
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 生成的闪卡列表
  const [generatedCards, setGeneratedCards] = useState<Flashcard[]>([]);
  
  // 任务历史记录
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true); // 首次加载时为true
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // 从API获取任务历史，每5秒轮询一次
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // 只在首次加载时显示加载状态
        if (isFirstLoad) {
          setIsLoadingTasks(true);
        }

        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/tasks?limit=20', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success && data.tasks) {
          setTaskHistory(data.tasks);
        }
      } catch (error) {
        console.error('获取任务列表失败:', error);
      } finally {
        if (isFirstLoad) {
          setIsLoadingTasks(false);
          setIsFirstLoad(false);
        }
      }
    };

    // 立即获取一次
    fetchTasks();

    // 每5秒轮询一次
    const interval = setInterval(fetchTasks, 5000);

    return () => clearInterval(interval);
  }, [isFirstLoad]);

  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);

  // 大纲选择对话框状态
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogData, setCatalogData] = useState<Chapter[]>([]);
  const [catalogFileName, setCatalogFileName] = useState('');

  // 当前任务ID（用于文件生成时传递给后端）
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  /**
   * 显示 Toast 通知
   */
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      title,
      message,
      duration: 3000,
    };
    setToasts(prev => [...prev, newToast]);
  };

  /**
   * 关闭 Toast 通知
   */
  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  /**
   * 处理生成闪卡的操作
   */
  const handleGenerateCards = async () => {
    if (isProcessing) return; // 防止重复提交

    // 验证输入内容
    if (activeTab === 'text' && !textInput.trim()) {
      showToast('warning', t('dashboard.messages.inputRequired'), t('dashboard.messages.inputHint'));
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      showToast('warning', t('dashboard.messages.fileRequired'), t('dashboard.messages.fileHint'));
      return;
    }

    if (activeTab === 'url' && !urlInput.trim()) {
      showToast('warning', t('dashboard.messages.urlRequired'), t('dashboard.messages.urlHint'));
      return;
    }

    if (activeTab === 'topic' && !topicInput.trim()) {
      showToast('warning', t('dashboard.messages.topicRequired'), t('dashboard.messages.topicHint'));
      return;
    }

    setIsProcessing(true);

    // 创建任务记录
    let taskId: string | null = null;
    try {
      const token = localStorage.getItem('auth_token');
      const taskResponse = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_type: activeTab,
          workflow_type: activeTab === 'file' ? 'extract_catalog' : 'direct_generate',
          input_data: {
            text: activeTab === 'text' ? textInput : undefined,
            file: activeTab === 'file' ? { name: selectedFile?.name, type: selectedFile?.type } : undefined,
            web_url: activeTab === 'url' ? urlInput : undefined,
            topic: activeTab === 'topic' ? topicInput : undefined,
          },
        }),
      });

      const taskData = await taskResponse.json();
      if (taskData.success && taskData.task) {
        taskId = taskData.task.id;
        setCurrentTaskId(taskId); // 保存到状态，供后续使用
      }
    } catch (error) {
      console.error('创建任务记录失败:', error);
      // 即使任务记录创建失败，也继续执行生成流程
    }

    try {
      let result;
      let inputTitle = '';

      if (activeTab === 'text') {
        // 文本生成 - 传递 taskId 给后端
        result = await apiService.generateFlashcardsFromText(textInput, taskId || undefined);
        inputTitle = `文本生成 - ${textInput.substring(0, 30)}${textInput.length > 30 ? '...' : ''}`;
      } else if (activeTab === 'file') {
        // 文件生成：先生成大纲，让用户选择章节
        if (!selectedFile) {
          showToast('error', t('dashboard.messages.fileRequired'), t('dashboard.messages.fileHint'));
          setIsProcessing(false);
          return;
        }

        showToast('info', t('dashboard.messages.analyzingCatalog'), t('dashboard.messages.analyzingHint'));

        const catalogResult = await apiService.generateCatalogFromFile(selectedFile, taskId || undefined);

        console.log('Catalog API response:', catalogResult);

        if (!catalogResult.success || !catalogResult.catalog) {
          showToast('error', t('dashboard.messages.catalogFailed'), catalogResult.error || '未知错误');
          setIsProcessing(false);
          return;
        }

        // 验证 catalog 是否为数组
        if (!Array.isArray(catalogResult.catalog)) {
          console.error('Catalog is not an array:', catalogResult.catalog);
          showToast('error', t('dashboard.messages.catalogFormatError'), '服务器返回的数据格式不正确');
          setIsProcessing(false);
          return;
        }

        // 显示大纲选择对话框
        setCatalogData(catalogResult.catalog);
        setCatalogFileName(catalogResult.fileName || selectedFile.name);
        setShowCatalogModal(true);
        setIsProcessing(false);
        return; // 等待用户选择章节

      } else if (activeTab === 'url') {
        // 网页生成 - 传递 taskId 给后端
        result = await apiService.generateFlashcardsFromUrl(urlInput, taskId || undefined, 10, 'zh');
        inputTitle = `网页生成 - ${urlInput}`;
      } else if (activeTab === 'topic') {
        // 主题生成 (暂未实现)
        showToast('info', t('dashboard.messages.featureComingSoon'), t('dashboard.messages.topicFeatureHint'));
        setIsProcessing(false);
        return;
      }

      if (result && result.success && result.cards) {
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

        // 显示成功提示
        showToast('success', t('dashboard.messages.generateSuccess'), t('dashboard.messages.generateSuccessHint', { count: cardsWithIds.length }));
      } else {
        showToast('error', t('dashboard.messages.generateFailed'), result?.error || '未知错误');
      }
    } catch (error) {
      console.error('生成闪卡时出错:', error);
      showToast('error', t('dashboard.messages.generateFailed'), '发生错误，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 处理大纲选择确认
   * 现在接受章节ID列表，而不是章节对象
   */
  const handleCatalogConfirm = async (selectedChapterIds: string[]) => {
    setShowCatalogModal(false);
    setIsProcessing(true);

    try {
      if (!selectedFile) {
        showToast('error', t('dashboard.messages.fileRequired'), t('dashboard.messages.fileHint'));
        setIsProcessing(false);
        return;
      }

      if (selectedChapterIds.length === 0) {
        showToast('warning', '请选择章节', '至少选择一个章节来生成闪卡');
        setIsProcessing(false);
        return;
      }

      showToast('info', t('dashboard.messages.generating'), t('dashboard.messages.generatingHint', { count: selectedChapterIds.length }));

      // 调用API生成闪卡，传递taskId给后端
      const result = await apiService.generateFlashcardsFromFileSection(
        selectedFile,
        selectedChapterIds, // 现在传递ID列表
        currentTaskId || undefined
      );

      if (!result.success || !result.cards) {
        showToast('error', '生成失败', result.error || '未知错误');
        setIsProcessing(false);
        return;
      }

      // 为每张卡片添加唯一ID
      const cardsWithIds = result.cards.map((card: Flashcard, index: number) => ({
        ...card,
        id: `card-${Date.now()}-${index}`,
        qualityScore: 85 + Math.floor(Math.random() * 15),
      }));

      setGeneratedCards(cardsWithIds);

      // 创建闪卡集数据结构，按章节组织
      const chapters = result.sectionResults?.map((sectionResult, index) => ({
        id: `ch-${index}`,
        title: sectionResult.sectionTitle,
        description: `包含 ${sectionResult.count} 张闪卡`,
        isExpanded: true,
        cards: sectionResult.cards.map((card: Flashcard, cardIndex: number) => ({
          ...card,
          id: `card-${Date.now()}-${index}-${cardIndex}`,
          qualityScore: 85 + Math.floor(Math.random() * 15),
        })),
      })) || [
        {
          id: 'ch-default',
          title: '默认章节',
          description: '自动生成的闪卡',
          isExpanded: true,
          cards: cardsWithIds,
        },
      ];

      const flashcardSet: FlashcardSet = {
        id: `set-${Date.now()}`,
        title: `文件生成 - ${catalogFileName}`,
        topic: catalogFileName,
        createdAt: new Date().toLocaleString('zh-CN'),
        totalCards: cardsWithIds.length,
        averageQuality: Math.floor(cardsWithIds.reduce((sum: number, card: any) => sum + (card.qualityScore || 0), 0) / cardsWithIds.length),
        chapters: chapters,
      };

      // 保存到 localStorage
      localStorage.setItem('currentFlashcardSet', JSON.stringify(flashcardSet));

      // 显示成功提示
      showToast('success', t('dashboard.messages.generateSuccess'), t('dashboard.messages.generateSuccessHint', { count: cardsWithIds.length }));

    } catch (error) {
      console.error('生成闪卡时出错:', error);
      showToast('error', t('dashboard.messages.generateFailed'), '发生错误，请稍后重试');
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
      validateAndSetFile(file);
    }
  };

  /**
   * 验证并设置文件
   */
  const validateAndSetFile = (file: File) => {
    // 文件类型验证
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt|md)$/i)) {
      showToast('error', t('dashboard.messages.fileTypeError'), t('dashboard.messages.fileTypeHint'));
      return;
    }

    // 文件大小限制 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', t('dashboard.messages.fileSizeError'), t('dashboard.messages.fileSizeHint'));
      return;
    }

    setSelectedFile(file);
    showToast('info', t('dashboard.messages.fileSelected'), `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  };

  /**
   * 处理拖拽进入
   */
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * 处理拖拽经过
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * 处理拖拽离开
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * 处理文件放下
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      validateAndSetFile(file);
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
              {t('dashboard.inputs.textLabel')}
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t('dashboard.inputs.textPlaceholder')}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
          </div>
        );
      case 'file':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('dashboard.inputs.fileLabel')}
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={triggerFileSelect}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900 hover:text-gray-700">
                    {t('dashboard.inputs.fileUploadText')}
                  </span>
                  <span> {t('dashboard.inputs.fileDragText')}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {t('dashboard.inputs.fileHint')}
                </p>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-700">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
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
              {t('dashboard.inputs.urlLabel')}
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={t('dashboard.inputs.urlPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        );
      case 'topic':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('dashboard.inputs.topicLabel')}
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder={t('dashboard.inputs.topicPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta tags */}
      <SEOHead page="dashboard" />

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 核心操作区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.title')}</h2>

            {/* Tab切换 */}
            <div className="mb-6">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeTab === 'text'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('dashboard.tabs.text')}
                </button>
                <button
                  onClick={() => setActiveTab('file')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeTab === 'file'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('dashboard.tabs.file')}
                </button>
                <button
                  onClick={() => setActiveTab('url')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeTab === 'url'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('dashboard.tabs.url')}
                </button>
                <button
                  onClick={() => setActiveTab('topic')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center space-x-1 ${
                    activeTab === 'topic'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{t('dashboard.tabs.topic')}</span>
                  <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-1.5 py-0.5 rounded">Pro</span>
                </button>
              </div>
            </div>

            {/* 输入内容区域 */}
            <div className="mb-8">
              {renderInputContent()}
            </div>

            {/* 生成按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateCards}
                disabled={isProcessing}
                className={`bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-10 rounded-lg transition-all ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t('dashboard.buttons.generating')}</span>
                  </div>
                ) : (
                  t('dashboard.buttons.generate')
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 生成结果列表 */}
        <div className="mt-8">
          <ResultsList
            taskHistory={taskHistory}
            isLoading={isLoadingTasks}
            onCatalogConfirm={handleCatalogConfirm}
            onToast={showToast}
          />
        </div>
      </div>

      {/* Toast 通知容器 */}
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* 大纲选择对话框 - 用于初始文件上传流程 */}
      <CatalogSelectionModal
        isOpen={showCatalogModal}
        catalog={catalogData}
        fileName={catalogFileName}
        onClose={() => setShowCatalogModal(false)}
        onConfirm={handleCatalogConfirm}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}