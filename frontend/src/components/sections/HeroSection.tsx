'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[600px] lg:h-[700px] overflow-hidden">
      {/* Full Width Background Video/Image */}
      <div className="absolute inset-0 w-full h-full">
        {/* You can replace this with a video tag if you have a video */}
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          {/* Overlay gradient for premium look */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-orange-600/60 to-green-800/70"></div>
        </div>
        
        {/* Alternative: Uncomment below if you want to use a video instead */}
        {/* 
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 via-orange-600/50 to-green-800/60"></div>
        */}
      </div>

      {/* Shop Now Button - Bottom Right */}
      <div className="relative h-full flex items-end justify-end p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-orange-500 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 backdrop-blur-sm border-2 border-white/30"
          >
            Shop Now
            <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
