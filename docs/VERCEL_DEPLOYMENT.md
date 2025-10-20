# Vercel 部署配置指南

本文档说明如何配置 Vercel 部署后的 OAuth 登录。

---

## 问题描述

部署到 Vercel 后，Google OAuth 登录会重定向到 `http://localhost:3000`，导致登录失败。

**原因**：OAuth 回调 URL 配置不完整，缺少生产环境域名。

---

## 解决方案

### 步骤 1：获取 Vercel 部署域名

部署到 Vercel 后，你会得到一个域名，例如：
```
https://your-app-name.vercel.app
```

或自定义域名：
```
https://your-custom-domain.com
```

---

### 步骤 2：更新 Supabase 配置

#### 2.1 登录 Supabase Dashboard

访问：https://supabase.com/dashboard

#### 2.2 进入项目设置

1. 选择你的项目
2. 点击左侧 **"Authentication"**
3. 点击 **"URL Configuration"**

#### 2.3 添加 Vercel 域名到允许列表

在 **"Site URL"** 和 **"Redirect URLs"** 中添加：

```
https://your-app-name.vercel.app
https://your-app-name.vercel.app/auth/callback
```

如果有自定义域名，也要添加：
```
https://your-custom-domain.com
https://your-custom-domain.com/auth/callback
```

点击 **"Save"** 保存配置。

---

### 步骤 3：更新 Google OAuth 配置

#### 3.1 前往 Google Cloud Console

访问：https://console.cloud.google.com/

#### 3.2 选择项目并进入凭据设置

1. 选择你的 AnkiGenix 项目
2. 左侧菜单：**"API 和服务" → "凭据"**
3. 找到你创建的 OAuth 2.0 客户端 ID，点击编辑（铅笔图标）

#### 3.3 添加 Vercel 域名

在 **"已获授权的 JavaScript 来源"** 中添加：
```
https://your-app-name.vercel.app
```

在 **"已获授权的重定向 URI"** 中添加：
```
https://your-app-name.vercel.app/auth/callback
```

**⚠️ 注意**：
- ✅ 正确：`https://your-app-name.vercel.app/auth/callback`
- ❌ 错误：`https://your-app-name.vercel.app/auth/callback/` （末尾不要斜杠）

点击 **"保存"**。

---

### 步骤 4：更新 Microsoft OAuth 配置（如果使用）

#### 4.1 前往 Azure Portal

访问：https://portal.azure.com/

#### 4.2 进入应用注册设置

1. 搜索并进入 **"Azure Active Directory"**
2. 左侧菜单：**"应用注册"**
3. 选择你的 AnkiGenix 应用

#### 4.3 添加重定向 URI

1. 点击左侧 **"身份验证"**
2. 在 **"Web"** 平台的重定向 URI 中点击 **"添加 URI"**
3. 添加：
   ```
   https://your-app-name.vercel.app/auth/callback
   ```
4. 点击 **"保存"**

---

### 步骤 5：清除浏览器缓存并测试

1. 清除浏览器缓存和 Cookie
2. 访问你的 Vercel 部署网址
3. 点击 "Google 登录"
4. 应该正常跳转并完成登录

---

## 完整的 URL 配置清单

### Supabase 配置

**Site URL**:
```
https://your-app-name.vercel.app
```

**Redirect URLs**（每行一个）:
```
http://localhost:3000/auth/callback
https://your-project-ref.supabase.co/auth/v1/callback
https://your-app-name.vercel.app/auth/callback
```

---

### Google OAuth 配置

**已获授权的 JavaScript 来源**:
```
http://localhost:3000
https://your-project-ref.supabase.co
https://your-app-name.vercel.app
```

**已获授权的重定向 URI**:
```
http://localhost:3000/auth/callback
https://your-project-ref.supabase.co/auth/v1/callback
https://your-app-name.vercel.app/auth/callback
```

---

### Microsoft OAuth 配置

**重定向 URI**（Web 平台）:
```
https://your-project-ref.supabase.co/auth/v1/callback
https://your-app-name.vercel.app/auth/callback
```

---

## 常见问题

### Q: 为什么需要添加 Supabase 的回调 URL？

A: Supabase 使用自己的认证服务器来处理 OAuth 流程，所以需要 `https://your-project-ref.supabase.co/auth/v1/callback`。

### Q: 本地开发时还能用吗？

A: 可以！保留 `http://localhost:3000` 相关配置，本地和生产环境可以同时工作。

### Q: 自定义域名怎么配置？

A: 在 Vercel 绑定自定义域名后，将上面所有的 `your-app-name.vercel.app` 替换为你的自定义域名，重新配置一遍即可。

### Q: 配置后还是跳转到 localhost？

A: 可能的原因：
1. Google/Azure 配置需要几分钟生效，等待 5-10 分钟
2. 清除浏览器缓存
3. 检查 Supabase 的 Redirect URLs 配置是否正确
4. 确认代码中使用的是 `window.location.origin`（已经是正确的）

### Q: 报错 "redirect_uri_mismatch"？

A: 说明回调 URL 配置不匹配，请严格按照上述步骤检查：
- URL 完全一致（包括协议 https/http）
- 没有多余的斜杠
- 域名拼写正确

---

## 代码说明

当前代码已经正确处理了动态域名：

**`src/contexts/AuthContext.tsx`** (第110行):
```typescript
const signInWithOAuth = async (provider: 'google' | 'azure') => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,  // ✅ 自动使用当前域名
    },
  });
  // ...
};
```

**`src/app/auth/callback/route.ts`** (第61行):
```typescript
// 登录成功，重定向到 dashboard
return NextResponse.redirect(`${requestUrl.origin}/dashboard`);  // ✅ 自动使用当前域名
```

**这意味着代码无需修改**，只需要在 Google/Microsoft/Supabase 后台添加 Vercel 域名配置即可。

---

## 检查清单

在配置完成后，请确认：

- [ ] Supabase Site URL 已添加 Vercel 域名
- [ ] Supabase Redirect URLs 已添加 `/auth/callback`
- [ ] Google OAuth 已添加 JavaScript 来源
- [ ] Google OAuth 已添加重定向 URI
- [ ] Microsoft OAuth 已添加重定向 URI（如果使用）
- [ ] 配置保存并等待生效（5-10分钟）
- [ ] 清除浏览器缓存
- [ ] 测试登录流程

---

完成以上配置后，OAuth 登录应该在 Vercel 生产环境中正常工作！
