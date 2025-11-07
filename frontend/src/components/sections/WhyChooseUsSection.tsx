'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';

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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      cardsRef.current.forEach((card, i) => {
        if (card) {
          card.style.animationDelay = `${0.2 * (i + 1)}s`;
          card.style.opacity = '1';
        }
      });
    }
  }, [isMobile]);

  // Auto-rotate only on mobile
  useEffect(() => {
    if (!isMobile) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isMobile]);

  const currentFeature = features[currentIndex];

  return (
    <>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotateGradient {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .why-choose-us {
          background-color: #f8f9fa;
          padding: 20px 0;
        }

        .feature-card {
          text-align: center;
          padding: 20px 20px;
          margin-bottom: 0px;
          position: relative;
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .icon-container {
          position: relative;
          width: 220px;
          height: 200px;
          margin: 0 auto 20px;
        }

        .circle-base {
          width: 200px;
          height: 200px;
          background-color: #f8f9fa;
          border-radius: 50%;
          position: absolute;
          top: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .circle-gradient-1,
        .circle-gradient-2 {
          width: 200px;
          height: 200px;
          position: absolute;
          top: 0;
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
          transition: transform 0.3s ease;
        }

        .icon-container:hover .feature-icon {
          transform: scale(1.1);
        }

        .icon-container:hover .circle-base {
          animation: pulse 1s ease-in-out infinite;
        }

        .feature-title {
          color: #333;
          font-size: 1.4rem;
          margin-bottom: 10px;
          margin-top: -10px;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .feature-text {
          color: #666;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
          background: -webkit-linear-gradient(#F97316 0%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(to right, #F97316, #F59E0B);
          margin: 25px auto;
          border-radius: 50px;
          transition: width 0.3s ease;
        }

        .feature-card:hover .divider {
          width: 120px;
        }

        .feature-card:hover .feature-title {
          color: #F97316 !important;
        }

        /* Mobile Single Card Styles */
        .single-card-container {
          max-width: 600px;
          margin: 0 auto;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-feature-card {
          text-align: center;
          padding: 30px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
        }

        .progress-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 25px;
        }

        .dot {
          width: 10px;
          height: 10px;
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
          .single-card-container {
            text-align: center;
          }
          .icon-container {
            width: 160px;
            height: 160px;
            margin: 0 auto 20px;
          }
          .circle-base,
          .circle-gradient-1,
          .circle-gradient-2 {
            width: 140px;
            height: 140px;
          }
          .feature-icon {
            font-size: 3.5rem;
          }
          .feature-title {
            font-size: 1.5rem;
            text-align: center;
          }
          .feature-text {
            font-size: 0.85rem;
            text-align: center;
          }
          .section-title {
            font-size: 2rem;
            text-align: center;
          }
        }
      `}</style>

      <section className="why-choose-us">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title">Why Choose Us</h2>

          {/* Mobile: Single rotating card */}
          <div className="block md:hidden">
            <div className="single-card-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="mobile-feature-card"
                >
                  <div className="icon-container">
                    <div className={currentFeature.gradient}></div>
                    <div className="circle-base">
                      <i className={`fas ${currentFeature.icon} feature-icon`}></i>
                    </div>
                  </div>

                  <h3 className="feature-title" style={{ color: '#F97316' }}>{currentFeature.title}</h3>
                  <p className="feature-text">{currentFeature.text}</p>

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

          {/* Desktop: Original 4-card grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, idx) => (
              <div key={idx}>
                <div
                  className="feature-card"
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                >
                  <div className="icon-container">
                    <div className={f.gradient}></div>
                    <div className="circle-base">
                      <i className={`fas ${f.icon} feature-icon`}></i>
                    </div>
                  </div>

                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-text">{f.text}</p>
                  <div className="divider"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
