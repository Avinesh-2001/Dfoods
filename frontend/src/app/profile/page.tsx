'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  PencilIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  GiftIcon,
  ClockIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 body-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: 'profile', label: 'Personal Info', icon: UserIcon, color: 'from-blue-500 to-indigo-500' },
    { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon, color: 'from-green-500 to-emerald-500' },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon, color: 'from-red-500 to-pink-500' },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'rewards', label: 'Rewards', icon: GiftIcon, color: 'from-yellow-500 to-orange-500' },
  ];

  const stats = [
    { label: 'Total Orders', value: '0', icon: ShoppingBagIcon, color: 'bg-green-100 text-green-600' },
    { label: 'Wishlist Items', value: '0', icon: HeartIcon, color: 'bg-red-100 text-red-600' },
    { label: 'Reward Points', value: '0', icon: GiftIcon, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Saved Addresses', value: '0', icon: MapPinIcon, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header - More Impressive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-600/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Enhanced Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/50">
                <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
              >
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
              >
                {user.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-base sm:text-lg mb-4"
              >
                {user.email}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 justify-center sm:justify-start"
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Member since {new Date().getFullYear()}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  Verified Account
                </span>
              </motion.div>
            </div>

            {/* Edit Profile Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden sm:block px-6 py-3 bg-white text-amber-600 rounded-xl hover:shadow-xl transition-all font-semibold"
            >
              <PencilIcon className="w-5 h-5 inline mr-2" />
              Edit Profile
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm body-text">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-24">
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                        : 'text-gray-700 hover:bg-gray-50 hover:scale-102'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Personal Information</h2>
                    <button className="flex items-center gap-2 px-4 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                      <PencilIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                        <span className="text-gray-900 font-semibold text-lg">{user.name}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                        <EnvelopeIcon className="w-6 h-6 text-purple-600" />
                        <span className="text-gray-900 font-semibold text-lg break-all">{user.email}</span>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                          <PhoneIcon className="w-6 h-6 text-green-600" />
                          <span className="text-gray-900 font-semibold text-lg">{user.phone}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Password</label>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
                        <span className="text-gray-900 font-semibold text-lg">••••••••</span>
                        <button className="text-amber-600 hover:text-amber-700 text-sm font-semibold hover:underline">
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Account Security</h3>
                        <p className="text-sm text-gray-600">Your account is protected</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Email Verified
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Two-Factor Ready
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Orders</h2>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBagIcon className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 body-text mb-6">Start your jaggery journey today!</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full hover:shadow-xl transition-all font-semibold"
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      Start Shopping
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h2>
                    <Link
                      href="/wishlist"
                      className="text-amber-600 hover:text-amber-700 font-semibold text-sm sm:text-base hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <HeartIcon className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 body-text mb-6">Save products you love for later</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-semibold"
                    >
                      <HeartIcon className="w-5 h-5" />
                      Browse Products
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Addresses</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Add New</span>
                    </button>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPinIcon className="w-12 h-12 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No saved addresses</h3>
                    <p className="text-gray-600 body-text">Add addresses for faster checkout</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rewards' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Rewards & Points</h2>
                  
                  {/* Rewards Card */}
                  <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
                    <div className="relative">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-white/80 text-sm mb-2 uppercase tracking-wide">Available Points</p>
                          <p className="text-6xl font-bold">0</p>
                        </div>
                        <GiftIcon className="w-16 h-16 opacity-30" />
                      </div>
                      <div className="h-px bg-white/30 mb-4"></div>
                      <p className="text-white/90 text-sm">
                        Start shopping to earn reward points with every purchase!
                      </p>
                    </div>
                  </div>

                  {/* How to Earn */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-amber-50 rounded-xl p-4 text-center border-2 border-amber-200">
                      <div className="text-3xl mb-2">🛍️</div>
                      <h4 className="font-bold text-gray-900 mb-1">Shop & Earn</h4>
                      <p className="text-sm body-text">₹100 = 10 points</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center border-2 border-amber-200">
                      <div className="text-3xl mb-2">⭐</div>
                      <h4 className="font-bold text-gray-900 mb-1">Write Reviews</h4>
                      <p className="text-sm body-text">Earn 50 points</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center border-2 border-amber-200">
                      <div className="text-3xl mb-2">🎁</div>
                      <h4 className="font-bold text-gray-900 mb-1">Refer Friends</h4>
                      <p className="text-sm body-text">Earn 200 points</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
