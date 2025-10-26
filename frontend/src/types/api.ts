// API type definitions

import { Product } from './product';
import { User, Admin, LoginCredentials, RegisterData, AuthResponse } from './user';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  error?: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}

// Auth API types
export interface AuthApi {
  login: (data: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (data: RegisterData) => Promise<ApiResponse<AuthResponse>>;
  getProfile: () => Promise<ApiResponse<{ user: User }>>;
}

// Admin API types
export interface AdminApi {
  login: (data: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  getUsers: () => Promise<ApiResponse<User[]>>;
  getCategories: () => Promise<ApiResponse<string[]>>;
  getProducts: () => Promise<ApiResponse<Product[]>>;
  getProductById: (id: string) => Promise<ApiResponse<Product>>;
  createProduct: (data: Partial<Product>) => Promise<ApiResponse<Product>>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<ApiResponse<Product>>;
  deleteProduct: (id: string) => Promise<ApiResponse<{ message: string }>>;
  uploadProducts: (formData: FormData) => Promise<ApiResponse<{ message: string; count: number }>>;
}

