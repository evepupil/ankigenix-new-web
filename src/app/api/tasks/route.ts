import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { authenticateRequest } from '@/lib/supabase/jwt-verify';

/**
 * GET /api/tasks
 * 获取当前用户的任务列表
 * 查询参数：
 * - status: 按状态过滤（可选）
 * - limit: 每页数量（默认20）
 * - offset: 偏移量（默认0）
 */
export async function GET(request: NextRequest) {
  try {
    // 验证 JWT 并获取用户 ID
    let userId: string;
    try {
      userId = await authenticateRequest(request);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 构建查询
    let query = supabaseServer
      .from('task_info')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // 按状态过滤（如果提供）
    if (status) {
      query = query.eq('status', status);
    }

    // 按创建时间降序排序（新的在上面）
    query = query.order('created_at', { ascending: false });

    // 分页
    query = query.range(offset, offset + limit - 1);

    const { data: tasks, error: queryError, count } = await query;

    if (queryError) {
      console.error('Database query error:', queryError);
      return NextResponse.json(
        { error: 'Failed to fetch tasks', details: queryError.message },
        { status: 500 }
      );
    }

    // 返回任务列表
    return NextResponse.json({
      success: true,
      tasks: tasks || [],
      total: count || 0,
      limit,
      offset,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
