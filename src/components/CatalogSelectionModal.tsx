'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * 章节数据结构
 */
interface Subsection {
  subsection: string;
  description?: string;
}

interface Section {
  section: string;
  description?: string;
  subsections?: Subsection[];
}

interface Chapter {
  chapter: string;
  description?: string;
  sections?: Section[];
}

/**
 * 大纲选择对话框属性
 */
interface CatalogSelectionModalProps {
  isOpen: boolean;
  catalog: Chapter[];
  fileName: string;
  onClose: () => void;
  onConfirm: (selectedChapters: Chapter[]) => void;
}

/**
 * 大纲选择对话框组件
 * 用于展示文件大纲并允许用户选择需要生成闪卡的章节
 */
export default function CatalogSelectionModal({
  isOpen,
  catalog,
  fileName,
  onClose,
  onConfirm,
}: CatalogSelectionModalProps) {
  // 选中的章节索引集合
  const [selectedChapters, setSelectedChapters] = useState<Set<number>>(new Set());
  // 选中的小节路径集合 (格式: "chapterIndex-sectionIndex")
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  // 展开的章节索引集合
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  // 初始化：默认全选并全部展开
  useEffect(() => {
    if (isOpen && catalog.length > 0) {
      // 全选章节
      const allChapters = new Set(catalog.map((_, index) => index));
      setSelectedChapters(allChapters);

      // 全选所有小节
      const allSections = new Set<string>();
      catalog.forEach((chapter, chapterIndex) => {
        chapter.sections?.forEach((_, sectionIndex) => {
          allSections.add(`${chapterIndex}-${sectionIndex}`);
        });
      });
      setSelectedSections(allSections);

      // 全部展开
      setExpandedChapters(allChapters);
    }
  }, [isOpen, catalog]);

  // 切换章节选中状态
  const toggleChapter = (chapterIndex: number) => {
    const newSelected = new Set(selectedChapters);
    const chapter = catalog[chapterIndex];

    if (newSelected.has(chapterIndex)) {
      // 取消选中章节，同时取消选中所有子节点
      newSelected.delete(chapterIndex);
      const newSelectedSections = new Set(selectedSections);
      chapter.sections?.forEach((_, sectionIndex) => {
        newSelectedSections.delete(`${chapterIndex}-${sectionIndex}`);
      });
      setSelectedSections(newSelectedSections);
    } else {
      // 选中章节，同时选中所有子节点
      newSelected.add(chapterIndex);
      const newSelectedSections = new Set(selectedSections);
      chapter.sections?.forEach((_, sectionIndex) => {
        newSelectedSections.add(`${chapterIndex}-${sectionIndex}`);
      });
      setSelectedSections(newSelectedSections);
    }

    setSelectedChapters(newSelected);
  };

  // 切换小节选中状态
  const toggleSection = (chapterIndex: number, sectionIndex: number) => {
    const sectionKey = `${chapterIndex}-${sectionIndex}`;
    const newSelectedSections = new Set(selectedSections);

    if (newSelectedSections.has(sectionKey)) {
      newSelectedSections.delete(sectionKey);
    } else {
      newSelectedSections.add(sectionKey);
    }

    setSelectedSections(newSelectedSections);

    // 检查父章节是否应该被选中
    const chapter = catalog[chapterIndex];
    const allSectionsSelected = chapter.sections?.every((_, idx) =>
      newSelectedSections.has(`${chapterIndex}-${idx}`)
    );

    const newSelectedChapters = new Set(selectedChapters);
    if (allSectionsSelected) {
      newSelectedChapters.add(chapterIndex);
    } else {
      newSelectedChapters.delete(chapterIndex);
    }

    setSelectedChapters(newSelectedChapters);
  };

  // 切换章节展开/折叠
  const toggleExpand = (chapterIndex: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterIndex)) {
      newExpanded.delete(chapterIndex);
    } else {
      newExpanded.add(chapterIndex);
    }
    setExpandedChapters(newExpanded);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedChapters.size === catalog.length) {
      // 取消全选
      setSelectedChapters(new Set());
      setSelectedSections(new Set());
    } else {
      // 全选
      const allChapters = new Set(catalog.map((_, index) => index));
      setSelectedChapters(allChapters);

      const allSections = new Set<string>();
      catalog.forEach((chapter, chapterIndex) => {
        chapter.sections?.forEach((_, sectionIndex) => {
          allSections.add(`${chapterIndex}-${sectionIndex}`);
        });
      });
      setSelectedSections(allSections);
    }
  };

  // 确认选择
  const handleConfirm = () => {
    // 构建选中的章节数据
    const selected = catalog
      .map((chapter, chapterIndex) => {
        if (!selectedChapters.has(chapterIndex)) {
          // 检查是否有选中的小节
          const selectedSectionsInChapter = chapter.sections?.filter((_, sectionIndex) =>
            selectedSections.has(`${chapterIndex}-${sectionIndex}`)
          );

          if (selectedSectionsInChapter && selectedSectionsInChapter.length > 0) {
            return {
              ...chapter,
              sections: selectedSectionsInChapter,
            };
          }
          return null;
        }
        return chapter;
      })
      .filter((chapter): chapter is Chapter => chapter !== null);

    onConfirm(selected);
  };

  // 计算选中数量
  const selectedCount = selectedChapters.size;
  const totalCount = catalog.length;

  if (!isOpen) return null;

  // 防御性检查：确保 catalog 是数组
  if (!Array.isArray(catalog)) {
    console.error('CatalogSelectionModal: catalog is not an array', catalog);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-gray-200">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">选择要生成的章节</h2>
            <p className="text-sm text-gray-500 mt-1">{fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 工具栏 */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <button
            onClick={toggleSelectAll}
            className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            {selectedChapters.size === catalog.length ? '取消全选' : '全选'}
          </button>
          <span className="text-sm text-gray-600">
            已选择 <span className="font-semibold text-gray-900">{selectedCount}</span> / {totalCount} 个章节
          </span>
        </div>

        {/* 大纲列表 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {catalog.map((chapter, chapterIndex) => {
            const isChapterSelected = selectedChapters.has(chapterIndex);
            const isExpanded = expandedChapters.has(chapterIndex);
            const hasSections = chapter.sections && chapter.sections.length > 0;

            return (
              <div key={chapterIndex} className="mb-2">
                {/* 章节 */}
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <input
                    type="checkbox"
                    checked={isChapterSelected}
                    onChange={() => toggleChapter(chapterIndex)}
                    className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {chapterIndex + 1}. {chapter.chapter}
                        </h3>
                        {chapter.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{chapter.description}</p>
                        )}
                      </div>
                      {hasSections && (
                        <button
                          onClick={() => toggleExpand(chapterIndex)}
                          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg
                            className={`h-5 w-5 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 小节（展开时显示）*/}
                {isExpanded && hasSections && (
                  <div className="ml-10 mt-1 space-y-1">
                    {chapter.sections!.map((section, sectionIndex) => {
                      const sectionKey = `${chapterIndex}-${sectionIndex}`;
                      const isSectionSelected = selectedSections.has(sectionKey);

                      return (
                        <div
                          key={sectionIndex}
                          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSectionSelected}
                            onChange={() => toggleSection(chapterIndex, sectionIndex)}
                            className="mt-0.5 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700">
                              {chapterIndex + 1}.{sectionIndex + 1} {section.section}
                            </p>
                            {section.description && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {section.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedCount === 0}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all ${
              selectedCount === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 hover:shadow-lg'
            }`}
          >
            生成闪卡 ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
}
