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
    title: 'Traditional Methods',
    icon: SparklesIcon,
    description: 'Time-honored techniques passed down through generations, ensuring authentic taste and quality in every batch.',
    arcColor: 'from-amber-400 via-orange-500 to-amber-600',
    lineColor: 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600'
  },
  {
    title: 'Quality Assurance',
    icon: ShieldCheckIcon,
    description: 'Rigorous quality testing ensures purity, authenticity, and safety standards that exceed industry requirements.',
    arcColor: 'from-amber-600 via-orange-700 to-amber-800',
    lineColor: 'bg-gradient-to-r from-amber-600 via-orange-700 to-amber-800'
  },
  {
    title: 'Farm-to-Table',
    icon: TruckIcon,
    description: 'Direct from our farms to your table, ensuring fresh jaggery with minimal processing and maximum nutrition.',
    arcColor: 'from-amber-400 via-orange-500 to-amber-600',
    lineColor: 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600'
  },
  {
    title: 'Organic Certification',
    icon: FireIcon,
    description: 'Certified organic processes with no chemicals or artificial additives, preserving natural goodness.',
    arcColor: 'from-amber-600 via-orange-700 to-amber-800',
    lineColor: 'bg-gradient-to-r from-amber-600 via-orange-700 to-amber-800'
  }
];

export default function WhatWeDoSection() {
  return (
    <>
      <style jsx>{`
        .what-we-do-section {
          position: relative;
          overflow: hidden;
        }

        .background-top {
          background: linear-gradient(to bottom, #FDF6E3 0%, #FEF3C7 100%);
          height: 65%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 0;
        }

        .background-bottom {
          background: linear-gradient(to top, #F59E0B 0%, #F97316 100%);
          height: 35%;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 0;
        }

        .what-we-do-content {
          position: relative;
          z-index: 1;
          padding: 60px 0;
        }

        .what-we-do-card {
          background-color: #FFFFFF;
          border-radius: 12px;
          padding: 30px 25px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .what-we-do-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .card-up {
          transform: translateY(-30px) !important;
        }

        .card-down {
          transform: translateY(30px) !important;
        }

        .icon-circle {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
        }

        .icon-circle svg {
          width: 35px;
          height: 35px;
          color: #FFFFFF;
          stroke-width: 2;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .card-description {
          font-size: 0.85rem;
          color: #333333;
          line-height: 1.5;
          margin-bottom: 15px;
          flex-grow: 1;
        }


        .section-header {
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 10px;
          text-align: center;
          width: 100%;
        }

        .section-subtitle {
          font-size: 0.9rem;
          color: #666666;
          text-align: center;
          width: 100%;
          margin-bottom:40px;
        }

        @media (max-width: 768px) {
          .what-we-do-content {
            padding: 50px 0;
          }

          .what-we-do-card {
            padding: 25px 20px;
            margin-bottom: 15px;
          }

          .card-up,
          .card-down {
            margin-top: 0;
          }

          .icon-circle {
            width: 60px;
            height: 60px;
          }

          .icon-circle svg {
            width: 30px;
            height: 30px;
          }

          .section-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <section className="what-we-do-section">
        <div className="background-top"></div>
        <div className="background-bottom"></div>
        
        <div className="what-we-do-content">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <h2 className="section-title">What We Do</h2>
              <p className="section-subtitle">
                Our commitment to quality and tradition drives everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {whatWeDoItems.map((item, index) => {
                const IconComponent = item.icon;
                // Wave effect: cards 1 & 3 (index 0, 2) go up, cards 2 & 4 (index 1, 3) go down
                const waveOffset = index % 2 === 0 ? -30 : 30;
                
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 + waveOffset }}
                    whileInView={{ opacity: 1, y: waveOffset }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1 
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="what-we-do-card">
                      <div className="icon-circle">
                        <IconComponent />
                      </div>
                      
                      <h3 className="card-title">{item.title}</h3>
                      
                      <p className="card-description">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}