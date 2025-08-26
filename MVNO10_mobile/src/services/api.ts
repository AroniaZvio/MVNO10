import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, getApiUrl } from '../config/api';

// Create axios instance with configuration
export const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ API Timeout Error');
      error.message = 'Request timeout. Please check your connection.';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 API Network Error');
      error.message = `Network error. Cannot connect to ${API_CONFIG.BASE_URL}. Please check if the server is running and accessible.`;
    } else if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
    } else {
      console.error('❌ API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export async function setToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    await AsyncStorage.setItem('accessToken', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    await AsyncStorage.removeItem('accessToken');
  }
}

// Restore token on app start
(async () => {
  try {
    const saved = await AsyncStorage.getItem('accessToken');
    if (saved) api.defaults.headers.common.Authorization = `Bearer ${saved}`;
  } catch {}
})();

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
    return data;
  },
  register: async (email: string, username: string, password: string) => {
    const { data } = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, { email, username, password });
    return data;
  },
  refresh: async (refreshToken: string) => {
    const { data } = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return data;
  }
};

export const userApi = {
  getDashboard: async () => {
    const { data } = await api.get(API_CONFIG.ENDPOINTS.USER.DASHBOARD);
    return data;
  },
  getProfile: async () => {
    const { data } = await api.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
    return data;
  }
};

// Tariff Plan API
export const planApi = {
  // Get all available plans
  getPlans: async () => {
    const { data } = await api.get('/plans');
    return data;
  },
  
  // Get user's connected plan
  getUserPlan: async () => {
    const { data } = await api.get('/users/me/plan');
    return data;
  },
  
  // Connect a plan to user
  connectPlan: async (planId: number) => {
    const { data } = await api.post('/users/me/plan', { planId });
    return data;
  }
};
