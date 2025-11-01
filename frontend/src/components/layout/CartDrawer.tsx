'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/lib/store/cartStore';
import Link from 'next/link';

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice,
    getTotalItems,
    clearCart 
  } = useCartStore();

  const handleQuantityChange = (id: string, newQuantity: number, variant?: string) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity, variant);
  };

  const handleRemoveItem = (id: string, variant?: string) => {
    removeItem(id, variant);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[1001]"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[1002] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#F59E0B]/10 to-[#F97316]/10">
              <div>
                <h2 className="text-2xl font-bold text-[#F97316]">Shopping Cart</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#F59E0B]/20 to-[#F97316]/20 rounded-full flex items-center justify-center">
                    <ShoppingBagIcon className="w-16 h-16 text-[#F97316]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-8">Add some delicious products to get started!</p>
                  <Link
                    href="/products"
                    onClick={toggleCart}
                    className="inline-block bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.variant}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-[#F97316] transition-colors bg-white shadow-sm"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-[#F59E0B]/10 to-[#F97316]/10 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍯
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mb-1">
                            Size: <span className="font-medium text-[#F97316]">{item.variant}</span>
                          </p>
                        )}
                        <p className="text-sm font-bold text-[#F97316]">
                          ₹{item.price ? item.price.toLocaleString() : 0}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.variant)}
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.variant)}
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          ₹{(item.price && item.quantity ? (item.price * item.quantity).toLocaleString() : 0)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id, item.variant)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t-2 border-gray-200 p-6 space-y-4 bg-gradient-to-br from-[#F59E0B]/10 to-[#F97316]/10">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Delivery:</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-bold pt-3 border-t-2 border-gray-300">
                  <span className="text-[#F97316]">Total:</span>
                  <span className="text-[#F97316]">₹{getTotalPrice().toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="block w-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white text-center py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={toggleCart}
                  className="w-full text-sm text-gray-600 hover:text-[#F97316] transition-colors font-medium"
                >
                  Continue Shopping
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
