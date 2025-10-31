'use client';

import { motion } from 'framer-motion';
import FlipCard from '@/components/ui/FlipCard';

const whatWeDoItems = [
  {
    title: "Organic Farming",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-bold">Organic Farming</h3>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">Organic Farming</h3>
          <p className="text-sm leading-relaxed">
            We use traditional farming methods without any chemical fertilizers or pesticides, ensuring pure and natural jaggery production.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Traditional Processing",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🔥</div>
          <h3 className="text-xl font-bold">Traditional Processing</h3>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">Traditional Processing</h3>
          <p className="text-sm leading-relaxed">
            Our 40+ years of experience in traditional jaggery making ensures authentic taste and quality that has been passed down through generations.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Quality Assurance",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold">Quality Assurance</h3>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">Quality Assurance</h3>
          <p className="text-sm leading-relaxed">
            Every batch undergoes rigorous quality testing to ensure purity, authenticity, and safety standards that exceed industry requirements.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Farm-to-Table",
    front: (
      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🚛</div>
          <h3 className="text-xl font-bold">Farm-to-Table</h3>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-3">Farm-to-Table</h3>
          <p className="text-sm leading-relaxed">
            Direct from our farms to your table, ensuring fresh jaggery with minimal processing and maximum nutritional value.
          </p>
        </div>
      </div>
    )
  }
];

export default function WhatWeDoSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-green-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent mb-4">
            What We Do
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our commitment to quality and tradition drives everything we do, from farming to your table.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatWeDoItems.map((item, index) => (
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
