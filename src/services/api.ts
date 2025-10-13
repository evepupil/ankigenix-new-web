// src/services/api.ts
import { Flashcard } from '@/types/flashcard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * 获取存储的token
 */
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * 获取带有认证头的headers
 */
const getAuthHeaders = (includeContentType: boolean = true): HeadersInit => {
  const headers: HeadersInit = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * 处理API响应，检查401错误
 */
const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Token过期或无效，清除本地存储并跳转到登录页
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    throw new Error('认证已过期，请重新登录');
  }
  return response;
};

/**
 * 章节数据结构
 */
interface Subsection {
  subsection: string;
  description?: string;
}

interface Section {
  section: string;
  description?: string;
  subsections?: Subsection[];
}

interface Chapter {
  chapter: string;
  description?: string;
  sections?: Section[];
}

/**
 * API服务类，用于与后端API交互
 */
class ApiService {
  /**
   * 从文本生成闪卡
   */
  async generateFlashcardsFromText(text: string): Promise<{ success: boolean; cards?: Flashcard[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/generate/text/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
      });

      await handleResponse(response);
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || '生成闪卡失败',
        };
      }

      return {
        success: true,
        cards: result.cards,
      };
    } catch (error) {
      console.error('API调用错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误或服务器不可用',
      };
    }
  }

  /**
   * 从文件生成闪卡
   */
  async generateFlashcardsFromFile(file: File): Promise<{ success: boolean; cards?: Flashcard[]; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/flashcards/generate/file/`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      await handleResponse(response);
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || '生成闪卡失败',
        };
      }

      return {
        success: true,
        cards: result.cards,
      };
    } catch (error) {
      console.error('API调用错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误或服务器不可用',
      };
    }
  }

  /**
   * 从网页URL生成闪卡
   * @param url 网页URL地址
   * @param cardNumber 闪卡数量，默认10，范围1-50
   * @param lang 语言，默认zh
   */
  async generateFlashcardsFromUrl(
    url: string,
    cardNumber: number = 10,
    lang: string = 'zh'
  ): Promise<{ success: boolean; cards?: Flashcard[]; error?: string; count?: number; crawledLength?: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/generate/url/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          url,
          card_number: cardNumber,
          lang
        }),
      });

      await handleResponse(response);
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || '生成闪卡失败',
        };
      }

      return {
        success: true,
        cards: result.cards,
        count: result.count,
        crawledLength: result.crawled_length,
      };
    } catch (error) {
      console.error('API调用错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误或服务器不可用',
      };
    }
  }

  /**
   * 从文件生成大纲
   * @param file 上传的文件
   * @param lang 语言，默认zh
   */
  async generateCatalogFromFile(
    file: File,
    lang: string = 'zh'
  ): Promise<{ success: boolean; catalog?: Chapter[]; fileName?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lang', lang);

      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/catalog/file/`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      await handleResponse(response);
      const result = await response.json();

      console.log('generateCatalogFromFile API raw response:', result);
      console.log('result.catalog type:', typeof result.catalog);
      console.log('result.catalog isArray:', Array.isArray(result.catalog));

      if (!response.ok) {
        return {
          success: false,
          error: result.error || '生成大纲失败',
        };
      }

      return {
        success: true,
        catalog: result.catalog,
        fileName: result.file_name,
      };
    } catch (error) {
      console.error('API调用错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误或服务器不可用',
      };
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health/`);
      return response.ok;
    } catch (error) {
      console.error('健康检查失败:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
export type { Chapter, Section, Subsection };