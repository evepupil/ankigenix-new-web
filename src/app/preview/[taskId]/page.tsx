'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/ProtectedRoute';
import FlashcardList, { Flashcard, Chapter } from '@/components/preview/FlashcardList';

/**
 * 任务闪卡预览页面
 */
function TaskPreviewContent() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId as string;

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskInfo, setTaskInfo] = useState<any>(null);

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
        // task 表本身没有 result_id，需要通过 task_id 查找 flashcard_result
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
          // 转换数据格式
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
        } else {
          console.log('该任务没有闪卡数据');
          // 即使没有闪卡，也正常结束，让页面显示"暂无闪卡"状态
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

        // 处理子章节
        const childSections = item.sections || item.subsections;
        if (childSections && Array.isArray(childSections) && childSections.length > 0) {
          chapter.children = convert(childSections);
        }

        return chapter;
      });
    };

    return convert(catalogData);
  };

  /**
   * 导出闪卡
   */
  const handleExport = () => {
    // TODO: 调用导出 API
    alert('导出功能开发中...');
  };

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

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">暂无闪卡</h2>
          <p className="text-gray-600 mb-4">该任务还没有生成闪卡</p>
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
                <h1 className="text-xl font-semibold text-gray-900">闪卡预览</h1>
                <p className="text-sm text-gray-500">
                  {taskInfo?.input_data?.file?.name ||
                   taskInfo?.input_data?.web_url ||
                   '任务结果查看'}
                </p>
              </div>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                总计: <span className="font-semibold">{flashcards.filter(c => !c.is_deleted).length}</span> 张
              </div>

              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>导出 Anki</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 - 使用 FlashcardList 组件 */}
      <div className="flex-1 overflow-hidden">
        <FlashcardList
          flashcards={flashcards}
          chapters={chapters}
          showDeleted={false}
          readOnly={true}
        />
      </div>
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
