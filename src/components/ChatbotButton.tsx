"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes, FaWhatsapp, FaRobot, FaEnvelope, FaPhone } from 'react-icons/fa';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  
  const welcomeMessage = "Hello! How can I help you today? Our AI team is ready to assist with your business needs in Africa.";
  
  // API URL for backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    if (isOpen) {
      // Reset states when chat opens
      setTypingText('');
      setShowFullMessage(false);
      setSelectedOption(null);
      
      // Simulate typing animation
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < welcomeMessage.length) {
          setTypingText(prev => prev + welcomeMessage.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setShowFullMessage(true);
        }
      }, 30);
      
      return () => clearInterval(typingInterval);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleOptionSelect = async (option: string) => {
    setIsLoading(true);
    setSelectedOption(option);
    
    // Prepare message based on selected option
    let userMessage = '';
    if (option === 'services') {
      userMessage = 'What AI services do you offer?';
    } else if (option === 'pricing') {
      userMessage = 'Tell me about your pricing options.';
    } else if (option === 'demo') {
      userMessage = 'I would like to request a demo.';
    }
    
    // Add user message to chat history
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(updatedMessages);
    
    try {
      // Call backend API
      const response = await fetch(`${API_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      
      // Add AI response to chat history
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: data.response }
      ]);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      // Use fallback responses if API fails
      let fallbackResponse = '';
      if (option === 'services') {
        fallbackResponse = 'We offer AI solutions for businesses across Africa, including NLP for local languages, predictive analytics, and custom chatbots.';
      } else if (option === 'pricing') {
        fallbackResponse = 'Our pricing is tailored to your specific needs. We offer flexible packages starting from $500 for small businesses.';
      } else if (option === 'demo') {
        fallbackResponse = 'We would love to show you a demo! Please provide your email or contact us via WhatsApp to schedule one.';
      }
      
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: fallbackResponse }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-xl p-4 mb-4 w-72"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 p-1.5 rounded-full">
                  <FaRobot className="text-white text-sm" />
                </div>
                <h3 className="font-bold text-primary dark:text-blue-400">SynapseIQ AI</h3>
              </div>
              <button 
                onClick={toggleChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Close chat"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2">
                <div className="bg-blue-500 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                  <FaRobot className="text-white text-xs" />
                </div>
                <div>
                  {selectedOption ? (
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {isLoading ? (
                        <span>Thinking<span className="animate-pulse">...</span></span>
                      ) : (
                        messages.length > 0 && messages[messages.length - 1].role === 'assistant' && 
                        messages[messages.length - 1].content
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {typingText}
                      {!showFullMessage && <span className="inline-block w-2 h-4 bg-gray-500 ml-0.5 animate-pulse">|</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {showFullMessage && !selectedOption && (
              <div className="grid grid-cols-1 gap-2 mb-3">
                <button 
                  onClick={() => handleOptionSelect('services')}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-primary dark:text-blue-300 py-2 px-3 rounded-lg text-sm transition-colors text-left"
                >
                  <span className="bg-blue-100 dark:bg-blue-800 p-1 rounded-full"><FaRobot className="text-xs text-primary dark:text-blue-300" /></span>
                  What AI services do you offer?
                </button>
                <button 
                  onClick={() => handleOptionSelect('pricing')}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-primary dark:text-blue-300 py-2 px-3 rounded-lg text-sm transition-colors text-left"
                >
                  <span className="bg-blue-100 dark:bg-blue-800 p-1 rounded-full"><FaRobot className="text-xs text-primary dark:text-blue-300" /></span>
                  Tell me about pricing
                </button>
                <button 
                  onClick={() => handleOptionSelect('demo')}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-primary dark:text-blue-300 py-2 px-3 rounded-lg text-sm transition-colors text-left"
                >
                  <span className="bg-blue-100 dark:bg-blue-800 p-1 rounded-full"><FaRobot className="text-xs text-primary dark:text-blue-300" /></span>
                  I'd like to see a demo
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <a 
                href="https://wa.me/265996873573" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm transition-colors justify-center flex-1"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a 
                href="mailto:info@synapseiq.com" 
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg text-sm transition-colors justify-center flex-1"
              >
                <FaEnvelope /> Email
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat button */}
      <motion.button
        onClick={toggleChat}
        className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaRobot className="text-2xl" />
        )}
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </motion.button>
    </div>
  );
};

export default ChatbotButton;
