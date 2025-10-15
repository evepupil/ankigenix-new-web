'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

/**
 * 卡片数据结构
 */
export interface Flashcard {
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
export interface Chapter {
  id: string;
  title: string;
  children?: Chapter[];
  isExpanded: boolean;
}

interface FlashcardListProps {
  flashcards: Flashcard[];
  chapters: Chapter[];
  showDeleted?: boolean;
  readOnly?: boolean;
}

/**
 * 闪卡列表展示组件（只读）
 */
export default function FlashcardList({
  flashcards,
  chapters,
  showDeleted = false,
  readOnly = true,
}: FlashcardListProps) {
  const [selectedChapterIds, setSelectedChapterIds] = useState<Set<string>>(new Set());
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Chapter[]>(chapters);

  // 初始化展开所有章节
  useEffect(() => {
    const expandAll = (chapters: Chapter[]): Chapter[] => {
      return chapters.map(ch => ({
        ...ch,
        isExpanded: true,
        children: ch.children ? expandAll(ch.children) : undefined,
      }));
    };
    setExpandedChapters(expandAll(chapters));
  }, [chapters]);

  // 根据选中的章节过滤卡片
  useEffect(() => {
    let filtered: Flashcard[];

    if (selectedChapterIds.size === 0) {
      filtered = flashcards;
    } else {
      filtered = flashcards.filter(card => {
        if (!card.section_id) return false;
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
    setExpandedChapters(updateChapters(expandedChapters));
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
   * 切换章节选择
   */
  const toggleChapterSelection = (chapterId: string) => {
    const newSelectedChapterIds = new Set(selectedChapterIds);

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

    const chapter = findChapter(expandedChapters);
    if (!chapter) return;

    // 收集该章节及所有子章节的ID
    const allChapterIds = collectChapterIds(chapter);

    // 判断是选中还是取消
    const isSelecting = !newSelectedChapterIds.has(chapterId);

    if (isSelecting) {
      allChapterIds.forEach(id => newSelectedChapterIds.add(id));
    } else {
      allChapterIds.forEach(id => newSelectedChapterIds.delete(id));
    }

    setSelectedChapterIds(newSelectedChapterIds);
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
  const displayedCount = filteredCards.filter(c => !c.is_deleted).length;

  return (
    <div className="flex h-full overflow-hidden">
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
                  collectIds(expandedChapters);
                  setSelectedChapterIds(allIds);
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {selectedChapterIds.size > 0 ? '取消全选' : '全选章节'}
            </button>
          </div>
          <div>{renderChapterTree(expandedChapters)}</div>
        </div>
      </aside>

      {/* 右侧卡片列表 */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* 统计信息栏 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between">
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
            </div>
            <div className="text-sm text-gray-500">
              显示 {filteredCards.length} / {totalCards} 张卡片
            </div>
          </div>

          {/* 卡片列表 */}
          <div className="space-y-3">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                {/* 头部：序号 + 类型徽章 + 状态 */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs text-gray-400">#{card.order_index + 1}</span>
                  {renderCardTypeBadge(card.card_type)}
                  {card.section_id && (
                    <span className="text-xs text-gray-400">
                      章节: {card.section_id}
                    </span>
                  )}
                  {showDeleted && card.is_deleted && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                      已删除
                    </span>
                  )}
                </div>

                {/* 卡片内容 */}
                {renderCardContent(card)}
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
  );
}
