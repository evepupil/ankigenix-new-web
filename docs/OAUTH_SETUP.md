# OAuth 单点登录配置指南

本文档详细说明如何为 AnkiGenix 配置 Google 和 Microsoft OAuth 单点登录。

---

## 目录

1. [Google OAuth 配置](#google-oauth-配置)
2. [Microsoft OAuth 配置](#microsoft-oauth-配置)
3. [Supabase 配置](#supabase-配置)
4. [测试登录流程](#测试登录流程)
5. [常见问题](#常见问题)

---

## Google OAuth 配置

### 1. 前往 Google Cloud Console

访问：https://console.cloud.google.com/

### 2. 创建新项目（如果没有）

1. 点击顶部项目选择器
2. 点击 "新建项目"
3. 输入项目名称：`AnkiGenix`
4. 点击 "创建"

### 3. 启用 OAuth 2.0

1. 在左侧菜单选择 **"API 和服务" → "凭据"**
2. 点击 **"创建凭据" → "OAuth 客户端 ID"**

### 4. 配置 OAuth 同意屏幕（首次需要）

1. 点击 "配置同意屏幕"
2. 选择 **"外部"**（除非你有 Google Workspace）
3. 填写以下信息：
   - **应用名称**：`AnkiGenix`
   - **用户支持电子邮件**：你的邮箱
   - **开发者联系信息**：你的邮箱
4. 点击 "保存并继续"
5. **范围（Scopes）**：保持默认，点击 "保存并继续"
6. **测试用户**：可以添加测试用户邮箱（开发阶段）
7. 点击 "保存并继续" → "返回控制台"

### 5. 创建 OAuth 客户端 ID

1. 再次点击 **"创建凭据" → "OAuth 客户端 ID"**
2. 应用类型：选择 **"Web 应用"**
3. 填写信息：
   - **名称**：`AnkiGenix Web Client`
   - **已获授权的 JavaScript 来源**：
     ```
     http://localhost:3000
     https://your-project-ref.supabase.co
     ```
   - **已获授权的重定向 URI**：
     ```
     http://localhost:3000/auth/callback
     https://your-project-ref.supabase.co/auth/v1/callback
     ```

     > ⚠️ 注意：`your-project-ref` 需要替换为你的 Supabase 项目引用 ID

4. 点击 "创建"
5. **保存显示的客户端 ID 和客户端密钥**

### 6. 记录凭据

你将获得：
- **客户端 ID**：形如 `123456789-xxxxx.apps.googleusercontent.com`
- **客户端密钥**：形如 `GOCSPX-xxxxx`

**保存这两个值，稍后在 Supabase 中使用。**

---

## Microsoft OAuth 配置

### 1. 前往 Azure Portal

访问：https://portal.azure.com/

### 2. 注册应用程序

1. 搜索并进入 **"Azure Active Directory"**
2. 在左侧菜单选择 **"应用注册"**
3. 点击 **"新注册"**

### 3. 填写应用信息

1. **名称**：`AnkiGenix`
2. **支持的帐户类型**：选择
   - **任何组织目录中的帐户和个人 Microsoft 帐户**（推荐）
   - 这样可以支持 Outlook、Hotmail 等个人账号
3. **重定向 URI（可选）**：
   - 平台：选择 **"Web"**
   - URI：`https://your-project-ref.supabase.co/auth/v1/callback`

   > ⚠️ 替换 `your-project-ref` 为你的 Supabase 项目引用 ID

4. 点击 **"注册"**

### 4. 配置应用程序

注册成功后，你会看到应用的 **"概述"** 页面。

#### 记录应用程序（客户端）ID

- 在概述页面找到 **"应用程序(客户端) ID"**
- 形如：`12345678-1234-1234-1234-123456789abc`
- **复制并保存**

### 5. 创建客户端密钥

1. 在左侧菜单选择 **"证书和密码"**
2. 点击 **"新客户端密码"**
3. 填写描述：`AnkiGenix Client Secret`
4. 过期时间：选择 **"24 个月"**（或根据需要）
5. 点击 **"添加"**
6. **立即复制"值"（Value）字段** - 密钥只显示一次！
   - 形如：`abc~xxxxxxxxxxxxxxxxxxxxx`

### 6. 添加重定向 URI（如果之前跳过）

1. 在左侧菜单选择 **"身份验证"**
2. 在 **"平台配置"** 下，点击 **"添加平台"** → **"Web"**
3. 添加以下 URI：
   ```
   http://localhost:3000/auth/callback
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. 勾选 **"ID 令牌"** 和 **"访问令牌"**
5. 点击 **"配置"**

### 7. 配置 API 权限（可选但推荐）

1. 在左侧菜单选择 **"API 权限"**
2. 默认已有 `User.Read` 权限（足够使用）
3. 如需更多权限，点击 **"添加权限"** → **"Microsoft Graph"**

### 8. 记录凭据

你将获得：
- **应用程序(客户端) ID**：`12345678-1234-1234-1234-123456789abc`
- **客户端密钥（值）**：`abc~xxxxxxxxxxxxxxxxxxxxx`

**保存这两个值，稍后在 Supabase 中使用。**

---

## Supabase 配置

### 1. 登录 Supabase Dashboard

访问：https://app.supabase.com/

选择你的项目：`AnkiGenix`

### 2. 获取 Supabase 项目引用 ID

1. 在项目设置中找到 **"Project URL"**
2. 形如：`https://abcdefghijk.supabase.co`
3. 其中 `abcdefghijk` 就是你的项目引用 ID

### 3. 配置 Google Provider

1. 进入 **"Authentication" → "Providers"**
2. 找到 **"Google"**，点击启用
3. 填写信息：
   - **Client ID（for OAuth）**：粘贴 Google 客户端 ID
   - **Client Secret（for OAuth）**：粘贴 Google 客户端密钥
4. **Redirect URL** 会自动显示为：
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   **确保此 URL 已添加到 Google Cloud Console**

5. 点击 **"Save"**

### 4. 配置 Microsoft Provider

1. 在同一页面找到 **"Azure"**（Supabase 中 Microsoft 叫 Azure）
2. 点击启用
3. 填写信息：
   - **Client ID（for OAuth）**：粘贴 Azure 应用程序 ID
   - **Client Secret（for OAuth）**：粘贴 Azure 客户端密钥
   - **Azure Tenant ID**：
     - 如果支持所有账户类型，填：`common`
     - 如果只支持特定组织，填组织的 Tenant ID
4. 点击 **"Save"**

### 5. 配置站点 URL

1. 在 **"Authentication" → "URL Configuration"** 中
2. 设置：
   - **Site URL**：`http://localhost:3000`（开发环境）
   - **Redirect URLs**：
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/dashboard
     ```

---

## 测试登录流程

### 1. 启动开发服务器

```bash
cd D:\myproject\ankigenix-app\ankigenix
npm run dev
```

### 2. 访问登录页面

打开浏览器访问：`http://localhost:3000/login`

### 3. 测试 Google 登录

1. 点击 **"Google"** 按钮
2. 应该跳转到 Google 登录页面
3. 选择你的 Google 账号
4. 同意授权
5. 应该重定向回 `http://localhost:3000/dashboard`

### 4. 测试 Microsoft 登录

1. 点击 **"Microsoft"** 按钮
2. 应该跳转到 Microsoft 登录页面
3. 输入你的 Microsoft 账号（Outlook/Hotmail）
4. 同意授权
5. 应该重定向回 `http://localhost:3000/dashboard`

---

## 生产环境配置

### 部署到生产环境时需要更新：

#### 1. Google Cloud Console

添加生产环境 URL：
```
https://ankigenix.com
https://ankigenix.com/auth/callback
```

#### 2. Azure Portal

添加生产环境重定向 URI：
```
https://ankigenix.com/auth/callback
```

#### 3. Supabase

更新 Site URL 和 Redirect URLs：
```
https://ankigenix.com
https://ankigenix.com/auth/callback
https://ankigenix.com/dashboard
```

---

## 常见问题

### Q1: 登录时提示 "redirect_uri_mismatch"

**原因**：重定向 URI 配置不匹配

**解决方案**：
1. 检查 Google/Azure 配置的重定向 URI
2. 确保完全匹配 Supabase 提供的回调 URL
3. 注意 `http` vs `https`，尾部斜杠 `/`

### Q2: Google 登录显示 "应用未验证"

**原因**：应用处于测试模式

**解决方案**：
- **开发阶段**：添加测试用户邮箱
- **生产环境**：提交 Google OAuth 验证申请

### Q3: Microsoft 登录失败，显示 "AADSTS50011"

**原因**：重定向 URI 不匹配

**解决方案**：
1. 检查 Azure Portal 的重定向 URI 配置
2. 确保选择了正确的账户类型支持
3. 清除浏览器缓存重试

### Q4: 登录成功但没有跳转到 dashboard

**原因**：回调路由处理问题

**解决方案**：
1. 检查 `/auth/callback/route.ts` 文件是否存在
2. 查看浏览器控制台和网络请求
3. 检查 Supabase 的 Redirect URLs 配置

### Q5: 如何获取 Supabase 项目引用 ID？

在 Supabase Dashboard 中：
1. 进入你的项目
2. 查看 **Settings → General**
3. 找到 **Project URL**：`https://xxxxx.supabase.co`
4. `xxxxx` 就是项目引用 ID

### Q6: 本地开发时能否使用 OAuth？

可以！按照本文档配置：
1. Google/Azure 添加 `http://localhost:3000` 相关 URL
2. Supabase 添加本地回调 URL
3. 本地开发服务器运行在 `localhost:3000`

---

## 安全建议

### 1. 保护密钥

- ❌ 不要将客户端密钥提交到 Git
- ✅ 使用环境变量存储敏感信息
- ✅ 定期轮换客户端密钥

### 2. 限制重定向 URI

只添加你控制的域名，防止 OAuth 劫持攻击

### 3. 验证 OAuth 状态

后端验证时检查 `state` 参数，防止 CSRF 攻击

### 4. 使用 HTTPS

生产环境务必使用 HTTPS，保护传输安全

---

## 相关资源

- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)

---

## 获取帮助

如遇到问题：
1. 查看浏览器控制台错误信息
2. 检查 Supabase Dashboard 的 Auth Logs
3. 参考本文档的常见问题部分

**配置完成后，你的用户就可以使用 Google 和 Microsoft 账号一键登录 AnkiGenix 了！** 🎉
