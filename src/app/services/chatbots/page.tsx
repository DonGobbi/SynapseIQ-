"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaRobot, FaWhatsapp, FaGlobe, FaMobileAlt, FaDatabase, FaChartBar } from 'react-icons/fa';

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

export default function ChatbotsPage() {
  const features = [
    {
      icon: <FaWhatsapp className="text-3xl text-green-500" />,
      title: "WhatsApp Integration",
      description: "Reach customers where they already are. Our chatbots integrate seamlessly with WhatsApp, the most popular messaging platform across Africa."
    },
    {
      icon: <FaGlobe className="text-3xl text-blue-500" />,
      title: "African Language Support",
      description: "Our chatbots understand and respond in multiple African languages including Swahili, Amharic, Yoruba, Zulu, and more."
    },
    {
      icon: <FaMobileAlt className="text-3xl text-purple-500" />,
      title: "Low-Bandwidth Optimization",
      description: "Designed to work efficiently in areas with limited connectivity, ensuring your customers can always access support."
    },
    {
      icon: <FaDatabase className="text-3xl text-orange-500" />,
      title: "Seamless Integration",
      description: "Connect your chatbot to existing business systems including CRM, inventory management, and payment systems."
    },
    {
      icon: <FaChartBar className="text-3xl text-indigo-500" />,
      title: "Analytics Dashboard",
      description: "Gain valuable insights into customer interactions, common queries, and service performance."
    }
  ];

  const useCases = [
    {
      title: "Customer Support",
      description: "Reduce support costs by automating responses to common queries, with seamless handover to human agents when needed.",
      industry: "Retail, Telecom, Banking"
    },
    {
      title: "SACCO Member Services",
      description: "Help members check balances, apply for loans, and get financial advice through accessible WhatsApp chatbots.",
      industry: "Financial Services, SACCOs"
    },
    {
      title: "Healthcare Information",
      description: "Provide health information, appointment scheduling, and medication reminders in local languages.",
      industry: "Healthcare, NGOs"
    },
    {
      title: "Educational Support",
      description: "Create interactive learning experiences and answer student questions about course materials.",
      industry: "Education"
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
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="heading-xl mb-6">AI Chatbot Development</h1>
              <p className="text-xl mb-8">
                Custom chatbots that understand African languages and contexts, helping businesses automate customer service and information delivery.
              </p>
              <Link href="/contact" className="btn-primary">
                Request a Demo
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                <div className="relative h-full w-full p-2">
                  <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image 
                      src="/images/chatbot.jpg" 
                      alt="AI Chatbot Interface" 
                      width={400} 
                      height={400} 
                      className="object-cover h-full w-full" 
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="container-custom py-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <h2 className="heading-lg text-center mb-12 text-primary font-bold">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
              variants={fadeIn}
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-primary">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Use Cases Section */}
      <motion.div 
        className="bg-gray-100 py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12 text-primary font-bold">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2 text-primary">{useCase.title}</h3>
                <p className="text-gray-700 mb-4">{useCase.description}</p>
                <p className="text-sm font-semibold text-primary">Industries: {useCase.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Process Section */}
      <motion.div 
        className="container-custom py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="heading-lg text-center mb-12 text-primary font-bold">Our Development Process</h2>
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="md:w-1/4 mb-8 md:mb-0 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Consultation</h3>
            <p className="text-gray-700">We understand your business needs and target audience</p>
          </div>
          <div className="md:w-1/4 mb-8 md:mb-0 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Design</h3>
            <p className="text-gray-700">We create conversation flows and language models</p>
          </div>
          <div className="md:w-1/4 mb-8 md:mb-0 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Development</h3>
            <p className="text-gray-700">We build and train your custom chatbot</p>
          </div>
          <div className="md:w-1/4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">4</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Deployment</h3>
            <p className="text-gray-700">We launch, monitor, and continuously improve</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="bg-primary text-white py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom text-center">
          <h2 className="heading-lg mb-6 font-bold">Ready to Build Your Custom Chatbot?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with a free consultation to discuss how our AI chatbots can transform your customer service experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-white text-primary font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-all">
              Book a Consultation
            </Link>
            <Link href="/services" className="border-2 border-white text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-100 hover:text-primary hover:border-blue-100 transition-all">
              View All Services
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
