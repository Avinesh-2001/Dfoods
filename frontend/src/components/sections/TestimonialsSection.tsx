'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { testimonials } from '@/lib/data/testimonials';

export default function TestimonialsSection() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ));
  };

  const getUserAvatar = (name: string) => {
    const colors = ['bg-gray-700', 'bg-gray-800', 'bg-gray-900', 'bg-amber-700', 'bg-amber-800'];
    const color = colors[name.length % colors.length];
    return (
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg ring-2 ring-gray-200`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">Real stories from happy customers</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-gray-100 min-h-[320px] sm:min-h-[350px] flex flex-col justify-between"
                >
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-4">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 flex-grow">
                    "{testimonial.comment}"
                  </p>

                  {/* User Info */}
                  <div className="flex flex-col items-center gap-4">
                    {getUserAvatar(testimonial.name)}
                    <div>
                      <div className="text-lg font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">Verified Customer</div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .testimonials-swiper {
          padding: 20px 50px 60px !important;
        }

        .testimonials-swiper .swiper-button-next,
        .testimonials-swiper .swiper-button-prev {
          color: #F97316;
          background: white;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .testimonials-swiper .swiper-button-next:after,
        .testimonials-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }

        .testimonials-swiper .swiper-button-next:hover,
        .testimonials-swiper .swiper-button-prev:hover {
          background: #F97316;
          color: white;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          background: #F97316;
          opacity: 0.3;
          width: 10px;
          height: 10px;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #F97316;
        }

        @media (max-width: 768px) {
          .testimonials-swiper {
            padding: 10px 15px 50px !important;
          }

          .testimonials-swiper .swiper-button-next,
          .testimonials-swiper .swiper-button-prev {
            width: 35px;
            height: 35px;
          }

          .testimonials-swiper .swiper-button-next:after,
          .testimonials-swiper .swiper-button-prev:after {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}
