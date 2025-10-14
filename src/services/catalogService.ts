import { supabase, getCurrentUser } from '@/lib/supabase/client';

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
 * 大纲服务类
 * 提供 catalog_info 表的查询操作
 */
class CatalogService {
  private tableName = 'catalog_info';

  /**
   * 根据任务ID获取大纲信息
   * @param taskId 任务ID
   * @returns 大纲信息
   */
  async getCatalogByTaskId(taskId: string): Promise<CatalogInfo | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('task_id', taskId)
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
   * @returns 大纲数据数组
   */
  async getCatalogDataByTaskId(taskId: string): Promise<any[] | null> {
    const catalogInfo = await this.getCatalogByTaskId(taskId);
    return catalogInfo ? catalogInfo.catalog_data : null;
  }

  /**
   * 根据任务ID获取选中的章节ID列表
   * @param taskId 任务ID
   * @returns 选中的章节ID数组
   */
  async getSelectedSectionsByTaskId(taskId: string): Promise<string[]> {
    const catalogInfo = await this.getCatalogByTaskId(taskId);
    return catalogInfo ? catalogInfo.selected : [];
  }

  /**
   * 获取当前用户的所有大纲
   * @param options 查询选项
   * @returns 大纲列表
   */
  async getUserCatalogs(options?: {
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at';
    ascending?: boolean;
  }): Promise<CatalogInfo[]> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', user.id);

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

  /**
   * 订阅大纲变化（实时更新）
   * @param taskId 任务ID
   * @param callback 大纲更新时的回调函数
   * @returns 取消订阅的函数
   */
  subscribeToCatalog(taskId: string, callback: (catalog: CatalogInfo) => void) {
    const subscription = supabase
      .channel(`catalog:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.tableName,
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          if (payload.new) {
            callback(payload.new as CatalogInfo);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}

// 导出单例实例
export const catalogService = new CatalogService();
