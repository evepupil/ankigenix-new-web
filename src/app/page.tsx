import { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';

export const metadata: Metadata = {
  title: "Ankigenix - AI驱动的科学闪卡生成器 | 高效学习Anki卡片",
  description: "Ankigenix 是一款AI驱动的科学闪卡生成器，支持文本、文件、URL、视频等多种输入方式，智能生成高质量学习闪卡。提升学习效率，轻松创建Anki卡片。",
  keywords: ["Anki", "闪卡生成器", "AI学习工具", "智能卡片", "高效学习", "间隔重复", "记忆卡片", "学习助手", "知识管理"],
  openGraph: {
    title: "Ankigenix - AI驱动的科学闪卡生成器",
    description: "用最高质量的Anki卡片，加速你的学习效率。支持多种输入方式，AI智能生成高质量学习闪卡。",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Ankigenix 首页",
      },
    ],
  },
};

/**
 * 首页组件
 * 包含Hero部分、功能特性、定价CTA和使用说明区域
 */
export default function Home() {
  return (
    <div className="bg-white">
      <HomeContent />
    </div>
  );
}
