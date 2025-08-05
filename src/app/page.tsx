'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import IndustriesSection from '../components/IndustriesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import BlogSection from '../components/BlogSection';
import CallToActionSection from '../components/CallToActionSection';
import PageTransition from '../components/PageTransition';

export default function Home() {
  return (
    <main>
      <Header />
      <PageTransition>
        <HeroSection />
        <ServicesSection />
        <IndustriesSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <BlogSection />
        <CallToActionSection />
      </PageTransition>
      <Footer />
    </main>
  );
}
