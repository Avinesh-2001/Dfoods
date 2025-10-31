'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: any;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const currentPrice = product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : product.price;
  const inStock = product.quantity > 0 || product.status === 'in-stock' || product.inStock === true;

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className={`bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product._id || product.id}`}>
        {/* Product Image */}
        <div className="relative h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group">
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold shadow-lg">
              {discountPercent}% OFF
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <span className="text-white font-bold text-sm px-3 py-1.5 bg-gray-900">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white">
          {/* Category */}
          {product.category && (
            <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider block mb-2">
              {product.category.replace(/-/g, ' ')}
            </span>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base hover:text-amber-600 transition-colors">
            {product.name}
          </h3>

          {/* Price and Stock Status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">₹{currentPrice}</span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* In Stock Badge */}
          <div className="flex items-center gap-2 mt-2">
            {inStock ? (
              <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1">
                ✓ In Stock
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1">
                ✗ Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
