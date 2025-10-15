'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/hooks/useLocale';

/**
 * 受保护路由组件
 * 用于包裹需要登录才能访问的页面
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 未登录，跳转到登录页
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 加载中显示loading状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // 未认证返回null，等待重定向
  if (!isAuthenticated) {
    return null;
  }

  // 已认证，渲染子组件
  return <>{children}</>;
}
