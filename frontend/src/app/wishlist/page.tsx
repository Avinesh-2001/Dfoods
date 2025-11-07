'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, TrashIcon, ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 body-text">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <HeartIconSolid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-sm body-text">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                wishlistItems.forEach(item => {
                  if (item.quantity > 0 || item.inStock) {
                    moveToCart(item);
                  }
                });
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Add All to Cart
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <Link href={`/products/${item._id || item.id}`} className="block relative h-48 bg-gradient-to-br from-amber-50 to-orange-50">
                    {item.images?.[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                    
                    {/* Remove Button - Small & Clean */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item._id || item.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-red-500 hover:text-white transition-all"
                      title="Remove"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </Link>

                  {/* Compact Product Info */}
                  <div className="p-4">
                    <Link href={`/products/${item._id || item.id}`}>
                      {/* Category Badge */}
                      {item.category && (
                        <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-full mb-2">
                          {item.category.replace(/-/g, ' ')}
                        </span>
                      )}

                      {/* Product Name - Compact */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-10">
                        {item.name}
                      </h3>

                      {/* Price - Compact */}
                      <p className="text-lg font-bold text-amber-600 mb-3 price-text">
                        ₹{item.price?.toLocaleString()}
                      </p>
                    </Link>

                    {/* Action Button - Compact */}
                    <button
                      onClick={() => moveToCart(item)}
                      disabled={!(item.quantity > 0 || item.inStock)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 max-w-lg mx-auto"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-16 h-16 text-amber-600" strokeWidth={1.5} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 body-text mb-8">
                Save your favorite products by clicking the heart icon
              </p>
              
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Browse Products
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
