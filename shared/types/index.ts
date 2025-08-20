// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

// Tariff types
export interface Tariff {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  internet: InternetPackage;
  minutes: MinutesPackage;
  sms: SMSPackage;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InternetPackage {
  amount: number;
  unit: 'MB' | 'GB' | 'TB';
  isUnlimited: boolean;
}

export interface MinutesPackage {
  amount: number;
  isUnlimited: boolean;
}

export interface SMSPackage {
  amount: number;
  isUnlimited: boolean;
}

// Phone number types
export interface PhoneNumber {
  id: string;
  number: string;
  userId: string;
  isActive: boolean;
  tariffId?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  phoneNumberId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  status: TransactionStatus;
  createdAt: Date;
}

export enum TransactionType {
  TOP_UP = 'top_up',
  TARIFF_PAYMENT = 'tariff_payment',
  REFUND = 'refund',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}
