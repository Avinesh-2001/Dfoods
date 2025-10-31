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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            What We Do
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-4">
            Our commitment to quality and tradition drives everything we do, from farming to your table.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {whatWeDoItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                {/* Semi-circular Arc */}
                <div className="relative w-full mb-6 flex items-start justify-center">
                  <div 
                    className={`w-28 h-14 bg-gradient-to-r ${item.arcColor} rounded-t-full`}
                  ></div>
                </div>

                {/* Icon */}
                <div className="mb-3 sm:mb-4 flex items-center justify-center">
                  <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6 flex-grow">
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
