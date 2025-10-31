'use client';

import { useState, useEffect } from 'react';
import { authApi } from '../lib/api/api';
import toast from 'react-hot-toast';
import { CheckIcon } from '@heroicons/react/24/outline';

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
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter a valid 6-digit OTP');

    setLoading(true);
    try {
      const response = await authApi.verifyOTP(email, otp, name, password);
      toast.success('OTP verified successfully!');
      onVerificationSuccess(response.data.user, response.data.token);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await authApi.sendOTP(email);
      toast.success('OTP sent successfully!');
      setCountdown(60);
      setCanResend(false);
      onResendOTP?.();
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">Enter the 6-digit verification code sent to</p>
        <p className="font-medium text-gray-900 break-all">{email}</p>
        <p className="text-xs text-gray-500 mt-2">Check your spam folder if you don't see it</p>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <input
          type="text"
          value={otp}
          onChange={handleOTPChange}
          placeholder="000000"
          className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent tracking-widest"
          maxLength={6}
          required
        />
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="mt-6 text-center">
        {canResend ? (
          <button
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-amber-600 hover:text-amber-700 font-medium disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        ) : (
          <p className="text-gray-500">Resend OTP in {countdown}s</p>
        )}
      </div>

      <div className="mt-6 text-center">
        <button onClick={onVerificationFailed} className="text-gray-500 hover:text-gray-700 text-sm">
          Wrong email? Go back
        </button>
      </div>
    </div>
  );
}
