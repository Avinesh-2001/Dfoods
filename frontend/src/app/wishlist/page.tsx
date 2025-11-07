'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, TrashIcon, ShoppingCartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/lib/store/cartStore';

export default function WishlistPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchWishlist();
    }
  }, [user, router]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/wishlist`
        : `${API_BASE}/api/wishlist`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.products || []);
      }
    } catch (error) {
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = API_BASE.includes('/api') 
        ? `${API_BASE}/wishlist/remove/${productId}`
        : `${API_BASE}/api/wishlist/remove/${productId}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
        toast.success('Removed from wishlist');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const moveToCart = async (product: any) => {
    const productId = product._id || product.id;
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: 1
    });
    
    await removeFromWishlist(productId);
    toast.success('Moved to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-white flex items-center justify-center pt-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <HeartIconSolid className="w-16 h-16 text-red-500" />
          </motion.div>
          <p className="text-gray-600 body-text">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-red-50 to-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <HeartIconSolid className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto" />
              <SparklesIcon className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            My Wishlist
          </h1>
          <p className="text-base sm:text-lg body-text max-w-2xl mx-auto">
            {wishlistItems.length > 0 
              ? `You have ${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'} saved`
              : 'Save your favorite products here'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {wishlistItems.length > 0 ? (
            <motion.div
              key="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-red-200 transition-all duration-300 hover:shadow-xl">
                    {/* Product Image */}
                    <Link href={`/products/${item._id || item.id}`} className="block relative h-56 sm:h-64 bg-gradient-to-br from-pink-50 to-red-50 overflow-hidden">
                      <Image
                        src={item.images?.[0] || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      
                      {/* Wishlist Badge */}
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                        <HeartIconSolid className="w-4 h-4" />
                        Saved
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(item._id || item.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all group/btn"
                        title="Remove from wishlist"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/products/${item._id || item.id}`}>
                        {/* Category */}
                        {item.category && (
                          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mb-2">
                            {item.category.replace(/-/g, ' ')}
                          </span>
                        )}

                        {/* Product Name */}
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                          {item.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-xl sm:text-2xl font-bold text-gray-900 price-text">
                              ₹{item.price?.toLocaleString()}
                            </span>
                            {item.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-3">
                          {(item.quantity > 0 || item.inStock) ? (
                            <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-1 rounded">
                              ✓ In Stock
                            </span>
                          ) : (
                            <span className="text-xs text-red-700 font-medium bg-red-50 px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToCart(item)}
                          disabled={!(item.quantity > 0 || item.inStock)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 sm:py-24"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <HeartIcon className="w-32 h-32 sm:w-40 sm:h-40 text-gray-300 mx-auto" strokeWidth={1.5} />
                  <motion.div
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <SparklesIcon className="w-12 h-12 text-pink-400" />
                  </motion.div>
                </div>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Your Wishlist is Empty
              </h2>
              <p className="text-base sm:text-lg text-gray-600 body-text mb-8 max-w-md mx-auto">
                Start adding products you love and save them for later!
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl"
                >
                  <HeartIconSolid className="w-5 h-5" />
                  Start Shopping
                  <SparklesIcon className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <HeartIconSolid className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Save Favorites</h3>
                  <p className="text-sm body-text">Keep track of products you love</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <ShoppingCartIcon className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Access</h3>
                  <p className="text-sm body-text">Add to cart anytime with one click</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <SparklesIcon className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Get Notified</h3>
                  <p className="text-sm body-text">Price drops & stock alerts</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{wishlistItems.length}</p>
                <p className="text-sm sm:text-base text-white/90">Saved Items</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">
                  ₹{wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm sm:text-base text-white/90">Total Value</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">
                  {wishlistItems.filter(item => item.quantity > 0 || item.inStock).length}
                </p>
                <p className="text-sm sm:text-base text-white/90">In Stock</p>
              </div>
              <div>
                <button
                  onClick={() => {
                    wishlistItems.forEach(item => {
                      if (item.quantity > 0 || item.inStock) {
                        moveToCart(item);
                      }
                    });
                  }}
                  className="w-full py-2 sm:py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm sm:text-base"
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
