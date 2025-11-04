'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ui/ProductCard';
import { products as mockProducts } from '@/lib/data/products';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#F97316] rounded-full flex items-center justify-center mx-auto mb-3 shadow">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
            <p className="text-sm text-gray-600">Manage your account information</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <UserIcon className="w-5 h-5 text-[#F97316]" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-base font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <EnvelopeIcon className="w-5 h-5 text-[#F97316]" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-base font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <PhoneIcon className="w-5 h-5 text-[#F97316]" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-base font-semibold text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-[#F97316] font-bold">👤</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Account Type</p>
                <p className="text-base font-semibold text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200" />

          {/* Product Recommendations */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended for you</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {mockProducts.slice(0, 8).map((p: any) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

