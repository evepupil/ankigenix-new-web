'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLocale } from '@/hooks/useLocale';

/**
 * 章节数据结构
 */
interface Subsection {
  id?: string;
  subsection: string;
  description?: string;
}

interface Section {
  id?: string;
  section: string;
  description?: string;
  subsections?: Subsection[];
}

interface Chapter {
  id?: string;
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
  onConfirm: (selectedIds: string[]) => void; // 修改为返回ID列表
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
  const { t } = useLocale();
  // 选中的ID集合（章节、小节、子小节的ID）
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // 展开的章节ID集合
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // 初始化：默认全选并全部展开
  useEffect(() => {
    if (isOpen && catalog.length > 0) {
      const allIds = new Set<string>();
      const allChapterIds = new Set<string>();

      // 递归收集所有ID
      catalog.forEach((chapter) => {
        if (chapter.id) {
          allIds.add(chapter.id);
          allChapterIds.add(chapter.id);

          chapter.sections?.forEach((section) => {
            if (section.id) {
              allIds.add(section.id);
            }
            section.subsections?.forEach((subsection) => {
              if (subsection.id) {
                allIds.add(subsection.id);
              }
            });
          });
        }
      });

      setSelectedIds(allIds);
      setExpandedChapters(allChapterIds);
    }
  }, [isOpen, catalog]);

  // 获取章节下所有的子ID（sections和subsections）
  const getChapterChildIds = (chapter: Chapter): string[] => {
    const ids: string[] = [];
    chapter.sections?.forEach((section) => {
      if (section.id) ids.push(section.id);
      section.subsections?.forEach((subsection) => {
        if (subsection.id) ids.push(subsection.id);
      });
    });
    return ids;
  };

  // 切换章节选中状态
  const toggleChapter = (chapter: Chapter) => {
    if (!chapter.id) return;

    const newSelectedIds = new Set(selectedIds);
    const childIds = getChapterChildIds(chapter);

    if (newSelectedIds.has(chapter.id)) {
      // 取消选中章节及所有子节点
      newSelectedIds.delete(chapter.id);
      childIds.forEach(id => newSelectedIds.delete(id));
    } else {
      // 选中章节及所有子节点
      newSelectedIds.add(chapter.id);
      childIds.forEach(id => newSelectedIds.add(id));
    }

    setSelectedIds(newSelectedIds);
  };

  // 切换小节选中状态
  const toggleSection = (chapter: Chapter, section: Section) => {
    if (!chapter.id || !section.id) return;

    const newSelectedIds = new Set(selectedIds);

    // 获取小节的所有子ID
    const subsectionIds: string[] = [];
    section.subsections?.forEach((subsection) => {
      if (subsection.id) subsectionIds.push(subsection.id);
    });

    if (newSelectedIds.has(section.id)) {
      // 取消选中小节及所有子小节
      newSelectedIds.delete(section.id);
      subsectionIds.forEach(id => newSelectedIds.delete(id));
    } else {
      // 选中小节及所有子小节
      newSelectedIds.add(section.id);
      subsectionIds.forEach(id => newSelectedIds.add(id));
    }

    setSelectedIds(newSelectedIds);

    // 检查父章节是否应该被选中（所有sections都选中才选中章节）
    const allSectionsSelected = chapter.sections?.every((sec) =>
      sec.id && newSelectedIds.has(sec.id)
    );

    if (allSectionsSelected && chapter.id) {
      newSelectedIds.add(chapter.id);
    } else if (chapter.id) {
      newSelectedIds.delete(chapter.id);
    }

    setSelectedIds(newSelectedIds);
  };

  // 切换子小节选中状态
  const toggleSubsection = (chapter: Chapter, section: Section, subsection: Subsection) => {
    if (!subsection.id) return;

    const newSelectedIds = new Set(selectedIds);

    if (newSelectedIds.has(subsection.id)) {
      newSelectedIds.delete(subsection.id);
    } else {
      newSelectedIds.add(subsection.id);
    }

    setSelectedIds(newSelectedIds);

    // 检查父小节是否应该被选中
    if (section.id && section.subsections) {
      const allSubsectionsSelected = section.subsections.every((sub) =>
        sub.id && newSelectedIds.has(sub.id)
      );
      if (allSubsectionsSelected) {
        newSelectedIds.add(section.id);
      } else {
        newSelectedIds.delete(section.id);
      }
    }

    // 检查父章节是否应该被选中
    if (chapter.id && chapter.sections) {
      const allSectionsSelected = chapter.sections.every((sec) =>
        sec.id && newSelectedIds.has(sec.id)
      );
      if (allSectionsSelected) {
        newSelectedIds.add(chapter.id);
      } else {
        newSelectedIds.delete(chapter.id);
      }
    }

    setSelectedIds(newSelectedIds);
  };

