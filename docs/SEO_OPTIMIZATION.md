# SEO 优化清单

本文档记录了 Ankigenix 前端项目的 SEO 优化工作。

## 📋 优化清单

### ✅ 1. 元数据优化 (Metadata)

为每个页面添加合适的 `<title>` 和 `<meta description>`，使用 Next.js 的 `metadata` export 或 `generateMetadata` 函数。

#### 全局配置
- ✅ **`src/app/layout.tsx`** - 根布局 metadata
  - ✅ Title template: `"%s | Ankigenix"`
  - ✅ Description: 完整的应用描述
  - ✅ Keywords: ["Anki", "闪卡", "学习卡片", "AI生成", "记忆卡", "高效学习", "间隔重复", "知识管理", "智能学习"]
  - ✅ Authors: Ankigenix Team
  - ✅ Open Graph 配置（社交媒体分享）
  - ✅ Twitter Card 配置
  - ✅ Robots 配置（允许索引）
  - ✅ Icons 配置（favicon, apple-touch-icon）

#### 页面级 Metadata
- ✅ **`src/app/page.tsx`** - 首页
  - ✅ 优化的 title 和 description
  - ✅ Keywords 数组
  - ✅ Open Graph 配置（带图片）

- ✅ **`src/app/dashboard/metadata.ts`** - 工作台
  - ✅ 设置为 `noindex`（私密页面）

- ✅ **`src/app/preview/[taskId]/metadata.ts`** - 预览页面
  - ✅ 导出 `generateMetadata` 函数支持动态 metadata
  - ✅ 设置为 `noindex`（私密内容）

- ✅ **`src/app/login/layout.tsx`** - 登录页面
  - ✅ 设置为 `noindex`

- ✅ **`src/app/register/layout.tsx`** - 注册页面
  - ✅ 设置为 `noindex`

---

### ✅ 2. 结构化数据 (Structured Data / JSON-LD)

添加 JSON-LD 结构化数据，帮助搜索引擎理解内容。

- ✅ **`src/app/page.tsx`** - 首页结构化数据
  - ✅ Schema.org WebApplication 类型
  - ✅ 应用名称和描述
  - ✅ 定价信息（免费版 ¥0/月、专业版 ¥29/月）
  - ✅ 功能列表（featureList）
  - ✅ 用户评分（aggregateRating: 4.8/5，120 条评价）
  - ✅ 应用截图链接

**建议扩展：**
- ⏳ 添加 `FAQPage` schema（常见问题）
- ⏳ 添加 `HowTo` schema（使用教程）
- ⏳ 添加 `Organization` schema（公司信息）

---

### ⏳ 3. 动态路由 SEO

优化动态路由页面的 SEO。

- ✅ **`src/app/preview/[taskId]/metadata.ts`**
  - ✅ 创建了 `generateMetadata` 函数
  - ⏳ **待实现**：根据 taskId 从 API 获取任务信息
  - ⏳ **待实现**：生成动态标题（例如："查看《XXX》的 123 张闪卡"）
  - ⏳ **待实现**：生成动态描述

**实现示例代码：**
```typescript
export async function generateMetadata({ params }: { params: Promise<{ taskId: string }> }): Promise<Metadata> {
  const { taskId } = await params;

  // 从 API 获取任务信息
  const task = await fetch(`/api/tasks/${taskId}`).then(res => res.json());

  return {
    title: `查看《${task.title}》的 ${task.cardCount} 张闪卡`,
    description: `预览和管理《${task.title}》生成的 ${task.cardCount} 张AI闪卡，支持编辑、删除和导出。`,
    robots: { index: false, follow: false },
  };
}
```

---

### ✅ 4. Sitemap.xml

生成站点地图，帮助搜索引擎发现和索引页面。

**已创建：** `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ankigenix.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://ankigenix.com/features',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://ankigenix.com/pricing',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // 动态路由：公开的任务预览页面
    // ...taskIds.map(id => ({ url: `https://ankigenix.com/preview/${id}`, ... }))
  ];
}
```

**注意事项：**
- 只包含公开可访问的页面
- 不包含需要登录的页面（dashboard, 私密预览页等）
- 可以通过 API 动态获取公开任务列表

---

### ⏳ 5. Robots.txt

配置爬虫规则，控制搜索引擎爬取行为。

**待创建：** `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',        // 禁止爬取 API 路由
          '/dashboard/*',  // 禁止爬取工作台（私密）
          '/login',        // 禁止爬取登录页
          '/register',     // 禁止爬取注册页
        ],
      },
    ],
    sitemap: 'https://ankigenix.com/sitemap.xml',
  };
}
```

---

### ⏳ 6. 页面性能优化

提升 Core Web Vitals 指标，改善用户体验和 SEO 排名。

#### LCP (Largest Contentful Paint) 优化
- ⏳ 使用 Next.js `<Image>` 组件优化图片加载
- ⏳ 实现图片懒加载
- ⏳ 优化首屏加载速度

#### 代码分割和懒加载
- ⏳ 使用 `dynamic()` 懒加载非关键组件
- ⏳ 优化 bundle 大小

**示例：**
```typescript
import dynamic from 'next/dynamic';

