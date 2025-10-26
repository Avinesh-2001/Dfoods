'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircleIcon, TruckIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-[#8B4513] mb-4"
          >
            Order Placed Successfully! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Thank you for your order! We've received your payment and your order is being processed. 
            You'll receive a confirmation email shortly with your order details.
          </motion.p>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">What happens next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-[#E67E22]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Confirmed</h3>
                  <p className="text-gray-600">Your order has been confirmed and payment processed successfully.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TruckIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Processing</h3>
                  <p className="text-gray-600">We're preparing your order for shipment. You'll receive updates via email.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TruckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shipped</h3>
                  <p className="text-gray-600">Your order is on its way! Track your package with the tracking number.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivered</h3>
                  <p className="text-gray-600">Your order has been delivered. Enjoy your premium jaggery!</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E67E22] text-white rounded-xl hover:bg-[#D35400] transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              <ShoppingBagIcon className="w-6 h-6 mr-3" />
              Continue Shopping
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#E67E22] text-[#E67E22] rounded-xl hover:bg-[#E67E22] hover:text-white transition-all font-semibold text-lg"
            >
              <HomeIcon className="w-6 h-6 mr-3" />
              Back to Home
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 bg-orange-50 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <h3 className="font-semibold text-[#8B4513] mb-3">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="text-[#E67E22] hover:text-[#D35400] font-medium"
              >
                Contact Support
              </Link>
              <span className="hidden sm:block text-gray-400">|</span>
              <Link
                href="/about"
                className="text-[#E67E22] hover:text-[#D35400] font-medium"
              >
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
