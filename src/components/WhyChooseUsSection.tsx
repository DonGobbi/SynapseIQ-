"use client";

import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Localized AI',
    description: 'Supporting African languages & markets',
  },
  {
    title: 'Affordable Solutions',
    description: 'Designed for SMEs & startups',
  },
  {
    title: 'Local Experience',
    description: 'Working with NGOs, community projects, and African enterprises',
  },
  {
    title: 'World-Class Technology',
    description: 'Powered by OpenAI, Hugging Face, Python',
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg mb-4 text-gray-800">Why Choose SynapseIQ?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
