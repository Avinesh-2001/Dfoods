'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { authApi, adminApi } from '@/lib/api/api';
import { setUser } from '@/store';
import toast from 'react-hot-toast';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const attemptLogin = async (apiCall: any, type: string) => {
      try {
        const { data } = await apiCall({ email: formData.email, password: formData.password });
        console.log(`${type} login response:`, data);
        dispatch(setUser({ user: { ...data[type.toLowerCase()], role: type.toLowerCase() }, token: data.token }));
        localStorage.setItem('token', data.token);
        toast.success(`Logged in successfully!`, { duration: 2000 });
        // Small delay to show toast
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push(type === 'Admin' ? '/admin-dashboard' : '/');
        return true;
      } catch (err: any) {
        console.log(`${type} login failed:`, err.response?.data?.message || err.message);
        return false;
      }
    };

    try {
      console.log('Attempting login with:', { email: formData.email });

      // Try admin login first
      const adminSuccess = await attemptLogin(adminApi.login, 'Admin');
      if (adminSuccess) return;

      // Try user login if admin login failed
      const userSuccess = await attemptLogin(authApi.login, 'User');
      if (userSuccess) return;

      // If both fail, show error
      const message = 'Invalid email or password';
      setError(message);
      toast.error(message);
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#E67E22] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black">Welcome Back</h1>
            <p className="text-black mt-2">Sign in to your Dfoods account</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#E67E22] hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-[#E67E22] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#D35400] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#E67E22] hover:underline font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}