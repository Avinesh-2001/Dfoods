'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const heroGifs = [
  'https://media.giphy.com/media/3o7TKsQ8X9I9KgDLI4/giphy.gif',
  'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
  'https://media.giphy.com/media/xT9IgN8YKRhByXzgfO/giphy.gif',
  'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',
  'https://media.giphy.com/media/l0MYGxr9vQtKcIc2s/giphy.gif',
  'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
];

export default function HeroSection() {
  const [currentGif, setCurrentGif] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % heroGifs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Full Width Background GIF */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          key={currentGif}
          src={heroGifs[currentGif]}
          alt="Premium Jaggery"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
        />
        {/* Elegant overlay - premium sophisticated look */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-800/60 to-gray-900/70"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Shop Now Button - Bottom Right */}
      <div className="relative h-full flex items-end justify-end p-4 sm:p-6 md:p-8 lg:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold text-base sm:text-lg rounded-full shadow-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 backdrop-blur-sm border-2 border-white/50"
          >
            Shop Now
            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
