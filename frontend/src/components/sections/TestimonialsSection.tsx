'use client';

import { motion } from 'framer-motion';
import Carousel from '@/components/ui/Carousel';
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

  return (
    <section className="py-16 bg-[#FDF6E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#8B4513] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from thousands of satisfied customers who love our authentic jaggery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Carousel itemsPerView={3} autoplay={true} autoplayDelay={6000}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4">
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(testimonial.rating)}
                    </div>
                    {testimonial.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-gray-700 mb-4 flex-grow">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[#8B4513]">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(testimonial.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Carousel>
        </motion.div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center bg-white rounded-lg px-6 py-4 shadow-lg">
            <div className="flex items-center mr-4">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">⭐</span>
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold text-[#8B4513]">4.8</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600">Based on</p>
              <p className="font-semibold text-[#8B4513]">500+ Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
