import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * OAuth 回调处理路由
 * GET /auth/callback
 *
 * 处理来自 Google/Microsoft 等 OAuth 提供商的回调
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // 如果有错误，重定向到登录页面并显示错误
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // 如果有授权码，交换访问令牌
  if (code) {
    try {
      const cookieStore = await cookies();

      // 创建 Supabase 客户端用于处理 OAuth 回调
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
      );

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Token exchange error:', exchangeError);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent('登录失败，请重试')}`
        );
      }

      console.log('OAuth login successful:', data.user?.email);

      // 登录成功，重定向到 dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    } catch (err) {
      console.error('Callback processing error:', err);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('登录处理失败')}`
      );
    }
  }

  // 如果既没有 code 也没有 error，重定向到登录页
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
