import axios from 'axios';

// ---------------- TYPE DEFINITIONS ----------------
interface UserLoginData {
  email: string;
  password: string;
}

interface UserRegisterData {
  name: string;
  email: string;
  password: string;
}

interface AdminLoginData {
  email: string;
  password: string;
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
}

interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

// ----- UPDATED INTERFACE FOR EMAIL TEMPLATE -----
export interface UpdateEmailTemplateData {
  subject?: string;
  body?: string;
  isActive?: boolean; // ✅ Added this line
}

// ---------------- AXIOS INSTANCE ----------------
// Dynamic API URL - works for both local and production
const getApiBaseUrl = () => {
  // If we're in the browser
  if (typeof window !== 'undefined') {
    // Check if we have a custom API URL set
    const customUrl = localStorage.getItem('API_URL');
    if (customUrl) return customUrl;
    
    // In production (Vercel), use the deployed backend
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
  }
  
  // Default to /api which will be proxied to localhost:5000 in development
  // or to the configured backend in production
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000, // Increased timeout for production
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if ((error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') && !config._retry) {
      config._retry = true;
      console.log('🔄 Network error, retrying...', config.url);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(config);
    }

    const status = error.response?.status;

    if (status === 401 || status === 404) {
      return Promise.reject(error);
    }

    if (status >= 500) {
      console.error('❌ Server error:', {
        url: config?.url,
        status,
        message: error.response?.data?.message || error.message,
      });
    } else if (status >= 400) {
      console.warn('⚠️ Client error:', {
        url: config?.url,
        status,
        message: error.response?.data?.message || error.message,
      });
    } else {
      console.error('❌ Request failed:', {
        url: config?.url,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// ---------------- AUTH API ----------------
export const authApi = {
  login: (data: UserLoginData) => api.post('/users/login', data),
  register: (data: UserRegisterData) => api.post('/users/register', data),
  getProfile: () => api.get('/users/profile'),
  sendOTP: (email: string) => api.post('/auth/otp/send-otp', { email }),
  verifyOTP: (email: string, otp: string, name: string, password: string) =>
    api.post('/auth/otp/verify-otp', { email, otp, name, password }),
};

// ---------------- ADMIN API ----------------
export const adminApi = {
  login: (data: AdminLoginData) => api.post('/admin/auth/login', data),
  logout: () => api.post('/admin/auth/logout'),
  getProfile: () => api.get('/admin/auth/profile'),
  getDashboardStats: () => api.get('/admin/dashboard'),

  getUsers: (params?: GetUsersParams) => api.get('/admin/dashboard/users', { params }),
  getUserById: (userId: string) => api.get(`/admin/users/${userId}`),
  updateUser: (userId: string, data: Partial<UpdateUserData>) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  getEmailTemplates: () => api.get('/admin/email-templates'),
  updateEmailTemplate: (id: string, data: UpdateEmailTemplateData) =>
    api.put(`/admin/email-templates/${id}`, data),

  getCategories: () => api.get('/category'),

  getProducts: (params?: GetProductsParams) => api.get('/admin/dashboard/products', { params }),
  getProductById: (id: string) => api.get(`/products/${id}`),
  createProduct: (data: ProductData) => api.post('/products', data),
  updateProduct: (id: string, data: Partial<ProductData>) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  uploadProducts: (formData: FormData) =>
    api.post('/products/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // ✅ REVIEWS API
  getAllReviews: (params?: { status?: string }) =>
    api.get('/admin/reviews', { params }),
  getProductReviews: (productId: string) =>
    api.get(`/reviews/product/${productId}`),
  createReview: (data: any) => api.post('/reviews', data),
  approveReview: (reviewId: string, isApproved: boolean) =>
    api.put(`/admin/reviews/${reviewId}/approve`, { isApproved }),
  deleteReview: (reviewId: string) =>
    api.delete(`/admin/reviews/${reviewId}`),

  // ✅ CONTACTS API
  getContacts: () => api.get('/contact'),
  updateContactStatus: (id: string, status: string) =>
    api.put(`/contact/${id}/status`, { status }),
  deleteContact: (id: string) => api.delete(`/contact/${id}`),
};


export default api;
