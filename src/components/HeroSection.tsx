"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from './Button';
import ImageWithLoading from './ImageWithLoading';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-light to-white py-16 md:py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="heading-xl mb-6 text-primary">
              AI Solutions for Africa&apos;s Next Growth Story
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              At SynapseIQ, we empower African businesses, startups, and organizations with AI-driven tools that cut costs, improve services, and unlock new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/consultation" passHref>
                <Button variant="primary">
                  Request a Demo
                </Button>
              </Link>
              <Link href="/services" passHref>
                <Button variant="outline">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center"
          >
            {/* Dark blue background */}
            <div className="absolute inset-0 bg-[#001233] rounded-2xl"></div>
            
            {/* Hero image container */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden flex justify-end items-center">
              <div className="relative w-full h-full">
                <Image 
                  src="/images/hero-image.png" 
                  alt="African business professional representing SynapseIQ" 
                  width={600} 
                  height={600} 
                  priority 
                  className="scale-[1.15] translate-y-2 object-contain object-right-center absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
