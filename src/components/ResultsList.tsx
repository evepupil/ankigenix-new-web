'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  LinkIcon,
  VideoCameraIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import CatalogSelectionWrapper from './CatalogSelectionWrapper';

// 任务状态类型（对应数据库的status字段）
type TaskStatus = 'processing' | 'ai_processing' | 'file_uploading' | 'generating_catalog' | 'catalog_ready' | 'generating_cards' | 'completed' | 'failed';

// 输入类型（对应数据库的task_type字段）
type InputType = 'text' | 'file' | 'web' | 'topic';

// 任务数据接口（对应数据库的task_info表）
interface Task {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  task_type: InputType;
  workflow_type: 'extract_catalog' | 'direct_generate';
  input_data: {
    text?: string;
    file?: { name: string; type: string; info?: string };
    web_url?: string;
    topic?: string;
    language?: string;
    card_count?: number;
    flashcard_set_id?: string;
  };
  status: TaskStatus;
}

interface ResultsListProps {
  taskHistory?: Task[];
  isLoading?: boolean;
  onCatalogConfirm?: (selectedIds: string[]) => void; // 当用户确认选择章节时的回调
  onToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void; // Toast通知回调
}

/**
 * 生成结果列表组件
 * 显示用户的历史任务和闪卡生成记录
 */
