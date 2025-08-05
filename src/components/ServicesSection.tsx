"use client";

import { FaRobot, FaCogs, FaBrain, FaLanguage, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

const services = [
  {
    icon: <FaRobot className="text-4xl text-primary" />,
    title: 'AI Chatbot Development',
    description: 'WhatsApp & web-based bots in English, French, Swahili, Chichewa, Lingala and more—helping businesses connect with customers in their own language.',
    link: '/services/chatbots'
  },
  {
    icon: <FaCogs className="text-4xl text-primary" />,
    title: 'Business Process Automation',
    description: 'From SACCOs to local SMEs, automate record-keeping, invoicing, and customer follow-ups to save time and reduce errors.',
    link: '/services/automation'
  },
  {
    icon: <FaBrain className="text-4xl text-primary" />,
    title: 'Machine Learning & Data Science',
    description: 'Leverage your data to predict market demand, track customer behavior, or support better policy-making for NGOs and governments.',
    link: '/services/machine-learning'
  },
  {
    icon: <FaLanguage className="text-4xl text-primary" />,
    title: 'Natural Language Processing (NLP)',
    description: 'Analyze local feedback, translate across African languages, and summarize reports for faster decision-making.',
    link: '/services/nlp'
  },
  {
    icon: <FaChartLine className="text-4xl text-primary" />,
    title: 'AI Consulting & Strategy',
    description: 'Guiding businesses, startups, and NGOs on how to adopt AI responsibly and sustainably in African markets.',
    link: '/services/consulting'
  }
];

const ServicesSection = () => {
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
          <h2 className="heading-lg mb-4 text-gray-800">Bringing AI Innovation to African Enterprises</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We deliver affordable, practical, and scalable AI solutions designed to solve the unique challenges facing Africa today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-light p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <Link href={service.link} className="text-primary font-medium hover:underline">
                Learn more →
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary">
            View Full Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
