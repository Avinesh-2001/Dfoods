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
  ShieldCheckIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ui/ProductCard';

const THEME_ORANGE = '#E67E22';
const THEME_BADGE_BG = '#FCE8D8';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const wishlistItems = useWishlistStore((state) => state.items || []);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const wishlistInitialized = useWishlistStore((state) => state.initialized);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      
      // Fetch wishlist if not initialized
      if (!wishlistInitialized) {
        fetchWishlist();
      }
      
      // Fetch user orders
      fetchOrders();
    }
  }, [user, router, wishlistInitialized, fetchWishlist]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/orders`
        : `${API_BASE}/api/orders`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/users/profile`
        : `${API_BASE}/api/users/profile`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Update local storage
        const updatedUser = { ...user, ...editForm };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

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
    { label: 'Orders', value: orders.length.toString(), icon: ShoppingBagIcon },
    { label: 'Wishlist', value: wishlistItems.length.toString(), icon: HeartIcon },
    { label: 'Points', value: '0', icon: GiftIcon },
    { label: 'Addresses', value: '0', icon: MapPinIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F3] pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-orange-100 rounded-2xl p-6 sm:p-7 shadow-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">Account</p>
                <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user.name}</h1>
                <p className="text-sm text-gray-600">Manage your personal information, orders and saved items.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-semibold" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md"
                  style={{ backgroundColor: THEME_ORANGE }}
                >
                  <PencilIcon className="w-4 h-4" /> {isEditing ? 'Cancel' : 'Edit profile'}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                <ClockIcon className="w-4 h-4" /> Member since {new Date().getFullYear()}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                <ShieldCheckIcon className="w-4 h-4" /> Verified
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-orange-100 p-4 text-center shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{stat.label}</div>
              <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 h-fit">
            <p className="text-xs uppercase text-gray-500 mb-3">Quick links</p>
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

          <div className="lg:col-span-3 bg-white rounded-2xl border border-orange-100 shadow-sm p-5 space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Personal information</h2>
                    <p className="text-xs text-gray-500">Basic details associated with your account</p>
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-sm font-medium text-[#E67E22]"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-gray-500">Full name</p>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-gray-500">Email address</p>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-gray-500">Phone number</p>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || ''
                          });
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        className="px-4 py-2 text-sm font-medium text-white rounded-md"
                        style={{ backgroundColor: THEME_ORANGE }}
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-gray-500">Full name</p>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {user.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-gray-500">Email address</p>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800 break-all">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-gray-500">Phone number</p>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        {user.phone || 'Not provided'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-gray-500">Password</p>
                      <div className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800">
                        ••••••••
                        <button className="text-xs font-medium text-[#E67E22]">Change</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Order #{order._id?.slice(-8)}</p>
                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                          <p className="text-base font-semibold" style={{ color: THEME_ORANGE }}>
                            ₹{order.totalAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Wishlist</h2>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistItems.slice(0, 6).map((item) => (
                      <ProductCard key={item._id || item.id} product={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                      <HeartIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-sm text-gray-500 mb-4">Save items by tapping the heart icon on products.</p>
                    <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white" style={{ backgroundColor: THEME_ORANGE }}>
                      Browse products
                    </Link>
                  </div>
                )}
                {wishlistItems.length > 6 && (
                  <div className="mt-4 text-center">
                    <Link href="/wishlist" className="text-sm font-medium text-[#E67E22] hover:underline">
                      View all {wishlistItems.length} items →
                    </Link>
                  </div>
                )}
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
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Rewards</h2>
                  <p className="text-xs text-gray-500">Earn points every time you shop with Dfoods.</p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-[#FFF4EA] p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Available points</p>
                  <p className="text-3xl font-semibold text-gray-900">0</p>
                  <p className="text-xs text-gray-500 mt-3">Earn 10 points for every ₹100 spent</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
