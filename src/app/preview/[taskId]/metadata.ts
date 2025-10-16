import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ taskId: string }> }): Promise<Metadata> {
  const { taskId } = await params;

  // 这里可以根据 taskId 从 API 获取任务信息来生成动态 metadata
  // 暂时使用静态 metadata

  return {
    title: "闪卡预览与筛选",
    description: "预览和管理你的AI生成的闪卡，支持按章节筛选、批量编辑删除、导出为Anki格式。",
    robots: {
      index: false,
      follow: false,
    },
  };
}
