"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChartLine, FaRoad, FaCalculator, FaUserGraduate, FaHeadset } from 'react-icons/fa';

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

export default function ConsultingPage() {
  const features = [
    {
      icon: <FaChartLine className="text-3xl text-blue-500" />,
      title: "AI Readiness Assessment",
      description: "Comprehensive evaluation of your organization's readiness to adopt AI solutions in the African context."
    },
    {
      icon: <FaRoad className="text-3xl text-green-500" />,
      title: "Technology Roadmap",
      description: "Strategic planning for AI implementation tailored to African business environments and infrastructure."
    },
    {
      icon: <FaCalculator className="text-3xl text-purple-500" />,
      title: "Cost-Benefit Analysis",
      description: "Detailed analysis of potential ROI from AI investments, considering local market conditions and constraints."
    },
    {
      icon: <FaUserGraduate className="text-3xl text-orange-500" />,
      title: "Staff Training",
      description: "Customized training programs to build internal AI capabilities within your African organization."
    },
    {
      icon: <FaHeadset className="text-3xl text-red-500" />,
      title: "Ongoing Support",
      description: "Continuous guidance and optimization of AI strategies as your business and the African market evolve."
    }
  ];

  const consultingProcess = [
    {
      step: 1,
      title: "Discovery",
      description: "We assess your current state, business goals, and challenges specific to operating in African markets."
    },
    {
      step: 2,
      title: "Strategy Development",
      description: "We create a customized AI strategy aligned with your business objectives and African market realities."
    },
    {
      step: 3,
      title: "Implementation Planning",
      description: "We develop a detailed roadmap for AI adoption, including technology selection, resource allocation, and timeline."
    },
    {
      step: 4,
      title: "Capacity Building",
      description: "We train your team and establish the necessary infrastructure to support AI initiatives."
    },
    {
      step: 5,
      title: "Execution Support",
      description: "We provide ongoing guidance during implementation to ensure successful adoption."
    },
    {
      step: 6,
      title: "Evaluation & Refinement",
      description: "We measure results and continuously refine the strategy based on outcomes and changing market conditions."
    }
  ];

  const industries = [
    "Financial Services & SACCOs",
    "Healthcare",
    "Agriculture",
    "Retail & E-commerce",
    "Manufacturing",
    "Government & Public Sector",
    "Education",
    "Telecommunications",
    "NGOs & Development Organizations"
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
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
              <h1 className="heading-xl mb-6">AI Strategy Consulting</h1>
              <p className="text-xl mb-8">
                Expert guidance on implementing AI solutions that address unique challenges and opportunities in African markets.
              </p>
              <Link href="/consultation" className="btn-primary">
                Book a Consultation
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                <div className="relative h-full w-full p-2">
                  <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src="/images/consulting-team.png"
                      alt="AI Strategy Consulting"
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
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-primary font-bold">Our Consulting Services</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Comprehensive AI strategy services tailored for African businesses.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 text-4xl text-primary">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-100 text-gray-800">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-primary font-bold">Our Consulting Process</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              A structured approach to AI strategy development and implementation.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultingProcess.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">{process.title}</h3>
                <p className="text-gray-700">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4 text-primary font-bold">Industries We Serve</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our consulting expertise spans across key sectors in the African economy.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-50 py-2 px-4 rounded-full text-gray-700 font-medium"
              >
                {industry}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-100 text-gray-800">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12 text-primary font-bold">Why Choose SynapseIQ Consulting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">African Market Expertise</h3>
              <p className="text-gray-700">
                Our consultants have deep understanding of African business environments, challenges, and opportunities.
                We've worked with organizations across the continent and understand the unique considerations for AI implementation in Africa.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Practical Implementation Focus</h3>
              <p className="text-gray-700">
                We don't just provide theoretical strategies. Our recommendations are practical, actionable, and designed
                to work within the constraints and realities of African infrastructure and business environments.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Technology Agnostic</h3>
              <p className="text-gray-700">
                We're not tied to specific vendors or technologies. Our recommendations are based solely on what will
                work best for your specific needs, considering factors like cost, infrastructure requirements, and local support.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Capacity Building</h3>
              <p className="text-gray-700">
                We focus on transferring knowledge and building internal capabilities within your organization,
                ensuring sustainable AI adoption that doesn't create ongoing dependency on external consultants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container-custom">
          <div className="bg-gray-50 rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <div className="relative h-full w-full p-2">
                    <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image
                        src="/images/consulting-team.png"
                        alt="Sarah Mwangi, CTO"
                        width={100}
                        height={100}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-3/4">
                <p className="text-lg italic mb-4 text-gray-700">
                  "SynapseIQ's consulting team helped us navigate the complex landscape of AI adoption in Kenya.
                  Their understanding of local market conditions and practical approach to implementation made all the difference.
                  We've seen a 40% increase in operational efficiency since implementing their recommendations."
                </p>
                <p className="font-bold text-gray-800">Sarah Mwangi</p>
                <p className="text-gray-600">CTO, Savannah Financial Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-lg mb-4 font-bold">Ready to Transform Your Business with AI?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Book a free initial consultation to discuss your business challenges and how AI can help address them.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/consultation" className="bg-white text-primary font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-all">
                Book a Consultation
              </Link>
              <Link href="/services" className="border-2 border-white text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-100 hover:text-primary hover:border-blue-100 transition-all">
                Explore All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
