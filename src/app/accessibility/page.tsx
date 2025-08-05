"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUniversalAccess, FaKeyboard, FaEye, FaAssistiveListeningSystems, FaBrain } from 'react-icons/fa';
import PageTransition from '@/components/PageTransition';
import AccessibilityChecker from '@/components/AccessibilityChecker';
import Button from '@/components/Button';

export default function AccessibilityPage() {
  const [showChecker, setShowChecker] = useState(false);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-blue-400 mb-6">
            Accessibility at SynapseIQ
          </h1>
          
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            At SynapseIQ, we are committed to ensuring our website is accessible to everyone, 
            including people with disabilities. We strive to meet WCAG 2.1 AA standards and 
            continuously work to improve the accessibility of our digital content.
          </p>

          <Button 
            onClick={() => setShowChecker(true)}
            variant="primary"
            size="lg"
            className="mb-12"
          >
            <FaUniversalAccess className="mr-2" />
            Run Accessibility Checker
          </Button>

          {showChecker && <AccessibilityChecker onClose={() => setShowChecker(false)} />}

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary dark:bg-blue-600 p-3 rounded-full text-white mr-4">
                  <FaKeyboard size={24} />
                </div>
                <h2 className="text-2xl font-bold">Keyboard Navigation</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Our website is fully navigable using a keyboard. Use the Tab key to move between 
                interactive elements, Enter to activate buttons and links, and Escape to close 
                dialogs and menus.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary dark:bg-blue-600 p-3 rounded-full text-white mr-4">
                  <FaEye size={24} />
                </div>
                <h2 className="text-2xl font-bold">Visual Accessibility</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                We maintain sufficient color contrast for text and interactive elements. Our 
                dark mode option can help users with light sensitivity, and we use clear, 
                readable fonts throughout the site.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary dark:bg-blue-600 p-3 rounded-full text-white mr-4">
                  <FaAssistiveListeningSystems size={24} />
                </div>
                <h2 className="text-2xl font-bold">Screen Reader Support</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Our website is built with proper semantic HTML and ARIA attributes to ensure 
                compatibility with screen readers. All images have descriptive alt text, and 
                interactive elements have appropriate labels.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary dark:bg-blue-600 p-3 rounded-full text-white mr-4">
                  <FaBrain size={24} />
                </div>
                <h2 className="text-2xl font-bold">Cognitive Accessibility</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                We use clear language, consistent navigation, and predictable interactions 
                throughout our site. Content is organized with headings and sections to make 
                information easier to process and understand.
              </p>
            </motion.div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Accessibility Feedback</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We welcome your feedback on the accessibility of our website. If you encounter any 
              barriers or have suggestions for improvement, please contact us:
            </p>
            <ul className="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300">
              <li>Email: <a href="mailto:accessibility@synapseiq.com" className="text-primary dark:text-blue-400 hover:underline">accessibility@synapseiq.com</a></li>
              <li>Phone: +254 700 000 000</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              We are committed to addressing accessibility issues promptly and will provide 
              alternative formats or assistance for any content that is not accessible.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
