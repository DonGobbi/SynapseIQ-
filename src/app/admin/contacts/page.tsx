'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/contact/submissions`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Contact submissions response:', data);
        
        // Handle the response format from our backend
        if (data.submissions && Array.isArray(data.submissions)) {
          // Map the backend fields to match the frontend interface
          const formattedContacts = data.submissions.map((item: {
            id: number;
            name: string;
            email: string;
            subject: string;
            message: string;
            submitted_at: string;
            is_read: boolean;
          }) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            subject: item.subject,
            message: item.message,
            created_at: item.submitted_at // Map submitted_at to created_at
          }));
          setContacts(formattedContacts);
        } else {
          // Fallback for unexpected format
          setContacts([]);
          console.error('Unexpected API response format:', data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch contact submissions:', err);
        setError('Failed to load contact submissions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Contact Form Submissions
          </motion.h1>
          <Link href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          No contact submissions found
                        </td>
                      </tr>
                    ) : (
                      contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{contact.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{contact.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{contact.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{truncateText(contact.subject, 20)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(contact.created_at)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedContact ? 'Message Details' : 'Select a message to view details'}
              </h2>
              
              {selectedContact ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">From</h3>
                    <p className="text-base text-gray-900 dark:text-white">{selectedContact.name} ({selectedContact.email})</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</h3>
                    <p className="text-base text-gray-900 dark:text-white">{selectedContact.subject}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h3>
                    <p className="text-base text-gray-900 dark:text-white">{formatDate(selectedContact.created_at)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</h3>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <a 
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="mt-2">Select a message from the list to view its details</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
