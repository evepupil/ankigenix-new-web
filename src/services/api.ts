// src/services/api.ts
import { Flashcard } from '@/types/flashcard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

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
        error: '网络错误或服务器不可用',
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

      const response = await fetch(`${API_BASE_URL}/flashcards/generate/file/`, {
        method: 'POST',
        body: formData,
      });

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
        error: '网络错误或服务器不可用',
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