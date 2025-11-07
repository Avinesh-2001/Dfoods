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
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const THEME_ORANGE = '#E67E22';
const THEME_BADGE_BG = '#FCE8D8';

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
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div
            className="w-12 h-12 rounded-full border-4 animate-spin mx-auto"
            style={{
              borderColor: `${THEME_ORANGE} transparent ${THEME_ORANGE} ${THEME_ORANGE}`,
            }}
          ></div>
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: 'profile', label: 'Personal info', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'rewards', label: 'Rewards', icon: GiftIcon },
  ];

  const stats = [
    { label: 'Orders', value: '0', icon: ShoppingBagIcon },
    { label: 'Wishlist', value: '0', icon: HeartIcon },
    { label: 'Points', value: '0', icon: GiftIcon },
    { label: 'Addresses', value: '0', icon: MapPinIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F3] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-orange-100 rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-semibold" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                  <ClockIcon className="w-4 h-4" /> Member since {new Date().getFullYear()}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                  <ShieldCheckIcon className="w-4 h-4" /> Verified
                </span>
              </div>
            </div>
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md" style={{ backgroundColor: THEME_ORANGE }}>
              <PencilIcon className="w-4 h-4" /> Edit profile
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-orange-100 p-4 text-center shadow-sm">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-full" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#FCE8D8] text-[#E67E22]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Personal information</h2>
                  <button className="text-sm font-medium text-[#E67E22]">Edit</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-gray-500">Full name</p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      {user.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-gray-500">Email address</p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800 break-all">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  </div>
                  {user.phone && (
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-gray-500">Phone number</p>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-gray-500">Password</p>
                    <div className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800">
                      ••••••••
                      <button className="text-xs font-medium text-[#E67E22]">Change</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                  <ShoppingBagIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-sm text-gray-500 mb-4">Start shopping to view your orders here.</p>
                <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white" style={{ backgroundColor: THEME_ORANGE }}>
                  Browse products
                </Link>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                  <HeartIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-sm text-gray-500 mb-4">Save items by tapping the heart icon on products.</p>
                <Link href="/wishlist" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white" style={{ backgroundColor: THEME_ORANGE }}>
                  View wishlist
                </Link>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <MapPinIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
                <p className="text-sm text-gray-500 mb-4">Add your address for faster checkout.</p>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white" style={{ backgroundColor: THEME_ORANGE }}>
                  Add address
                </button>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Rewards</h2>
                <div className="rounded-xl border border-orange-100 bg-[#FFF4EA] p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Available points</p>
                  <p className="text-3xl font-semibold text-gray-900">0</p>
                  <p className="text-xs text-gray-500 mt-3">Earn points by shopping and engaging with Dfoods.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
