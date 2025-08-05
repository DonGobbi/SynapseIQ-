"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaBrain, FaChartBar, FaUsers, FaTruck, FaShieldAlt, FaTable } from 'react-icons/fa';

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

export default function MachineLearningPage() {
  const features = [
    {
      icon: <FaChartBar className="text-3xl text-blue-500" />,
      title: "African Market Analysis",
      description: "ML models trained specifically on African market data to provide relevant insights for local businesses."
    },
    {
      icon: <FaUsers className="text-3xl text-green-500" />,
      title: "Customer Behavior Prediction",
      description: "Understand and predict customer behavior patterns unique to African markets and demographics."
    },
    {
      icon: <FaTruck className="text-3xl text-orange-500" />,
      title: "Supply Chain Optimization",
      description: "Optimize logistics and inventory management considering local infrastructure and market conditions."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-red-500" />,
      title: "Risk Assessment",
      description: "AI-powered risk models calibrated for African business environments and economic conditions."
    },
    {
      icon: <FaTable className="text-3xl text-purple-500" />,
      title: "Custom Data Visualization",
      description: "Intuitive dashboards and reports designed for African stakeholders and decision-makers."
    }
  ];

  const useCases = [
    {
      title: "Agricultural Yield Prediction",
      description: "ML models that analyze soil, weather, and historical data to predict crop yields and optimize farming practices.",
      industry: "Agriculture, Agribusiness"
    },
    {
      title: "Customer Segmentation",
      description: "Identify distinct customer groups in African markets to tailor products and marketing strategies effectively.",
      industry: "Retail, Banking, Telecom"
    },
    {
      title: "Fraud Detection",
      description: "AI systems that detect unusual patterns in transactions and activities to prevent fraud in African contexts.",
      industry: "Financial Services, Insurance, Mobile Money"
    },
    {
      title: "Healthcare Diagnostics",
      description: "Machine learning models that assist healthcare providers in diagnosing conditions with limited resources.",
      industry: "Healthcare, NGOs"
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
              <h1 className="heading-xl mb-6">Machine Learning & Data Science</h1>
              <p className="text-xl mb-8">
                Turn your African business data into actionable insights with custom ML models trained on relevant regional datasets.
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
                    <FaBrain className="text-8xl text-primary" />
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

      {/* Data Science Process */}
      <motion.div 
        className="container-custom py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="heading-lg text-center mb-12 text-primary font-bold">Our Data Science Process</h2>
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="md:w-1/5 mb-8 md:mb-0 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Data Collection</h3>
            <p className="text-gray-700">Gathering relevant data from your business operations</p>
          </div>
          <div className="md:w-1/5 mb-8 md:mb-0 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Data Cleaning</h3>
            <p className="text-gray-700">Preparing and standardizing data for analysis</p>
          </div>
          <div className="md:w-1/5 mb-8 md:mb-0 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Model Building</h3>
            <p className="text-gray-700">Creating custom ML models for your specific needs</p>
          </div>
          <div className="md:w-1/5 mb-8 md:mb-0 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">4</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Validation</h3>
            <p className="text-gray-700">Testing models with real-world African data</p>
          </div>
          <div className="md:w-1/5 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">5</div>
            <h3 className="text-xl font-bold mb-2 text-primary">Deployment</h3>
            <p className="text-gray-700">Implementing solutions in your business environment</p>
          </div>
        </div>
      </motion.div>

      {/* Technologies Section */}
      <motion.div 
        className="bg-gray-100 py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12 text-primary font-bold">Technologies We Use</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">TensorFlow</h3>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">PyTorch</h3>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">Scikit-Learn</h3>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">Pandas</h3>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">Power BI</h3>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">Tableau</h3>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">Apache Spark</h3>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <h3 className="font-bold text-primary">AWS/Azure ML</h3>
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
          <h2 className="heading-lg mb-6 font-bold">Ready to Harness the Power of Your Data?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with a free consultation to discuss how our machine learning solutions can transform your business.
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
