import { supabaseServer } from '@/lib/supabase/server';

/**
 * 大纲信息接口
 */
export interface CatalogInfo {
  id: string;
  task_id: string;
  user_id: string;
  catalog_data: any[]; // 大纲数据JSON
  selected: string[]; // 选中的章节ID列表
  created_at: string;
  updated_at: string;
}

/**
 * 大纲服务类（服务端业务层）
 * 提供 catalog_info 表的查询操作
 *
 * 注意：所有方法都需要传入 userId 进行权限控制
 */
class CatalogService {
  private tableName = 'catalog_info';

  /**
   * 根据任务ID获取大纲信息
   * @param taskId 任务ID
   * @param userId 用户ID（用于权限验证）
   * @returns 大纲信息
   */
  async getCatalogByTaskId(taskId: string, userId: string): Promise<CatalogInfo | null> {
    try {
      const { data, error } = await supabaseServer
        .from(this.tableName)
        .select('*')
        .eq('task_id', taskId)
        .eq('user_id', userId) // 确保只能查询自己的数据
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // 未找到记录
        throw error;
      }
      return data;
    } catch (error) {
      console.error('获取大纲信息失败:', error);
      throw error;
    }
  }

  /**
   * 根据任务ID获取大纲数据（仅返回catalog_data）
   * @param taskId 任务ID
   * @param userId 用户ID（用于权限验证）
   * @returns 大纲数据数组
   */
  async getCatalogDataByTaskId(taskId: string, userId: string): Promise<any[] | null> {
    const catalogInfo = await this.getCatalogByTaskId(taskId, userId);
    return catalogInfo ? catalogInfo.catalog_data : null;
  }

  /**
   * 根据任务ID获取选中的章节ID列表
   * @param taskId 任务ID
   * @param userId 用户ID（用于权限验证）
   * @returns 选中的章节ID数组
   */
  async getSelectedSectionsByTaskId(taskId: string, userId: string): Promise<string[]> {
    const catalogInfo = await this.getCatalogByTaskId(taskId, userId);
    return catalogInfo ? catalogInfo.selected : [];
  }

  /**
   * 获取用户的所有大纲
   * @param userId 用户ID
   * @param options 查询选项
   * @returns 大纲列表
   */
  async getUserCatalogs(userId: string, options?: {
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at';
    ascending?: boolean;
  }): Promise<CatalogInfo[]> {
    let query = supabaseServer
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

    // 排序
    const orderBy = options?.orderBy || 'created_at';
    const ascending = options?.ascending ?? false;
    query = query.order(orderBy, { ascending });

    // 分页
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }
}

// 导出单例实例
export const catalogService = new CatalogService();
