'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ui/ProductCard';

export default function WishlistPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // Fetch wishlist items
      const fetchWishlist = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/wishlist', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setWishlistItems(data.items || []);
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchWishlist();
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <HeartIcon className="w-8 h-8 text-[#F97316] mr-3" />
            My Wishlist
          </h1>
          <p className="text-gray-600">Your saved favorite products</p>
        </motion.div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love!</p>
            <motion.a
              href="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white rounded-lg hover:from-[#F97316] hover:to-[#EA580C] transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Products
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

