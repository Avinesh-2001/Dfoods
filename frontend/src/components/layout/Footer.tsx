'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer 
      className="border-t border-amber-500/50"
      style={{
        background: 'radial-gradient(ellipse at center top, rgba(251, 191, 36, 0.28) 0%, rgba(234, 179, 8, 0.33) 40%, rgba(217, 119, 6, 0.38) 80%, rgba(194, 120, 3, 0.33) 100%)',
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base text-gray-900">Panchaganga Farm Solutions Pvt Ltd</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    B-12, Part-2, MIDC, Waluj, UIT, 431136 Bhiwadi, India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <a 
                  href="tel:+918010906093" 
                  className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors"
                >
                  +91 8010906093
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <a 
                  href="mailto:care@dfoods.in" 
                  className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors"
                >
                  care@dfoods.in
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/" className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors">
                About Us
              </Link>
              <Link href="/products" className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors">
                Products
              </Link>
              <Link href="/contact" className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors">
                Contact Us
              </Link>
              <Link href="/rewards" className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors">
                Rewards
              </Link>
              <Link href="/account" className="text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors">
                My Account
              </Link>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Subscribe to our newsletter
            </h3>
            
            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Follow us</h4>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm font-bold">f</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm font-bold">ig</span>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div 
        className="border-t border-amber-600/50"
        style={{
          background: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.3) 0%, rgba(217, 119, 6, 0.35) 50%, rgba(194, 120, 3, 0.3) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-xs sm:text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-amber-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-amber-600 transition-colors">
                Terms of Use
              </Link>
              <Link href="/shipping" className="text-gray-600 hover:text-amber-600 transition-colors">
                Shipping & Return Policy
              </Link>
              <Link href="/disclaimer" className="text-gray-600 hover:text-amber-600 transition-colors">
                Disclaimer
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-xs sm:text-sm space-y-1 text-gray-600">
              <p>Made with ❤️ Dfoods</p>
              <p>Copyright © 2024 Dfoods. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
