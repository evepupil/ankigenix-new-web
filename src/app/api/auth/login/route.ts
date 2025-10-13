import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * POST /api/auth/login
 * 用户登录（邮箱+密码）
 *
 * 请求体：
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证必需字段
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 登录
    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: error.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 登录成功
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        username: data.user?.user_metadata?.username,
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
