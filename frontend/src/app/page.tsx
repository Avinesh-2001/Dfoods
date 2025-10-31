import HeroSection from '@/components/sections/HeroSection';
import WhatWeDoSection from '@/components/sections/WhatWeDoSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import JaggeryBannerSection from '@/components/sections/JaggeryBannerSection';
import GoodnessRangeSection from '@/components/sections/GoodnessRangeSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <GoodnessRangeSection />
      <JaggeryBannerSection />
      <WhyChooseUsSection />
      <WhatWeDoSection />
      <TestimonialsSection />
    </div>
  );
}
