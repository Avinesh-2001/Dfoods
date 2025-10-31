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

  // Generate random user avatars (in production, you'd use real user images)
  const getUserAvatar = (name: string) => {
    const colors = ['bg-green-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500'];
    const color = colors[name.length % colors.length];
    return (
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-orange-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Don't just take our word for it - hear from thousands of satisfied customers who love our authentic jaggery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {testimonials.slice(0, 3).map((testimonial, index) => {
            const isCenter = index === 1;
            
            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg p-6 flex flex-col h-full border-2 transition-all ${
                  isCenter 
                    ? 'scale-110 z-10 shadow-2xl border-transparent relative' 
                    : 'hover:shadow-xl border-transparent'
                }`}
                style={isCenter ? {
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
                } : {}}
                onMouseEnter={() => {}}
              >
                {isCenter && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 via-green-500 to-orange-400 opacity-75 -z-10 blur-sm"></div>
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
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-gray-700 mb-6 flex-grow text-center italic">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="border-t pt-4 text-center">
                    <h4 className="font-bold text-lg bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
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
          <div className="inline-flex items-center bg-white rounded-2xl px-8 py-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-orange-400 opacity-20"></div>
            <div className="relative z-10 flex items-center">
              <div className="flex items-center mr-6">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="text-3xl text-yellow-400">⭐</span>
                  ))}
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">4.8</span>
              </div>
              <div className="text-left border-l-2 border-gray-200 pl-6">
                <p className="text-sm text-gray-600">Based on</p>
                <p className="font-bold text-xl bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">500+ Reviews</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
