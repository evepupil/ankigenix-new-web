-- 大纲信息表
-- 用于存储从文件中提取的大纲数据
CREATE TABLE IF NOT EXISTS catalog_info (
  -- === 基本信息 ===
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES task_info(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- === 大纲数据 (JSONB格式) ===
  catalog_data JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- catalog_data 结构示例:
  -- [
  --   {
  --     "id": "1",
  --     "chapter": "第一章 概述",
  --     "description": "本章介绍基本概念和框架",
  --     "sections": [
  --       {
  --         "id": "1.1",
  --         "section": "1.1 背景知识",
  --         "description": "介绍相关背景和历史",
  --         "subsections": [
  --           {
  --             "id": "1.1.1",
  --             "subsection": "1.1.1 历史发展",
  --             "description": "详细介绍发展历程"
  --           }
  --         ]
  --       }
  --     ]
  --   }
  -- ]

  -- === 用户选中的章节ID列表 ===
  selected TEXT[] DEFAULT ARRAY[]::TEXT[]
  -- 存储用户选中的章节ID数组
  -- 例如: ['1', '1.1', '2.3.1']
);

-- === 索引 ===
CREATE INDEX IF NOT EXISTS idx_catalog_info_task_id ON catalog_info(task_id);
CREATE INDEX IF NOT EXISTS idx_catalog_info_user_id ON catalog_info(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_info_created_at ON catalog_info(created_at DESC);

-- === 自动更新 updated_at ===
CREATE OR REPLACE FUNCTION update_catalog_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_catalog_info_updated_at
  BEFORE UPDATE ON catalog_info
  FOR EACH ROW
  EXECUTE FUNCTION update_catalog_info_updated_at();

-- === RLS (Row Level Security) 策略 ===
ALTER TABLE catalog_info ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的大纲
CREATE POLICY "Users can view their own catalogs"
  ON catalog_info
  FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能创建自己的大纲
CREATE POLICY "Users can create their own catalogs"
  ON catalog_info
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的大纲
CREATE POLICY "Users can update their own catalogs"
  ON catalog_info
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的大纲
CREATE POLICY "Users can delete their own catalogs"
  ON catalog_info
  FOR DELETE
  USING (auth.uid() = user_id);

-- === 注释 ===
COMMENT ON TABLE catalog_info IS '大纲信息表，存储从文件中提取的章节大纲';
COMMENT ON COLUMN catalog_info.id IS '大纲唯一ID';
COMMENT ON COLUMN catalog_info.task_id IS '关联的任务ID';
COMMENT ON COLUMN catalog_info.user_id IS '用户ID，关联 auth.users';
COMMENT ON COLUMN catalog_info.catalog_data IS '大纲数据，JSONB格式存储章节信息';
