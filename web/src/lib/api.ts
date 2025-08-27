import axios from "axios";
const base = (import.meta.env.VITE_API_BASE_URL ?? "https://api.mobilive.ge") + "/api";
export const api = axios.create({ baseURL: base });

export function setToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("accessToken");
  }
}

// восстановить при перезагрузке
const saved = localStorage.getItem("accessToken");
if (saved) setToken(saved);

// API функции для биллинга
export const billingApi = {
  // Пополнение баланса
  topup: async (amount: number) => {
    const response = await api.post("/billing/topup", { amount });
    return response.data;
  },

  // Покупка номера
  purchaseNumber: async (phoneNumberId: number, connectionFee: number, monthlyFee: number) => {
    const response = await api.post("/billing/purchase-number", {
      phoneNumberId,
      connectionFee,
      monthlyFee
    });
    return response.data;
  },

  // Отключение номера
  disconnectNumber: async (phoneNumberId: number) => {
    const response = await api.post("/billing/disconnect-number", {
      phoneNumberId
    });
    return response.data;
  },

  // Получение истории транзакций
  getTransactions: async (page = 1, limit = 20) => {
    const response = await api.get(`/billing/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Получение текущего баланса
  getBalance: async () => {
    const response = await api.get("/billing/balance");
    return response.data;
  }
};

// API функции для пользователей
export const userApi = {
  // Получение профиля пользователя
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Получение данных дашборда
  getDashboard: async () => {
    const response = await api.get("/users/me/dashboard");
    return response.data;
  },

  // Обновление профиля
  updateProfile: async (data: { firstName?: string; lastName?: string }) => {
    const response = await api.put("/users/me", data);
    return response.data;
  }
};