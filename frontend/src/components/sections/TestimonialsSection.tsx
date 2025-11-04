'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { testimonials } from '@/lib/data/testimonials';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= testimonials.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return testimonials.length - 1;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= testimonials.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ));
  };

  // Generate elegant user avatars with premium colors
  const getUserAvatar = (name: string) => {
    const colors = ['bg-gray-700', 'bg-gray-800', 'bg-gray-900', 'bg-amber-700', 'bg-amber-800'];
    const color = colors[name.length % colors.length];
    return (
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-gray-200`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">What Our Customers Say</h2>
        </motion.div>

        {/* 3-card layout like reference */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <button
            onClick={prevSlide}
            className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow-md border border-gray-200"
            aria-label="Prev"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow-md border border-gray-200"
            aria-label="Next"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, idx) => {
              const t = testimonials[(currentIndex + idx) % testimonials.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-md px-6 py-8 text-center border border-gray-100"
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-4">
                    {renderStars(t.rating)}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">{t.comment}</p>
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3">
                    {getUserAvatar(t.name)}
                    <div className="text-xs font-semibold tracking-wide text-gray-900 uppercase">{t.name}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
