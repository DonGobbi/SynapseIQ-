"use client";

import { FaShoppingCart, FaHospital, FaGraduationCap, FaMoneyBill, FaSeedling } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const industries = [
  {
    icon: <FaShoppingCart className="text-4xl text-primary" />,
    title: 'Retail & E-Commerce',
    description: 'Product recommendations, WhatsApp shop assistants, and inventory management.',
    link: '/industries/retail'
  },
  {
    icon: <FaHospital className="text-4xl text-primary" />,
    title: 'Healthcare',
    description: 'Patient record automation, virtual health assistants, and medical data analysis.',
    link: '/industries/healthcare'
  },
  {
    icon: <FaGraduationCap className="text-4xl text-primary" />,
    title: 'Education',
    description: 'AI tutors, grading automation, and multilingual learning platforms.',
    link: '/industries/education'
  },
  {
    icon: <FaMoneyBill className="text-4xl text-primary" />,
    title: 'Finance & SACCOs',
    description: 'Fraud detection, automated reporting, and customer service automation.',
    link: '/industries/financial-services'
  },
  {
    icon: <FaSeedling className="text-4xl text-primary" />,
    title: 'NGOs & Development',
    description: 'Community data analysis, beneficiary tracking, and impact measurement.',
    link: '/industries/ngos'
  }
];

const IndustriesSection = () => {
  return (
    <section className="section-padding bg-light">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg mb-4 text-gray-800">Industries We Serve</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            AI solutions tailored for Africa's diverse sectors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{industry.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{industry.title}</h3>
              <p className="text-gray-700 mb-4">{industry.description}</p>
              <Link href={industry.link} className="text-primary font-medium hover:underline">
                Learn more →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
