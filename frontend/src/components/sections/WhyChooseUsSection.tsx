'use client';

import { motion } from 'framer-motion';
import FlipCard from '@/components/ui/FlipCard';

const whyChooseUsItems = [
  {
    title: "40+ Years Experience",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold">40+ Years</h3>
          <p className="text-sm">Experience</p>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">40+ Years Experience</h3>
          <p className="text-sm leading-relaxed">
            Four decades of expertise in traditional jaggery making, passed down through generations with unmatched quality and authenticity.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "100% Organic",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🌿</div>
          <h3 className="text-xl font-bold">100%</h3>
          <p className="text-sm">Organic</p>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">100% Organic</h3>
          <p className="text-sm leading-relaxed">
            Certified organic farming practices with no chemicals, pesticides, or artificial additives - pure nature in every bite.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "No Chemicals",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🚫</div>
          <h3 className="text-xl font-bold">No</h3>
          <p className="text-sm">Chemicals</p>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">No Chemicals</h3>
          <p className="text-sm leading-relaxed">
            Zero chemical processing, bleaching, or artificial enhancement. Only natural, traditional methods that preserve authentic taste.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Farm Fresh",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🚜</div>
          <h3 className="text-xl font-bold">Farm</h3>
          <p className="text-sm">Fresh</p>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">Farm Fresh</h3>
          <p className="text-sm leading-relaxed">
            Direct from our farms to your doorstep. Freshly harvested sugarcane processed within hours to ensure maximum freshness and nutrition.
          </p>
        </div>
      </div>
    )
  }
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Dfoods?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We stand out with our commitment to quality, tradition, and authenticity in every product we deliver.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUsItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FlipCard
                front={item.front}
                back={item.back}
                className="h-48"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
