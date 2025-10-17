import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Supabase 服务端客户端
 * 使用 Service Role Key，拥有完整权限，绕过 RLS
 *
 * ⚠️ 仅在服务端使用（API Routes、Server Components）
 * ❌ 绝对不要在客户端组件中导入此文件！
 *
 * 用途：
 * - 后端 API 路由中需要绕过 RLS 的操作
 * - 管理员操作
 * - 系统级任务
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase server environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
}

export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
