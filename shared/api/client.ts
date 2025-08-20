import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {ApiResponse} from '../types';

export class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      },
    );
  }

  private getAuthToken(): string | null {
    // This will be implemented differently in web vs mobile
    if (typeof window !== 'undefined') {
      // Web environment
      return localStorage.getItem('authToken');
    } else {
      // Mobile environment - will be overridden
      return null;
    }
  }

  private handleUnauthorized() {
    // This will be implemented differently in web vs mobile
    if (typeof window !== 'undefined') {
      // Web environment
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    // Mobile will handle this through context
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.message || error.response.statusText,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'No response from server',
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  // Set auth token (for mobile apps)
  setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Remove auth token
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Get base URL
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create default instance
export const apiClient = new ApiClient(
  process.env.REACT_APP_API_URL || 
  process.env.EXPO_PUBLIC_API_URL || 
  'http://localhost:3000/api'
);

// Export for use in other modules
export default apiClient;
