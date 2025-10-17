import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * PATCH /api/flashcards/[id]
 * 编辑闪卡内容或恢复已删除的闪卡
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: flashcardId } = await params;

    // 验证身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const supabaseServer = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // 验证用户
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: '用户验证失败' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 获取请求体
    const body = await request.json();
    const { card_data, is_deleted } = body;

    if (!card_data) {
      return NextResponse.json(
        { success: false, error: 'card_data 字段是必需的' },
        { status: 400 }
      );
    }

    // 验证闪卡是否存在且属于该用户
    const { data: existingCard, error: fetchError } = await supabaseServer
      .from('flashcard')
      .select('*')
      .eq('id', flashcardId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingCard) {
      return NextResponse.json(
        { success: false, error: '闪卡不存在或无权限' },
        { status: 404 }
      );
    }

    // 构建更新数据
    interface UpdateData {
      card_data: Record<string, unknown>;
      updated_at: string;
      is_deleted?: boolean;
      deleted_at?: string | null;
    }

    const updateData: UpdateData = {
      card_data,
      updated_at: new Date().toISOString(),
    };

    // 如果提供了 is_deleted 字段，更新删除状态
    if (typeof is_deleted === 'boolean') {
      updateData.is_deleted = is_deleted;
      if (is_deleted === false) {
        // 恢复卡片时，清除 deleted_at
        updateData.deleted_at = null;
      }
    }

    // 更新闪卡
    const { data: updatedCard, error: updateError } = await supabaseServer
      .from('flashcard')
      .update(updateData)
      .eq('id', flashcardId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('更新闪卡失败:', updateError);
      return NextResponse.json(
        { success: false, error: '更新闪卡失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      flashcard: updatedCard,
    });
  } catch (error) {
    console.error('PATCH /api/flashcards/[id] 错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/flashcards/[id]
 * 软删除闪卡
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: flashcardId } = await params;

    // 验证身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const supabaseServer = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // 验证用户
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: '用户验证失败' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 验证闪卡是否存在且属于该用户
    const { data: existingCard, error: fetchError } = await supabaseServer
      .from('flashcard')
      .select('*')
      .eq('id', flashcardId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingCard) {
      return NextResponse.json(
        { success: false, error: '闪卡不存在或无权限' },
        { status: 404 }
      );
    }

    // 软删除：更新 is_deleted 字段
    const { data: deletedCard, error: deleteError } = await supabaseServer
      .from('flashcard')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', flashcardId)
      .eq('user_id', userId)
      .select()
      .single();

    if (deleteError) {
      console.error('删除闪卡失败:', deleteError);
      return NextResponse.json(
        { success: false, error: '删除闪卡失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      flashcard: deletedCard,
    });
  } catch (error) {
    console.error('DELETE /api/flashcards/[id] 错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
