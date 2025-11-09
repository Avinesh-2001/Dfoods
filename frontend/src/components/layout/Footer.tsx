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
      className="border-t border-[#F97316]/50"
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.85) 0%, rgba(249, 115, 22, 0.9) 100%)',
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info with Logo */}
          <div className="space-y-4">
            <div className="mb-4">
              <img
                src="/images/Dfood_logo.png"
                alt="Dfoods"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base text-gray-900">Panchaganga Farm Solutions Pvt Ltd</p>
                  <p className="text-xs sm:text-sm text-black">
                    B-12, Part-2, MIDC, Waluj, UIT, 431136 Bhiwadi, India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                <a 
                  href="tel:+918010906093" 
                  className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors"
                >
                  +91 8010906093
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                <a 
                  href="mailto:care@dfoods.in" 
                  className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors"
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
              <Link href="/" className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors">
                About Us
              </Link>
              <Link href="/products" className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors">
                Products
              </Link>
              <Link href="/contact" className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors">
                Contact Us
              </Link>
              <Link href="/faq" className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors">
                FAQ
              </Link>
              <Link href="/rewards" className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors">
                Rewards
              </Link>
              <Link href="/account" className="text-xs sm:text-sm text-black hover:text-[#F97316] transition-colors">
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
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-sm"
              />
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white rounded-lg hover:from-[#F97316] hover:to-[#EA580C] transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg"
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
                {/* Facebook */}
                <motion.a
                  href="https://www.facebook.com/dfoods"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#F97316] transition-all shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                
                {/* Instagram */}
                <motion.a
                  href="https://www.instagram.com/dfoods"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#F97316] transition-all shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="url(#instagram-gradient-footer-2)" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="instagram-gradient-footer-2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: '#FD5949', stopOpacity: 1}} />
                        <stop offset="50%" style={{stopColor: '#D6249F', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#285AEB', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div 
        className="border-t border-[#F97316]/50"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(249, 115, 22, 0.95) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-xs sm:text-sm">
              <Link href="/privacy" className="text-black hover:text-[#F97316] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-black hover:text-[#F97316] transition-colors">
                Terms of Use
              </Link>
              <Link href="/shipping" className="text-black hover:text-[#F97316] transition-colors">
                Shipping & Return Policy
              </Link>
              <Link href="/disclaimer" className="text-black hover:text-[#F97316] transition-colors">
                Disclaimer
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-xs sm:text-sm space-y-1 text-gray-600">
              <p>Made with Dfoods</p>
              <p>Copyright © 2024 Dfoods. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
