"use client";

import Link from 'next/link';
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white transition-colors duration-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">SynapseIQ</h3>
            <p className="mb-4 text-gray-300">
              Empowering African businesses with AI-driven tools that cut costs, improve services, and unlock new opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" title="Follow us on Twitter" aria-label="Follow us on Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" title="Connect with us on LinkedIn" aria-label="Connect with us on LinkedIn">
                <FaLinkedinIn size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" title="Like us on Facebook" aria-label="Like us on Facebook">
                <FaFacebookF size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" title="Follow us on Instagram" aria-label="Follow us on Instagram">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-gray-300 hover:text-white">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/chatbots" className="text-gray-300 hover:text-white">
                  AI Chatbot Development
                </Link>
              </li>
              <li>
                <Link href="/services/automation" className="text-gray-300 hover:text-white">
                  Business Process Automation
                </Link>
              </li>
              <li>
                <Link href="/services/machine-learning" className="text-gray-300 hover:text-white">
                  Machine Learning & Data Science
                </Link>
              </li>
              <li>
                <Link href="/services/nlp" className="text-gray-300 hover:text-white">
                  Natural Language Processing
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">AI in Africa, Straight to Your Inbox</h3>
            <p className="mb-4 text-gray-300">
              Sign up for monthly insights on how African companies are using AI to transform business and community impact.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md focus:outline-none text-dark"
              />
              <button type="submit" className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90">
                Join the List
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SynapseIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
