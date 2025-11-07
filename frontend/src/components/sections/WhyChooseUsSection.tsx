'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

const features = [
  {
    icon: 'fa-award',
    title: 'Quality',
    text: 'Four decades of expertise in traditional jaggery making, passed down through generations with unmatched quality and authenticity that stands the test of time.',
    gradient: 'circle-gradient-1',
  },
  {
    icon: 'fa-leaf',
    title: '100% Organic',
    text: 'Certified organic farming practices with no chemicals, pesticides, or artificial additives - pure nature in every bite for your health and wellness.',
    gradient: 'circle-gradient-2',
  },
  {
    icon: 'fa-shield-alt',
    title: 'No Chemicals',
    text: 'Zero chemical processing, bleaching, or artificial enhancement. Only natural, traditional methods that preserve authentic taste and nutritional value.',
    gradient: 'circle-gradient-1',
  },
  {
    icon: 'fa-truck',
    title: 'Farm Fresh',
    text: 'Direct from our farms to your doorstep. Freshly harvested sugarcane processed within hours to ensure maximum freshness and nutrition delivered with care.',
    gradient: 'circle-gradient-2',
  },
];

export default function WhyChooseUsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3500); // Change every 3.5 seconds

    return () => clearInterval(timer);
  }, []);

  const currentFeature = features[currentIndex];

  return (
    <>
      <Script
        src="https://kit.fontawesome.com/your-font-awesome-kit.js"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <style jsx>{`
        @keyframes rotateGradient {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .why-choose-us {
          background-color: #f8f9fa;
          padding: 60px 0;
        }

        .single-card-container {
          max-width: 600px;
          margin: 0 auto;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-card {
          text-align: center;
          padding: 40px 30px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
        }

        .icon-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto 30px;
        }

        .circle-base {
          width: 180px;
          height: 180px;
          background-color: #f8f9fa;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          animation: pulse 2s ease-in-out infinite;
        }

        .circle-gradient-1,
        .circle-gradient-2 {
          width: 200px;
          height: 200px;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
          z-index: 1;
          animation: rotateGradient 8s linear infinite;
        }

        .circle-gradient-1 {
          background: linear-gradient(#F97316 0%, #F59E0B 50%);
        }

        .circle-gradient-2 {
          background: linear-gradient(#F59E0B 0%, #F97316 50%);
        }

        .feature-icon {
          font-size: 5rem;
          color: #000000;
          position: relative;
          z-index: 3;
        }

        .feature-title {
          color: #F97316;
          font-size: 2rem;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .feature-text {
          color: #666;
          font-size: 1rem;
          line-height: 1.8;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 50px;
          text-align: center;
          background: -webkit-linear-gradient(#F97316 0%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .progress-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 30px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ddd;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #F97316;
          transform: scale(1.3);
        }

        @media (max-width: 768px) {
          .why-choose-us {
            padding: 40px 0;
          }

          .single-card-container {
            min-height: 350px;
            padding: 0 20px;
          }

          .feature-card {
            padding: 30px 20px;
          }

          .icon-container {
            width: 160px;
            height: 160px;
          }

          .circle-base {
            width: 140px;
            height: 140px;
          }

          .circle-gradient-1,
          .circle-gradient-2 {
            width: 160px;
            height: 160px;
          }

          .feature-icon {
            font-size: 3.5rem;
          }

          .feature-title {
            font-size: 1.5rem;
          }

          .feature-text {
            font-size: 0.9rem;
          }

          .section-title {
            font-size: 2rem;
            margin-bottom: 30px;
          }
        }
      `}</style>

      <section className="why-choose-us">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title">Why Choose Us</h2>

          <div className="single-card-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="feature-card"
              >
                <div className="icon-container">
                  <div className={currentFeature.gradient}></div>
                  <div className="circle-base">
                    <i className={`fas ${currentFeature.icon} feature-icon`}></i>
                  </div>
                </div>

                <h3 className="feature-title">{currentFeature.title}</h3>
                <p className="feature-text">{currentFeature.text}</p>

                {/* Progress Dots */}
                <div className="progress-dots">
                  {features.map((_, idx) => (
                    <div
                      key={idx}
                      className={`dot ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
