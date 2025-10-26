'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const inStock = product.quantity > 0 || product.status === 'in-stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) {
      toast.error('Product is out of stock');
      return;
    }

    addItem({
      id: product._id || product.id,
      name: product.name,
      price: currentPrice,
      quantity: 1,
      variant: selectedVariant?.size || '',
      image: product.images?.[0] || ''
    });
    
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      duration: 2000
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
      duration: 2000
    });
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 ${className}`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product._id || product.id}`}>
        {/* Product Image */}
        <div className="relative h-56 w-full bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden group">
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercent > 0 && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {discountPercent}% OFF
              </div>
            )}
            {product.tags && product.tags.includes('Organic') && (
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                🌿 Organic
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
          >
            {isWishlisted ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg px-4 py-2 bg-gray-800 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category Badge */}
          {product.category && (
            <span className="text-xs text-[#E67E22] font-semibold uppercase tracking-wide">
              {product.category.replace(/-/g, ' ')}
            </span>
          )}

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg mt-1 hover:text-[#E67E22] transition-colors">
            {product.name}
          </h3>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Variants */}
          {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2 font-semibold">Available Sizes:</p>
              <div className="grid grid-cols-3 gap-2">
                {product.variants.slice(0, 3).map((variant: any, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(variant);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-md border-2 transition-all text-center ${
                      selectedVariant?.size === variant.size
                        ? 'border-[#E67E22] bg-[#E67E22] text-white'
                        : 'border-[#E67E22] bg-white text-[#E67E22] hover:bg-orange-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{variant.size || 'N/A'}</div>
                    <div className="text-[10px]">₹{variant.price || 0}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-[#E67E22]">₹{currentPrice}</span>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
              inStock
                ? 'bg-[#E67E22] text-white hover:bg-[#D35400] shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            whileTap={inStock ? { scale: 0.95 } : {}}
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}
