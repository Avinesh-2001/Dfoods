'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface SiteLoaderProps {
  children: React.ReactNode;
}

export default function SiteLoader({ children }: SiteLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center">
                <img src="/images/Dfood_logo.png" alt="Dfoods" className="h-20 w-auto object-contain" />
              </div>
              <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Dfoods</h1>
              <p className="text-lg text-gray-600 mb-6">Pure Traditional Sweetness</p>
              <LoadingSpinner size="lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
