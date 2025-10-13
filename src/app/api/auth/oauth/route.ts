import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * POST /api/auth/oauth
 * 第三方OAuth登录（为未来扩展预留）
 *
 * 支持的 provider：
 * - google
 * - github
 * - microsoft
 * - apple
 * 等（需要在 Supabase Dashboard 配置）
 *
 * 请求体：
 * {
 *   "provider": "google"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider } = body;

    // 验证 provider
    const validProviders = ['google', 'github', 'microsoft', 'apple', 'facebook'];
    if (!provider || !validProviders.includes(provider)) {
      return NextResponse.json(
        { error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 }
      );
    }

    // 获取重定向 URL
    const redirectTo = `${request.nextUrl.origin}/auth/callback`;

    // 发起 OAuth 登录
    const { data, error } = await supabaseServer.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // 返回授权 URL
    return NextResponse.json({
      success: true,
      url: data.url,
      message: `Please complete authentication with ${provider}`,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
