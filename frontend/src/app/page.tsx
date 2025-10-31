import HeroSection from '@/components/sections/HeroSection';
import WhatWeDoSection from '@/components/sections/WhatWeDoSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import JaggeryBannerSection from '@/components/sections/JaggeryBannerSection';
import GoodnessRangeSection from '@/components/sections/GoodnessRangeSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <GoodnessRangeSection />
      <JaggeryBannerSection />
      <FeaturedProductsSection />
      <WhyChooseUsSection />
      <WhatWeDoSection />
      <TestimonialsSection />
    </div>
  );
}
