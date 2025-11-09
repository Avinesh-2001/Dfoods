// User and Auth type definitions

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  phone?: string;
  profilePhoto?: string;
  phoneVerified?: boolean;
  isBlocked?: boolean;
  wishlist?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  admin?: Admin;
}

export interface UserState {
  user: User | null;
  token: string | null;
}

