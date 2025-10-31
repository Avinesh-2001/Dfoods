'use client';

import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  FireIcon, 
  ShieldCheckIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline';

const whatWeDoItems = [
  {
    title: "Organic Farming",
    icon: SparklesIcon,
    description: "We use traditional farming methods without any chemical fertilizers or pesticides, ensuring pure and natural jaggery production with authentic taste and maximum nutritional value.",
    arcColor: "from-orange-400 via-orange-500 to-orange-600",
    lineColor: "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
  },
  {
    title: "Traditional Processing",
    icon: FireIcon,
    description: "Our 40+ years of experience in traditional jaggery making ensures authentic taste and quality that has been passed down through generations using time-tested methods.",
    arcColor: "from-orange-600 via-orange-700 to-orange-800",
    lineColor: "bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800"
  },
  {
    title: "Quality Assurance",
    icon: ShieldCheckIcon,
    description: "Every batch undergoes rigorous quality testing to ensure purity, authenticity, and safety standards that exceed industry requirements for your complete satisfaction.",
    arcColor: "from-orange-400 via-orange-500 to-orange-600",
    lineColor: "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
  },
  {
    title: "Farm-to-Table",
    icon: TruckIcon,
    description: "Direct from our farms to your table, ensuring fresh jaggery with minimal processing and maximum nutritional value, delivered with care and dedication.",
    arcColor: "from-orange-600 via-orange-700 to-orange-800",
    lineColor: "bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800"
  }
];

export default function WhatWeDoSection() {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2 sm:mb-3">
            What We Do
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto px-4">
            Our commitment to quality and tradition drives everything we do, from farming to your table.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {whatWeDoItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex flex-col items-center text-center"
              >
                {/* Semi-circular Arc */}
                <motion.div 
                  className="relative w-full mb-5 sm:mb-6 flex items-start justify-center"
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className={`w-28 h-14 bg-gradient-to-r ${item.arcColor} rounded-t-full`}
                  ></div>
                </motion.div>

                {/* Icon */}
                <motion.div 
                  className="mb-3 sm:mb-4 flex items-center justify-center"
                  initial={{ opacity: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                >
                  <IconComponent className="w-9 h-9 sm:w-11 sm:h-11 text-gray-900" />
                </motion.div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed mb-4 sm:mb-6 flex-grow">
                  {item.description}
                </p>

                {/* Bottom Line */}
                <div className={`w-full h-1 ${item.lineColor} rounded-full mt-auto`}></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
