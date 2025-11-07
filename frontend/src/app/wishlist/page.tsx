'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, TrashIcon, ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';

const THEME_ORANGE = '#E67E22';
const THEME_BADGE_BG = '#FCE8D8';

export default function WishlistPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const { addItem } = useCartStore();

  const {
    items: wishlistItems,
    loading,
    initialized,
    fetchWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlistStore((state) => ({
    items: state.items,
    loading: state.loading,
    initialized: state.initialized,
    fetchWishlist: state.fetchWishlist,
    removeFromWishlist: state.removeFromWishlist,
    clearWishlist: state.clearWishlist,
  }));

  useEffect(() => {
    if (!user) {
      clearWishlist();
      router.push('/login');
      return;
    }
    if (!initialized) {
      fetchWishlist();
    }
  }, [user, initialized, fetchWishlist, clearWishlist, router]);

  const moveToCart = async (product: any) => {
    const productId = product._id || product.id;
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: 1,
    });

    const success = await removeFromWishlist(productId);
    if (success) {
      toast.success('Moved to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: THEME_BADGE_BG }}>
              <HeartIcon className="w-5 h-5" style={{ color: THEME_ORANGE }} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Wishlist</h1>
              <p className="text-sm text-gray-500">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item saved' : 'items saved'}
              </p>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                wishlistItems.forEach((item) => {
                  if (item.quantity > 0 || item.inStock) {
                    moveToCart(item);
                  }
                });
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white"
              style={{ backgroundColor: THEME_ORANGE }}
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Add all to cart
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <Link href={`/products/${item._id || item.id}`} className="block relative h-44 bg-gray-50">
                    {item.images?.[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item._id || item.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-[#FEE2D5] transition-colors"
                      title="Remove"
                    >
                      <TrashIcon className="w-4 h-4" style={{ color: THEME_ORANGE }} />
                    </button>
                  </Link>

                  <div className="p-4 space-y-3">
                    <Link href={`/products/${item._id || item.id}`}>
                      {item.category && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mb-2"
                          style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}
                        >
                          {item.category.replace(/-/g, ' ')}
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold" style={{ color: THEME_ORANGE }}>
                        ₹{item.price?.toLocaleString()}
                      </p>
                      <span className={`${item.quantity > 0 || item.inStock ? 'text-green-600' : 'text-red-600'} text-xs font-medium`}>
                        {item.quantity > 0 || item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => moveToCart(item)}
                      disabled={!(item.quantity > 0 || item.inStock)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      style={{ backgroundColor: THEME_ORANGE }}
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: THEME_BADGE_BG }}>
                <HeartIcon className="w-8 h-8" style={{ color: THEME_ORANGE }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 text-sm mb-6">Tap the heart on products you love to save them here.</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: THEME_ORANGE }}
              >
                Browse products
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
