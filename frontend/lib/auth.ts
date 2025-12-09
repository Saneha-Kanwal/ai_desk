import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Get token from localStorage
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Set token in localStorage
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
}

// Remove token from localStorage
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
}

// Get auth headers
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Check if backend is available
async function checkBackendConnection(): Promise<boolean> {
  try {
    await axios.get(`${API_URL}/api/health`, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

// Auth API functions
export const authApi = {
  async register(data: RegisterRequest): Promise<User> {
    const isBackendAvailable = await checkBackendConnection();
    if (!isBackendAvailable) {
      throw new Error('Backend server is not running. Please start the backend server first.');
    }
    
    try {
      const response = await axios.post<User>(`${API_URL}/api/auth/register`, data);
      return response.data;
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on port 8000.');
      }
      throw err;
    }
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    const isBackendAvailable = await checkBackendConnection();
    if (!isBackendAvailable) {
      throw new Error('Backend server is not running. Please start the backend server first.');
    }
    
    try {
      const response = await axios.post<TokenResponse>(`${API_URL}/api/auth/login`, data);
      setToken(response.data.access_token);
      return response.data;
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on port 8000.');
      }
      throw err;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_URL}/api/auth/me`, {
        headers: getAuthHeaders(),
        timeout: 2000,
      });
      return response.data;
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Backend server is not running.');
      }
      throw err;
    }
  },

  logout(): void {
    removeToken();
  },
};