  // 切换章节展开/折叠
  const toggleExpand = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const allIds = new Set<string>();
    catalog.forEach((chapter) => {
      if (chapter.id) allIds.add(chapter.id);
      chapter.sections?.forEach((section) => {
        if (section.id) allIds.add(section.id);
        section.subsections?.forEach((subsection) => {
          if (subsection.id) allIds.add(subsection.id);
        });
      });
    });

    if (selectedIds.size === allIds.size) {
      // 取消全选
      setSelectedIds(new Set());
    } else {
      // 全选
      setSelectedIds(allIds);
    }
  };

  // 确认选择
  const handleConfirm = () => {
    // 直接返回选中的ID列表
    const selectedIdArray = Array.from(selectedIds);
    onConfirm(selectedIdArray);
  };

  // 计算选中数量（只计算选中的ID数量）
  const selectedCount = selectedIds.size;
  const totalCount = (() => {
    let count = 0;
    catalog.forEach((chapter) => {
      if (chapter.id) count++;
      chapter.sections?.forEach((section) => {
        if (section.id) count++;
        section.subsections?.forEach((subsection) => {
          if (subsection.id) count++;
        });
      });
    });
    return count;
  })();

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
            <h2 className="text-xl font-semibold text-gray-900">{t('flashcard.selectSections')}</h2>
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
            {selectedCount === totalCount ? t('common.deselectAll') : t('common.selectAll')}
          </button>
          <span className="text-sm text-gray-600">
            {t('common.selected')} <span className="font-semibold text-gray-900">{selectedCount}</span> / {totalCount} {t('common.sections')}
          </span>
        </div>

        {/* 大纲列表 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {catalog.map((chapter) => {
            const isChapterSelected = chapter.id ? selectedIds.has(chapter.id) : false;
            const isChapterExpanded = chapter.id ? expandedChapters.has(chapter.id) : false;
            const hasSections = chapter.sections && chapter.sections.length > 0;
            const chapterKey = chapter.id || `chapter-${catalog.indexOf(chapter)}`;

            return (
              <div key={chapterKey} className="mb-2">
                {/* 章节 */}
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <input
                    type="checkbox"
                    checked={isChapterSelected}
                    onChange={() => toggleChapter(chapter)}
                    className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {chapter.chapter}
                        </h3>
                        {chapter.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{chapter.description}</p>
                        )}
                      </div>
                      {hasSections && (
                        <button
                          onClick={() => chapter.id && toggleExpand(chapter.id)}
                          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg
                            className={`h-5 w-5 transition-transform ${
                              isChapterExpanded ? 'rotate-180' : ''
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
                {isChapterExpanded && hasSections && (
                  <div className="ml-10 mt-1 space-y-1">
                    {chapter.sections!.map((section) => {
                      const isSectionSelected = section.id ? selectedIds.has(section.id) : false;
                      const sectionKey = section.id || `section-${chapterKey}-${chapter.sections!.indexOf(section)}`;

                      return (
                        <div
                          key={sectionKey}
                          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSectionSelected}
                            onChange={() => toggleSection(chapter, section)}
                            className="mt-0.5 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700">
                              {section.section}
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

                {/* 子小节（展开时显示）*/}
                {isChapterExpanded && hasSections && (
                  <div className="ml-16 mt-1 space-y-1">
                    {chapter.sections?.map((section) => {
                      const sectionSubKey = section.id || `${chapterKey}-section-${chapter.sections!.indexOf(section)}`;
                      
                      return (
                        <div key={sectionSubKey}>
                          {section.subsections && section.subsections.length > 0 && (
                            section.subsections.map((subsection) => {
                              const isSubsectionSelected = subsection.id ? selectedIds.has(subsection.id) : false;

                              return (
                                <div
                                  key={subsection.id || `subsection-${sectionKey}-${section.subsections!.indexOf(subsection)}`}
                                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSubsectionSelected}
                                    onChange={() => toggleSubsection(chapter, section, subsection)}
                                    className="mt-0.5 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700">
                                      {subsection.subsection}
                                    </p>
                                    {subsection.description && (
                                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                        {subsection.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
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
            {t('common.cancel')}
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
            {t('flashcard.create')} ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
}
