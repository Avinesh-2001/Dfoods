'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentPrice = product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : product.price;
  const inStock = product.quantity > 0 || product.status === 'in-stock' || product.inStock === true;

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  // Check if product is in wishlist on mount
  useEffect(() => {
    checkWishlistStatus();
  }, [product._id, product.id]);

  const checkWishlistStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
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
        const productId = product._id || product.id;
        const inWishlist = data.products?.some((p: any) => 
          (p._id || p.id) === productId
        );
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setIsLoading(true);
    const productId = product._id || product.id;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      if (isInWishlist) {
        // Remove from wishlist
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
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        }
      } else {
        // Add to wishlist
        const endpoint = API_BASE.includes('/api') 
          ? `${API_BASE}/wishlist/add`
          : `${API_BASE}/api/wishlist/add`;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });

        if (response.ok) {
          setIsInWishlist(true);
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={`bg-white overflow-hidden transition-all duration-300 outline outline-1 outline-gray-200 rounded-lg ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product._id || product.id}`}>
        {/* Product Image */}
        <div className="relative h-48 w-full bg-gray-50 overflow-hidden group">
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Wishlist Icon - Top Right */}
          <button
            onClick={toggleWishlist}
            disabled={isLoading}
            className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 disabled:opacity-50"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-700 hover:text-red-500" />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-3 space-y-1">
          {/* Category - Round Orange Badge */}
          {product.category && (
            <div className="flex justify-start">
              <span className="inline-block bg-[#F97316] text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                {product.category.replace(/-/g, ' ')}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline">
            <span className="text-sm font-semibold text-gray-900">₹{currentPrice}</span>
          </div>

          {/* In Stock Status */}
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
