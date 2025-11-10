'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { testimonials } from '@/lib/data/testimonials';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [expandedCards, setExpandedCards] = useState<number[]>([0, 1, 2]);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev >= testimonials.length - 1 ? 0 : prev + 1;
      setExpandedCards([next, (next + 1) % testimonials.length, (next + 2) % testimonials.length]);
      return next;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev <= 0 ? testimonials.length - 1 : prev - 1;
      setExpandedCards([next, (next + 1) % testimonials.length, (next + 2) % testimonials.length]);
      return next;
    });
  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 2500); // Changed to 2.5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ));
  };

  const getUserAvatar = (name: string) => {
    const colors = ['bg-gradient-to-br from-amber-600 to-orange-600', 'bg-gradient-to-br from-orange-600 to-red-600', 'bg-gradient-to-br from-amber-700 to-orange-700'];
    const color = colors[name.length % colors.length];
    return (
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-amber-200`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-600 mt-2">Real experiences from our valued customers</p>
        </motion.div>

        {/* Mobile: Improved Swiper with smooth sliding */}
        <div className="block md:hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            effect="slide"
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="testimonials-mobile-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-lg px-5 py-6 text-center border border-amber-100 min-h-[240px] max-h-[280px] flex flex-col justify-between"
                >
                  <div className="flex justify-center gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow overflow-hidden line-clamp-4">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    {getUserAvatar(testimonial.name)}
                    <div className="text-xs font-semibold tracking-wide text-gray-900 uppercase">{testimonial.name}</div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop: Enhanced sliding with collapsible cards */}
        <div
          className="hidden md:block relative px-16"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full p-3 shadow-xl hover:shadow-2xl z-20 transition-all"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full p-3 shadow-xl hover:shadow-2xl z-20 transition-all"
            aria-label="Next"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </motion.button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="wait">
              {Array.from({ length: 3 }).map((_, idx) => {
                const testimonialIndex = (currentIndex + idx) % testimonials.length;
                const t = testimonials[testimonialIndex];
                const isExpanded = expandedCards.includes(testimonialIndex);
                
                return (
                  <motion.div
                    key={`${currentIndex}-${idx}`}
                    initial={{ opacity: 0, x: 100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100, scale: 0.8 }}
                    transition={{ 
                      duration: 0.6,
                      delay: idx * 0.1,
                      ease: "easeInOut"
                    }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl px-6 py-5 text-center border border-amber-100 transition-all duration-500"
                  >
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-3">
                      {renderStars(t.rating)}
                    </div>
                    
                    {/* Quote with collapse/expand */}
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96' : 'max-h-20'}`}>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        "{t.comment}"
                      </p>
                    </div>
                    
                    {/* Expand/Collapse Button */}
                    {t.comment.length > 100 && (
                      <button
                        onClick={() => toggleCard(testimonialIndex)}
                        className="flex items-center justify-center mx-auto mb-3 text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUpIcon className="w-5 h-5" />
                            <span className="text-xs ml-1">Show less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="w-5 h-5" />
                            <span className="text-xs ml-1">Read more</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-2">
                      {getUserAvatar(t.name)}
                      <div className="text-xs font-semibold tracking-wide text-gray-900 uppercase">{t.name}</div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setExpandedCards([idx, (idx + 1) % testimonials.length, (idx + 2) % testimonials.length]);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-amber-600 to-orange-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .testimonials-mobile-swiper {
          padding: 10px 15px 50px !important;
        }

        .testimonials-mobile-swiper .swiper-button-next,
        .testimonials-mobile-swiper .swiper-button-prev {
          color: white;
          background: linear-gradient(to right, #D97706, #EA580C);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4);
          transition: all 0.3s ease;
        }

        .testimonials-mobile-swiper .swiper-button-next:hover,
        .testimonials-mobile-swiper .swiper-button-prev:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.6);
        }

        .testimonials-mobile-swiper .swiper-button-next:after,
        .testimonials-mobile-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }

        .testimonials-mobile-swiper .swiper-pagination-bullet {
          background: #D97706;
          opacity: 0.3;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }

        .testimonials-mobile-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: linear-gradient(to right, #D97706, #EA580C);
          width: 20px;
          border-radius: 10px;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
