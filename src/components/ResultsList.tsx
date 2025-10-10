'use client';

import { useState } from 'react';
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

// 任务状态类型
type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 输入类型
type InputType = 'text' | 'file' | 'url' | 'topic';

// 任务数据接口
interface Task {
  id: string;
  title: string;
  inputType: InputType;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  cardCount?: number;
  qualityScore?: number;
  errorMessage?: string;
}

/**
 * 获取任务状态的显示信息
 */
const getStatusInfo = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return {
        icon: ClockIcon,
        text: '等待中',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    case 'processing':
      return {
        icon: ClockIcon,
        text: '处理中',
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
    case 'url':
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

/**
 * 生成结果列表组件
 * 显示用户的历史任务和闪卡生成记录
 */
export default function ResultsList() {
  // 模拟任务数据
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: '高中数学函数知识点',
      inputType: 'text',
      status: 'completed',
      createdAt: '2024-01-15 14:30',
      completedAt: '2024-01-15 14:32',
      cardCount: 15,
      qualityScore: 92
    },
    {
      id: '2',
      title: 'JavaScript基础教程.pdf',
      inputType: 'file',
      status: 'completed',
      createdAt: '2024-01-15 10:15',
      completedAt: '2024-01-15 10:18',
      cardCount: 28,
      qualityScore: 88
    },
    {
      id: '3',
      title: 'React官方文档 - Hooks',
      inputType: 'url',
      status: 'processing',
      createdAt: '2024-01-15 16:45'
    },
    {
      id: '4',
      title: '英语语法基础',
      inputType: 'topic',
      status: 'pending',
      createdAt: '2024-01-15 17:20'
    },
    {
      id: '5',
      title: '历史事件时间线',
      inputType: 'text',
      status: 'failed',
      createdAt: '2024-01-15 09:30',
      errorMessage: '内容格式不支持，请检查输入内容'
    }
  ]);

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

  /**
   * 格式化质量分数显示
   */
  const formatQualityScore = (score: number) => {
    if (score >= 90) return { text: '优秀', color: 'text-green-600' };
    if (score >= 80) return { text: '良好', color: 'text-blue-600' };
    if (score >= 70) return { text: '一般', color: 'text-yellow-600' };
    return { text: '需改进', color: 'text-red-600' };
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

        {/* 任务列表 */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const inputTypeInfo = getInputTypeInfo(task.inputType);
            const StatusIcon = statusInfo.icon;
            const InputIcon = inputTypeInfo.icon;

            return (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <InputIcon className={`h-5 w-5 ${inputTypeInfo.color}`} />
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>创建时间: {task.createdAt}</span>
                      {task.completedAt && (
                        <span>完成时间: {task.completedAt}</span>
                      )}
                      {task.cardCount && (
                        <span>卡片数量: {task.cardCount}</span>
                      )}
                      {task.qualityScore && (
                        <span className={formatQualityScore(task.qualityScore).color}>
                          质量评分: {task.qualityScore}分 ({formatQualityScore(task.qualityScore).text})
                        </span>
                      )}
                    </div>

                    {task.errorMessage && (
                      <div className="mt-2 text-sm text-red-600">
                        错误信息: {task.errorMessage}
                      </div>
                    )}
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
                    {task.status === 'processing' && (
                      <div className="text-sm text-blue-600 font-medium">
                        处理中...
                      </div>
                    )}
                    {task.status === 'pending' && (
                      <div className="text-sm text-yellow-600 font-medium">
                        排队中...
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

        {/* 空状态 */}
        {tasks.length === 0 && (
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
                  闪卡预览 - {selectedTask.title}
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