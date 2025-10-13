/**
 * 数据库类型定义
 * 基于 Supabase 数据库结构自动生成
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// 任务类型枚举
export type TaskType = 'text' | 'file' | 'web' | 'topic';

// 工作流类型枚举
export type WorkflowType = 'extract_catalog' | 'direct_generate';

// 任务状态枚举
export type TaskStatus =
  | 'processing'          // 处理中（通用）
  | 'ai_processing'       // AI处理中
  | 'file_uploading'      // 文件上传中
  | 'generating_catalog'  // AI生成大纲中
  | 'catalog_ready'       // 大纲完成待用户选择章节
  | 'generating_cards'    // AI生成闪卡中
  | 'completed'           // 闪卡生成完成
  | 'failed';             // 失败

// 输入数据结构
export interface TaskInputData {
  text?: string;
  file?: {
    name: string;
    type?: string;
    info?: string;
  };
  web_url?: string;
  topic?: string;
  language?: 'zh' | 'en';
  card_count?: number;
}

// 任务信息表类型
export interface TaskInfo {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  task_type: TaskType;
  workflow_type: WorkflowType;
  input_data: TaskInputData;
  status: TaskStatus;
}

// 数据库插入类型（创建时不需要 id, created_at, updated_at）
export type TaskInfoInsert = Omit<TaskInfo, 'id' | 'created_at' | 'updated_at'>;

// 数据库更新类型（所有字段可选）
export type TaskInfoUpdate = Partial<Omit<TaskInfo, 'id' | 'user_id' | 'created_at'>>;

// Supabase 数据库类型定义
export interface Database {
  public: {
    Tables: {
      task_info: {
        Row: TaskInfo;
        Insert: TaskInfoInsert;
        Update: TaskInfoUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      task_type: TaskType;
      workflow_type: WorkflowType;
      task_status: TaskStatus;
    };
  };
}
