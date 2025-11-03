'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { testimonials } from '@/lib/data/testimonials';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Create infinite loop by duplicating testimonials
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

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

  // Get visible testimonials (3 at a time: left, center, right)
  const getVisibleTestimonials = () => {
    const indices = [
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1,
      currentIndex,
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1,
    ];
    return indices.map(idx => testimonials[idx]);
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2 sm:mb-3">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto px-4">
            Don't just take our word for it - hear from thousands of satisfied customers who love our authentic jaggery.
          </p>
        </motion.div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative max-w-[90rem] mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all z-20 border border-gray-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all z-20 border border-gray-200"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Carousel Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start px-8 sm:px-12">
              <AnimatePresence mode="wait">
                {visibleTestimonials.map((testimonial, displayIndex) => {
                  const isCenter = displayIndex === 1;
                  
                  return (
                    <motion.div
                      key={`${testimonial.id}-${currentIndex}-${displayIndex}`}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        scale: isCenter ? 1.05 : 1,
                        y: 0
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className={`bg-white rounded-lg shadow-lg p-3 sm:p-4 flex flex-col transition-all ${
                        isCenter 
                          ? 'scale-105 z-10 shadow-2xl border-2 border-gray-300 relative' 
                          : 'hover:shadow-xl border-2 border-transparent opacity-90'
                      }`}
                      style={isCenter ? {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.5) 100%)',
                      } : {}}
                    >
                      {isCenter && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 opacity-60 -z-10 blur-sm"></div>
                      )}
                      <div className={isCenter ? 'relative z-10' : ''}>
                        <div className="flex items-start gap-3 mb-2">
                          {/* User Avatar */}
                          <div className="flex-shrink-0">
                            {getUserAvatar(testimonial.name)}
                          </div>

                          {/* Rating and Name */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-0.5">
                                {renderStars(testimonial.rating)}
                              </div>
                              {testimonial.verified && (
                                <svg className="w-4 h-4 text-green-600 fill-green-600" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              )}
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-gray-900 mb-0.5">
                              {testimonial.name}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              {new Date(testimonial.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Comment */}
                        <blockquote className="text-gray-700 text-left italic text-xs sm:text-sm leading-relaxed line-clamp-3">
                          "{testimonial.comment}"
                        </blockquote>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-10"
        >
          <div className="inline-flex flex-col sm:flex-row items-center bg-white rounded-xl px-5 sm:px-6 py-4 sm:py-5 shadow-xl border-2 border-gray-200">
            <div className="flex items-center mb-3 sm:mb-0 sm:mr-5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-gray-900">4.8</span>
            </div>
            <div className="text-center sm:text-left sm:border-l-2 sm:border-gray-300 sm:pl-5">
              <p className="text-[10px] sm:text-xs text-gray-600">Based on</p>
              <p className="font-bold text-base sm:text-lg text-gray-900">500+ Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
