'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 用户信息接口
 */
interface User {
  id: string;
  username: string;
  email: string;
}

/**
 * 认证上下文类型
 */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 认证Provider组件
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 初始化：从localStorage恢复认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_info');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // TODO: 可以在这里验证token是否有效
          // 如果token即将过期，可以自动刷新
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
        // 清除无效数据
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_info', JSON.stringify(newUser));
  };

  // 登出
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('currentFlashcardSet');
    localStorage.removeItem('ankiTaskHistory');
    router.push('/login');
  };

  // 刷新token
  const refreshToken = async (): Promise<boolean> => {
    try {
      // TODO: 调用后端刷新token的API
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      //
      // if (response.ok) {
      //   const data = await response.json();
      //   setToken(data.token);
      //   localStorage.setItem('auth_token', data.token);
      //   return true;
      // }

      console.warn('Token刷新功能暂未实现');
      return false;
    } catch (error) {
      console.error('刷新token失败:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 使用认证上下文的Hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}
