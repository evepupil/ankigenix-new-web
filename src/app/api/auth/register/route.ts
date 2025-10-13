import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * POST /api/auth/register
 * 用户注册（邮箱+密码）
 *
 * 请求体：
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "username"?: "optional_username"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    // 验证必需字段
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 注册用户
    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || null,
        },
      },
    });

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // 注册成功
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
