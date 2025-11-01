'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BannerImageSection() {
  return (
    <section className="relative w-full h-[150px] md:h-[200px] lg:h-[250px] overflow-hidden">
      {/* Full Width Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/bannerimage.png"
          alt="Premium Jaggery Banner"
          fill
          priority
          className="object-cover w-full h-full"
          sizes="100vw"
        />
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
      </div>
    </section>
  );
}

