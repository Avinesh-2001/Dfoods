'use client';

import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  SparklesIcon, 
  ShieldCheckIcon, 
  TruckIcon 
} from '@heroicons/react/24/solid';

const whyChooseUsItems = [
  {
    title: "40+ Years Experience",
    icon: TrophyIcon,
    description: "Four decades of expertise in traditional jaggery making, passed down through generations with unmatched quality and authenticity.",
    gradient: "from-amber-400 via-orange-500 to-amber-600",
    bgGradient: "from-amber-50 via-orange-50 to-amber-50",
    number: "40+",
    unit: "Years"
  },
  {
    title: "100% Organic",
    icon: SparklesIcon,
    description: "Certified organic farming practices with no chemicals, pesticides, or artificial additives - pure nature in every bite.",
    gradient: "from-green-400 via-emerald-500 to-green-600",
    bgGradient: "from-green-50 via-emerald-50 to-green-50",
    number: "100%",
    unit: "Organic"
  },
  {
    title: "No Chemicals",
    icon: ShieldCheckIcon,
    description: "Zero chemical processing, bleaching, or artificial enhancement. Only natural, traditional methods that preserve authentic taste.",
    gradient: "from-blue-400 via-cyan-500 to-blue-600",
    bgGradient: "from-blue-50 via-cyan-50 to-blue-50",
    number: "0",
    unit: "Chemicals"
  },
  {
    title: "Farm Fresh",
    icon: TruckIcon,
    description: "Direct from our farms to your doorstep. Freshly harvested sugarcane processed within hours to ensure maximum freshness and nutrition.",
    gradient: "from-orange-400 via-red-500 to-orange-600",
    bgGradient: "from-orange-50 via-red-50 to-orange-50",
    number: "24hr",
    unit: "Delivery"
  }
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Dfoods?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We stand out with our commitment to quality, tradition, and authenticity in every product we deliver.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUsItems.map((item, index) => {
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
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Card */}
                <div className={`relative h-full bg-gradient-to-br ${item.bgGradient} rounded-3xl p-8 shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover:shadow-2xl`}>
                  {/* Animated gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={false}
                  />

                  {/* Floating icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.2,
                      transition: { duration: 0.5 }
                    }}
                    className="relative z-10 mb-6 flex justify-center"
                  >
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  {/* Animated number */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.15 + 0.2 
                    }}
                    viewport={{ once: true }}
                    className="text-center mb-3 relative z-10"
                  >
                    <motion.span
                      className={`text-5xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.number}
                    </motion.span>
                    <p className={`text-sm font-semibold mt-1 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {item.unit}
                    </p>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-xl font-bold text-gray-900 mb-4 text-center relative z-10"
                  >
                    {item.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                    viewport={{ once: true }}
                    className="text-sm text-gray-600 leading-relaxed text-center relative z-10"
                  >
                    {item.description}
                  </motion.p>

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                    <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-20 rounded-full blur-xl`}></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
                    <div className={`absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-20 rounded-full blur-xl`}></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
