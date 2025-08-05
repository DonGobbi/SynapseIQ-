"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaRobot, FaCogs, FaBrain, FaLanguage, FaChartLine, FaArrowRight } from 'react-icons/fa';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function ServicesPage() {
  const services = [
    {
      id: 'chatbots',
      icon: <FaRobot className="text-4xl text-primary mb-4" />,
      title: 'AI Chatbot Development',
      description: 'Custom chatbots that understand African languages and contexts, helping businesses automate customer service and information delivery.',
      features: [
        'WhatsApp integration for wide accessibility',
        'Support for multiple African languages',
        'Contextual understanding of local expressions',
        'Integration with existing business systems',
        'Analytics dashboard for performance tracking'
      ]
    },
    {
      id: 'automation',
      icon: <FaCogs className="text-4xl text-primary mb-4" />,
      title: 'Business Process Automation',
      description: 'Streamline operations with AI-powered automation solutions tailored for African business environments and infrastructure realities.',
      features: [
        'Low-bandwidth optimized solutions',
        'Offline-capable processing',
        'Mobile-first design for African markets',
        'Integration with local payment systems',
        'Customized workflows for African business models'
      ]
    },
    {
      id: 'machine-learning',
      icon: <FaBrain className="text-4xl text-primary mb-4" />,
      title: 'Machine Learning & Data Science',
      description: 'Turn your African business data into actionable insights with custom ML models trained on relevant regional datasets.',
      features: [
        'African market trend analysis',
        'Customer behavior prediction models',
        'Supply chain optimization for local markets',
        'Risk assessment for African contexts',
        'Data visualization tailored for stakeholders'
      ]
    },
    {
      id: 'nlp',
      icon: <FaLanguage className="text-4xl text-primary mb-4" />,
      title: 'Natural Language Processing',
      description: 'NLP solutions that understand and process African languages, dialects, and communication patterns.',
      features: [
        'Support for Swahili, Amharic, Yoruba, and more',
        'Sentiment analysis for local contexts',
        'Document processing in multiple languages',
        'Voice recognition for African accents',
        'Translation services between African languages'
      ]
    },
    {
      id: 'consulting',
      icon: <FaChartLine className="text-4xl text-primary mb-4" />,
      title: 'AI Strategy Consulting',
      description: 'Expert guidance on implementing AI solutions that address unique challenges and opportunities in African markets.',
      features: [
        'AI readiness assessment for African businesses',
        'Technology roadmap development',
        'Cost-benefit analysis for local context',
        'Staff training and capacity building',
        'Ongoing support and optimization'
      ]
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom">
          <h1 className="heading-xl mb-6">AI Services for Africa's Growth</h1>
          <p className="text-xl mb-8 max-w-2xl">
            We provide cutting-edge AI solutions tailored specifically for African businesses, 
            designed to work with local infrastructure, languages, and business models.
          </p>
        </div>
      </motion.div>

      {/* Services List */}
      <motion.div 
        className="container-custom py-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all"
              variants={fadeIn}
            >
              <div className="flex flex-col h-full">
                {service.icon}
                <h3 className="heading-sm mb-4 text-gray-800">{service.title}</h3>
                <p className="mb-6 text-gray-600 flex-grow">{service.description}</p>
                <Link href={`/services/${service.id}`} className="inline-flex items-center text-primary font-semibold hover:text-secondary transition-colors">
                  Learn more <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="bg-gray-100 py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom text-center">
          <h2 className="heading-lg mb-6 text-gray-800">Ready to Transform Your Business with AI?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Book a free consultation to discuss how our AI services can address your specific business needs in the African context.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/consultation" className="btn-primary">Book a Consultation</Link>
            <Link href="/case-studies" className="btn-outline">View Success Stories</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
