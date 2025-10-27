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

// ✅ UPDATED Admin API types
export interface AdminApi {
  login: (data: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<{ message: string }>>;
  getProfile: () => Promise<ApiResponse<Admin>>;
  getDashboardStats: () => Promise<ApiResponse<any>>;

  getUsers: () => Promise<ApiResponse<User[]>>;
  getUserById: (id: string) => Promise<ApiResponse<User>>;
  updateUser: (id: string, data: Partial<User>) => Promise<ApiResponse<User>>;
  deleteUser: (id: string) => Promise<ApiResponse<{ message: string }>>;

  getEmailTemplates: () => Promise<ApiResponse<any>>;
  updateEmailTemplate: (id: string, data: { subject?: string; body?: string; isActive?: boolean }) => Promise<ApiResponse<any>>;

  getCategories: () => Promise<ApiResponse<string[]>>;

  getProducts: () => Promise<ApiResponse<Product[]>>;
  getProductById: (id: string) => Promise<ApiResponse<Product>>;
  createProduct: (data: Partial<Product>) => Promise<ApiResponse<Product>>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<ApiResponse<Product>>;
  deleteProduct: (id: string) => Promise<ApiResponse<{ message: string }>>;
  uploadProducts: (formData: FormData) => Promise<ApiResponse<{ message: string; count: number }>>;

  // ✅ New additions
  getAllReviews: (params?: { status?: string }) => Promise<ApiResponse<any>>;
  approveReview: (reviewId: string, isApproved: boolean) => Promise<ApiResponse<any>>;
  deleteReview: (reviewId: string) => Promise<ApiResponse<any>>;

  // ✅ Contacts API
  getContacts: () => Promise<ApiResponse<any>>;
}
