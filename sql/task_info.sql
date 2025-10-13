-- 任务信息表
-- 用于记录用户创建的闪卡生成任务信息
CREATE TABLE IF NOT EXISTS task_info (
  -- === 基本信息 ===
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- === 任务类型 ===
  task_type TEXT NOT NULL CHECK (task_type IN ('text', 'file', 'web', 'topic')),
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('extract_catalog', 'direct_generate')),

  -- === 输入数据 (JSONB格式) ===
  input_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  -- input_data 结构示例:
  -- {
  --   "text": "文本内容",
  --   "file": {
  --     "name": "example.pdf",
  --     "type": "application/pdf",
  --     "info": "文件元信息"
  --   },
  --   "web_url": "https://example.com",
  --   "topic": "主题关键词",
  --   "language": "zh",
  --   "card_count": 10
  -- }

  -- === 任务状态 ===
  status TEXT NOT NULL DEFAULT 'processing' CHECK (
    status IN (
      'processing',          -- 处理中（通用）
      'ai_processing',       -- AI处理中
      'file_uploading',      -- 文件上传中
      'generating_catalog',  -- AI生成大纲中
      'catalog_ready',       -- 大纲完成待用户选择章节
      'generating_cards',    -- AI生成闪卡中
      'completed',           -- 闪卡生成完成
      'failed'               -- 失败
    )
  )
);

-- === 索引 ===
CREATE INDEX IF NOT EXISTS idx_task_info_user_id ON task_info(user_id);
CREATE INDEX IF NOT EXISTS idx_task_info_status ON task_info(status);
CREATE INDEX IF NOT EXISTS idx_task_info_created_at ON task_info(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_info_user_status ON task_info(user_id, status);

-- === 自动更新 updated_at ===
CREATE OR REPLACE FUNCTION update_task_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_task_info_updated_at
  BEFORE UPDATE ON task_info
  FOR EACH ROW
  EXECUTE FUNCTION update_task_info_updated_at();

-- === RLS (Row Level Security) 策略 ===
ALTER TABLE task_info ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的任务
CREATE POLICY "Users can view their own tasks"
  ON task_info
  FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能创建自己的任务
CREATE POLICY "Users can create their own tasks"
  ON task_info
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的任务
CREATE POLICY "Users can update their own tasks"
  ON task_info
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的任务
CREATE POLICY "Users can delete their own tasks"
  ON task_info
  FOR DELETE
  USING (auth.uid() = user_id);

-- === 注释 ===
COMMENT ON TABLE task_info IS '闪卡生成任务信息表';
COMMENT ON COLUMN task_info.id IS '任务唯一ID';
COMMENT ON COLUMN task_info.user_id IS '用户ID，关联 auth.users';
COMMENT ON COLUMN task_info.task_type IS '任务类型: text(文本), file(文件), web(网页), topic(主题)';
COMMENT ON COLUMN task_info.workflow_type IS '任务流程类型: extract_catalog(提取大纲), direct_generate(直接生成)';
COMMENT ON COLUMN task_info.input_data IS '任务输入数据，JSONB格式存储';
COMMENT ON COLUMN task_info.status IS '任务当前状态';
