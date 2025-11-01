'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  {
    name: "Plain Jaggery",
    href: "/products?category=plain-jaggery",
    image: "🍯",
    description: "Pure traditional jaggery"
  },
  {
    name: "Jaggery Powder",
    href: "/products?category=jaggery-powder", 
    image: "🥄",
    description: "Finely ground powder"
  },
  {
    name: "Jaggery Cubes",
    href: "/products?category=jaggery-cubes",
    image: "🧊",
    description: "Perfect bite-sized cubes"
  },
  {
    name: "Flavoured Jaggery",
    href: "/products?category=flavoured-jaggery",
    image: "🌿",
    description: "Aromatic flavored varieties"
  },
  {
    name: "Gud Combo",
    href: "/products?category=gud-combo",
    image: "🎁",
    description: "Complete collection packs"
  },
  {
    name: "Shop All",
    href: "/products",
    image: "🛍️",
    description: "Browse all products"
  }
];

export default function CategoryGrid() {
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
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F97316] mb-4">
            Our Product Range
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide variety of premium organic jaggery products, each crafted with traditional methods and modern quality standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.href}>
                <motion.div
                  className="group bg-white rounded-full w-32 h-32 mx-auto shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.image}
                  </div>
                  <h3 className="text-sm font-semibold text-[#F97316] text-center leading-tight">
                    {category.name}
                  </h3>
                </motion.div>
              </Link>
              <p className="text-xs text-gray-500 text-center mt-2 max-w-24 mx-auto">
                {category.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white rounded-lg hover:from-[#F97316] hover:to-[#EA580C] transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
