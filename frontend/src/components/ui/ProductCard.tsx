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
      className={`bg-white overflow-hidden transition-all duration-300 outline outline-1 outline-gray-200 rounded-lg ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product._id || product.id}`}>
        {/* Product Image */}
        <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
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
