// API Configuration for Render Backend
import Constants from 'expo-constants';

// Get API base URL from app config or fallback to Render URL
const getApiBaseUrl = () => {
  const config = Constants.expoConfig?.extra as any;
  return config?.apiBaseUrl || 'https://api.mobilive.ge';
};

export const API_CONFIG = {
  // Render Backend API
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 20000, // Increased timeout for production
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
    },
    USER: {
      PROFILE: '/users/me',
      DASHBOARD: '/users/me/dashboard',
    },
    PLANS: {
      GET_PLANS: '/plans',
      GET_USER_PLAN: '/users/me/plan',
      CONNECT_PLAN: '/users/me/plan',
    },
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}/api${endpoint}`;
