import HeroSection from '@/components/sections/HeroSection';
import WhatWeDoSection from '@/components/sections/WhatWeDoSection';
import OurProductsSection from '@/components/sections/OurProductsSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <OurProductsSection />
      <WhatWeDoSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
    </div>
  );
}
