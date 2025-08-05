"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUserTie, FaBuilding, FaLaptopCode } from 'react-icons/fa';

const ConsultationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    industry: 'finance',
    serviceType: 'ai-strategy',
    preferredDate: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real implementation, this would be an API call
      // await fetch('/api/consultation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        industry: 'finance',
        serviceType: 'ai-strategy',
        preferredDate: '',
        message: '',
      });
    } catch (error) {
      setSubmitError('There was an error scheduling your consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = [
    { value: 'finance', label: 'Financial Services & SACCOs' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'government', label: 'Government & Public Sector' },
    { value: 'education', label: 'Education' },
    { value: 'telecom', label: 'Telecommunications' },
    { value: 'ngo', label: 'NGOs & Development Organizations' },
    { value: 'other', label: 'Other' }
  ];

  const serviceTypes = [
    { value: 'ai-strategy', label: 'AI Strategy Consulting' },
    { value: 'data-analytics', label: 'Data Analytics & Insights' },
    { value: 'process-automation', label: 'Process Automation' },
    { value: 'chatbot', label: 'Conversational AI & Chatbots' },
    { value: 'custom-ai', label: 'Custom AI Solution Development' },
    { value: 'other', label: 'Other Services' }
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-secondary text-white py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="heading-xl mb-6">Book a Consultation</h1>
            <p className="text-lg md:text-xl mb-8">
              Schedule a personalized consultation with our AI experts to discuss how we can help transform your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Consultation Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg lg:col-span-3"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Schedule Your Consultation</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold mb-2">Thank You for Scheduling a Consultation!</h3>
                  <p className="mb-4">We've received your request and will contact you within 24 hours to confirm your appointment and provide further details.</p>
                  <p>In the meantime, you might want to explore our <Link href="/services" className="text-primary font-medium hover:underline">services</Link> or <Link href="/industries" className="text-primary font-medium hover:underline">industry solutions</Link>.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="industry" className="block text-gray-700 mb-2">Industry *</label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {industries.map((industry) => (
                          <option key={industry.value} value={industry.value}>
                            {industry.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="serviceType" className="block text-gray-700 mb-2">Service Type *</label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {serviceTypes.map((service) => (
                          <option key={service.value} value={service.value}>
                            {service.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="preferredDate" className="block text-gray-700 mb-2">Preferred Date for Consultation</label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2">Tell us about your business challenges *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                      {submitError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors w-full md:w-auto"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                  </button>
                </form>
              )}
            </motion.div>
            
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">What to Expect</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <FaCalendarAlt className="text-primary text-xl mt-1 mr-3 flex-shrink-0" />
                    <p>A 45-minute video or in-person consultation with one of our AI strategy experts</p>
                  </li>
                  <li className="flex items-start">
                    <FaUserTie className="text-primary text-xl mt-1 mr-3 flex-shrink-0" />
                    <p>Discussion of your business challenges and how AI can address them</p>
                  </li>
                  <li className="flex items-start">
                    <FaBuilding className="text-primary text-xl mt-1 mr-3 flex-shrink-0" />
                    <p>Industry-specific insights and case studies relevant to your business</p>
                  </li>
                  <li className="flex items-start">
                    <FaLaptopCode className="text-primary text-xl mt-1 mr-3 flex-shrink-0" />
                    <p>Initial recommendations and potential next steps for implementation</p>
                  </li>
                </ul>
              </div>
              
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg mt-6">
                <Image 
                  src="/images/consulting-team.png" 
                  alt="SynapseIQ consultation" 
                  fill 
                  style={{ objectFit: 'cover', objectPosition: 'center top' }} 
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12 text-gray-800">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg shadow-md"
            >
              <p className="text-lg italic mb-4 text-gray-700">
                "The consultation with SynapseIQ was eye-opening. They helped us identify AI opportunities we hadn't considered and provided a clear roadmap for implementation."
              </p>
              <p className="font-bold text-gray-800">David Ochieng</p>
              <p className="text-gray-600">CTO, Nairobi Retail Solutions</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-lg shadow-md"
            >
              <p className="text-lg italic mb-4 text-gray-700">
                "What impressed me most was how well they understood the unique challenges of operating in African markets. Their recommendations were practical and tailored to our infrastructure realities."
              </p>
              <p className="font-bold text-gray-800">Amina Diallo</p>
              <p className="text-gray-600">Operations Director, West African Healthcare</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-lg mb-4">Not Ready for a Consultation Yet?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore our services or contact us with any questions you might have.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services" className="bg-white text-primary font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-all">
                Explore Services
              </Link>
              <Link href="/contact" className="border-2 border-white text-white font-semibold py-2 px-6 rounded-md hover:bg-white hover:bg-opacity-10 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ConsultationPage;
