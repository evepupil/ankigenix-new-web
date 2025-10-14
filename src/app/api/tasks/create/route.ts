import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { authenticateRequest } from '@/lib/supabase/jwt-verify';

/**
 * POST /api/tasks/create
 * 创建新任务
 *
 * 请求体：
 * {
 *   "task_type": "text" | "file" | "web" | "topic",
 *   "workflow_type": "extract_catalog" | "direct_generate",
 *   "input_data": {
 *     "text"?: string,
 *     "file"?: { name: string, type: string },
 *     "web_url"?: string,
 *     "topic"?: string,
 *     "language"?: string,
 *     "card_count"?: number
 *   }
 * }
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { task_type, workflow_type, input_data } = body;

    // 验证必需字段
    if (!task_type || !workflow_type || !input_data) {
      return NextResponse.json(
        { error: 'Missing required fields: task_type, workflow_type, input_data' },
        { status: 400 }
      );
    }

    // 验证 task_type
    const validTaskTypes = ['text', 'file', 'web', 'topic'];
    if (!validTaskTypes.includes(task_type)) {
      return NextResponse.json(
        { error: `Invalid task_type. Must be one of: ${validTaskTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // 验证 workflow_type
    const validWorkflowTypes = ['extract_catalog', 'direct_generate'];
    if (!validWorkflowTypes.includes(workflow_type)) {
      return NextResponse.json(
        { error: `Invalid workflow_type. Must be one of: ${validWorkflowTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // 创建任务
    const { data: task, error } = await supabaseServer
      .from('task_info')
      .insert({
        user_id: userId,
        task_type,
        workflow_type,
        input_data,
        status: 'processing', // 初始状态
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create task:', error);
      return NextResponse.json(
        { error: 'Failed to create task', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      task,
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
