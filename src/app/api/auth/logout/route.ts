import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/supabase/jwt-verify';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * POST /api/auth/logout
 * 用户登出
 *
 * 注意：此接口会撤销用户的 refresh token，使其无法刷新 access token
 */
export async function POST(request: NextRequest) {
  try {
    // 验证 JWT 并获取用户 ID
    let userId: string;
    try {
      userId = await authenticateRequest(request);
    } catch (error) {
      // 如果 token 已经失效，也返回成功（客户端应该清理本地 session）
      return NextResponse.json({
        success: true,
        message: 'Logout successful',
      });
    }

    // 撤销用户的所有 refresh tokens
    // 注意：这需要使用 service_role key 才能执行
    const { error } = await supabaseServer.auth.admin.signOut(userId);

    if (error) {
      console.error('Logout error:', error);
      // 即使撤销失败，也返回成功，让客户端清理本地 session
      return NextResponse.json({
        success: true,
        message: 'Logout successful (local)',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
