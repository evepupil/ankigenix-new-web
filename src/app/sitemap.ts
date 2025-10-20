import { MetadataRoute } from 'next';

/**
 * 生成站点地图
 *
 * 此文件定义了网站的sitemap.xml，帮助搜索引擎发现和索引页面。
 * Next.js会自动在 /sitemap.xml 路径提供此文件。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ankigenix.com';
  const currentDate = new Date();

  return [
    // 首页 - 最高优先级
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // 功能介绍页面
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // 定价页面
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // 以下页面不包含在sitemap中（因为需要登录或是私密页面）：
    // - /dashboard - 工作台（需要登录）
    // - /login - 登录页面（无需索引）
    // - /register - 注册页面（无需索引）
    // - /preview/[taskId] - 预览页面（私密内容）
    // - /theme, /design, /navbar-showcase - 开发测试页面（不公开）

    // 注意：如果将来有公开的帮助文档、博客文章等页面，可以在���里添加
    // 例如：
    // {
    //   url: `${baseUrl}/help`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.6,
    // },

    // 动态路由示例：如果有公开的任务预览页面
    // 可以从API获取公开任务列表并添加到sitemap
    // ...await getPublicTasks().then(tasks =>
    //   tasks.map(task => ({
    //     url: `${baseUrl}/preview/${task.id}`,
    //     lastModified: new Date(task.updatedAt),
    //     changeFrequency: 'monthly' as const,
    //     priority: 0.5,
    //   }))
    // ),
  ];
}
