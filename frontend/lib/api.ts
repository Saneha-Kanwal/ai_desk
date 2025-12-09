import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  summary: string | null;
  content: string | null;
  tags: string[];
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
  async getNews(page: number = 1, pageSize: number = 20, search?: string): Promise<NewsListResponse> {
    const params: any = { page, page_size: pageSize };
    if (search) {
      params.search = search;
    }
    const response = await apiClient.get<NewsListResponse>('/api/news', { params });
    return response.data;
  },

  async getNewsItem(id: string): Promise<NewsItem> {
    const response = await apiClient.get<NewsItem>(`/api/news/${id}`);
    return response.data;
  },

  async translateNewsItem(id: string, language: string): Promise<TranslateResponse> {
    const response = await apiClient.post<TranslateResponse>(`/api/news/${id}/translate`, {
      language,
    });
    return response.data;
  },
};

