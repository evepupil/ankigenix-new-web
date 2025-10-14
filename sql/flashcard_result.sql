-- 闪卡结果表
-- 用于存储生成的闪卡结果集元数据
CREATE TABLE IF NOT EXISTS flashcard_result (
  -- === 基本信息 ===
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- === 关联字段 ===
  task_id UUID NOT NULL REFERENCES task_info(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id UUID REFERENCES catalog_info(id) ON DELETE SET NULL,

  -- === 统计字段 ===
  total_count INTEGER NOT NULL DEFAULT 0,
  -- 总卡片数量，通过触发器自动维护

  -- === 来源字段 ===
  source_type TEXT NOT NULL CHECK (source_type IN ('text', 'file', 'web')),
  -- 来源类型，冗余字段便于查询和统计

  -- === 导出相关字段 ===
  is_exported BOOLEAN NOT NULL DEFAULT FALSE,
  export_format TEXT CHECK (export_format IN ('apkg', 'csv')),
  exported_at TIMESTAMPTZ,
  resource_url TEXT
  -- 资源文件下载链接（OSS/S3地址）
);

-- === 索引 ===
CREATE INDEX IF NOT EXISTS idx_flashcard_result_task_id ON flashcard_result(task_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_result_user_id ON flashcard_result(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_result_catalog_id ON flashcard_result(catalog_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_result_created_at ON flashcard_result(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flashcard_result_source_type ON flashcard_result(source_type);
CREATE INDEX IF NOT EXISTS idx_flashcard_result_user_source ON flashcard_result(user_id, source_type);

-- === 自动更新 updated_at ===
CREATE OR REPLACE FUNCTION update_flashcard_result_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_flashcard_result_updated_at
  BEFORE UPDATE ON flashcard_result
  FOR EACH ROW
  EXECUTE FUNCTION update_flashcard_result_updated_at();

-- === RLS (Row Level Security) 策略 ===
ALTER TABLE flashcard_result ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的闪卡结果
CREATE POLICY "Users can view their own flashcard results"
  ON flashcard_result
  FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能创建自己的闪卡结果
CREATE POLICY "Users can create their own flashcard results"
  ON flashcard_result
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的闪卡结果
CREATE POLICY "Users can update their own flashcard results"
  ON flashcard_result
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的闪卡结果
CREATE POLICY "Users can delete their own flashcard results"
  ON flashcard_result
  FOR DELETE
  USING (auth.uid() = user_id);

-- === 注释 ===
COMMENT ON TABLE flashcard_result IS '闪卡结果表，存储生成的闪卡结果集元数据';
COMMENT ON COLUMN flashcard_result.id IS '结果集唯一ID';
COMMENT ON COLUMN flashcard_result.task_id IS '关联的任务ID';
COMMENT ON COLUMN flashcard_result.user_id IS '用户ID，关联 auth.users';
COMMENT ON COLUMN flashcard_result.catalog_id IS '关联的大纲ID（可选）';
COMMENT ON COLUMN flashcard_result.total_count IS '总卡片数量，由触发器自动维护';
COMMENT ON COLUMN flashcard_result.source_type IS '来源类型: text(文本), file(文件), web(网页)';
COMMENT ON COLUMN flashcard_result.is_exported IS '是否已导出';
COMMENT ON COLUMN flashcard_result.export_format IS '导出格式: apkg, csv';
COMMENT ON COLUMN flashcard_result.exported_at IS '最近一次导出时间';
COMMENT ON COLUMN flashcard_result.resource_url IS '资源文件下载链接（OSS/S3地址）';
