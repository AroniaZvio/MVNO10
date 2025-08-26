export type Role = 'USER' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  balance?: number; // present on some endpoints
}

export interface LoginResponse {
  message: string;
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
}

export interface PhoneNumber {
  id: number;
  countryName?: string;
  countryCode?: string;
  mobileNumber: string;
  number800?: string | null;
  category?: string | null;
  status?: string;
}

// Tariff Plan Types
export interface Plan {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  dataMb: number;
  minutes: number;
  sms: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPlan {
  id: number;
  planId: number;
  planName: string;
  planDescription: string;
  planPrice: string;
  planDataMb: number;
  planMinutes: number;
  planSms: number;
  connectedAt: string;
  status: string;
}

export interface DashboardResponse {
  user: AuthUser & { balance?: number };
  connectedNumbers: PhoneNumber[];
  availableNumbers: PhoneNumber[];
}
