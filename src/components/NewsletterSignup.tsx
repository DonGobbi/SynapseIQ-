"use client";

import { useState } from 'react';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Get the API URL from environment variable or use default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Send subscription data to backend API
      const response = await fetch(`${apiUrl}/contact/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to subscribe');
      }
      
      setSubmitSuccess(true);
      setEmail('');
      setName('');
    } catch (error: any) {
      setSubmitError(error.message || 'There was an error subscribing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-primary-light p-8 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <FaEnvelope className="text-primary text-xl mr-2" />
        <h3 className="text-xl font-bold text-gray-800">Subscribe to Our Newsletter</h3>
      </div>
      
      <p className="text-gray-700 mb-6">
        Stay updated with the latest AI trends and SynapseIQ news for African businesses.
      </p>
      
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          Thank you for subscribing to our newsletter!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              {submitError}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="newsletter-name" className="block text-gray-700 mb-2">Name (Optional)</label>
            <input
              type="text"
              id="newsletter-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="newsletter-email" className="block text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              id="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSignup;
