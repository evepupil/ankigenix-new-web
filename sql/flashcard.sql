-- 闪卡表
CREATE TABLE IF NOT EXISTS flashcard (
  -- === 基本信息 ===
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- === 关联字段 ===
  result_id UUID NOT NULL REFERENCES flashcard_result(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id UUID REFERENCES catalog_info(id) ON DELETE SET NULL,
  section_id TEXT,

  -- === 卡片字段 ===
  card_type TEXT NOT NULL CHECK (card_type IN ('basic', 'cloze', 'multiple_choice')),
  card_data JSONB NOT NULL,

  -- === 排序字段 ===
  order_index INTEGER NOT NULL,

  -- === 可选字段 ===
  tags TEXT[],
  notes TEXT,

  -- === 软删除 ===
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- === 索引 ===
CREATE INDEX idx_flashcard_result_order ON flashcard(result_id, order_index) WHERE NOT is_deleted;
CREATE INDEX idx_flashcard_user_id ON flashcard(user_id) WHERE NOT is_deleted;
CREATE INDEX idx_flashcard_card_type ON flashcard(result_id, card_type) WHERE NOT is_deleted;
CREATE INDEX idx_flashcard_created_at ON flashcard(created_at DESC);
CREATE INDEX idx_flashcard_card_data ON flashcard USING GIN(card_data);
CREATE INDEX idx_flashcard_catalog_section ON flashcard(catalog_id, section_id) WHERE NOT is_deleted;
CREATE INDEX idx_flashcard_section_order ON flashcard(catalog_id, section_id, order_index) WHERE NOT is_deleted;

-- === 自动更新 updated_at ===
CREATE OR REPLACE FUNCTION update_flashcard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
    NEW.deleted_at = NOW();
  ELSIF NEW.is_deleted = FALSE THEN
    NEW.deleted_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_flashcard_updated_at
  BEFORE UPDATE ON flashcard
  FOR EACH ROW
  EXECUTE FUNCTION update_flashcard_updated_at();

-- === 维护 flashcard_result.total_count ===
CREATE OR REPLACE FUNCTION update_flashcard_result_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE flashcard_result
    SET total_count = total_count + 1
    WHERE id = NEW.result_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE flashcard_result
    SET total_count = total_count - 1
    WHERE id = OLD.result_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
      UPDATE flashcard_result
      SET total_count = total_count - 1
      WHERE id = NEW.result_id;
    ELSIF NEW.is_deleted = FALSE AND OLD.is_deleted = TRUE THEN
      UPDATE flashcard_result
      SET total_count = total_count + 1
      WHERE id = NEW.result_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_flashcard_insert_count
  AFTER INSERT ON flashcard
  FOR EACH ROW
  EXECUTE FUNCTION update_flashcard_result_count();

CREATE TRIGGER trigger_flashcard_delete_count
  AFTER DELETE ON flashcard
  FOR EACH ROW
  EXECUTE FUNCTION update_flashcard_result_count();

CREATE TRIGGER trigger_flashcard_update_count
  AFTER UPDATE ON flashcard
  FOR EACH ROW
  WHEN (OLD.is_deleted IS DISTINCT FROM NEW.is_deleted)
  EXECUTE FUNCTION update_flashcard_result_count();

-- === RLS ===
ALTER TABLE flashcard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own flashcards"
  ON flashcard FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flashcards"
  ON flashcard FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards"
  ON flashcard FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards"
  ON flashcard FOR DELETE
  USING (auth.uid() = user_id);

-- === 注释 ===
COMMENT ON TABLE flashcard IS '闪卡表，存储具体的每张卡片';
COMMENT ON COLUMN flashcard.result_id IS '关联的结果集ID';
COMMENT ON COLUMN flashcard.catalog_id IS '关联的大纲ID（可选）';
COMMENT ON COLUMN flashcard.section_id IS '章节ID（如 "1.1.2"）';
COMMENT ON COLUMN flashcard.card_type IS '卡片类型: basic, cloze, multiple_choice';
COMMENT ON COLUMN flashcard.card_data IS '卡片数据，不同类型存储不同结构的JSONB';
COMMENT ON COLUMN flashcard.order_index IS '卡片在结果集中的顺序';
COMMENT ON COLUMN flashcard.is_deleted IS '软删除标记，可用于用户筛选卡片';
COMMENT ON COLUMN flashcard.deleted_at IS '删除时间（软删除时自动记录）';
