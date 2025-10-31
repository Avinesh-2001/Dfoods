'use client';

import { motion } from 'framer-motion';
import { testimonials } from '@/lib/data/testimonials';

export default function TestimonialsSection() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ⭐
      </span>
    ));
  };

  // Generate elegant user avatars with premium colors
  const getUserAvatar = (name: string) => {
    const colors = ['bg-gray-700', 'bg-gray-800', 'bg-gray-900', 'bg-amber-700', 'bg-amber-800'];
    const color = colors[name.length % colors.length];
    return (
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-gray-200`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2 sm:mb-3">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto px-4">
            Don't just take our word for it - hear from thousands of satisfied customers who love our authentic jaggery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {testimonials.slice(0, 3).map((testimonial, index) => {
            const isCenter = index === 1;
            
            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg p-6 flex flex-col h-full transition-all ${
                  isCenter 
                    ? 'scale-110 z-10 shadow-2xl border-2 border-gray-300 relative' 
                    : 'hover:shadow-xl border-2 border-transparent'
                }`}
                style={isCenter ? {
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.5) 100%)',
                } : {}}
              >
                {isCenter && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 opacity-60 -z-10 blur-sm"></div>
                )}
                <div className={isCenter ? 'relative z-10' : ''}>
                  {/* User Avatar */}
                  <div className="flex justify-center mb-4">
                    {getUserAvatar(testimonial.name)}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(testimonial.rating)}
                    </div>
                    {testimonial.verified && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-semibold">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-gray-700 mb-4 sm:mb-6 flex-grow text-center italic text-sm sm:text-base">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="border-t pt-3 sm:pt-4 text-center">
                    <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(testimonial.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center bg-white rounded-2xl px-6 sm:px-8 py-5 sm:py-6 shadow-xl border-2 border-gray-200">
            <div className="flex items-center mb-4 sm:mb-0 sm:mr-6">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="text-2xl sm:text-3xl text-yellow-400">⭐</span>
                ))}
              </div>
              <span className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold text-gray-900">4.8</span>
            </div>
            <div className="text-center sm:text-left sm:border-l-2 sm:border-gray-300 sm:pl-6">
              <p className="text-xs sm:text-sm text-gray-600">Based on</p>
              <p className="font-bold text-lg sm:text-xl text-gray-900">500+ Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
