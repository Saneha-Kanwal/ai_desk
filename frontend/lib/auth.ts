import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with custom error handling for auth endpoints
const authAxios = axios.create({
  validateStatus: (status) => status < 500, // Don't throw on 401/403/404
});

// Suppress console errors for 401/403 responses (expected when not logged in)
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 401/403 errors - they're expected when checking auth status
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Suppress the error from console
      error.suppressLog = true;
    }
    return Promise.reject(error);
  }
);

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

// Check if backend is available (distinguishes connection errors from auth errors)
async function checkBackendConnection(): Promise<boolean> {
  try {
    await axios.get(`${API_URL}/api/health`, { timeout: 2000 });
    return true;
  } catch (err: any) {
    // Only return false for actual connection errors, not auth errors
    if (
      err.code === 'ECONNREFUSED' || 
      err.message?.includes('ERR_CONNECTION_REFUSED') ||
      err.message?.includes('Network Error') ||
      (err.response === undefined && err.request !== undefined)
    ) {
      return false;
    }
    // Backend is running (got a response, even if error)
    return true;
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
      // Use authAxios which won't throw on 401/403
      const response = await authAxios.get<User>(`${API_URL}/api/auth/me`, {
        headers: getAuthHeaders(),
        timeout: 2000,
      });
      
      // Check if we got a successful response
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      
      // If we got 401/403, the user is not authenticated (this is normal, not an error)
      if (response.status === 401 || response.status === 403) {
        // Remove invalid token silently
        removeToken();
        // Throw a specific error that won't be logged
        const error: any = new Error('Not authenticated');
        error.isAuthError = true; // Flag to identify auth errors
        throw error;
      }
      
      // Other status codes
      throw new Error(`Unexpected status: ${response.status}`);
    } catch (err: any) {
      // Silently handle auth errors - they're expected when not logged in
      if (err.isAuthError || err.response?.status === 401 || err.response?.status === 403) {
        removeToken();
        // Return a silent error that won't be logged
        const error: any = new Error('Not authenticated');
        error.isAuthError = true;
        throw error;
      }
      
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

