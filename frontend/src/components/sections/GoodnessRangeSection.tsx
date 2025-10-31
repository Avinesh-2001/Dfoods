'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
    name: "Plain Jaggery",
    href: "/products?category=plain-jaggery",
    image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=400&fit=crop&q=80",
    description: "Pure traditional jaggery"
  },
  {
    name: "Flavoured Jaggery",
    href: "/products?category=flavoured-jaggery",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80",
    description: "Aromatic flavored varieties"
  },
  {
    name: "Gud Combo",
    href: "/products?category=gud-combo",
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
          className="mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[#8B4513] mb-2">
            The Güdness Range
          </h2>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
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
              className="flex flex-col items-center w-full"
            >
              <Link href={category.href} className="group w-full flex flex-col items-center">
                {/* Circular Image - Fixed equal size */}
                <motion.div 
                  className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden shadow-lg mb-3 sm:mb-4 ring-2 ring-gray-100 group-hover:ring-4 group-hover:ring-amber-300 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 176px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
                
                {/* Category Label */}
                <h3 className="text-center text-[#8B4513] font-semibold text-xs sm:text-sm group-hover:text-amber-600 transition-colors w-full">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

