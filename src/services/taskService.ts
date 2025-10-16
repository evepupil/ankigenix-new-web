import { supabaseServer } from '@/lib/supabase/server';
import type { TaskInfo, TaskInfoInsert, TaskInfoUpdate, TaskStatus } from '@/types/database';

/**
 * 任务服务类（服务端业务层）
 * 提供 task_info 表的 CRUD 操作
 *
 * 注意：所有方法都需要传入 userId 进行权限控制
 */
class TaskService {
  private tableName = 'task_info';

  /**
   * 创建新任务
   * @param userId 用户ID
   * @param taskData 任务数据（不含 user_id）
   * @returns 创建的任务信息
   */
  async createTask(userId: string, taskData: Omit<TaskInfoInsert, 'user_id'>): Promise<TaskInfo> {
    const { data, error } = await (supabaseServer
      .from(this.tableName)
      .insert({
        ...taskData,
        user_id: userId,
      } as never)
      .select()
      .single());

    if (error) throw error;
    return data;
  }

  /**
   * 获取单个任务
   * @param taskId 任务ID
   * @param userId 用户ID（用于权限验证）
   * @returns 任务信息
   */
  async getTask(taskId: string, userId: string): Promise<TaskInfo | null> {
    const { data, error } = await supabaseServer
      .from(this.tableName)
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId) // 确保只能查询自己的任务
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // 未找到记录
      throw error;
    }
    return data;
  }

  /**
   * 获取用户的所有任务
   * @param userId 用户ID
   * @param options 查询选项
   * @returns 任务列表
   */
  async getUserTasks(userId: string, options?: {
    status?: TaskStatus;
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at';
    ascending?: boolean;
  }): Promise<TaskInfo[]> {
    let query = supabaseServer
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

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
   * @param userId 用户ID（用于权限验证）
   * @param status 新状态
   * @returns 更新后的任务信息
   */
  async updateTaskStatus(taskId: string, userId: string, status: TaskStatus): Promise<TaskInfo> {
    const { data, error } = await (supabaseServer
      .from(this.tableName)
      .update({ status } as never)
      .eq('id', taskId)
      .eq('user_id', userId) // 确保只能更新自己的任务
      .select()
      .single());

    if (error) throw error;
    return data;
  }

  /**
   * 更新任务信息
   * @param taskId 任务ID
   * @param userId 用户ID（用于权限验证）
   * @param updates 更新的字段
   * @returns 更新后的任务信息
   */
  async updateTask(taskId: string, userId: string, updates: TaskInfoUpdate): Promise<TaskInfo> {
    const { data, error } = await (supabaseServer
      .from(this.tableName)
      .update(updates as never)
      .eq('id', taskId)
      .eq('user_id', userId) // 确保只能更新自己的任务
      .select()
      .single());

    if (error) throw error;
    return data;
  }

  /**
   * 删除任务
   * @param taskId 任务ID
   * @param userId 用户ID（用于权限验证）
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    const { error } = await supabaseServer
      .from(this.tableName)
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId); // 确保只能删除自己的任务

    if (error) throw error;
  }

  /**
   * 获取任务统计信息
   * @param userId 用户ID
   * @returns 统计数据
   */
  async getTaskStats(userId: string): Promise<{
    total: number;
    completed: number;
    failed: number;
    processing: number;
  }> {
    const { count: total } = await supabaseServer
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: completed } = await supabaseServer
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    const { count: failed } = await supabaseServer
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'failed');

    const { count: processing } = await supabaseServer
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['processing', 'ai_processing', 'file_uploading', 'generating_catalog', 'generating_cards']);

    return {
      total: total || 0,
      completed: completed || 0,
      failed: failed || 0,
      processing: processing || 0,
    };
  }
}

// 导出单例实例
export const taskService = new TaskService();
