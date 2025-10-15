import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/flashcards?task_id=xxx 或 ?result_id=xxx
 * 根据 task_id 或 result_id 获取闪卡列表
 */
export async function GET(request: NextRequest) {
  try {
    // 从请求头获取 token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // 创建带用户token的supabase客户端
    const supabaseServer = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // 验证用户
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: '用户验证失败' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');
    const resultId = searchParams.get('result_id');

    let finalResultId = resultId;
    let catalogId = null;

    // 如果提供了 task_id，先查找对应的 flashcard_result
    if (taskId && !resultId) {
      const { data: resultData, error: resultError } = await supabaseServer
        .from('flashcard_result')
        .select('id, catalog_id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .single();

      if (resultError || !resultData) {
        console.error('查询闪卡结果失败:', resultError);
        return NextResponse.json(
          { success: false, error: '该任务没有找到闪卡结果' },
          { status: 404 }
        );
      }

      finalResultId = resultData.id;
      catalogId = resultData.catalog_id;
    } else if (resultId) {
      // 如果直接提供了 result_id，获取 catalog_id
      const { data: resultInfo, error: resultError } = await supabaseServer
        .from('flashcard_result')
        .select('catalog_id')
        .eq('id', resultId)
        .single();

      catalogId = resultInfo?.catalog_id || null;
    } else {
      return NextResponse.json(
        { success: false, error: '缺少 task_id 或 result_id 参数' },
        { status: 400 }
      );
    }

    // 查询闪卡数据
    const { data: flashcards, error: flashcardsError } = await supabaseServer
      .from('flashcard')
      .select('*')
      .eq('result_id', finalResultId)
      .eq('user_id', userId)
      .order('order_index', { ascending: true });

    if (flashcardsError) {
      console.error('查询闪卡失败:', flashcardsError);
      return NextResponse.json(
        { success: false, error: '查询闪卡失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      flashcards: flashcards || [],
      catalog_id: catalogId,
    });

  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
