'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const categories = [
  {
    name: "Shop All",
    href: "/products",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
    description: "Browse all our premium jaggery products"
  },
  {
    name: "Jaggery Cubes",
    href: "/products?category=jaggery-cubes",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80",
    description: "Perfect bite-sized cubes"
  },
  {
    name: "Jaggery Powder",
    href: "/products?category=jaggery-powder",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80",
    description: "Finely ground powder"
  },
  {
    name: "Flavoured Jaggery",
    href: "/products?category=flavoured-jaggery",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80",
    description: "Aromatic flavored varieties"
  },
  {
    name: "Jaggery Combo",
    href: "/products?category=jaggery-combo",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80",
    description: "Complete collection packs"
  }
];

export default function GoodnessRangeSection() {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-black mb-2">
            The Güdness Range
          </h2>
        </motion.div>

        {/* Mobile Swiper */}
        <div className="block md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={2.5}
            centeredSlides={false}
            loop={false}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 2.2,
                spaceBetween: 15,
              },
              480: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
            }}
            className="goodness-swiper pb-10"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.name}>
                <Link href={category.href} className="group flex flex-col items-center">
                  <motion.div 
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg mb-3 ring-2 ring-gray-100 group-hover:ring-4 group-hover:ring-amber-300 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                  
                  <h3 className="text-center text-black font-semibold text-xs group-hover:text-[#F59E0B] transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center"
            >
              <Link href={category.href} className="group flex flex-col items-center">
                <motion.div 
                  className="relative w-36 h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg mb-4 ring-2 ring-gray-100 group-hover:ring-4 group-hover:ring-amber-300 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
                
                <h3 className="text-center text-black font-semibold text-sm group-hover:text-[#F59E0B] transition-colors">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .goodness-swiper .swiper-pagination-bullet {
          background: #F97316;
          opacity: 0.4;
        }
        .goodness-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #F97316;
        }
      `}</style>
    </section>
  );
}
