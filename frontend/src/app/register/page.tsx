'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { authApi } from '@/lib/api/api'; // Change to adminApi
import { setUser } from '@/store';
import toast from 'react-hot-toast';
import OTPVerification from '@/components/OTPVerification';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Sending OTP to:', formData.email);
      
      // Set registration data first so we can show OTP screen even if sending fails
      const registrationInfo = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      };
      setRegistrationData(registrationInfo);
      
      // Try to send OTP with timeout handling
      try {
        const otpPromise = authApi.sendOTP(formData.email);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout. OTP may still be sent. Please check your email.')), 10000)
        );
        
        await Promise.race([otpPromise, timeoutPromise]);
        setOtpSent(true);
        toast.success('OTP sent to your email! Please check your inbox.');
      } catch (otpError: any) {
        console.error('Send OTP error:', otpError);
        // If timeout, assume OTP was sent (backend responds immediately now)
        if (otpError.message?.includes('timeout')) {
          setOtpSent(true);
          toast.success('OTP request processed. Please check your email.', { duration: 5000 });
        } else {
          const message = otpError.response?.data?.error || otpError.message || 'Failed to send OTP. You can still verify manually or retry.';
          setError(message);
          toast.error(message, { duration: 5000 });
          setOtpSent(false);
        }
        // Still show OTP screen so user can manually enter or retry
      }
      
      // Show OTP screen regardless of whether sending succeeded
      setShowOTPVerification(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = (user: any, token: string) => {
    dispatch(setUser({ user, token }));
    toast.success('Account created and verified successfully!');
    router.push('/');
  };

  const handleOTPVerificationFailed = () => {
    setShowOTPVerification(false);
    setRegistrationData(null);
  };

  const handleResendOTP = async () => {
    try {
      const otpPromise = authApi.sendOTP(formData.email);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );
      
      await Promise.race([otpPromise, timeoutPromise]);
      setOtpSent(true);
      toast.success('OTP sent again! Please check your email.');
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      // If timeout, assume OTP was sent (backend responds immediately now)
      if (err.message?.includes('timeout')) {
        setOtpSent(true);
        toast.success('OTP request processed. Please check your email.', { duration: 5000 });
      } else {
        toast.error(err.response?.data?.error || err.message || 'Failed to resend OTP. Please check your email or try again later.');
        setOtpSent(false);
      }
    }
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <OTPVerification
          email={formData.email}
          name={`${formData.firstName} ${formData.lastName}`}
          password={formData.password}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onVerificationFailed={handleOTPVerificationFailed}
          onResendOTP={handleResendOTP}
        />
        {!otpSent && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ OTP email may not have been sent due to a timeout. You can:
            </p>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
              <li>Check your email spam folder</li>
              <li>Wait a moment and click "Resend OTP"</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>
        )}
        </div>
      </div>
    );
  }

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
              <UserPlusIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#8B4513]">Create Account</h1>
            <p className="text-gray-600 mt-2">Join Dfoods for the best jaggery experience</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>

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
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition-colors"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-[#E67E22] border-gray-300 rounded focus:ring-[#E67E22]"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-[#E67E22] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#E67E22] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E67E22] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#D35400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? 'Sending OTP...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#E67E22] hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}