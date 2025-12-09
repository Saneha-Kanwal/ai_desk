import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

// Suppress console errors for 401 responses on auth endpoints (expected when checking auth)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors for /api/auth/me endpoint (expected when not logged in)
    if (error.config?.url?.includes('/api/auth/me') && error.response?.status === 401) {
      error.suppressLog = true;
    }
    return Promise.reject(error);
  }
);

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  summary: string | null;
  content: string | null;
  tags: string[];
  thumbnail: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  videos: Video[];
}

export interface Video {
  id: string;
  youtube_id: string | null;
  title: string;
  url: string;
  published_at: string | null;
}

export interface NewsListResponse {
  items: NewsItem[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface TranslateResponse {
  translated_content: string;
  language: string;
}

export const newsApi = {
  async getNews(page: number = 1, pageSize: number = 20, search?: string, category?: string, timePeriod?: string): Promise<NewsListResponse> {
    const params: any = { page, page_size: pageSize };
    if (search) {
      params.search = search;
    }
    if (category) {
      params.category = category;
    }
    if (timePeriod) {
      params.time_period = timePeriod;
    }
    const response = await apiClient.get<NewsListResponse>('/api/news', { params });
    return response.data;
  },

  async getNewsItem(id: string, forceRegenerate: boolean = false): Promise<NewsItem> {
    const params = forceRegenerate ? { force_regenerate: 'true' } : {};
    const response = await apiClient.get<NewsItem>(`/api/news/${id}`, { params });
    return response.data;
  },

  async translateNewsItem(id: string, language: string): Promise<TranslateResponse> {
    const response = await apiClient.post<TranslateResponse>(`/api/news/${id}/translate`, {
      language,
    });
    return response.data;
  },

  async regenerateArticle(id: string): Promise<NewsItem> {
    const response = await apiClient.post<NewsItem>(`/api/news/${id}/regenerate`);
    return response.data;
  },
};

