"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaLanguage, FaComments, FaFileAlt, FaMicrophone, FaExchangeAlt } from 'react-icons/fa';

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

export default function NlpPage() {
  const features = [
    {
      icon: <FaComments className="text-4xl text-primary" />,
      title: "African Language Support",
      description: "NLP models trained on Swahili, Amharic, Yoruba, Zulu, Hausa, and other African languages."
    },
    {
      icon: <FaFileAlt className="text-4xl text-primary" />,
      title: "Document Processing",
      description: "Extract information from documents in multiple African languages and dialects."
    },
    {
      icon: <FaMicrophone className="text-4xl text-primary" />,
      title: "Voice Recognition",
      description: "Speech-to-text systems trained to understand various African accents and speech patterns."
    },
    {
      icon: <FaExchangeAlt className="text-4xl text-primary" />,
      title: "Translation Services",
      description: "AI-powered translation between African languages and global languages like English and French."
    },
    {
      icon: <FaComments className="text-3xl text-red-500" />,
      title: "Sentiment Analysis",
      description: "Understand customer sentiment in local contexts and cultural nuances specific to African regions."
    }
  ];

  const languages = [
    { name: "Swahili", region: "East Africa", speakers: "100+ million" },
    { name: "Amharic", region: "Ethiopia", speakers: "25+ million" },
    { name: "Yoruba", region: "West Africa", speakers: "40+ million" },
    { name: "Zulu", region: "Southern Africa", speakers: "12+ million" },
    { name: "Hausa", region: "West/Central Africa", speakers: "70+ million" },
    { name: "Lingala", region: "Central Africa", speakers: "15+ million" },
    { name: "Chichewa", region: "Southern Africa", speakers: "12+ million" },
    { name: "Arabic", region: "North Africa", speakers: "170+ million" }
  ];

  const useCases = [
    {
      title: "Multilingual Customer Support",
      description: "Enable businesses to provide customer support in multiple African languages through chatbots and automated systems.",
      industry: "Retail, Telecom, Banking"
    },
    {
      title: "Content Localization",
      description: "Automatically translate content into various African languages while preserving cultural context and meaning.",
      industry: "Media, Education, Government"
    },
    {
      title: "Voice-Enabled Services",
      description: "Create voice interfaces that understand African accents and languages for services accessible to non-literate populations.",
      industry: "Healthcare, Agriculture, Public Services"
    },
    {
      title: "Social Media Monitoring",
      description: "Track brand mentions and sentiment across social media in multiple African languages.",
      industry: "Marketing, Public Relations, Political Organizations"
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
              <h1 className="heading-xl mb-6">Natural Language Processing</h1>
              <p className="text-xl mb-8">
                NLP solutions that understand and process African languages, dialects, and communication patterns.
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
                      src="/images/nlp.jpg"
                      alt="Natural Language Processing"
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

      {/* Languages Section */}
      <motion.div 
        className="bg-gray-100 py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12 text-primary font-bold">Supported African Languages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {languages.map((language, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-xl font-bold mb-1 text-primary">{language.name}</h3>
                <p className="text-sm text-gray-700 mb-1">Region: {language.region}</p>
                <p className="text-sm text-gray-700">Speakers: {language.speakers}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Use Cases Section */}
      <motion.div 
        className="container-custom py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
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
      </motion.div>

      {/* Technology Section */}
      <motion.div 
        className="bg-gray-100 py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12 text-primary font-bold">Our NLP Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Data Collection & Corpus Building</h3>
              <p className="text-gray-700 mb-4">
                We've built extensive language datasets for African languages, collecting data from:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Local news sources and publications</li>
                <li>Social media conversations</li>
                <li>Government documents and records</li>
                <li>Academic research and literature</li>
                <li>Community partnerships and contributions</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Model Training & Optimization</h3>
              <p className="text-gray-700 mb-4">
                Our NLP models are:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Fine-tuned for African linguistic structures</li>
                <li>Optimized for low-resource languages</li>
                <li>Continuously improved with new data</li>
                <li>Designed to work with limited computational resources</li>
                <li>Adaptable to regional dialects and variations</li>
              </ul>
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
          <h2 className="heading-lg mb-6 font-bold">Ready to Break Language Barriers?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with a free consultation to discuss how our NLP solutions can help your business communicate effectively in African languages.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-white text-primary font-semibold py-2 px-6 rounded-md hover:bg-gray-200 hover:shadow-lg transition-all">
              Book a Consultation
            </Link>
            <Link href="/services" className="border-2 border-white text-white font-semibold py-2 px-6 rounded-md hover:bg-white hover:text-primary hover:border-white transition-all">
              View All Services
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
