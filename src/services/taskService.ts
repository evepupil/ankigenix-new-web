import { supabase, getCurrentUser } from '@/lib/supabase/client';
import type { TaskInfo, TaskInfoInsert, TaskInfoUpdate, TaskStatus } from '@/types/database';

/**
 * 任务服务类
 * 提供 task_info 表的 CRUD 操作
 */
class TaskService {
  private tableName = 'task_info';

  /**
   * 创建新任务
   * @param taskData 任务数据（不含 user_id，自动从当前用户获取）
   * @returns 创建的任务信息
   */
  async createTask(taskData: Omit<TaskInfoInsert, 'user_id'>): Promise<TaskInfo> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        ...taskData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 获取单个任务
   * @param taskId 任务ID
   * @returns 任务信息
   */
  async getTask(taskId: string): Promise<TaskInfo | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // 未找到记录
      throw error;
    }
    return data;
  }

  /**
   * 获取当前用户的所有任务
   * @param options 查询选项
   * @returns 任务列表
   */
  async getUserTasks(options?: {
    status?: TaskStatus;
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at';
    ascending?: boolean;
  }): Promise<TaskInfo[]> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', user.id);

    // 按状态筛选
    if (options?.status) {
      query = query.eq('status', options.status);
    }

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
   * 更新任务状态
   * @param taskId 任务ID
   * @param status 新状态
   * @returns 更新后的任务信息
   */
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<TaskInfo> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 更新任务信息
   * @param taskId 任务ID
   * @param updates 更新的字段
   * @returns 更新后的任务信息
   */
  async updateTask(taskId: string, updates: TaskInfoUpdate): Promise<TaskInfo> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 删除任务
   * @param taskId 任务ID
   */
  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  }

  /**
   * 获取任务统计信息
   * @returns 统计数据
   */
  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    failed: number;
    processing: number;
  }> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { count: total } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { count: completed } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    const { count: failed } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'failed');

    const { count: processing } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['processing', 'ai_processing', 'file_uploading', 'generating_catalog', 'generating_cards']);

    return {
      total: total || 0,
      completed: completed || 0,
      failed: failed || 0,
      processing: processing || 0,
    };
  }

  /**
   * 订阅任务变化（实时更新）
   * @param taskId 任务ID
   * @param callback 任务更新时的回调函数
   * @returns 取消订阅的函数
   */
  subscribeToTask(taskId: string, callback: (task: TaskInfo) => void) {
    const subscription = supabase
      .channel(`task:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: this.tableName,
          filter: `id=eq.${taskId}`,
        },
        (payload) => {
          callback(payload.new as TaskInfo);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}

// 导出单例实例
export const taskService = new TaskService();
