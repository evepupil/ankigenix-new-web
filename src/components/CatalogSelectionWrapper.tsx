'use client';

import { useState, useEffect } from 'react';
import CatalogSelectionModal from './CatalogSelectionModal';

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
 * CatalogSelectionWrapper属性
 */
interface CatalogSelectionWrapperProps {
  // 任务ID（用于从API获取大纲）
  taskId: string | null;
  // 直接传入的大纲数据（可选，如果传入则不从API获取）
  catalogData?: Chapter[];
  // 文件名（可选，如果传入catalogData则需要）
  fileName?: string;
  // 是否打开对话框
  isOpen: boolean;
  // 关闭对话框的回调
  onClose: () => void;
  // 确认选择的回调（传递选中的章节ID列表）
  onConfirm: (selectedIds: string[]) => void;
  // Toast通知回调（可选）
  onToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

/**
 * 大纲选择包装器组件
 * 负责从API获取大纲数据，然后传递给CatalogSelectionModal
 * 可以在两种场景使用：
 * 1. 传入taskId，组件会自动从API获取大纲
 * 2. 直接传入catalogData和fileName，不需要从API获取
 */
export default function CatalogSelectionWrapper({
  taskId,
  catalogData: propCatalogData,
  fileName: propFileName,
  isOpen,
  onClose,
  onConfirm,
  onToast,
}: CatalogSelectionWrapperProps) {
  const [catalogData, setCatalogData] = useState<Chapter[]>([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // 标记是否已经获取过数据

  // 当对话框打开且提供了taskId时，从API获取大纲数据
  useEffect(() => {
    const fetchCatalogData = async () => {
      if (!isOpen) {
        // 对话框关闭时，重置状态
        setHasFetched(false);
        return;
      }

      // 如果已经获取过数据，不再重复获取
      if (hasFetched) return;

      // 如果直接传入了catalogData，则使用传入的数据
      if (propCatalogData && propFileName) {
        setCatalogData(propCatalogData);
        setFileName(propFileName);
        setHasFetched(true);
        return;
      }

      // 如果没有taskId，无法获取数据
      if (!taskId) {
        setError('缺少任务ID');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 从localStorage获取token
        const token = localStorage.getItem('auth_token');

        // 从API获取大纲信息
        const response = await fetch(`/api/catalog/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!data.success || !data.catalog) {
          const errorMsg = data.error || '获取大纲失败';
          setError(errorMsg);
          onToast?.('error', '获取大纲失败', errorMsg);
          return;
        }

        const catalog = data.catalog;

        // 验证 catalog_data 是否为数组
        if (!Array.isArray(catalog.catalog_data)) {
          console.error('Catalog data is not an array:', catalog.catalog_data);
          setError('大纲数据格式错误');
          onToast?.('error', '大纲数据格式错误', '服务器返回的数据格式不正确');
          return;
        }

        // 从任务表获取文件信息
        const taskResponse = await fetch(`/api/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const taskData = await taskResponse.json();

        let fileNameFromTask = '未知文件';
        if (taskData.success && taskData.task?.input_data?.file?.name) {
          fileNameFromTask = taskData.task.input_data.file.name;
        }

        setCatalogData(catalog.catalog_data);
        setFileName(fileNameFromTask);
        setHasFetched(true); // 标记已经获取过数据

      } catch (err) {
        console.error('获取大纲信息失败:', err);
        const errorMsg = '发生错误，请稍后重试';
        setError(errorMsg);
        onToast?.('error', '获取大纲失败', errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogData();
  }, [isOpen, taskId, propCatalogData, propFileName, hasFetched]);

  // 处理关闭
  const handleClose = () => {
    setCatalogData([]);
    setFileName('');
    setError(null);
    setHasFetched(false); // 重置获取标志
    onClose();
  };

  // 如果正在加载，显示加载状态
  if (isOpen && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
          <div className="flex justify-center mb-4">
            <svg className="animate-spin h-12 w-12 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-700 font-medium">正在加载大纲数据...</p>
        </div>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (isOpen && error && !catalogData.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center border border-red-200">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  // 如果没有打开，或者没有数据，不渲染
  if (!isOpen || catalogData.length === 0) {
    return null;
  }

  // 渲染大纲选择对话框
  return (
    <CatalogSelectionModal
      isOpen={isOpen}
      catalog={catalogData}
      fileName={fileName}
      onClose={handleClose}
      onConfirm={onConfirm}
    />
  );
}