export default function ResultsList({ taskHistory = [], isLoading = false, onCatalogConfirm, onToast }: ResultsListProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(taskHistory);

  // 当传入的任务历史发生变化时，更新本地状态
  useEffect(() => {
    if (taskHistory) {
      setTasks(taskHistory);
    }
  }, [taskHistory]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 大纲选择对话框状态
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [selectedTaskIdForCatalog, setSelectedTaskIdForCatalog] = useState<string | null>(null);

  /**
   * 获取任务状态的显示信息
   */
  const getStatusInfo = (status: TaskStatus) => {
    const statusKey = {
      'processing': 'processing',
      'ai_processing': 'aiProcessing',
      'file_uploading': 'fileUploading',
      'generating_catalog': 'generatingCatalog',
      'catalog_ready': 'catalogReady',
      'generating_cards': 'generatingCards',
      'completed': 'completed',
      'failed': 'failed'
    }[status];

    const colors = {
      'processing': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'ai_processing': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'file_uploading': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'generating_catalog': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'catalog_ready': { color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      'generating_cards': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'completed': { color: 'text-green-600', bgColor: 'bg-green-100' },
      'failed': { color: 'text-red-600', bgColor: 'bg-red-100' }
    }[status];

    const icons = {
      'completed': CheckCircleIcon,
      'failed': XCircleIcon
    };

    return {
      icon: icons[status as keyof typeof icons] || ClockIcon,
      text: t(`dashboard.taskHistory.status.${statusKey}`),
      ...colors
    };
  };

  /**
   * 获取输入类型的显示信息
   */
  const getInputTypeInfo = (inputType: InputType) => {
    const typeColors = {
      'text': 'text-gray-600',
      'file': 'text-purple-600',
      'web': 'text-blue-600',
      'topic': 'text-orange-600'
    };

    const typeIcons = {
      'text': DocumentTextIcon,
      'file': DocumentTextIcon,
      'web': LinkIcon,
      'topic': LightBulbIcon
    };

    return {
      icon: typeIcons[inputType],
      text: t(`dashboard.taskHistory.inputType.${inputType}`),
      color: typeColors[inputType]
    };
  };

  /**
   * 从任务数据生成标题
   */
  const getTaskTitle = (task: Task): string => {
    const { task_type, input_data } = task;

    if (task_type === 'text' && input_data.text) {
      const preview = input_data.text.substring(0, 30);
      return `${t('dashboard.taskHistory.taskTitle.text')} - ${preview}${input_data.text.length > 30 ? '...' : ''}`;
    }

    if (task_type === 'file' && input_data.file) {
      return input_data.file.name;
    }

    if (task_type === 'web' && input_data.web_url) {
      return `${t('dashboard.taskHistory.taskTitle.web')} - ${input_data.web_url}`;
    }

    if (task_type === 'topic' && input_data.topic) {
      return `${t('dashboard.taskHistory.taskTitle.topic')} - ${input_data.topic}`;
    }

    return t('dashboard.taskHistory.taskTitle.unknown');
  };

  /**
   * 格式化时间显示
   */
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 处理预览任务 - 跳转到动态路由
   */
  const handleViewTask = (task: Task) => {
    router.push(`/preview/${task.id}`);
  };

  /**
   * 处理下载闪卡
   */
  const handleDownload = (taskId: string) => {
    console.log('下载闪卡:', taskId);
    // 这里将来会实现真实的下载功能
  };

  /**
   * 处理选择大纲按钮点击
   */
  const handleSelectCatalog = (taskId: string) => {
    setSelectedTaskIdForCatalog(taskId);
    setShowCatalogModal(true);
  };

  /**
   * 处理大纲选择确认
   */
  const handleCatalogConfirm = (selectedIds: string[]) => {
    setShowCatalogModal(false);
    setSelectedTaskIdForCatalog(null);
    // 调用父组件传入的回调
    onCatalogConfirm?.(selectedIds);
  };

  /**
   * 处理大纲选择取消
   */
  const handleCatalogClose = () => {
    setShowCatalogModal(false);
    setSelectedTaskIdForCatalog(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.taskHistory.title')}</h2>
          <div className="text-sm text-gray-500">
            {t('dashboard.taskHistory.totalTasks', { count: tasks.length })}
          </div>
        </div>

        {/* 骨架屏加载状态 */}
        {isLoading && tasks.length === 0 && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 任务列表 */}
        {!isLoading && tasks.length > 0 && (
          <div className="space-y-4">
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const inputTypeInfo = getInputTypeInfo(task.task_type);
            const StatusIcon = statusInfo.icon;
            const InputIcon = inputTypeInfo.icon;
            const title = getTaskTitle(task);

            return (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <InputIcon className={`h-5 w-5 ${inputTypeInfo.color}`} />
                      <h3 className="font-medium text-gray-900">{title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.text}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{t('dashboard.taskHistory.labels.createTime')}: {formatDateTime(task.created_at)}</span>
                      {task.status === 'completed' && (
                        <span>{t('dashboard.taskHistory.labels.completeTime')}: {formatDateTime(task.updated_at)}</span>
                      )}
                      {task.input_data.card_count && (
                        <span>{t('dashboard.taskHistory.labels.cardCount')}: {task.input_data.card_count}</span>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 ml-4">
                    {task.status === 'completed' && (
                      <>
                        <button
                          onClick={() => handleViewTask(task)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {t('dashboard.taskHistory.actions.preview')}
                        </button>
                        <button
                          onClick={() => handleDownload(task.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          {t('dashboard.taskHistory.actions.download')}
                        </button>
                      </>
                    )}
                    {(task.status === 'processing' || task.status === 'ai_processing' || task.status === 'generating_cards' || task.status === 'generating_catalog' || task.status === 'file_uploading') && (
                      <div className="text-sm text-blue-600 font-medium">
                        {t('dashboard.taskHistory.actions.processing')}
                      </div>
                    )}
                    {task.status === 'catalog_ready' && (
                      <button
                        onClick={() => handleSelectCatalog(task.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        {t('dashboard.taskHistory.actions.selectChapters')}
                      </button>
                    )}
                    {task.status === 'failed' && (
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {t('dashboard.taskHistory.actions.retry')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* 空状态 */}
        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('dashboard.taskHistory.empty')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('dashboard.taskHistory.emptyHint')}
            </p>
          </div>
        )}
      </div>

      {/* 大纲选择对话框 */}
      <CatalogSelectionWrapper
        taskId={selectedTaskIdForCatalog}
        isOpen={showCatalogModal}
        onClose={handleCatalogClose}
        onConfirm={handleCatalogConfirm}
        onToast={onToast}
      />
    </div>
  );
}
