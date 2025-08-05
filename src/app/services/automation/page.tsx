"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCogs, FaLightbulb, FaMobileAlt, FaMoneyBillWave, FaChartLine, FaShieldAlt } from 'react-icons/fa';

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

export default function AutomationPage() {
  const features = [
    {
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      title: "Low-Bandwidth Solutions",
      description: "Our automation tools are optimized to work efficiently in areas with limited connectivity, ensuring business continuity."
    },
    {
      icon: <FaMobileAlt className="text-3xl text-blue-500" />,
      title: "Mobile-First Design",
      description: "Built for the African market where mobile is the primary computing device for most businesses and consumers."
    },
    {
      icon: <FaMoneyBillWave className="text-3xl text-green-500" />,
      title: "Local Payment Integration",
      description: "Seamless integration with popular African payment systems like M-Pesa, MTN Mobile Money, and more."
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-500" />,
      title: "Business Analytics",
      description: "Gain valuable insights into your operations with customized dashboards and reporting tools."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-red-500" />,
      title: "Offline Capability",
      description: "Critical processes continue to function even during internet outages, with automatic synchronization when connectivity returns."
    }
  ];

  const useCases = [
    {
      title: "Inventory Management",
      description: "Automate stock tracking, reordering, and distribution across multiple locations with SMS notifications when inventory runs low.",
      industry: "Retail, Distribution, Manufacturing"
    },
    {
      title: "Document Processing",
      description: "Digitize and automate document workflows, reducing paper usage and improving access to information.",
      industry: "Government, Legal, Education"
    },
    {
      title: "Financial Operations",
      description: "Streamline invoicing, payment processing, and financial reporting with solutions adapted to local regulations.",
      industry: "Financial Services, SACCOs, SMEs"
    },
    {
      title: "Field Service Management",
      description: "Coordinate field teams with mobile-optimized tools that work in remote areas with limited connectivity.",
      industry: "Agriculture, Utilities, Healthcare"
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
              <h1 className="heading-xl mb-6">Business Process Automation</h1>
              <p className="text-xl mb-8">
                Streamline operations with AI-powered automation solutions tailored for African business environments and infrastructure realities.
              </p>
              <Link href="/contact" className="btn-primary">
                Request a Demo
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                <div className="relative h-full w-full p-2">
                  <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-white bg-opacity-20 flex items-center justify-center">
                    <FaCogs className="text-8xl text-primary" />
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

      {/* Benefits Section */}
      <motion.div 
        className="container-custom py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="heading-lg text-center mb-12 text-primary font-bold">Benefits for African Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-4">60%</div>
            <p className="text-xl text-gray-700">Reduction in manual processing time</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-4">40%</div>
            <p className="text-xl text-gray-700">Decrease in operational costs</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-4">85%</div>
            <p className="text-xl text-gray-700">Improvement in data accuracy</p>
          </div>
        </div>
      </motion.div>

      {/* Implementation Process */}
      <motion.div 
        className="bg-gray-100 py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12 text-primary font-bold">Our Implementation Process</h2>
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="md:w-1/4 mb-8 md:mb-0 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2 text-primary">Assessment</h3>
              <p className="text-gray-700">We analyze your current processes and identify automation opportunities</p>
            </div>
            <div className="md:w-1/4 mb-8 md:mb-0 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2 text-primary">Design</h3>
              <p className="text-gray-700">We create custom automation solutions for your specific needs</p>
            </div>
            <div className="md:w-1/4 mb-8 md:mb-0 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2 text-primary">Implementation</h3>
              <p className="text-gray-700">We deploy and integrate the solutions with your existing systems</p>
            </div>
            <div className="md:w-1/4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">4</div>
              <h3 className="text-xl font-bold mb-2 text-primary">Training & Support</h3>
              <p className="text-gray-700">We ensure your team can effectively use and maintain the new systems</p>
            </div>
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
          <h2 className="heading-lg mb-6 font-bold">Ready to Streamline Your Operations?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with a free consultation to discuss how our automation solutions can transform your business processes.
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
