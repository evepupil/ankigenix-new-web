import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * POST /api/auth/logout
 * 用户登出
 */
export async function POST(request: NextRequest) {
  try {
    const { error } = await supabaseServer.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
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
