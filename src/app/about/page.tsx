"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaHandshake, FaGlobeAfrica } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AboutPage = () => {
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

  const teamMembers = [
    {
      name: "Don Nshombo",
      role: "Founder & CEO",
      bio: "Master's in Computer Science with 10 years experience in AI research and implementation across African markets."
    },
    {
      name: "Kwame Nkrumah",
      role: "CTO",
      bio: "Former Google AI engineer with expertise in machine learning and natural language processing for African languages."
    },
    {
      name: "Nala Diallo",
      role: "Head of Business Development",
      bio: "MBA with extensive experience connecting AI solutions to business needs across various African industries."
    },
    {
      name: "Jessie Bwanaphiri",
      role: "Lead AI Consultant",
      bio: "Specialist in implementing AI strategies for businesses transitioning to digital-first operations."
    }
  ];

  const values = [
    {
      icon: <FaUsers className="text-4xl text-primary mb-4" />,
      title: "African-Centered Solutions",
      description: "We build AI solutions specifically designed for African contexts, challenges, and opportunities."
    },
    {
      icon: <FaLightbulb className="text-4xl text-primary mb-4" />,
      title: "Innovation with Purpose",
      description: "Our innovations are driven by real needs and focused on creating meaningful impact."
    },
    {
      icon: <FaHandshake className="text-4xl text-primary mb-4" />,
      title: "Collaborative Approach",
      description: "We work closely with our clients to ensure solutions are tailored to their specific needs."
    },
    {
      icon: <FaGlobeAfrica className="text-4xl text-primary mb-4" />,
      title: "Pan-African Vision",
      description: "We're committed to advancing AI adoption across the entire African continent."
    }
  ];

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
            <h1 className="heading-xl mb-6 text-primary">About SynapseIQ</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              Pioneering AI solutions tailored for African businesses and organizations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg mb-6">Our Story</h2>
              <p className="mb-4 text-gray-700">
                Founded in 2022, SynapseIQ emerged from a vision to bridge the AI adoption gap in African markets. 
                Our founders recognized that while artificial intelligence was transforming businesses globally, 
                solutions weren't being adequately tailored to African contexts and challenges.
              </p>
              <p className="mb-4 text-gray-700">
                We started with a small team of AI specialists and business consultants focused on creating 
                accessible, relevant AI tools for local businesses. Today, we've grown into a comprehensive 
                AI solutions provider serving clients across multiple African countries.
              </p>
              <p className="text-gray-700">
                Our mission remains constant: to empower African businesses with AI solutions that are 
                accessible, effective, and designed specifically for local contexts and challenges.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image 
                src="/images/team-meeting.png" 
                alt="SynapseIQ team meeting" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-gray-800">Our Values</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              These core principles guide our approach to developing AI solutions for Africa.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                {value.icon}
                <h3 className="text-xl font-bold mb-2 text-gray-800">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-primary font-bold">Our Team</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Meet the experts behind SynapseIQ's innovative AI solutions.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <div className="relative h-full w-full p-2">
                    <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                      {index === 0 && (
                        <Image 
                          src="/images/Founder.png" 
                          alt="Don Nshombo" 
                          width={128} 
                          height={128} 
                          className="object-cover h-full w-full" 
                        />
                      )}
                      {index === 2 && (
                        <Image 
                          src="/images/Head_Bus_Development.jpg" 
                          alt="Nala Diallo" 
                          width={128} 
                          height={128} 
                          className="object-cover h-full w-full" 
                        />
                      )}
                      {index === 3 && (
                        <Image 
                          src="/images/Lead AI_Consultant.jpg" 
                          alt="Jessie Bwanaphiri" 
                          width={128} 
                          height={128} 
                          className="object-cover h-full w-full" 
                        />
                      )}
                      {index === 1 && (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <span className="text-3xl font-bold">KN</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
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
            <h2 className="heading-lg mb-6">Ready to Transform Your Business with AI?</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Join the growing number of African businesses leveraging our AI solutions to improve operations, 
              reduce costs, and create new opportunities.
            </p>
            <Link href="/consultation" className="btn-white inline-block">
              Contact Us Today
            </Link>
          </motion.div>
        </div>
      </section>
      </div>
      <Footer />
    </main>
  );
};

export default AboutPage;
