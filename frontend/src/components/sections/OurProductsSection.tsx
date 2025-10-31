'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { adminApi } from '@/lib/api/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
  inStock?: boolean;
}

export default function OurProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await adminApi.getProducts({});
        const productsData = response.data?.products || response.data || [];
        // Show first 8 products (2 rows of 4)
        setProducts(Array.isArray(productsData) ? productsData.slice(0, 8) : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover our premium collection of authentic jaggery products, crafted with traditional expertise and modern quality standards.
          </p>
        </motion.div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/products/${product._id}`}>
                    <motion.div
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      {/* Product Image */}
                      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🍯
                          </div>
                        )}
                        {product.inStock === false && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          {product.category && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
                              {product.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105"
              >
                View All Products
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

