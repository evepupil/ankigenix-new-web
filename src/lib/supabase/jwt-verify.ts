import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable');
}

/**
 * 从请求头中提取 JWT token
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return null;
  }

  // 支持 "Bearer <token>" 格式
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * 验证 JWT token 并返回用户 ID
 *
 * @param token - JWT token
 * @returns 用户 ID
 * @throws 如果 token 无效或已过期
 */
export async function verifyJWT(token: string): Promise<string> {
  try {
    // 创建一个临时的 Supabase 客户端用于验证 JWT
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 使用 Supabase 的 getUser 方法验证 token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error(error?.message || 'Invalid token');
    }

    return user.id;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`JWT verification failed: ${error.message}`);
    }
    throw new Error('JWT verification failed: Unknown error');
  }
}

/**
 * 从请求中验证用户身份
 *
 * @param request - Next.js 请求对象
 * @returns 用户 ID
 * @throws 如果认证失败
 */
export async function authenticateRequest(request: NextRequest): Promise<string> {
  const token = extractTokenFromRequest(request);

  if (!token) {
    throw new Error('No authorization token provided');
  }

  return await verifyJWT(token);
}
