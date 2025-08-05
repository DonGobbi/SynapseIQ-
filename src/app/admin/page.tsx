'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUsers, FaEnvelope, FaImage, FaNewspaper, FaChartBar, FaCog, FaComments, FaLock } from 'react-icons/fa';

// Mock data for analytics
const analyticsData = {
  visitors: {
    today: 124,
    week: 1243,
    month: 5678,
    trend: '+12.5%'
  },
  subscribers: {
    total: 458,
    active: 437,
    trend: '+5.2%'
  },
  contacts: {
    total: 89,
    unread: 12,
    trend: '+3.7%'
  }
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            SynapseIQ Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome back, Admin! Here's an overview of your website's performance.
          </p>
        </motion.div>

        {/* Analytics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaChartBar className="mr-2" /> Analytics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visitors Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Website Visitors</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.visitors.today}</h3>
                  <p className="text-xs text-green-500 mt-1">↑ {analyticsData.visitors.trend} from last week</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <FaUsers className="text-blue-500 dark:text-blue-300 text-xl" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Today</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{analyticsData.visitors.today}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">This Week</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{analyticsData.visitors.week}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">This Month</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{analyticsData.visitors.month}</p>
                </div>
              </div>
            </div>
            
            {/* Subscribers Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Newsletter Subscribers</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.subscribers.total}</h3>
                  <p className="text-xs text-green-500 mt-1">↑ {analyticsData.subscribers.trend} from last month</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <FaEnvelope className="text-green-500 dark:text-green-300 text-xl" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{analyticsData.subscribers.total}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Active</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{analyticsData.subscribers.active}</p>
                </div>
              </div>
            </div>
            
            {/* Contact Submissions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact Submissions</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.contacts.total}</h3>
                  <p className="text-xs text-green-500 mt-1">↑ {analyticsData.contacts.trend} from last month</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <FaComments className="text-purple-500 dark:text-purple-300 text-xl" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{analyticsData.contacts.total}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Unread</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200 text-red-500">{analyticsData.contacts.unread}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaCog className="mr-2" /> Content Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Newsletter Management */}
            <Link href="/admin/subscribers" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-500 dark:text-blue-300 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Newsletter</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Manage subscribers, send newsletters, and track engagement.</p>
              </div>
            </Link>
            
            {/* Media Library */}
            <Link href="/admin/media" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                    <FaImage className="text-green-500 dark:text-green-300 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Media Library</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Upload and manage images, videos, and documents.</p>
              </div>
            </Link>
            
            {/* Testimonials */}
            <Link href="/admin/testimonials" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full mr-4">
                    <FaComments className="text-yellow-500 dark:text-yellow-300 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Testimonials</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Add, edit, and showcase customer testimonials.</p>
              </div>
            </Link>
            
            {/* Blog Posts */}
            <Link href="/admin/blog" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
                    <FaNewspaper className="text-purple-500 dark:text-purple-300 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blog Posts</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Create, edit, and publish blog content.</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Communication & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4">
                  <FaUsers className="text-indigo-500 dark:text-indigo-300 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Management</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                View and respond to contact form submissions from potential clients and partners.
              </p>
              <Link href="/admin/contacts" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                View Contacts
              </Link>
            </div>
          </motion.div>
          
          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full mr-4">
                  <FaLock className="text-red-500 dark:text-red-300 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Manage admin accounts, permissions, and security settings.
              </p>
              <Link href="/admin/security" className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                Security Settings
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
