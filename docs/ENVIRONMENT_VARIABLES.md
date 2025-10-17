# 环境变量配置说明

本文档说明 AnkiGenix 项目中环境变量的使用和安全配置。

---

## 📋 必需的环境变量

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **说明**：Supabase 项目的 URL
- **示例**：`https://abcdefghijk.supabase.co`
- **在哪里使用**：前端 + 后端
- **是否公开**：✅ 是（`NEXT_PUBLIC_` 前缀表示会暴露给浏览器）
- **如何获取**：
  1. 登录 [Supabase Dashboard](https://app.supabase.com/)
  2. 进入你的项目
  3. **Settings → API → Project URL**

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **说明**：Supabase 匿名密钥（Anon Key）
- **示例**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **在哪里使用**：前端认证和数据访问
- **是否公开**：✅ 是（这是**设计如此**，安全！）
- **如何获取**：
  1. **Settings → API → Project API keys → anon public**

#### ⚠️ 为什么 Anon Key 可以公开？

**Anon Key 是公开密钥，暴露在浏览器中是正常的！**

安全性由以下机制保证：
1. **Row Level Security (RLS)**：数据库表级别的权限控制
2. **最小权限原则**：Anon Key 只有基础读写权限
3. **用户认证**：登录后使用用户的 JWT，RLS 基于 `auth.uid()` 验证

**示例 RLS 规则**：
```sql
-- 用户只能看到自己的任务
CREATE POLICY "Users can only see their own tasks"
ON task_info
FOR SELECT
USING (auth.uid() = user_id);
```

即使有人获取了你的 Anon Key，他们也：
- ❌ 无法看到其他用户的数据
- ❌ 无法删除或修改其他用户的数据
- ❌ 无法访问管理功能

---

## 🔒 可选但推荐的环境变量

### 3. `SUPABASE_SERVICE_ROLE_KEY`
- **说明**：Supabase 服务端密钥（Service Role Key）
- **示例**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **在哪里使用**：仅后端 API 路由（绕过 RLS 的操作）
- **是否公开**：❌ **绝对不公开！**
- **如何获取**：
  1. **Settings → API → Project API keys → service_role secret**

#### ⚠️ Service Role Key 安全警告

**这是超级管理员密钥，拥有完整数据库权限，绕过所有 RLS 规则！**

❌ **绝对不要**：
- 不要添加 `NEXT_PUBLIC_` 前缀
- 不要在前端代码中使用
- 不要提交到 Git 仓库
- 不要暴露给浏览器

✅ **只能**：
- 在服务端 API 路由中使用
- 在 Next.js Server Components 中使用
- 用于管理员操作

---

## 📁 配置文件

### `.env.local`（本地开发）
```bash
# 前端 + 后端都需要
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# 仅后端需要（可选）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### `.env.production`（生产环境）
在部署平台（Vercel、Netlify 等）配置相同的变量。

---

## 🔍 验证配置

### 检查环境变量是否生效

**前端（浏览器控制台）**：
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL); // 应该显示 URL
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); // 应该显示 Key
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY); // 应该是 undefined（正确！）
```

**后端（服务端日志）**：
```typescript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL); // 应该显示 URL
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY); // 应该显示 Key
```

---

## 🎯 使用场景

### 场景 1：用户登录/注册（前端）
```typescript
// ✅ 使用 Anon Key（自动）
import { supabaseClient } from '@/lib/supabase/client';
await supabaseClient.auth.signInWithPassword({ email, password });
```

### 场景 2：用户访问自己的数据（前端）
```typescript
// ✅ 使用 Anon Key + 用户 JWT（自动）
import { supabaseClient } from '@/lib/supabase/client';
const { data } = await supabaseClient
  .from('task_info')
  .select('*')
  .eq('user_id', user.id); // RLS 自动验证
```

### 场景 3：后端 API 需要绕过 RLS（服务端）
```typescript
// ✅ 使用 Service Role Key
import { supabaseServer } from '@/lib/supabase/server';
const { data } = await supabaseServer
  .from('task_info')
  .select('*'); // 绕过 RLS，获取所有数据
```

---

## 📚 相关文档

- [Supabase API Keys 说明](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security (RLS) 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js 环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## ❓ 常见问题

### Q: Anon Key 暴露在浏览器中安全吗？
A: **安全！** 这是 Supabase 的标准设计。安全性由 RLS 保证，不是靠隐藏密钥。

### Q: 我应该轮换 Anon Key 吗？
A: 一般不需要。但如果你担心，可以在 Supabase Dashboard 中重新生成。

### Q: Service Role Key 泄露了怎么办？
A: **立即**在 Supabase Dashboard 中重新生成，并更新所有部署环境的配置。

### Q: 本地开发时需要配置什么？
A: 只需要在 `.env.local` 中配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。

### Q: `.env.local` 需要提交到 Git 吗？
A: ❌ 不要！`.env.local` 已在 `.gitignore` 中，只提交 `.env.example` 作为模板。
