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
    phone: '',
    profilePhoto: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

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
        phone: user.phone || '',
        profilePhoto: user.profilePhoto || ''
      });
      setPhotoPreview(user.profilePhoto || '');
      
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setEditForm({ ...editForm, profilePhoto: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = async () => {
    if (!user.phone) {
      toast.error('Please add a phone number first');
      return;
    }
    
    setSendingOtp(true);
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/auth/phone-otp/send-phone-otp`
        : `${API_BASE}/api/auth/phone-otp/send-phone-otp`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: user.phone })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('OTP sent to your mobile number!');
        setShowOtpModal(true);
        // Log OTP for development (remove in production)
        if (data.debugOtp) {
          console.log('OTP for testing:', data.debugOtp);
        }
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/auth/phone-otp/verify-phone-otp`
        : `${API_BASE}/api/auth/phone-otp/verify-phone-otp`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: user.phone, otp })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Mobile number verified successfully!');
        setShowOtpModal(false);
        setOtp('');
        // Update user in localStorage
        const updatedUser = { ...user, phoneVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        toast.error(data.error || 'Invalid OTP. Please try again');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again');
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
          <p className="text-black text-sm">Loading profile...</p>
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
                <p className="text-xs uppercase tracking-wide text-black/70">Account</p>
                <h1 className="text-2xl font-semibold text-black">Welcome back, {user.name}</h1>
                <p className="text-sm text-black">Manage your personal information, orders and saved items.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-2xl font-semibold" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                  {photoPreview || user.profilePhoto ? (
                    <img src={photoPreview || user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
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
              <div className="text-xs uppercase tracking-wide text-black/70 mb-1">{stat.label}</div>
              <div className="text-xl font-semibold text-black">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 h-fit">
            <p className="text-xs uppercase text-black/70 mb-3">Quick links</p>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#FCE8D8] text-[#E67E22]'
                      : 'text-black hover:bg-gray-100'
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
                    <h2 className="text-lg font-semibold text-black">Personal information</h2>
                    <p className="text-xs text-black/70">Basic details associated with your account</p>
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
                    {/* Profile Photo Upload */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-black/70">Profile Photo</p>
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}>
                          {photoPreview ? (
                            <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            id="profile-photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="profile-photo"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer"
                            style={{ backgroundColor: THEME_ORANGE }}
                          >
                            Upload Photo
                          </label>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (MAX. 5MB)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-black/70">Full name</p>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-black/70">Email address</p>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase text-black/70">Phone number</p>
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
                            phone: user.phone || '',
                            profilePhoto: user.profilePhoto || ''
                          });
                          setPhotoPreview(user.profilePhoto || '');
                          setPhotoFile(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200"
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
                      <p className="text-xs uppercase text-black/70">Full name</p>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-black">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {user.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-black/70">Email address</p>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-black break-all">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-black/70">Phone number</p>
                      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-black">
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          {user.phone || 'Not provided'}
                        </div>
                        {user.phone && (
                          <button 
                            onClick={handleSendOtp}
                            disabled={sendingOtp}
                            className="text-xs font-medium text-[#E67E22] hover:underline disabled:opacity-50"
                          >
                            {sendingOtp ? 'Sending...' : 'Verify number'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-black/70">Password</p>
                      <div className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-200 text-sm text-black">
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
                <h2 className="text-lg font-semibold text-black mb-4">My Orders</h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-semibold text-black">Order #{order._id?.slice(-8)}</p>
                            <p className="text-xs text-black/70">{new Date(order.createdAt).toLocaleDateString()}</p>
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
                          <p className="text-sm text-black">{order.items?.length || 0} items</p>
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
                    <h3 className="text-lg font-semibold text-black mb-2">No orders yet</h3>
                    <p className="text-sm text-black/70 mb-4">Start shopping to view your orders here.</p>
                    <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white" style={{ backgroundColor: THEME_ORANGE }}>
                      Browse products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-lg font-semibold text-black mb-4">My Wishlist</h2>
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
                    <h3 className="text-lg font-semibold text-black mb-2">Your wishlist is empty</h3>
                    <p className="text-sm text-black/70 mb-4">Save items by tapping the heart icon on products.</p>
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
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 text-black/70">
                  <MapPinIcon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">No saved addresses</h3>
                <p className="text-sm text-black/70 mb-4">Add your address for faster checkout.</p>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white" style={{ backgroundColor: THEME_ORANGE }}>
                  Add address
                </button>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-black">Rewards</h2>
                  <p className="text-xs text-black/70">Earn points every time you shop with Dfoods.</p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-[#FFF4EA] p-6 text-center">
                  <p className="text-sm text-black mb-2">Available points</p>
                  <p className="text-3xl font-semibold text-black">0</p>
                  <p className="text-xs text-black/70 mt-3">Earn 10 points for every ₹100 spent</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">Verify Mobile Number</h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the 6-digit OTP sent to <span className="font-semibold text-[#E67E22]">{user.phone}</span>
              </p>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-center text-2xl tracking-widest focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: THEME_ORANGE }}
                >
                  Verify
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="text-sm text-[#E67E22] hover:underline disabled:opacity-50"
                >
                  {sendingOtp ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
