/**
 * TypeScript Type Definitions for AI Desk API
 * Generated from OpenAPI specification
 * Date: 2025-01-27
 */

// News Article Types

export type Category = 
  | 'AI-Related News'
  | 'Inventions'
  | 'Technologies'
  | 'Breakthroughs';

export type TimePeriod = 
  | '20s'
  | '30m'
  | '6h'
  | '1d'
  | '4d'
  | 'older';

export interface Video {
  id: string;
  youtube_id: string | null;
  title: string;
  url: string;
  published_at: string | null;
}

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
  category: Category;
  created_at: string;
  updated_at: string;
  videos: Video[];
}

export interface NewsListResponse {
  items: NewsItem[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// Authentication Types

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

// Error Types

export interface ErrorResponse {
  detail: string;
}

// Health Check Types

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
}

// API Client Types

export interface NewsListParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: Category;
  time_period?: TimePeriod;
}

export interface GetNewsItemParams {
  id: string;
  force_regenerate?: boolean;
}

