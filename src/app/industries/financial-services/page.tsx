"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaUserCheck, FaRobot, FaChartPie } from 'react-icons/fa';

const FinancialServicesPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const useCases = [
    {
      icon: <FaChartLine className="text-4xl text-primary mb-4" />,
      title: "Predictive Analytics",
      description: "Forecast market trends and customer behaviors to make data-driven investment decisions."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary mb-4" />,
      title: "Fraud Detection",
      description: "Identify suspicious patterns and prevent fraudulent transactions in real-time."
    },
    {
      icon: <FaUserCheck className="text-4xl text-primary mb-4" />,
      title: "Customer Risk Assessment",
      description: "Evaluate creditworthiness and risk profiles using AI-powered scoring models."
    },
    {
      icon: <FaRobot className="text-4xl text-primary mb-4" />,
      title: "Automated Customer Service",
      description: "Deploy AI chatbots to handle routine inquiries and transactions 24/7."
    },
    {
      icon: <FaChartPie className="text-4xl text-primary mb-4" />,
      title: "Portfolio Management",
      description: "Optimize investment portfolios based on risk tolerance and market conditions."
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-light to-white py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="heading-xl mb-6 text-primary">AI for Financial Services</h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700">
                Transform your financial institution with AI solutions designed for African markets. 
                From fraud detection to customer insights, our tools help you make smarter decisions 
                and deliver better services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-primary text-center">
                  Schedule a Consultation
                </Link>
                <Link href="/services" className="btn-outline text-center">
                  Explore Our Services
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[300px] md:h-[400px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-[#001233] rounded-2xl"></div>
              
              <div className="absolute inset-0 rounded-2xl overflow-hidden flex justify-end items-center">
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/team-collaboration.png" 
                    alt="Financial services professionals using AI" 
                    fill 
                    style={{ objectFit: 'contain', objectPosition: 'center' }} 
                    priority 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-primary font-bold">Challenges in African Financial Services</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Financial institutions across Africa face unique challenges that our AI solutions are specifically designed to address.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 p-6 rounded-lg shadow"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Limited Access to Banking</h3>
              <p className="mb-4 text-gray-700">
                Many African regions have limited banking infrastructure, making it difficult for traditional 
                financial institutions to reach potential customers.
              </p>
              <p className="text-gray-700">
                Our AI solutions enable mobile-first banking services that can reach customers in remote areas, 
                expanding your market reach without physical branches.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 p-6 rounded-lg shadow"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Fraud and Security Concerns</h3>
              <p className="mb-4 text-gray-700">
                Financial institutions in Africa face growing threats from sophisticated fraud schemes 
                that target both customers and internal systems.
              </p>
              <p className="text-gray-700">
                Our AI-powered fraud detection systems can identify suspicious patterns in real-time, 
                protecting your institution and customers from financial losses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg shadow"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Limited Credit History</h3>
              <p className="mb-4">
                Many potential customers lack formal credit histories, making traditional risk 
                assessment methods ineffective.
              </p>
              <p>
                Our alternative credit scoring models use AI to analyze non-traditional data points, 
                enabling you to safely extend services to previously underserved populations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-lg shadow"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Regulatory Compliance</h3>
              <p className="mb-4">
                Navigating complex and evolving regulatory requirements across different African 
                countries can be challenging.
              </p>
              <p>
                Our AI compliance tools help you stay updated with changing regulations and 
                automatically flag potential compliance issues before they become problems.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-primary font-bold">AI Use Cases for Financial Services</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Discover how our AI solutions can transform various aspects of your financial institution.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                {useCase.icon}
                <h3 className="text-xl font-bold mb-2 text-primary">{useCase.title}</h3>
                <p className="text-gray-700">{useCase.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-primary font-bold">Success Story</h2>
          </motion.div>

          <div className="bg-gray-50 rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="relative w-64 h-64 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <div className="relative h-full w-full p-2">
                    <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image 
                        src="/images/consulting-team.png" 
                        alt="Financial services client" 
                        width={256}
                        height={256}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold mb-4 text-primary">Pan-African Bank Reduces Fraud by 62%</h3>
                <p className="mb-4">
                  A leading bank operating in 12 African countries was struggling with rising fraud rates 
                  that were affecting customer trust and causing significant financial losses.
                </p>
                <p className="mb-4">
                  We implemented our AI-powered fraud detection system that analyzed transaction patterns 
                  in real-time and flagged suspicious activities for immediate review.
                </p>
                <p className="mb-4">
                  Within six months, the bank saw a 62% reduction in fraudulent transactions and saved 
                  an estimated $3.5 million in potential losses.
                </p>
                <div className="flex items-center mt-6">
                  <div className="mr-4">
                    <p className="font-bold">James Okonkwo</p>
                    <p className="text-gray-600">Chief Risk Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="heading-lg mb-6 font-bold">Ready to Transform Your Financial Institution?</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Join the growing number of African financial institutions using our AI solutions to 
              improve security, expand services, and better serve their customers.
            </p>
            <Link href="/contact" className="bg-white text-primary font-semibold py-2 px-6 rounded-md hover:bg-gray-200 hover:shadow-lg transition-all inline-block">
              Schedule a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default FinancialServicesPage;
