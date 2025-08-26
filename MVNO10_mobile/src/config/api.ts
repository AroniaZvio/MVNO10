// API Configuration
// Change this to your computer's local IP address
// You can find it by running 'ipconfig' on Windows or 'ifconfig' on Mac/Linux

export const API_CONFIG = {
  // For physical device: use your computer's local IP (e.g., 192.168.0.83)
  // For emulator: localhost should work
  // For Expo Go: use your computer's local IP
  BASE_URL: 'http://192.168.0.83:4000',
  TIMEOUT: 15000,
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
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}/api${endpoint}`;
