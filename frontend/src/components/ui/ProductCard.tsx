'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useWishlistStore } from '@/lib/store/wishlistStore';

interface ProductCardProps {
  product: any;
  className?: string;
}

const THEME_ORANGE = '#E67E22';
const THEME_BADGE_BG = '#FCE8D8';

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const productId = product._id || product.id;
  const [isProcessing, setIsProcessing] = useState(false);

  const isInWishlist = useWishlistStore((state) =>
    state.items.some((item) => (item._id || item.id) === productId)
  );
  const initialized = useWishlistStore((state) => state.initialized);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);

  useEffect(() => {
    if (!initialized) {
      fetchWishlist();
    }
  }, [initialized, fetchWishlist]);

  const currentPrice = product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : product.price;
  const inStock = product.quantity > 0 || product.status === 'in-stock' || product.inStock === true;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    const success = isInWishlist
      ? await removeFromWishlist(productId)
      : await addToWishlist(productId);

    setIsProcessing(false);

    if (success) {
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } else {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <motion.div
      className={`bg-white overflow-hidden transition-all duration-300 outline outline-1 outline-gray-200 rounded-lg ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product._id || product.id}`}>
        <div className="relative h-48 w-full bg-gray-50 overflow-hidden group">
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          <button
            onClick={toggleWishlist}
            disabled={isProcessing}
            className={`absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 disabled:opacity-50 hover:scale-[1.08] ${isProcessing ? 'cursor-wait' : 'hover:bg-white'} group/button`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? (
              <HeartIconSolid className="w-5 h-5 text-[#E67E22]" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-400 transition-colors group-hover/button:text-[#E67E22]" />
            )}
          </button>
        </div>

        <div className="p-3 space-y-1">
          {product.category && (
            <div className="flex justify-start">
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: THEME_BADGE_BG, color: THEME_ORANGE }}
              >
                {product.category.replace(/-/g, ' ')}
              </span>
            </div>
          )}

          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-baseline">
            <span className="text-sm font-semibold" style={{ color: THEME_ORANGE }}>₹{currentPrice}</span>
          </div>

          <div className="pt-0.5">
            {inStock ? (
              <span className="text-[10px] text-green-700 font-medium">
                In Stock
              </span>
            ) : (
              <span className="text-[10px] text-red-700 font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
