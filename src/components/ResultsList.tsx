'use client';

import { useState, useEffect } from 'react';
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

/**
 * 获取任务状态的显示信息
 */
const getStatusInfo = (status: TaskStatus) => {
  switch (status) {
    case 'processing':
      return {
        icon: ClockIcon,
        text: '处理中',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    case 'ai_processing':
      return {
        icon: ClockIcon,
        text: 'AI处理中',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    case 'file_uploading':
      return {
        icon: ClockIcon,
        text: '文件上传中',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    case 'generating_catalog':
      return {
        icon: ClockIcon,
        text: '生成大纲中',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    case 'catalog_ready':
      return {
        icon: ClockIcon,
        text: '大纲已完成',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    case 'generating_cards':
      return {
        icon: ClockIcon,
        text: '生成闪卡中',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    case 'completed':
      return {
        icon: CheckCircleIcon,
        text: '已完成',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    case 'failed':
      return {
        icon: XCircleIcon,
        text: '失败',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      };
  }
};

/**
 * 获取输入类型的显示信息
 */
const getInputTypeInfo = (inputType: InputType) => {
  switch (inputType) {
    case 'text':
      return {
        icon: DocumentTextIcon,
        text: '文本输入',
        color: 'text-gray-600'
      };
    case 'file':
      return {
        icon: DocumentTextIcon,
        text: '文件上传',
        color: 'text-purple-600'
      };
    case 'web':
      return {
        icon: LinkIcon,
        text: '网页链接',
        color: 'text-blue-600'
      };
    case 'topic':
      return {
        icon: LightBulbIcon,
        text: '主题生成',
        color: 'text-orange-600'
      };
  }
};

interface ResultsListProps {
  taskHistory?: Task[];
  isLoading?: boolean;
}

/**
 * 从任务数据生成标题
 */
const getTaskTitle = (task: Task): string => {
  const { task_type, input_data } = task;

  if (task_type === 'text' && input_data.text) {
    const preview = input_data.text.substring(0, 30);
    return `文本生成 - ${preview}${input_data.text.length > 30 ? '...' : ''}`;
  }

  if (task_type === 'file' && input_data.file) {
    return input_data.file.name;
  }

  if (task_type === 'web' && input_data.web_url) {
    return `网页生成 - ${input_data.web_url}`;
  }

  if (task_type === 'topic' && input_data.topic) {
    return `主题生成 - ${input_data.topic}`;
  }

  return '未知任务';
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
 * 生成结果列表组件
 * 显示用户的历史任务和闪卡生成记录
 */
export default function ResultsList({ taskHistory = [], isLoading = false }: ResultsListProps) {
  const [tasks, setTasks] = useState<Task[]>(taskHistory);

  // 当传入的任务历史发生变化时，更新本地状态
  useEffect(() => {
    if (taskHistory) {
      setTasks(taskHistory);
    }
  }, [taskHistory]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  /**
   * 处理查看任务详情
   */
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
  };

  /**
   * 处理下载闪卡
   */
  const handleDownload = (taskId: string) => {
    console.log('下载闪卡:', taskId);
    // 这里将来会实现真实的下载功能
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">生成历史</h2>
          <div className="text-sm text-gray-500">
            共 {tasks.length} 个任务
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
                      <span>创建时间: {formatDateTime(task.created_at)}</span>
                      {task.status === 'completed' && (
                        <span>完成时间: {formatDateTime(task.updated_at)}</span>
                      )}
                      {task.input_data.card_count && (
                        <span>卡片数量: {task.input_data.card_count}</span>
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
                          预览
                        </button>
                        <button
                          onClick={() => handleDownload(task.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          下载
                        </button>
                      </>
                    )}
                    {(task.status === 'processing' || task.status === 'ai_processing' || task.status === 'generating_cards' || task.status === 'generating_catalog' || task.status === 'file_uploading') && (
                      <div className="text-sm text-blue-600 font-medium">
                        处理中...
                      </div>
                    )}
                    {task.status === 'catalog_ready' && (
                      <div className="text-sm text-yellow-600 font-medium">
                        等待选择章节...
                      </div>
                    )}
                    {task.status === 'failed' && (
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        重试
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无生成记录</h3>
            <p className="mt-1 text-sm text-gray-500">
              开始创建您的第一个闪卡集吧！
            </p>
          </div>
        )}
      </div>

      {/* 任务详情模态框 */}
      {selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  闪卡预览 - {getTaskTitle(selectedTask)}
                </h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 这里将来会显示实际的闪卡预览内容 */}
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <p className="text-gray-600 text-center">
                  闪卡预览功能开发中...
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  关闭
                </button>
                <button
                  onClick={() => handleDownload(selectedTask.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  下载 .apkg
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}