import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else if (process.env.NODE_ENV === 'development') {
          // In development, add a dummy token or skip auth for testing
          const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;
          if (devToken) {
            config.headers.Authorization = `Bearer ${devToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          console.warn('Authentication failed - token cleared');
          // Don't redirect in development mode
          if (process.env.NODE_ENV !== 'development') {
            window.location.href = '/';
          }
        } else if (error.response?.status === 400 && process.env.NODE_ENV === 'development') {
          console.warn('API Error 400 - possibly authentication required:', error.response?.data);
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic API methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(endpoint);
    return response.data;
  }

  // Set auth token
  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // Clear auth token
  clearAuthToken() {
    localStorage.removeItem('auth_token');
  }

  // Check if client-side
  private isClient() {
    return typeof window !== 'undefined';
  }
}

export const apiClient = new ApiClient();