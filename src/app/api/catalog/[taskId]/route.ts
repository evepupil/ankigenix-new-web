import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * GET /api/catalog/[taskId]
 * 根据任务ID获取大纲信息
 *
 * 响应：
 * {
 *   "success": true,
 *   "catalog": {
 *     "id": "uuid",
 *     "task_id": "uuid",
 *     "user_id": "uuid",
 *     "catalog_data": [...],
 *     "selected": ["1", "1.1", ...],
 *     "created_at": "...",
 *     "updated_at": "..."
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    // 获取当前用户
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const awaitedParams = await params;
    const taskId = awaitedParams.taskId;

    // 查询大纲信息（RLS会自动确保只能查询自己的大纲）
    const { data: catalog, error } = await supabaseServer
      .from('catalog_info')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', user.id) // 额外确保安全
      .single();

    if (error) {
      // 如果没有找到记录
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Catalog not found for this task' },
          { status: 404 }
        );
      }

      console.error('Failed to fetch catalog:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch catalog', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      catalog,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
