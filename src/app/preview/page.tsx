'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Flashcard, Chapter, FlashcardSet } from '@/types/flashcard';

/**
 * 闪卡预览页面
 * 支持章节目录、卡片翻转预览、批量选择、编辑和导出功能
 */
export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从URL参数或localStorage获取闪卡数据
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);

  // 当前查看的卡片索引
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // 当前卡片是否翻转
  const [isFlipped, setIsFlipped] = useState(false);

  // 选中的卡片ID集合
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());

  // 选中的章节ID集合
  const [selectedChapterIds, setSelectedChapterIds] = useState<Set<string>>(new Set());

  // 当前编辑的卡片
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  // 临时编辑内容
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // 左侧边栏折叠状态
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 获取所有卡片（扁平化）
  const allCards = flashcardSet?.chapters.flatMap(chapter => chapter.cards) || [];

  // 当前显示的卡片
  const currentCard = allCards[currentCardIndex];

  // 初始化数据
  useEffect(() => {
    // 从 localStorage 获取闪卡集数据
    const savedFlashcardSet = localStorage.getItem('currentFlashcardSet');

    if (savedFlashcardSet) {
      try {
        const parsedSet: FlashcardSet = JSON.parse(savedFlashcardSet);
        setFlashcardSet(parsedSet);
        return;
      } catch (error) {
        console.error('解析闪卡数据失败:', error);
      }
    }

    // 如果没有保存的数据或解析失败，使用模拟数据
    const mockData: FlashcardSet = {
      id: '1',
      title: 'Python编程基础',
      topic: 'Python',
      createdAt: new Date().toLocaleString('zh-CN'),
      totalCards: 15,
      averageQuality: 88,
      chapters: [
        {
          id: 'ch1',
          title: '第一章：Python基础语法',
          description: '介绍Python的基本语法和数据类型',
          isExpanded: true,
          cards: [
            {
              id: 'c1',
              question: '什么是Python？',
              answer: 'Python是一种高级编程语言，具有简洁的语法和强大的功能。',
              type: 'basic_card',
              chapterId: 'ch1',
              qualityScore: 92,
              tags: ['基础', '概念'],
            },
            {
              id: 'c2',
              question: 'Python中的变量如何声明？',
              answer: 'Python不需要显式声明变量类型，直接赋值即可：x = 10',
              type: 'basic_card',
              chapterId: 'ch1',
              qualityScore: 88,
            },
            {
              id: 'c3',
              question: 'Python支持哪些基本数据类型？',
              answer: '整数(int)、浮点数(float)、字符串(str)、布尔值(bool)、列表(list)、元组(tuple)、字典(dict)、集合(set)',
              type: 'basic_card',
              chapterId: 'ch1',
              qualityScore: 90,
            },
          ],
        },
        {
          id: 'ch2',
          title: '第二章：控制流程',
          description: '学习if语句、循环等控制结构',
          isExpanded: false,
          cards: [
            {
              id: 'c4',
              question: 'Python中如何写if语句？',
              answer: 'if condition:\\n    statement',
              type: 'basic_card',
              chapterId: 'ch2',
              qualityScore: 85,
            },
            {
              id: 'c5',
              question: 'Python有哪些循环语句？',
              answer: 'for循环和while循环',
              type: 'basic_card',
              chapterId: 'ch2',
              qualityScore: 87,
            },
          ],
        },
        {
          id: 'ch3',
          title: '第三章：函数与模块',
          description: '函数定义、参数传递、模块导入',
          isExpanded: false,
          cards: [
            {
              id: 'c6',
              question: '如何定义一个函数？',
              answer: 'def function_name(parameters):\\n    function_body\\n    return result',
              type: 'basic_card',
              chapterId: 'ch3',
              qualityScore: 91,
            },
            {
              id: 'c7',
              question: '如何导入模块？',
              answer: 'import module_name 或 from module_name import something',
              type: 'basic_card',
              chapterId: 'ch3',
              qualityScore: 86,
            },
          ],
        },
      ],
    };

    setFlashcardSet(mockData);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果正在编辑，不触发快捷键
      if (editingCard) return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevCard();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextCard();
          break;
        case 'Delete':
          e.preventDefault();
          handleToggleMarkForDeletion(currentCard?.id);
          break;
        case 'e':
        case 'E':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleEditCard(currentCard);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentCard, editingCard]);

  /**
   * 上一张卡片
   */
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  /**
   * 下一张卡片
   */
  const handleNextCard = () => {
    if (currentCardIndex < allCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  /**
   * 切换章节展开/折叠
   */
  const toggleChapterExpanded = (chapterId: string) => {
    if (!flashcardSet) return;

    setFlashcardSet({
      ...flashcardSet,
      chapters: flashcardSet.chapters.map(ch =>
        ch.id === chapterId ? { ...ch, isExpanded: !ch.isExpanded } : ch
      ),
    });
  };

  /**
   * 选择/取消选择章节
   */
  const handleToggleChapterSelection = (chapterId: string, chapter: Chapter) => {
    const newSelectedChapterIds = new Set(selectedChapterIds);
    const newSelectedCardIds = new Set(selectedCardIds);

    if (newSelectedChapterIds.has(chapterId)) {
      // 取消选择章节及其所有卡片
      newSelectedChapterIds.delete(chapterId);
      chapter.cards.forEach(card => newSelectedCardIds.delete(card.id));
    } else {
      // 选择章节及其所有卡片
      newSelectedChapterIds.add(chapterId);
      chapter.cards.forEach(card => newSelectedCardIds.add(card.id));
    }

    setSelectedChapterIds(newSelectedChapterIds);
    setSelectedCardIds(newSelectedCardIds);
  };

  /**
   * 选择/取消选择卡片
   */
  const handleToggleCardSelection = (cardId: string, chapterId: string) => {
    const newSelectedCardIds = new Set(selectedCardIds);

    if (newSelectedCardIds.has(cardId)) {
      newSelectedCardIds.delete(cardId);
    } else {
      newSelectedCardIds.add(cardId);
    }

    setSelectedCardIds(newSelectedCardIds);

    // 检查该章节是否所有卡片都被选中
    const chapter = flashcardSet?.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      const allCardsSelected = chapter.cards.every(card => newSelectedCardIds.has(card.id));
      const newSelectedChapterIds = new Set(selectedChapterIds);

      if (allCardsSelected) {
        newSelectedChapterIds.add(chapterId);
      } else {
        newSelectedChapterIds.delete(chapterId);
      }

      setSelectedChapterIds(newSelectedChapterIds);
    }
  };

  /**
   * 标记/取消标记删除
   */
  const handleToggleMarkForDeletion = (cardId?: string) => {
    if (!cardId || !flashcardSet) return;

    setFlashcardSet({
      ...flashcardSet,
      chapters: flashcardSet.chapters.map(chapter => ({
        ...chapter,
        cards: chapter.cards.map(card =>
          card.id === cardId
            ? { ...card, isMarkedForDeletion: !card.isMarkedForDeletion }
            : card
        ),
      })),
    });
  };

  /**
   * 批量删除选中的卡片
   */
  const handleBatchDelete = () => {
    if (!flashcardSet || selectedCardIds.size === 0) return;

    if (!confirm(`确定要删除选中的 ${selectedCardIds.size} 张卡片吗？`)) return;

    setFlashcardSet({
      ...flashcardSet,
      chapters: flashcardSet.chapters.map(chapter => ({
        ...chapter,
        cards: chapter.cards.filter(card => !selectedCardIds.has(card.id)),
      })),
      totalCards: flashcardSet.totalCards - selectedCardIds.size,
    });

    setSelectedCardIds(new Set());
    setSelectedChapterIds(new Set());
  };

  /**
   * 编辑卡片
   */
  const handleEditCard = (card?: Flashcard) => {
    if (!card) return;

    setEditingCard(card);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setEditNotes(card.notes || '');
  };

  /**
   * 保存编辑
   */
  const handleSaveEdit = () => {
    if (!editingCard || !flashcardSet) return;

    setFlashcardSet({
      ...flashcardSet,
      chapters: flashcardSet.chapters.map(chapter => ({
        ...chapter,
        cards: chapter.cards.map(card =>
          card.id === editingCard.id
            ? {
                ...card,
                question: editQuestion,
                answer: editAnswer,
                notes: editNotes,
              }
            : card
        ),
      })),
    });

    setEditingCard(null);
  };

  /**
   * 取消编辑
   */
  const handleCancelEdit = () => {
    setEditingCard(null);
    setEditQuestion('');
    setEditAnswer('');
    setEditNotes('');
  };

  /**
   * 导出闪卡
   */
  const handleExport = () => {
    console.log('导出闪卡集:', flashcardSet);
    alert('导出功能开发中...');
  };

  /**
   * 跳转到指定卡片
   */
  const handleJumpToCard = (cardId: string) => {
    const index = allCards.findIndex(card => card.id === cardId);
    if (index !== -1) {
      setCurrentCardIndex(index);
      setIsFlipped(false);
    }
  };

  if (!flashcardSet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  // 计算统计信息
  const totalCards = allCards.length;
  const markedForDeletionCount = allCards.filter(c => c.isMarkedForDeletion).length;
  const selectedCount = selectedCardIds.size;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 左侧：返回按钮和标题 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="返回"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{flashcardSet.title}</h1>
                <p className="text-sm text-gray-500">
                  主题: {flashcardSet.topic} · 创建于 {flashcardSet.createdAt}
                </p>
              </div>
            </div>

            {/* 右侧：统计信息和操作按钮 */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600">
                  总计: <span className="font-semibold text-gray-900">{totalCards}</span> 张
                </span>
                {selectedCount > 0 && (
                  <span className="text-blue-600">
                    已选: <span className="font-semibold">{selectedCount}</span> 张
                  </span>
                )}
                {markedForDeletionCount > 0 && (
                  <span className="text-red-600">
                    待删除: <span className="font-semibold">{markedForDeletionCount}</span> 张
                  </span>
                )}
                {flashcardSet.averageQuality && (
                  <span className="text-green-600">
                    平均质量: <span className="font-semibold">{flashcardSet.averageQuality}</span> 分
                  </span>
                )}
              </div>

              {/* 批量操作按钮 */}
              {selectedCount > 0 && (
                <button
                  onClick={handleBatchDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  删除选中 ({selectedCount})
                </button>
              )}

              {/* 导出按钮 */}
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>导出 Anki</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧章节目录 */}
        <aside
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-12' : 'w-80'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* 折叠按钮 */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <span className="text-sm font-medium text-gray-700">章节目录</span>
                )}
              </button>
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-y-auto p-4">
                {flashcardSet.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-4">
                    {/* 章节标题 */}
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedChapterIds.has(chapter.id)}
                        onChange={() => handleToggleChapterSelection(chapter.id, chapter)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => toggleChapterExpanded(chapter.id)}
                        className="flex-1 flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                      >
                        {chapter.isExpanded ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {chapter.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {chapter.cards.length} 张卡片
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* 卡片列表 */}
                    {chapter.isExpanded && (
                      <div className="ml-6 space-y-1">
                        {chapter.cards.map((card, index) => (
                          <div
                            key={card.id}
                            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                              currentCard?.id === card.id ? 'bg-blue-50 border border-blue-200' : ''
                            } ${card.isMarkedForDeletion ? 'opacity-50' : ''}`}
                            onClick={() => handleJumpToCard(card.id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCardIds.has(card.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggleCardSelection(card.id, chapter.id);
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-600 truncate">
                                {index + 1}. {card.question}
                              </div>
                              {card.qualityScore && (
                                <div className="text-xs text-gray-400">
                                  质量: {card.qualityScore}分
                                </div>
                              )}
                            </div>
                            {card.isMarkedForDeletion && (
                              <XMarkIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* 中央卡片预览区 */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
          {currentCard ? (
            <div className="w-full max-w-3xl">
              {/* 卡片容器 */}
              <div
                className="relative w-full bg-white rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-500 hover:scale-105"
                style={{ minHeight: '400px', perspective: '1000px' }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* 正面：问题 */}
                  <div
                    className="absolute w-full h-full p-12 flex flex-col items-center justify-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden', minHeight: '400px' }}
                  >
                    <div className="text-xs font-medium text-blue-600 mb-4">问题</div>
                    <div className="text-2xl text-gray-900 text-center leading-relaxed">
                      {currentCard.question}
                    </div>
                    {currentCard.qualityScore && (
                      <div className="mt-6 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        质量评分: {currentCard.qualityScore} 分
                      </div>
                    )}
                    <div className="mt-8 text-sm text-gray-400">点击翻转查看答案</div>
                  </div>

                  {/* 背面：答案 */}
                  <div
                    className="absolute w-full h-full p-12 flex flex-col items-center justify-center backface-hidden bg-blue-50"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      minHeight: '400px',
                    }}
                  >
                    <div className="text-xs font-medium text-blue-600 mb-4">答案</div>
                    <div className="text-xl text-gray-900 text-center leading-relaxed whitespace-pre-wrap">
                      {currentCard.answer}
                    </div>
                    {currentCard.notes && (
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 w-full">
                        <div className="text-xs font-medium text-yellow-800 mb-1">批注</div>
                        <div className="text-sm text-yellow-900">{currentCard.notes}</div>
                      </div>
                    )}
                    <div className="mt-8 text-sm text-gray-400">点击翻转返回问题</div>
                  </div>
                </div>

                {/* 卡片状态标记 */}
                {currentCard.isMarkedForDeletion && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    待删除
                  </div>
                )}
                {currentCard.type && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {currentCard.type === 'basic_card' && '基础卡片'}
                    {currentCard.type === 'cloze_card' && '填空卡片'}
                    {currentCard.type === 'multiple_choice_card' && '选择题卡片'}
                  </div>
                )}
              </div>

              {/* 导航控制 */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  上一张
                </button>

                <div className="text-center">
                  <div className="text-sm text-gray-600">
                    {currentCardIndex + 1} / {totalCards}
                  </div>
                  <div className="mt-2 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    快捷键: ← → 切换 | 空格 翻转 | E 编辑 | Delete 标记删除
                  </div>
                </div>

                <button
                  onClick={handleNextCard}
                  disabled={currentCardIndex === totalCards - 1}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一张
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">没有可显示的卡片</div>
          )}
        </main>

        {/* 右侧操作面板 */}
        <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">卡片操作</h3>

            {currentCard && (
              <>
                {/* 快速操作 */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleToggleMarkForDeletion(currentCard.id)}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                      currentCard.isMarkedForDeletion
                        ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                        : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {currentCard.isMarkedForDeletion ? (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        <span>恢复此卡</span>
                      </>
                    ) : (
                      <>
                        <XMarkIcon className="h-5 w-5" />
                        <span>标记删除</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleEditCard(currentCard)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>编辑卡片</span>
                  </button>
                </div>

                {/* 卡片信息 */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">所属章节:</span>
                    <span className="ml-2 text-gray-900 font-medium">
                      {flashcardSet.chapters.find(ch => ch.id === currentCard.chapterId)?.title || '未知'}
                    </span>
                  </div>
                  {currentCard.qualityScore && (
                    <div className="text-sm">
                      <span className="text-gray-600">质量评分:</span>
                      <span className="ml-2 text-gray-900 font-medium">{currentCard.qualityScore} 分</span>
                    </div>
                  )}
                  {currentCard.tags && currentCard.tags.length > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-600">标签:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {currentCard.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* 编辑卡片模态框 */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">编辑卡片</h3>

              <div className="space-y-4">
                {/* 问题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    问题 *
                  </label>
                  <textarea
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="输入问题..."
                  />
                </div>

                {/* 答案 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    答案 *
                  </label>
                  <textarea
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="输入答案..."
                  />
                </div>

                {/* 批注 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    批注（可选）
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="添加个人批注..."
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
