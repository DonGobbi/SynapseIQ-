"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaSpinner } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NewsletterSignup from '../../components/NewsletterSignup';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
      // Get the API URL from environment variable or use default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Send form data to backend API
      const response = await fetch(`${apiUrl}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit form');
      }
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      setSubmitError(error.message || 'There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Header />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-light to-white py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="heading-xl mb-6 text-primary">Contact Us</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              Have questions about our AI solutions or company? Get in touch with our team today.
              For consultation bookings, please visit our <Link href="/consultation" className="text-primary hover:underline">consultation page</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                  Thank you for your message! We'll get back to you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                      {submitError}
                    </div>
                  )}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="mb-4">
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
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-2">Message *</label>
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
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                      {submitError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-primary text-xl mt-1 mr-4" />
                    <div>
                      <h3 className="font-bold">Our Office</h3>
                      <p>Area 14, Plot 151<br />Lilongwe, Malawi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaPhone className="text-primary text-xl mt-1 mr-4" />
                    <div>
                      <h3 className="font-bold">Phone</h3>
                      <p>+265 996 873 573</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="text-primary text-xl mt-1 mr-4" />
                    <div>
                      <h3 className="font-bold">Email</h3>
                      <p>dongobbinshombo@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaWhatsapp className="text-primary text-xl mt-1 mr-4" />
                    <div>
                      <h3 className="font-bold">WhatsApp</h3>
                      <p>+265 996 873 573</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src="/images/team-collaboration.png" 
                  alt="SynapseIQ office location" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <NewsletterSignup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-gray-800">Frequently Asked Questions</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Find quick answers to common questions about our services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md mb-4"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">How quickly can you implement an AI solution?</h3>
              <p className="text-gray-700">Implementation timelines vary based on the complexity of your needs. Simple automations can be deployed in 2-4 weeks, while more complex solutions may take 2-3 months. We'll provide a detailed timeline during our initial consultation. <Link href="/consultation" className="text-primary hover:underline">Book a consultation</Link> to discuss your specific needs.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md mb-4"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">Do you offer services outside of Malawi?</h3>
              <p className="text-gray-700">Yes, we serve clients across Africa. We have experience working with businesses in Nigeria, Ghana, South Africa, Kenya, and several other African countries. Our solutions are designed to address the unique challenges of various African markets.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md mb-4"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">What industries do you specialize in?</h3>
              <p className="text-gray-700">We have expertise across multiple sectors including financial services, healthcare, agriculture, retail, manufacturing, and education. Our team has developed specialized AI solutions for each of these industries with an understanding of their unique challenges.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">Do you offer training for our team?</h3>
              <p className="text-gray-700">Yes, comprehensive training is included with all our implementations. We believe in knowledge transfer and ensuring your team can effectively use and maintain the AI solutions we develop. We also offer extended support packages for ongoing assistance.</p>
            </motion.div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </main>
  );
};

export default ContactPage;
