'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

/**
 * 认证上下文类型
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'azure') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 认证Provider组件
 * 使用 Supabase Auth 管理用户认证状态
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 初始化：监听 Supabase Auth 状态变化
  useEffect(() => {
    // 获取当前 session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // 保存 access_token 到 localStorage 供 API 调用使用
      if (session?.access_token) {
        localStorage.setItem('auth_token', session.access_token);
      } else {
        localStorage.removeItem('auth_token');
      }

      setIsLoading(false);
    });

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // 更新 localStorage 中的 token
      if (session?.access_token) {
        localStorage.setItem('auth_token', session.access_token);
      } else {
        localStorage.removeItem('auth_token');
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 邮箱密码登录
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      // 登录成功，状态会自动通过 onAuthStateChange 更新
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // 邮箱密码注册
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // OAuth 登录
  const signInWithOAuth = async (provider: 'google' | 'azure') => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // 登出
  const signOut = async () => {
    await supabaseClient.auth.signOut();
    // 清除本地缓存
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentFlashcardSet');
    localStorage.removeItem('ankiTaskHistory');
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signOut,
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
