'use client';

import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  FireIcon, 
  ShieldCheckIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const whatWeDoItems = [
  {
    title: 'Traditional Methods',
    icon: SparklesIcon,
    description: 'Authentic jaggery made using age-old traditional techniques passed down through generations.',
    arcColor: 'from-amber-300 via-orange-400 to-amber-500',
    lineColor: 'bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500'
  },
  {
    title: 'Quality Assurance',
    icon: ShieldCheckIcon,
    description: 'Rigorous testing and certification to ensure the highest quality standards for every batch.',
    arcColor: 'from-amber-400 via-orange-500 to-amber-600',
    lineColor: 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600'
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
          min-height: 280px;
        }

        .what-we-do-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
          font-size: 1.1rem;
          font-weight: 700;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .card-description {
          font-size: 0.9rem;
          color: #333333;
          line-height: 1.6;
          margin-bottom: 15px;
          flex-grow: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 10px;
          text-align: center;
        }

        .section-subtitle {
          font-size: 0.95rem;
          color: #666666;
          margin-bottom: 40px;
          text-align: center;
        }

        .card-up {
          transform: translateY(-40px);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-down {
          transform: translateY(40px);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .what-we-do-card:hover {
          transform: translateY(0px) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .what-we-do-content {
            padding: 50px 0;
          }

          .what-we-do-card {
            padding: 25px 20px;
            min-height: 260px;
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
            text-align: center;
          }

          .section-subtitle {
            text-align: center;
          }
        }
      `}</style>

      <section className="what-we-do-section">
        <div className="background-top"></div>
        <div className="background-bottom"></div>
        
        <div className="what-we-do-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="section-header"
            >
              <h2 className="section-title">What We Do</h2>
              <p className="section-subtitle">
                Delivering excellence in every step of our jaggery production process
              </p>
            </motion.div>

            {/* Mobile Swiper */}
            <div className="block md:hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={1.1}
                centeredSlides={true}
                loop={false}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="what-we-do-swiper pb-12"
              >
                {whatWeDoItems.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="px-2">
                      <div className="what-we-do-card">
                        <div className="icon-circle">
                          <item.icon />
                        </div>
                        <h3 className="card-title">{item.title}</h3>
                        <p className="card-description">{item.description}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Desktop Grid - Wave Effect: 1 above, 2 below, 3 above, 4 below */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whatWeDoItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={index % 2 === 0 ? 'card-up' : 'card-down'}
                >
                  <div className="what-we-do-card">
                    <div className="icon-circle">
                      <item.icon />
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .what-we-do-swiper .swiper-pagination-bullet {
          background: #F97316;
          opacity: 0.5;
        }
        .what-we-do-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #F97316;
        }
      `}</style>
    </>
  );
}
