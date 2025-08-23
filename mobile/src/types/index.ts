// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
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
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
  internetPackage?: InternetPackage;
  minutesPackage?: MinutesPackage;
  smsPackage?: SMSPackage;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InternetPackage {
  data: number; // в МБ
  unlimited: boolean;
}

export interface MinutesPackage {
  minutes: number;
  unlimited: boolean;
}

export interface SMSPackage {
  sms: number;
  unlimited: boolean;
}

// Phone number types
export interface PhoneNumber {
  id: string;
  number: string;
  userId: string;
  tariffId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionType {
  RECHARGE = 'RECHARGE',
  TARIFF_PURCHASE = 'TARIFF_PURCHASE',
  REFUND = 'REFUND'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
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
}

export interface SearchParams extends PaginationParams {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
