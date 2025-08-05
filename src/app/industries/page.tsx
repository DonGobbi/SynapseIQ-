"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHospital, FaGraduationCap, FaMoneyBill, FaSeedling } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const IndustriesPage = () => {
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

  const industries = [
    {
      icon: <FaShoppingCart className="text-4xl text-primary mb-4" />,
      title: 'Retail & E-Commerce',
      description: 'AI-powered inventory management, customer insights, and personalized shopping experiences tailored for African retail environments.',
      link: '/industries/retail',
      features: [
        'WhatsApp shop assistants',
        'Inventory forecasting for unreliable supply chains',
        'Customer behavior analysis',
        'Multilingual chatbots for customer service',
        'Mobile payment integration'
      ]
    },
    {
      icon: <FaHospital className="text-4xl text-primary mb-4" />,
      title: 'Healthcare',
      description: 'Improving healthcare delivery with AI solutions that work within the constraints of African healthcare systems.',
      link: '/industries/healthcare',
      features: [
        'Patient record digitization and management',
        'Diagnostic assistance tools',
        'Medication inventory management',
        'Healthcare worker training systems',
        'Remote patient monitoring'
      ]
    },
    {
      icon: <FaGraduationCap className="text-4xl text-primary mb-4" />,
      title: 'Education',
      description: 'Enhancing learning outcomes with AI tools designed for diverse African educational contexts.',
      link: '/industries/education',
      features: [
        'Multilingual learning platforms',
        'Automated grading systems',
        'Personalized learning paths',
        'Educational content recommendation',
        'Teacher support tools'
      ]
    },
    {
      icon: <FaMoneyBill className="text-4xl text-primary mb-4" />,
      title: 'Finance & SACCOs',
      description: 'Empowering financial institutions with AI tools that improve efficiency, reduce risk, and expand financial inclusion.',
      link: '/industries/finance',
      features: [
        'Credit risk assessment for informal businesses',
        'Fraud detection systems',
        'Automated customer onboarding',
        'Financial literacy chatbots',
        'Mobile banking enhancements'
      ]
    },
    {
      icon: <FaSeedling className="text-4xl text-primary mb-4" />,
      title: 'Agriculture',
      description: 'Supporting farmers and agribusinesses with AI solutions that increase yields, reduce waste, and improve market access.',
      link: '/industries/agriculture',
      features: [
        'Crop disease detection via smartphone',
        'Weather prediction and advisory',
        'Supply chain optimization',
        'Market price forecasting',
        'Soil health analysis'
      ]
    }
  ];

  return (
    <main>
      <Header />
      <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-light to-white py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="heading-xl mb-6 text-primary">Industries We Serve</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              AI solutions tailored for Africa's diverse sectors and unique challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Overview */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-16"
          >
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="mb-4">{industry.icon}</div>
                  <h2 className="heading-lg mb-4 text-gray-800">{industry.title}</h2>
                  <p className="text-gray-700 mb-6">{industry.description}</p>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">How We Help</h3>
                  <ul className="mb-6">
                    {industry.features.map((feature, i) => (
                      <li key={i} className="mb-2 flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={industry.link} className="btn-primary inline-block">
                    Learn More
                  </Link>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                    {index === 0 ? (
                      <Image 
                        src="/images/industry_retail.jpg" 
                        alt="Retail & E-Commerce industry" 
                        fill 
                        style={{ objectFit: 'cover', objectPosition: 'center' }} 
                        className="rounded-lg"
                        sizes="100%"
                        priority
                      />
                    ) : index === 1 ? (
                      <Image 
                        src="/images/industry_healthcare.jpg" 
                        alt="Healthcare industry" 
                        fill 
                        style={{ objectFit: 'cover', objectPosition: 'center' }} 
                        className="rounded-lg"
                        sizes="100%"
                        priority
                      />
                    ) : index === 2 ? (
                      <Image 
                        src="/images/industry-Education.png" 
                        alt="Education industry" 
                        fill 
                        style={{ objectFit: 'cover', objectPosition: 'center' }} 
                        className="rounded-lg"
                        sizes="100%"
                        priority
                      />
                    ) : index === 3 ? (
                      <Image 
                        src="/images/industry_Finance.png" 
                        alt="Finance & SACCOs industry" 
                        fill 
                        style={{ objectFit: 'cover', objectPosition: 'center' }} 
                        className="rounded-lg"
                        sizes="100%"
                        priority
                      />
                    ) : index === 4 ? (
                      <Image 
                        src="/images/industry_agriculture.png" 
                        alt="Agriculture industry" 
                        fill 
                        style={{ objectFit: 'cover', objectPosition: 'center' }} 
                        className="rounded-lg"
                        sizes="100%"
                        priority
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-primary text-5xl mb-4">{industry.icon}</div>
                          <h3 className="text-xl font-bold text-gray-800">{industry.title}</h3>
                          <p className="text-gray-600 mt-2">Image placeholder</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
            <h2 className="heading-lg mb-6">Ready to Transform Your Industry with AI?</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Book a consultation to discuss how our AI solutions can address your specific industry challenges.
            </p>
            <Link href="/consultation" className="btn-white inline-block">
              Book a Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
      <Footer />
    </main>
  );
};

export default IndustriesPage;