const CatalogSelectionModal = dynamic(
  () => import('@/components/CatalogSelectionModal'),
  { ssr: false }
);
```

---

### ⏳ 7. 语义化 HTML 和无障碍访问

提升页面语义化和可访问性。

- ⏳ 检查标题层级（h1 → h2 → h3，不跳级）
- ⏳ 为按钮和链接添加有意义的 `aria-label`
- ⏳ 确保键盘导航可用（Tab 键顺序正确）
- ⏳ 添加 `alt` 属性到所有图片
- ⏳ 使用语义化标签（`<main>`, `<article>`, `<section>`, `<nav>`）

**检查清单：**
- [ ] 每个页面只有一个 `<h1>`
- [ ] 标题层级不跳级
- [ ] 所有图片都有 `alt` 文本
- [ ] 表单输入有 `<label>` 关联
- [ ] 交互元素可通过键盘访问

---

### ⏳ 8. URL 结构优化

优化 URL 结构，使其更具可读性和 SEO 友好性。

**当前 URL：**
- `/preview/[taskId]` - 使用 UUID（例如：`5e8b3b02-79db-48ec-ae78-fa994371eeec`）

**建议优化：**
- `/flashcards/[slug]` - 使用语义化 slug（例如：`advanced-calculus-2024`）
- `/deck/[title]-[id]` - 结合标题和 ID（例如：`advanced-calculus-abc123`）

**优点：**
- 更易于理解和记忆
- 包含关键词，有利于 SEO
- 更好的用户体验

---

### ✅ 9. Open Graph 和 Twitter Cards

为社交媒体分享优化。

- ✅ **全局 Open Graph 配置** - `src/app/layout.tsx`
  - ✅ `og:type`: website
  - ✅ `og:locale`: zh_CN
  - ✅ `og:url`: https://ankigenix.com
  - ✅ `og:site_name`: Ankigenix
  - ✅ `og:title`: 应用标题
  - ✅ `og:description`: 应用描述
  - ✅ `og:image`: /og-image.png (1200x630)

- ✅ **Twitter Card 配置**
  - ✅ `twitter:card`: summary_large_image
  - ✅ `twitter:title`: 标题
  - ✅ `twitter:description`: 描述
  - ✅ `twitter:image`: /og-image.png

**待完成：**
- ⏳ 创建 OG 图片资源
  - ⏳ `/public/og-image.png` (1200x630)
  - ⏳ `/public/og-home.png` (1200x630)
- ⏳ 为不同页面生成动态 OG 图片（使用 `@vercel/og`）

---

### ⏳ 10. 内容索引策略

决定哪些页面需要被搜索引擎索引。

#### 允许索引（index: true）
- ✅ 首页 `/`
- ⏳ 功能介绍 `/features`
- ⏳ 定价页面 `/pricing`
- ⏳ 帮助文档 `/help`
- ⏳ 公开的任务预览页面（如果有）

#### 禁止索引（noindex）
- ✅ 登录页面 `/login`
- ✅ 注册页面 `/register`
- ✅ 工作台 `/dashboard`
- ✅ 私密预览页面 `/preview/[taskId]`
- ⏳ API 路由 `/api/*`

---

## 🎯 优先级建议

### 高优先级（立即完成）
1. ✅ ~~元数据优化~~ - **已完成**
2. ✅ ~~结构化数据（首页）~~ - **已完成**
3. ✅ ~~Open Graph 配置~~ - **已完成**
4. ⏳ 创建 OG 图片资源

### 中优先级（近期完成）
5. ✅ ~~Sitemap.xml~~ - **已完成**
6. ⏳ Robots.txt
7. ⏳ 动态路由 metadata 优化
8. ⏳ 页面性能优化（图片优化）

### 低优先级（可选）
9. ⏳ URL 结构优化
10. ⏳ 语义化 HTML 审查
11. ⏳ 动态 OG 图片生成
12. ⏳ 扩展结构化数据（FAQ, HowTo）

---

## 📊 SEO 工具和检查

### 推荐工具
- **Google Search Console** - 监控索引状态和搜索表现
- **Google PageSpeed Insights** - 检查页面性能和 Core Web Vitals
- **Lighthouse** - 综合 SEO、性能、无障碍检查
- **Schema Markup Validator** - 验证结构化数据
- **Open Graph Debugger** - 测试社交媒体分享卡片

### 检查命令
```bash
# 本地构建检查
npm run build

# 查看生成的 sitemap
curl http://localhost:3000/sitemap.xml

# 查看生成的 robots.txt
curl http://localhost:3000/robots.txt
```

---

## 📝 更新日志

### 2024-10-21
- ✅ 创建 sitemap.ts 文件
- ✅ 配置站点地图包含首页、功能页、定价页
- ✅ 添加 NEXT_PUBLIC_SITE_URL 环境变量配置
- ✅ 排除需要登录和私密页面

### 2024-10-16
- ✅ 完成全局 metadata 配置（layout.tsx）
- ✅ 优化首页 metadata 和 JSON-LD 结构化数据
- ✅ 为 dashboard、preview、login、register 添加 metadata
- ✅ 配置 Open Graph 和 Twitter Cards
- ✅ 创建本 SEO 优化清单文档

---

## 🔗 相关资源

- [Next.js Metadata 文档](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org 文档](https://schema.org/)
- [Google 搜索中心](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

**维护者：** Ankigenix 开发团队
**最后更新：** 2024-10-21
