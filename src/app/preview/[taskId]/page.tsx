'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * 卡片数据结构
 */
interface Flashcard {
  id: string;
  card_type: 'basic' | 'cloze' | 'multiple_choice';
  card_data: {
    question?: string;
    answer?: string;
    text?: string;
    cloze_items?: any[];
    options?: string[];
    correct_index?: number;
  };
  section_id?: string;
  order_index: number;
  is_deleted: boolean;
}

/**
 * 章节数据结构（树形）
 */
interface Chapter {
  id: string;
  title: string;
  children?: Chapter[];
  isExpanded: boolean;
}

/**
 * 任务闪卡预览页面 - 批量筛选模式
 */
function TaskPreviewContent() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId as string;

  // 状态
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const [selectedChapterIds, setSelectedChapterIds] = useState<Set<string>>(new Set());
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskInfo, setTaskInfo] = useState<any>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // 从API获取任务数据
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) {
        setError('任务ID不存在');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');

        // 1. 获取任务信息
        const taskResponse = await fetch(`/api/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!taskResponse.ok) {
          throw new Error('获取任务信息失败');
        }

        const taskData = await taskResponse.json();
        if (!taskData.success || !taskData.task) {
          throw new Error('任务不存在或已被删除');
        }

        const task = taskData.task;
        setTaskInfo(task);

        // 2. 检查任务状态
        if (task.status !== 'completed') {
          throw new Error(`任务尚未完成，当前状态：${task.status}`);
        }

        // 3. 根据任务ID查找对应的 flashcard_result
        const resultResponse = await fetch(`/api/flashcards?task_id=${task.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!resultResponse.ok) {
          throw new Error('获取闪卡结果失败');
        }

        const resultData = await resultResponse.json();
        if (!resultData.success) {
          throw new Error(resultData.error || '获取闪卡结果失败');
        }

        // 4. 处理闪卡数据
        if (resultData.flashcards && resultData.flashcards.length > 0) {
          const cards: Flashcard[] = resultData.flashcards.map((card: any, index: number) => ({
            id: card.id || `card-${index}`,
            card_type: card.card_type || 'basic',
            card_data: card.card_data || {},
            section_id: card.section_id,
            order_index: card.order_index !== undefined ? card.order_index : index,
            is_deleted: card.is_deleted || false,
          }));

          setFlashcards(cards);

          // 5. 如果有 catalog_id，获取章节信息
          if (resultData.catalog_id || task.catalog_id) {
            const catalogId = resultData.catalog_id || task.catalog_id;
            const catalogResponse = await fetch(`/api/catalog/${catalogId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (catalogResponse.ok) {
              const catalogData = await catalogResponse.json();
              if (catalogData.success && catalogData.catalog_data) {
                // 转换章节数据格式
                const convertedChapters = convertCatalogToChapters(catalogData.catalog_data);
                setChapters(convertedChapters);
              }
            }
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('获取任务数据失败:', err);
        setError(err instanceof Error ? err.message : '加载失败');
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, [taskId]);

  /**
   * 将后端的 catalog_data 转换为 Chapter 格式
   */
  const convertCatalogToChapters = (catalogData: any[]): Chapter[] => {
    if (!Array.isArray(catalogData)) return [];

    const convert = (items: any[]): Chapter[] => {
      return items.map((item, index) => {
        const chapter: Chapter = {
          id: item.id || `ch-${index}`,
          title: item.chapter || item.section || item.subsection || '未命名章节',
          isExpanded: true,
          children: undefined,
        };

        const childSections = item.sections || item.subsections;
        if (childSections && Array.isArray(childSections) && childSections.length > 0) {
          chapter.children = convert(childSections);
        }

        return chapter;
      });
    };

    return convert(catalogData);
  };

  // 根据选中的章节过滤卡片，已删除的排在最后
  useEffect(() => {
    let filtered: Flashcard[];

    if (selectedChapterIds.size === 0) {
      filtered = flashcards;
    } else {
      filtered = flashcards.filter(card => {
        if (!card.section_id) return false;
        // 检查卡片的 section_id 是否匹配任何选中的章节
        return Array.from(selectedChapterIds).some(chapterId =>
          card.section_id?.startsWith(chapterId)
        );
      });
    }

    // 根据 showDeleted 状态过滤
    if (showDeleted) {
      filtered = filtered.filter(c => c.is_deleted);
    } else {
      filtered = filtered.filter(c => !c.is_deleted);
    }

    // 排序
    filtered.sort((a, b) => a.order_index - b.order_index);

    setFilteredCards(filtered);
  }, [selectedChapterIds, flashcards, showDeleted]);

  /**
   * 切换章节展开/折叠
   */
  const toggleChapterExpanded = (chapterId: string) => {
    const updateChapters = (chapters: Chapter[]): Chapter[] => {
      return chapters.map(ch => {
        if (ch.id === chapterId) {
          return { ...ch, isExpanded: !ch.isExpanded };
        }
        if (ch.children) {
          return { ...ch, children: updateChapters(ch.children) };
        }
        return ch;
      });
    };
    setChapters(updateChapters(chapters));
  };

  /**
   * 收集章节及其所有子章节的ID
   */
  const collectChapterIds = (chapter: Chapter): string[] => {
    const ids = [chapter.id];
    if (chapter.children) {
      chapter.children.forEach(child => {
        ids.push(...collectChapterIds(child));
      });
    }
    return ids;
  };

  /**
   * 切换章节选择（包括子章节和卡片）
   */
  const toggleChapterSelection = (chapterId: string) => {
    const newSelectedChapterIds = new Set(selectedChapterIds);
    const newSelectedCardIds = new Set(selectedCardIds);

    // 查找章节
    const findChapter = (chapters: Chapter[]): Chapter | null => {
      for (const ch of chapters) {
        if (ch.id === chapterId) return ch;
        if (ch.children) {
          const found = findChapter(ch.children);
          if (found) return found;
        }
      }
      return null;
    };

    const chapter = findChapter(chapters);
    if (!chapter) return;

    // 收集该章节及所有子章节的ID
    const allChapterIds = collectChapterIds(chapter);

    // 判断是选中还是取消
    const isSelecting = !newSelectedChapterIds.has(chapterId);

    if (isSelecting) {
      // 选中：添加所有章节ID
      allChapterIds.forEach(id => newSelectedChapterIds.add(id));

      // 选中所有相关卡片
      flashcards.forEach(card => {
        if (card.section_id && allChapterIds.some(id => card.section_id?.startsWith(id))) {
          newSelectedCardIds.add(card.id);
        }
      });
    } else {
      // 取消：删除所有章节ID
      allChapterIds.forEach(id => newSelectedChapterIds.delete(id));

      // 取消选中所有相关卡片
      flashcards.forEach(card => {
        if (card.section_id && allChapterIds.some(id => card.section_id?.startsWith(id))) {
          newSelectedCardIds.delete(card.id);
        }
      });
    }

    setSelectedChapterIds(newSelectedChapterIds);
    setSelectedCardIds(newSelectedCardIds);
  };

  /**
   * 切换卡片选择
   */
  const toggleCardSelection = (cardId: string) => {
    const newSelected = new Set(selectedCardIds);

    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }

    setSelectedCardIds(newSelected);
  };

  /**
   * 全选/取消全选
   */
  const toggleSelectAll = () => {
    if (selectedCardIds.size === filteredCards.length) {
      setSelectedCardIds(new Set());
    } else {
      setSelectedCardIds(new Set(filteredCards.map(c => c.id)));
    }
  };

  /**
   * 批量删除选中卡片（软删除）
   */
  const handleBatchDelete = async () => {
    if (selectedCardIds.size === 0) {
      alert('请先选择要删除的卡片');
      return;
    }

    // 如果只选中一张卡片，记录其位置以便删除后自动选中下一张
    let nextCardToSelect: string | null = null;
    if (selectedCardIds.size === 1) {
      const selectedCardId = Array.from(selectedCardIds)[0];
      const currentIndex = filteredCards.findIndex(c => c.id === selectedCardId);

      if (currentIndex !== -1) {
        // 找到下一张未删除的卡片
        for (let i = currentIndex + 1; i < filteredCards.length; i++) {
          if (!selectedCardIds.has(filteredCards[i].id)) {
            nextCardToSelect = filteredCards[i].id;
            break;
          }
        }

        // 如果后面没有了，找前面的
        if (!nextCardToSelect) {
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (!selectedCardIds.has(filteredCards[i].id)) {
              nextCardToSelect = filteredCards[i].id;
              break;
            }
          }
        }
      }
    }

    try {
      const token = localStorage.getItem('auth_token');
      const deletePromises = Array.from(selectedCardIds).map(cardId =>
        fetch(`/api/flashcards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).then(res => res.json())
      );

      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(r => !r.success);

      if (failedDeletes.length > 0) {
        alert(`${failedDeletes.length} 张卡片删除失败`);
      }

      // 更新本地状态
      setFlashcards(flashcards.map(card =>
        selectedCardIds.has(card.id)
          ? { ...card, is_deleted: true }
          : card
      ));

      // 如果是单选删除，自动选中下一张
      if (nextCardToSelect) {
        setSelectedCardIds(new Set([nextCardToSelect]));

        // 滚动到新选中的卡片
        setTimeout(() => {
          const cardElement = document.querySelector(`[data-card-id="${nextCardToSelect}"]`);
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      } else {
        setSelectedCardIds(new Set());
      }
    } catch (error) {
      console.error('批量删除失败:', error);
      alert('批量删除失败');
    }
  };

  /**
   * 导出闪卡
   */
  const handleExport = async (format: 'apkg' | 'csv') => {
    if (!taskId) {
      alert('任务ID不存在');
      return;
    }

    try {
      setIsExporting(true);
      setShowExportMenu(false);

      // 使用与 api.ts 相同的后端API地址配置
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      // 构建导出URL
      const exportUrl = `${API_BASE_URL}/flashcards/export/?task_id=${taskId}&format=${format}`;

      // 使用 fetch 下载文件
      const response = await fetch(exportUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || '导出失败');
      }

      // 获取文件名（从响应头）
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = format === 'apkg' ? 'flashcards.apkg' : 'flashcards.csv';

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/"/g, '');
        }
      }

      // 下载文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log(`导出成功: ${format.toUpperCase()} - ${fileName}`);
    } catch (error) {
      console.error('导出失败:', error);
      alert(error instanceof Error ? error.message : '导出失败，请稍后重试');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * 删除单张卡片
   */
  const handleDeleteCard = async (cardId: string) => {
    // 找到下一张要选中的卡片
    const currentIndex = filteredCards.findIndex(c => c.id === cardId);
    let nextCardToSelect: string | null = null;

    if (currentIndex !== -1) {
      // 先找后面的卡片
      if (currentIndex + 1 < filteredCards.length) {
        nextCardToSelect = filteredCards[currentIndex + 1].id;
      }
      // 如果后面没有了，找前面的
      else if (currentIndex - 1 >= 0) {
        nextCardToSelect = filteredCards[currentIndex - 1].id;
      }
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/flashcards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '删除失败');
      }

      // 更新本地状态
      setFlashcards(flashcards.map(card =>
        card.id === cardId ? { ...card, is_deleted: true } : card
      ));
      setOpenMenuId(null);

      // 自动选中下一张卡片
      if (nextCardToSelect) {
        setSelectedCardIds(new Set([nextCardToSelect]));

        // 滚动到新选中的卡片
        setTimeout(() => {
          const cardElement = document.querySelector(`[data-card-id="${nextCardToSelect}"]`);
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      } else {
        setSelectedCardIds(new Set());
      }
    } catch (error) {
      console.error('删除卡片失败:', error);
      alert(error instanceof Error ? error.message : '删除失败');
    }
  };

  /**
   * 恢复单张卡片
   */
  const handleRestoreCard = async (cardId: string) => {
    try {
      const token = localStorage.getItem('auth_token');

      // 找到卡片获取完整的 card_data
      const card = flashcards.find(c => c.id === cardId);
      if (!card) return;

      const response = await fetch(`/api/flashcards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_data: card.card_data,
          is_deleted: false,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '恢复失败');
      }

      setFlashcards(flashcards.map(c =>
        c.id === cardId ? { ...c, is_deleted: false } : c
      ));
      setOpenMenuId(null);
    } catch (error) {
      console.error('恢复卡片失败:', error);
      alert(error instanceof Error ? error.message : '恢复失败');
    }
  };

  /**
   * 批量恢复已删除卡片
   */
  const handleBatchRestore = async () => {
    if (selectedCardIds.size === 0) {
      alert('请先选择要恢复的卡片');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const restorePromises = Array.from(selectedCardIds).map(cardId => {
        const card = flashcards.find(c => c.id === cardId);
        if (!card) return Promise.resolve({ success: false });

        return fetch(`/api/flashcards/${cardId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            card_data: card.card_data,
            is_deleted: false,
          }),
        }).then(res => res.json());
      });

      const results = await Promise.all(restorePromises);
      const failedRestores = results.filter(r => !r.success);

      if (failedRestores.length > 0) {
        alert(`${failedRestores.length} 张卡片恢复失败`);
      }

      setFlashcards(flashcards.map(card =>
        selectedCardIds.has(card.id) ? { ...card, is_deleted: false } : card
      ));
      setSelectedCardIds(new Set());
    } catch (error) {
      console.error('批量恢复失败:', error);
      alert('批量恢复失败');
    }
  };

  /**
   * 编辑卡片
   */
  const handleEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setEditQuestion(card.card_data.question || '');
    setEditAnswer(card.card_data.answer || '');
    setOpenMenuId(null);
  };

  /**
   * 保存编辑
   */
  const handleSaveEdit = async () => {
    if (!editingCard) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/flashcards/${editingCard.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_data: {
            ...editingCard.card_data,
            question: editQuestion,
            answer: editAnswer,
          },
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '保存失败');
      }

      // 更新本地状态
      setFlashcards(flashcards.map(card =>
        card.id === editingCard.id
          ? {
              ...card,
              card_data: {
                ...card.card_data,
                question: editQuestion,
                answer: editAnswer,
              },
            }
          : card
      ));

      setEditingCard(null);
      setEditQuestion('');
      setEditAnswer('');
    } catch (error) {
      console.error('保存编辑失败:', error);
      alert(error instanceof Error ? error.message : '保存失败');
    }
  };

  /**
   * 重新生成卡片
   */
  const handleRegenerateCard = (cardId: string) => {
    // TODO: 调用 AI API 重新生成
    setOpenMenuId(null);
    alert('重新生成功能开发中...');
  };

  /**
   * 点击外部关闭菜单
   */
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // 点击外部关闭导出菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportMenu]);

  /**
   * 键盘事件处理
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果正在编辑，不处理快捷键
      if (editingCard) return;

      // 如果焦点在输入框等元素上，不处理
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // 上下箭头：单选时导航
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (selectedCardIds.size === 1) {
          e.preventDefault();
          const selectedCardId = Array.from(selectedCardIds)[0];
          const currentIndex = filteredCards.findIndex(c => c.id === selectedCardId);

          if (currentIndex !== -1) {
            const newIndex = e.key === 'ArrowUp'
              ? Math.max(0, currentIndex - 1)
              : Math.min(filteredCards.length - 1, currentIndex + 1);

            if (newIndex !== currentIndex) {
              const newCard = filteredCards[newIndex];
              setSelectedCardIds(new Set([newCard.id]));
              setFocusedCardIndex(newIndex);

              // 滚动到可见区域
              const cardElement = document.querySelector(`[data-card-id="${newCard.id}"]`);
              if (cardElement) {
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          }
        }
      }

      // E键：编辑
      if (e.key === 'e' || e.key === 'E') {
        if (selectedCardIds.size === 1) {
          e.preventDefault();
          const selectedCardId = Array.from(selectedCardIds)[0];
          const card = filteredCards.find(c => c.id === selectedCardId);
          if (card && !showDeleted) {
            handleEditCard(card);
          }
        }
      }

      // D键：删除/恢复
      if (e.key === 'd' || e.key === 'D') {
        if (selectedCardIds.size > 0) {
          e.preventDefault();
          if (showDeleted) {
            handleBatchRestore();
          } else {
            handleBatchDelete();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedCardIds, filteredCards, editingCard, showDeleted]);

  /**
   * 点击卡片选中
   */
  const handleCardClick = (e: React.MouseEvent, cardId: string) => {
    // 如果点击的是三点菜单或其他按钮，不处理
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input[type="checkbox"]')) {
      return;
    }

    e.preventDefault();

    const newSelected = new Set(selectedCardIds);

    if (e.ctrlKey || e.metaKey) {
      // Ctrl+点击：多选
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
    } else {
      // 普通点击：单选
      if (newSelected.size === 1 && newSelected.has(cardId)) {
        // 如果已经是唯一选中的卡片，取消选中
        newSelected.clear();
      } else {
        // 否则选中这张卡片
        newSelected.clear();
        newSelected.add(cardId);
      }
    }

    setSelectedCardIds(newSelected);
  };

  /**
   * 渲染章节树（递归）
   */
  const renderChapterTree = (chapters: Chapter[], level: number = 0) => {
    return chapters.map(chapter => (
      <div key={chapter.id} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded">
          <input
            type="checkbox"
            checked={selectedChapterIds.has(chapter.id)}
            onChange={() => toggleChapterSelection(chapter.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <button
            onClick={() => toggleChapterExpanded(chapter.id)}
            className="flex items-center space-x-1 flex-1 text-left"
          >
            {chapter.children && chapter.children.length > 0 && (
              <>
                {chapter.isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                )}
              </>
            )}
            <span className="text-sm text-gray-700">{chapter.title}</span>
          </button>
        </div>
        {chapter.isExpanded && chapter.children && renderChapterTree(chapter.children, level + 1)}
      </div>
    ));
  };

  /**
   * 渲染卡片类型徽章
   */
  const renderCardTypeBadge = (type: string) => {
    const badges = {
      basic: { text: '基础', color: 'bg-blue-100 text-blue-700' },
      cloze: { text: '填空', color: 'bg-green-100 text-green-700' },
      multiple_choice: { text: '选择', color: 'bg-purple-100 text-purple-700' },
    };

    const badge = badges[type as keyof typeof badges] || badges.basic;

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  /**
   * 渲染卡片内容
   */
  const renderCardContent = (card: Flashcard) => {
    const { card_type, card_data } = card;

    if (card_type === 'basic') {
      return (
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-gray-500">问题：</span>
            <p className="text-sm text-gray-900 mt-1">{card_data.question}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">答案：</span>
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{card_data.answer}</p>
          </div>
        </div>
      );
    }

    if (card_type === 'cloze') {
      return (
        <div>
          <span className="text-xs font-medium text-gray-500">填空题：</span>
          <p className="text-sm text-gray-900 mt-1">{card_data.text}</p>
        </div>
      );
    }

    if (card_type === 'multiple_choice') {
      return (
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-gray-500">问题：</span>
            <p className="text-sm text-gray-900 mt-1">{card_data.question}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">选项：</span>
            <ul className="mt-1 space-y-1">
              {card_data.options?.map((option, idx) => (
                <li
                  key={idx}
                  className={`text-sm ${
                    idx === card_data.correct_index
                      ? 'text-green-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {option}
                  {idx === card_data.correct_index && ' ✓'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  // 统计信息
  const totalCards = flashcards.filter(c => !c.is_deleted).length;
  const deletedCards = flashcards.filter(c => c.is_deleted).length;
  const selectedCount = selectedCardIds.size;
  const displayedCount = filteredCards.filter(c => !c.is_deleted).length;

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部工具栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 左侧：返回和标题 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="返回"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">闪卡预览与筛选</h1>
                <p className="text-sm text-gray-500">
                  快速浏览所有卡片，筛选优质内容
                </p>
              </div>
            </div>

            {/* 右侧：统计和操作 */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                总计: <span className="font-semibold">{totalCards}</span> 张
                {deletedCards > 0 && (
                  <span className="ml-3 text-red-600">
                    已删除: <span className="font-semibold">{deletedCards}</span> 张
                  </span>
                )}
                {selectedChapterIds.size > 0 && (
                  <span className="ml-3">
                    当前显示: <span className="font-semibold text-blue-600">{displayedCount}</span> 张
                  </span>
                )}
                {selectedCount > 0 && (
                  <span className="ml-3 text-orange-600">
                    已选: <span className="font-semibold">{selectedCount}</span> 张
                  </span>
                )}
              </div>

              {deletedCards > 0 && (
                <button
                  onClick={() => {
                    setShowDeleted(!showDeleted);
                    setSelectedCardIds(new Set());
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                    showDeleted
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">
                    {showDeleted ? '显示正常卡片' : `显示已删除 (${deletedCards})`}
                  </span>
                </button>
              )}

              {selectedCount > 0 && !showDeleted && (
                <button
                  onClick={handleBatchDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>删除选中 ({selectedCount})</span>
                </button>
              )}

              {selectedCount > 0 && showDeleted && (
                <button
                  onClick={handleBatchRestore}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArrowUturnLeftIcon className="h-4 w-4" />
                  <span>恢复选中 ({selectedCount})</span>
                </button>
              )}

              {/* 导出按钮（带下拉菜单） */}
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>{isExporting ? '导出中...' : '导出'}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                {/* 下拉菜单 */}
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('apkg')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">导出为 Anki 包</div>
                          <div className="text-xs text-gray-500">.apkg 格式</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">导出为 CSV</div>
                          <div className="text-xs text-gray-500">.csv 格式</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧章节目录 */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">章节目录</h2>
              <button
                onClick={() => {
                  if (selectedChapterIds.size > 0) {
                    setSelectedChapterIds(new Set());
                  } else {
                    // 全选所有章节
                    const allIds = new Set<string>();
                    const collectIds = (chapters: Chapter[]) => {
                      chapters.forEach(ch => {
                        allIds.add(ch.id);
                        if (ch.children) collectIds(ch.children);
                      });
                    };
                    collectIds(chapters);
                    setSelectedChapterIds(allIds);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {selectedChapterIds.size > 0 ? '取消全选' : '全选章节'}
              </button>
            </div>
            <div>{renderChapterTree(chapters)}</div>
          </div>
        </aside>

        {/* 右侧卡片列表 */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* 批量操作栏 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedCardIds.size === filteredCards.length && filteredCards.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {selectedCardIds.size === filteredCards.length && filteredCards.length > 0
                    ? '取消全选'
                    : '全选当前页'}
                </span>
                <div className="ml-4 text-xs text-gray-400 border-l pl-4">
                  💡 点击卡片选中 | Ctrl+点击多选 | ↑↓导航 | E编辑 | D删除
                </div>
              </div>
              <div className="text-sm text-gray-500">
                显示 {filteredCards.length} / {totalCards} 张卡片
              </div>
            </div>

            {/* 卡片列表 */}
            <div className="space-y-3">
              {filteredCards.map((card, index) => (
                <div
                  key={card.id}
                  data-card-id={card.id}
                  onClick={(e) => handleCardClick(e, card.id)}
                  className={`group relative bg-white border rounded-lg p-4 transition-all cursor-pointer ${
                    showDeleted
                      ? 'border-red-200 bg-red-50/50'
                      : selectedCardIds.has(card.id)
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* 选择框 */}
                    <input
                      type="checkbox"
                      checked={selectedCardIds.has(card.id)}
                      onChange={() => toggleCardSelection(card.id)}
                      className={`mt-1 rounded border-gray-300 focus:ring-blue-500 ${
                        showDeleted ? 'text-green-600 focus:ring-green-500' : 'text-blue-600'
                      }`}
                    />

                    {/* 卡片内容 */}
                    <div className="flex-1 min-w-0">
                      {/* 头部：序号 + 类型徽章 + 状态 */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs text-gray-400">#{card.order_index + 1}</span>
                        {renderCardTypeBadge(card.card_type)}
                        {card.section_id && (
                          <span className="text-xs text-gray-400">
                            章节: {card.section_id}
                          </span>
                        )}
                        {showDeleted && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                            已删除
                          </span>
                        )}
                      </div>

                      {/* 卡片内容 */}
                      {renderCardContent(card)}
                    </div>

                    {/* 操作按钮区域 */}
                    {showDeleted ? (
                      /* 已删除模式：显示恢复按钮 */
                      <button
                        onClick={() => handleRestoreCard(card.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <ArrowUturnLeftIcon className="h-4 w-4" />
                        <span>恢复</span>
                      </button>
                    ) : (
                      /* 正常模式：三点菜单 */
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === card.id ? null : card.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                          </button>
                          {openMenuId === card.id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCard(card);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <PencilIcon className="h-4 w-4" />
                                <span>编辑</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRegenerateCard(card.id);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <ArrowPathIcon className="h-4 w-4" />
                                <span>重新生成</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCard(card.id);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span>删除</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 空状态 */}
            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">当前筛选条件下没有卡片</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 编辑卡片模态框 */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
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
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingCard(null);
                    setEditQuestion('');
                    setEditAnswer('');
                  }}
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

export default function TaskPreviewPage() {
  return (
    <ProtectedRoute>
      <TaskPreviewContent />
    </ProtectedRoute>
  );
}
