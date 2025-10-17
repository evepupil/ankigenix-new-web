import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * 创建浏览器端 Supabase 客户端
 * 用于前端认证和数据操作
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// 导出单例客户端供客户端组件使用
export const supabaseClient = createSupabaseBrowserClient();
