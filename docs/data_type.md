interface Task_info {
    // === 基本信息 ===
    id: string;                           // 任务唯一ID
    user_id: string;                      // 用户ID (Supabase Auth)
    created_at: string;                   // 创建时间 (ISO 8601)
    updated_at: string;                   // 更新时间

    // === 任务类型与输入 ===
    task_type: 'text' | 'file' | 'web' | 'topic';  // 任务类型
    workflow_type: 'extract_catalog' | 'direct_generate';  // 任务流程类型

    input_data: {
      text?: string;                      // 文本输入
      file?: {
        name: string;                     // 原始文件名
        type?: string;                     // 文件类型，上传文件后计算得出
        info?: string;                     // 文件信息，上传文件后获取的
      };
      web_url?: string;                   // 网页URL
      topic?: string;                     // 主题关键词
      language?: 'zh' | 'en';             // 目标语言
      card_count?: number;                // 期望生成卡片数量
    };

    // === 任务状态 ===
    status:
      | 'processing'                      // 处理中（通用）
      | 'ai_processing'                   // AI处理中
      | 'file_uploading'                  // 文件上传中
      | 'generating_catalog'              // AI生成大纲中
      | 'catalog_ready'                   // 大纲完成待用户选择章节
      | 'generating_cards'                // AI生成闪卡中
      | 'completed'                       // 闪卡生成完成
      | 'failed';                         // 失败
  }