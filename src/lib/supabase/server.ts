import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// 从环境变量获取 Supabase 配置（服务端专用）
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase server environment variables');
}

/**
 * Supabase 服务端客户端实例
 * 使用 service_role key，拥有完整权限
 * 仅在服务端（API Routes、Server Components）使用
 *
 * 注意：此客户端用于数据库操作，用户身份验证通过 jwt-verify.ts 中的 JWT 验证完成
 *
 * ⚠️ 警告：不要在客户端组件中导入此文件！
 */
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
