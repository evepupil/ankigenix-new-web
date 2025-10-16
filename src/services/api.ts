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
 * API 请求体类型定义
 */
interface TextGenerateRequest {
  text: string;
  task_id?: string;
  card_number?: number;
  lang?: string;
}

interface UrlGenerateRequest {
  url: string;
  task_id?: string;
  card_number: number;
  lang: string;
}

/**
 * API服务类，用于与后端API交互
 */
class ApiService {
  /**
   * 从文本生成闪卡
   * @param text 文本内容
   * @param taskId 任务ID（可选）
   * @param cardNumber 卡片数量（可选）
   * @param lang 语言，默认zh
   */
  async generateFlashcardsFromText(
    text: string,
    taskId?: string,
    cardNumber?: number,
    lang: string = 'zh'
  ): Promise<{ success: boolean; cards?: Flashcard[]; error?: string }> {
    try {
      const requestBody: TextGenerateRequest = { text };

      // 添加可选参数
      if (taskId) {
        requestBody.task_id = taskId;
      }
      if (cardNumber) {
        requestBody.card_number = cardNumber;
      }
      if (lang) {
        requestBody.lang = lang;
      }

      const response = await fetch(`${API_BASE_URL}/flashcards/generate/text/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
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
   * 从文件生成闪卡（直接生成，不经过章节选择）
   * @param file 上传的文件
   * @param taskId 任务ID（可选）
   * @param cardNumber 卡片数量（可选）
   * @param lang 语言，默认zh
   */
  async generateFlashcardsFromFile(
    file: File,
    taskId?: string,
    cardNumber?: number,
    lang: string = 'zh'
  ): Promise<{ success: boolean; cards?: Flashcard[]; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // 添加可选参数
      if (taskId) {
        formData.append('task_id', taskId);
      }
      if (cardNumber) {
        formData.append('card_number', cardNumber.toString());
      }
      formData.append('lang', lang);

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
   * @param taskId 任务ID（可选）
   * @param cardNumber 闪卡数量，默认10，范围1-50
   * @param lang 语言，默认zh
   */
  async generateFlashcardsFromUrl(
    url: string,
    taskId?: string,
    cardNumber: number = 10,
    lang: string = 'zh'
  ): Promise<{ success: boolean; cards?: Flashcard[]; error?: string; count?: number; crawledLength?: number }> {
    try {
      const requestBody: UrlGenerateRequest = {
        url,
        card_number: cardNumber,
        lang
      };

      // 添加可选参数
      if (taskId) {
        requestBody.task_id = taskId;
      }

      const response = await fetch(`${API_BASE_URL}/flashcards/generate/url/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
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
   * @param taskId 任务ID（可选）
   * @param lang 语言，默认zh
   */
  async generateCatalogFromFile(
    file: File,
    taskId?: string,
    lang: string = 'zh'
  ): Promise<{ success: boolean; catalog?: Chapter[]; fileName?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // 添加可选参数
      if (taskId) {
        formData.append('task_id', taskId);
      }
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
   * 根据文件和选中的章节ID列表生成闪卡
   * @param file 上传的文件
   * @param chapterIds 选中的章节ID列表
   * @param taskId 任务ID（可选）
   * @param cardNumber 每个章节的卡片数量，可选
   * @param lang 语言，默认zh
   */
  async generateFlashcardsFromFileSection(
    file: File,
    chapterIds: string[],
    taskId?: string,
    cardNumber?: number,
    lang: string = 'zh'
  ): Promise<{
    success: boolean;
    cards?: Flashcard[];
    error?: string;
    sectionResults?: Array<{
      sectionTitle: string;
      cards: Flashcard[];
      count: number;
    }>;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 添加章节ID列表
      formData.append('chapter_ids', JSON.stringify(chapterIds));

      // 添加可选参数
      if (taskId) {
        formData.append('task_id', taskId);
      }
      if (cardNumber) {
        formData.append('card_number', cardNumber.toString());
      }
      formData.append('lang', lang);

      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/flashcards/generate/file/section/`, {
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
        sectionResults: result.section_results,
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