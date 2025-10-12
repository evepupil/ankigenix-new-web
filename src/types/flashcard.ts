// src/types/flashcard.ts

/**
 * 闪卡接口定义
 */
export interface Flashcard {
  id: string;                    // 卡片唯一标识
  question: string;              // 问题/正面内容
  answer: string;                // 答案/背面内容
  type?: 'basic_card' | 'cloze_card' | 'multiple_choice_card';  // 卡片类型
  chapterId?: string;            // 所属章节ID
  qualityScore?: number;         // AI质量评分（0-100）
  isMarkedForDeletion?: boolean; // 是否标记删除
  hasIssue?: boolean;            // 是否有问题
  tags?: string[];               // 标签
  notes?: string;                // 用户批注
}

/**
 * 章节接口定义
 */
export interface Chapter {
  id: string;                    // 章节唯一标识
  title: string;                 // 章节标题
  description?: string;          // 章节描述
  cards: Flashcard[];            // 该章节下的闪卡列表
  isExpanded?: boolean;          // 是否展开（用于UI状态）
}

/**
 * 闪卡集接口定义
 */
export interface FlashcardSet {
  id: string;                    // 闪卡集唯一标识
  title: string;                 // 闪卡集标题
  topic: string;                 // 主题
  chapters: Chapter[];           // 章节列表
  createdAt: string;             // 创建时间
  totalCards: number;            // 总卡片数
  averageQuality?: number;       // 平均质量分
}
