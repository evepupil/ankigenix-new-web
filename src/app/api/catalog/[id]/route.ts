import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/catalog/[id]
 * 根据 catalog_id 获取大纲数据
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id: catalogId } = await params;
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

    // 查询大纲数据
    const { data: catalog, error: catalogError } = await supabaseServer
      .from('catalog_info')
      .select('*')
      .eq('id', catalogId)
      .eq('user_id', userId)
      .single();

    if (catalogError) {
      console.error('查询大纲失败:', catalogError);
      return NextResponse.json(
        { success: false, error: '查询大纲失败' },
        { status: 500 }
      );
    }

    if (!catalog) {
      return NextResponse.json(
        { success: false, error: '大纲不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      catalog_data: catalog.catalog_data || [],
      file_name: catalog.file_name,
    });

  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
