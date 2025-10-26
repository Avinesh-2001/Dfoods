import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 3000,
  headers: {
    'Cache-Control': 'no-cache',
  },
});

console.log('Axios baseURL:', api.defaults.baseURL);

// ---------------- REQUEST INTERCEPTOR ----------------
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

// ---------------- RESPONSE INTERCEPTOR ----------------
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

// ---------------- AUTH API (User-side) ----------------
export const authApi = {
  login: (data: any) => api.post('/users/login', data),
  register: (data: any) => api.post('/users/register', data),
  getProfile: () => api.get('/users/profile'),
  sendOTP: (email: string) => api.post('/auth/otp/send-otp', { email }),
  verifyOTP: (email: string, otp: string, name: string, password: string) =>
    api.post('/auth/otp/verify-otp', { email, otp, name, password }),
};

// ---------------- ADMIN API ----------------
export const adminApi = {
  login: (data: any) => api.post('/admin/auth/login', data),
  logout: () => api.post('/admin/auth/logout'),
  getProfile: () => api.get('/admin/auth/profile'),
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/dashboard/users', { params }),
  getUserById: (userId: string) => api.get(`/admin/users/${userId}`),
  updateUser: (userId: string, data: any) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getCategories: () => api.get('/category'),
  getProducts: (params?: any) => api.get('/admin/dashboard/products', { params }),
  getProductById: (id: string) => api.get(`/products/${id}`),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  uploadProducts: (formData: FormData) =>
    api.post('/products/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default api;
