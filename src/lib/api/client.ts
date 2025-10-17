/**
 * API 客户端工具
 * 自动在请求头中添加认证 token
 */

/**
 * 获取存储在 localStorage 中的 auth token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * 创建带认证头的 fetch 请求
 *
 * @param url - 请求 URL
 * @param options - fetch 选项
 * @returns fetch Promise
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});

  // 如果有 token，添加到 Authorization header
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 如果没有显式设置 Content-Type 且有 body，设置为 JSON
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * 带认证的 GET 请求
 */
export async function authGet(url: string): Promise<Response> {
  return authFetch(url, { method: 'GET' });
}

/**
 * 带认证的 POST 请求
 */
export async function authPost(url: string, data?: unknown): Promise<Response> {
  return authFetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * 带认证的 PUT 请求
 */
export async function authPut(url: string, data?: unknown): Promise<Response> {
  return authFetch(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * 带认证的 PATCH 请求
 */
export async function authPatch(url: string, data?: unknown): Promise<Response> {
  return authFetch(url, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * 带认证的 DELETE 请求
 */
export async function authDelete(url: string): Promise<Response> {
  return authFetch(url, { method: 'DELETE' });
}
