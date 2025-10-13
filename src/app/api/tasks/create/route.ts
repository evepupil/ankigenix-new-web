import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import type { TaskInfoInsert } from '@/types/database';

/**
 * POST /api/tasks/create
 * 创建新的闪卡生成任务
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体数据
    const body = await request.json();

    // 验证必需字段
    const { task_type, workflow_type, input_data } = body;

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
        { error: 'Invalid task_type. Must be one of: text, file, web, topic' },
        { status: 400 }
      );
    }

    // 验证 workflow_type
    const validWorkflowTypes = ['extract_catalog', 'direct_generate'];
    if (!validWorkflowTypes.includes(workflow_type)) {
      return NextResponse.json(
        { error: 'Invalid workflow_type. Must be one of: extract_catalog, direct_generate' },
        { status: 400 }
      );
    }

    // 获取当前用户
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // 构建任务数据
    const taskData: TaskInfoInsert = {
      user_id: user.id,
      task_type,
      workflow_type,
      input_data,
      status: body.status || 'processing', // 默认状态为 processing
    };

    // 插入数据库
    const { data: task, error: insertError } = await supabaseServer
      .from('task_info')
      .insert(taskData)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create task', details: insertError.message },
        { status: 500 }
      );
    }

    // 返回创建的任务
    return NextResponse.json(
      {
        success: true,
        task,
        message: 'Task created successfully',
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
