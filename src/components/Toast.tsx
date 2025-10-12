'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/**
 * Toast 类型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast 消息接口
 */
export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Toast 组件属性
 */
interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

/**
 * 单个 Toast 通知组件
 */
function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  // 自动关闭
  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast]);

  /**
   * 处理关闭动画
   */
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // 等待动画完成
  };

  /**
   * 获取Toast样式配置
   */
  const getToastConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-800',
        };
      case 'error':
        return {
          icon: XCircleIcon,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800',
        };
      case 'warning':
        return {
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800',
        };
      case 'info':
      default:
        return {
          icon: InformationCircleIcon,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg ${config.bgColor} ${config.borderColor} ${
        isExiting
          ? 'animate-slide-out-right'
          : 'animate-slide-in-right'
      }`}
      style={{
        minWidth: '320px',
        maxWidth: '420px',
      }}
    >
      <Icon className={`h-6 w-6 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.textColor}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 inline-flex ${config.textColor} hover:opacity-70 focus:outline-none`}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

/**
 * Toast 容器组件属性
 */
interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

/**
 * Toast 容器组件
 * 显示在屏幕右下角，管理多个 Toast 通知
 */
export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
