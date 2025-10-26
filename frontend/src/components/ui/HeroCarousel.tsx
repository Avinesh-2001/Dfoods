'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const carouselSlides = [
  {
    id: 1,
    title: "Premium Jaggery",
    subtitle: "100% Organic & Natural",
    description: "Handcrafted with 40+ years of traditional expertise",
    quote: "गुड़ खाओ, स्वस्थ रहो - Eat Jaggery, Stay Healthy",
    icon: "🍯",
    bgColor: "from-amber-400 to-orange-500",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Pure Sweetness",
    subtitle: "No Chemicals Added",
    description: "Traditional processing methods for authentic taste",
    quote: "प्रकृति का मिठास - Nature's Sweetness",
    icon: "🌿",
    bgColor: "from-green-400 to-emerald-500",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Farm Fresh",
    subtitle: "Direct from Fields",
    description: "Fresh sugarcane processed within hours of harvest",
    quote: "खेत से थाली तक - From Farm to Plate",
    icon: "🚜",
    bgColor: "from-yellow-400 to-amber-500",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 4,
    title: "Quality Assured",
    subtitle: "Certified Organic",
    description: "Rigorous testing ensures purity and safety",
    quote: "गुणवत्ता की गारंटी - Quality Guaranteed",
    icon: "✅",
    bgColor: "from-blue-400 to-indigo-500",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 5,
    title: "Traditional Taste",
    subtitle: "Generations of Expertise",
    description: "Authentic recipes passed down through families",
    quote: "पारंपरिक स्वाद - Traditional Taste",
    icon: "👨‍👩‍👧‍👦",
    bgColor: "from-purple-400 to-pink-500",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop&crop=center"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: {
      x: 300,
      opacity: 0
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: {
      zIndex: 0,
      x: -300,
      opacity: 0
    }
  };

  const slideTransition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  return (
    <div className="relative w-full h-96 lg:h-[500px] rounded-2xl shadow-2xl overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className={`absolute inset-0 bg-gradient-to-br ${carouselSlides[currentSlide].bgColor} flex items-center justify-center overflow-hidden`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={carouselSlides[currentSlide].image}
              alt={carouselSlides[currentSlide].title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-8 max-w-4xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl"
            >
              <span className="text-6xl">{carouselSlides[currentSlide].icon}</span>
            </motion.div>
            
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-bold mb-2 text-shadow-lg"
            >
              {carouselSlides[currentSlide].title}
            </motion.h3>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl mb-4 opacity-95 text-shadow-md"
            >
              {carouselSlides[currentSlide].subtitle}
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-white/20"
            >
              <p className="text-lg font-semibold mb-2 text-shadow-md">
                {carouselSlides[currentSlide].quote}
              </p>
              <p className="text-sm opacity-90 text-shadow-sm">
                {carouselSlides[currentSlide].description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        ←
      </button>
      
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        →
      </button>
    </div>
  );
}
