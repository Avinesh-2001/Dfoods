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
    <footer className="bg-[#8B4513] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F39C12]">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-[#F39C12] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Panchaganga Farm Solutions Pvt Ltd</p>
                  <p className="text-sm text-gray-300">
                    B-12, Part-2, MIDC, Waluj, UIT, 431136 Bhiwadi, India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-[#F39C12] flex-shrink-0" />
                <a 
                  href="tel:+918010906093" 
                  className="text-sm hover:text-[#F39C12] transition-colors"
                >
                  +91 8010906093
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-[#F39C12] flex-shrink-0" />
                <a 
                  href="mailto:care@dfoods.in" 
                  className="text-sm hover:text-[#F39C12] transition-colors"
                >
                  care@dfoods.in
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F39C12]">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/" className="text-sm hover:text-[#F39C12] transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm hover:text-[#F39C12] transition-colors">
                About Us
              </Link>
              <Link href="/products" className="text-sm hover:text-[#F39C12] transition-colors">
                Products
              </Link>
              <Link href="/contact" className="text-sm hover:text-[#F39C12] transition-colors">
                Contact Us
              </Link>
              <Link href="/rewards" className="text-sm hover:text-[#F39C12] transition-colors">
                Rewards
              </Link>
              <Link href="/account" className="text-sm hover:text-[#F39C12] transition-colors">
                My Account
              </Link>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F39C12]">
              Subscribe to our newsletter for all the new launches and offers!
            </h3>
            
            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-600 bg-[#8B4513] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent"
              />
              <motion.button
                className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#D35400] transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[#F39C12]">Follow us</h4>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F39C12] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm font-bold">f</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F39C12] transition-colors"
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
      <div className="border-t border-gray-600 bg-[#A0522D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-[#F39C12] transition-colors underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#F39C12] transition-colors underline">
                Terms of Use
              </Link>
              <Link href="/shipping" className="hover:text-[#F39C12] transition-colors underline">
                Shipping & Return Policy
              </Link>
              <Link href="/disclaimer" className="hover:text-[#F39C12] transition-colors underline">
                Disclaimer
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-sm space-y-1">
              <p>Made with ❤️ Dfoods</p>
              <p>Copyright © 2024 Dfoods. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
