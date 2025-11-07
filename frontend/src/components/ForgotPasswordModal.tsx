'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpToken, setOtpToken] = useState('');

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpToken('');
    onClose();
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/auth/otp/send-password-reset-otp`
        : `${API_BASE}/api/auth/otp/send-password-reset-otp`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent to your email!');
        setStep('otp');
      } else {
        toast.error(data.error || data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/auth/otp/verify-password-reset-otp`
        : `${API_BASE}/api/auth/otp/verify-password-reset-otp`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP verified!');
        setOtpToken(data.resetToken);
        setStep('password');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/users/reset-password/${otpToken}`
        : `${API_BASE}/api/users/reset-password/${otpToken}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successful!');
        setStep('success');
        // Auto close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/auth/otp/send-password-reset-otp`
        : `${API_BASE}/api/auth/otp/send-password-reset-otp`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        toast.success('OTP resent to your email!');
      } else {
        toast.error('Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-1">Forgot Password</h2>
              <p className="text-white/90 text-sm">Reset your password securely</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Email Input */}
                {step === 'email' && (
                  <motion.form
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSendOTP}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </motion.form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 'otp' && (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleVerifyOTP}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <EnvelopeIcon className="w-8 h-8 text-amber-600" />
                      </div>
                      <p className="text-sm text-gray-600">
                        We've sent a verification code to
                      </p>
                      <p className="text-sm font-semibold text-gray-900">{email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => setStep('email')}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Change email
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Resend OTP
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </motion.form>
                )}

                {/* Step 3: New Password */}
                {step === 'password' && (
                  <motion.form
                    key="password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleResetPassword}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <LockClosedIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        Create a new password
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          minLength={6}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-red-600">Passwords do not match</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isLoading ? 'Updating...' : 'Reset Password'}
                    </button>
                  </motion.form>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircleIcon className="w-12 h-12 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h3>
                    <p className="text-gray-600 body-text mb-4">
                      Your password has been successfully updated.
                    </p>
                    <p className="text-sm text-gray-500">
                      A confirmation email has been sent to {email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 pb-6">
              <div className="flex justify-center gap-2">
                <div className={`h-2 w-2 rounded-full transition-colors ${step === 'email' ? 'bg-amber-600' : 'bg-gray-300'}`} />
                <div className={`h-2 w-2 rounded-full transition-colors ${step === 'otp' ? 'bg-amber-600' : 'bg-gray-300'}`} />
                <div className={`h-2 w-2 rounded-full transition-colors ${step === 'password' || step === 'success' ? 'bg-amber-600' : 'bg-gray-300'}`} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

