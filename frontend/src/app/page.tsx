import HeroSection from '@/components/sections/HeroSection';
import WhatWeDoSection from '@/components/sections/WhatWeDoSection';
import CategoryGrid from '@/components/sections/CategoryGrid';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhatWeDoSection />
      <CategoryGrid />
      <WhyChooseUsSection />
      <TestimonialsSection />
    </div>
  );
}
