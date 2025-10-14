import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { authenticateRequest } from '@/lib/supabase/jwt-verify';

/**
 * GET /api/tasks/[id]
 * 获取单个任务的详细信息
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const awaitedParams = await params;
    const taskId = awaitedParams.id;

    // 查询任务信息（RLS会自动确保只能查询自己的任务）
    const { data: task, error } = await supabaseServer
      .from('task_info')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (error) {
      // 如果没有找到记录
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      console.error('Failed to fetch task:', error);
      return NextResponse.json(
        { error: 'Failed to fetch task', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      task,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tasks/[id]
 * 更新任务状态
 *
 * 请求体：
 * {
 *   "status": "processing" | "ai_processing" | "completed" | "failed" | ...,
 *   "input_data"?: { ... } // 可选，更新输入数据
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const awaitedParams = await params;
    const taskId = awaitedParams.id;
    const body = await request.json();
    const { status, input_data } = body;

    // 至少需要提供一个更新字段
    if (!status && !input_data) {
      return NextResponse.json(
        { error: 'At least one field (status or input_data) must be provided' },
        { status: 400 }
      );
    }

    // 验证状态值
    if (status) {
      const validStatuses = [
        'processing',
        'ai_processing',
        'file_uploading',
        'generating_catalog',
        'catalog_ready',
        'generating_cards',
        'completed',
        'failed'
      ];

      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // 构建更新对象
    const updateData: any = {};
    if (status) updateData.status = status;
    if (input_data) updateData.input_data = input_data;

    // 更新任务（RLS会自动确保只能更新自己的任务）
    const { data: task, error } = await supabaseServer
      .from('task_info')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', userId) // 额外确保安全
      .select()
      .single();

    if (error) {
      console.error('Failed to update task:', error);
      return NextResponse.json(
        { error: 'Failed to update task', details: error.message },
        { status: 500 }
      );
    }

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
