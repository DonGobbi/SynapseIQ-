"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const CallToActionSection = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="heading-lg mb-6">Africa's future is digital. Let's build it with intelligence.</h2>
          <p className="text-lg mb-8">
            Partner with SynapseIQ to accelerate growth in your business or organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/consultation" className="bg-white text-primary font-semibold py-3 px-8 rounded-md hover:bg-opacity-90 transition-all text-center">
              Book a Free Consultation
            </Link>
            <Link href="/contact" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-primary transition-all text-center">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
