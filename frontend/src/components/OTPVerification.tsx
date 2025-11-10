'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../lib/api/api';
import toast from 'react-hot-toast';
import { 
  ShieldCheckIcon, 
  EnvelopeIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface OTPVerificationProps {
  email: string;
  name: string;
  password: string;
  onVerificationSuccess: (user: any, token: string) => void;
  onVerificationFailed: () => void;
  onResendOTP?: () => void;
}

export default function OTPVerification({
  email,
  name,
  password,
  onVerificationSuccess,
  onVerificationFailed,
  onResendOTP,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyOTP(email, otpString, name, password);
      toast.success('✓ Account verified successfully!');
      onVerificationSuccess(response.data.user, response.data.token);
    } catch (error: any) {
      // Secure error handling - don't log sensitive data
      const errorMessage = error.response?.data?.error || 'Invalid verification code';
      toast.error(errorMessage);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await authApi.sendOTP(email);
      toast.success('New code sent to your email!');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      onResendOTP?.();
    } catch (error: any) {
      // Secure error handling
      const errorMessage = error.response?.data?.error || 'Failed to send code';
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (digit && index === 5 && newOtp.every(d => d)) {
      setTimeout(() => handleVerifyOTP(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    pastedData.split('').forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    
    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
    
    // Auto-submit if complete
    if (pastedData.length === 6) {
      setTimeout(() => handleVerifyOTP(), 100);
    }
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = localPart.slice(0, 2) + '*'.repeat(Math.max(localPart.length - 2, 3));
    return `${maskedLocal}@${domain}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <ShieldCheckIcon className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Verify Your Email
        </h2>
        
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
          <EnvelopeIcon className="w-4 h-4" />
          <p className="text-sm">
            Code sent to <span className="font-semibold text-gray-900">{maskEmail(email)}</span>
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Enter the 6-digit verification code
        </p>
      </div>

      {/* OTP Input Grid */}
      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <div className="flex justify-center gap-2 md:gap-3">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-200
                ${digit ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-400'}
                focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none
                disabled:bg-gray-50 disabled:cursor-not-allowed
              `}
            />
          ))}
        </div>

        {/* Verify Button */}
        <motion.button
          type="submit"
          disabled={loading || otp.some(d => !d)}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify Code'
          )}
        </motion.button>
      </form>

      {/* Resend Section */}
      <div className="mt-6 text-center">
        <AnimatePresence mode="wait">
          {canResend ? (
            <motion.button
              key="resend"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold disabled:opacity-50 transition-colors"
            >
              <ArrowPathIcon className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </motion.button>
          ) : (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-gray-500"
            >
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm">
                Resend available in <span className="font-semibold text-green-600">{countdown}s</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-sm text-blue-900 mb-2 font-medium">📧 Didn't receive the code?</p>
        <ul className="text-xs text-blue-800 space-y-1 ml-4">
          <li>• Check your spam/junk folder</li>
          <li>• Make sure email address is correct</li>
          <li>• Wait 1-2 minutes for delivery</li>
        </ul>
      </div>

      {/* Go Back Link */}
      <div className="mt-6 text-center">
        <button
          onClick={onVerificationFailed}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Wrong email? Go back
        </button>
      </div>
    </motion.div>
  );
}
