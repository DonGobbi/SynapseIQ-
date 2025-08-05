'use client';

import React, { useState } from 'react';
import ProgressBar from '@/components/ProgressBar';
import BarChart from '@/components/BarChart';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaMobile, 
  FaDesktop,
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaChartArea,
  FaCalendarAlt,
  FaDownload
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Mock data for analytics
const analyticsData = {
  overview: {
    visitors: {
      total: 12458,
      trend: '+15%',
      isPositive: true
    },
    subscribers: {
      total: 843,
      trend: '+8%',
      isPositive: true
    },
    contacts: {
      total: 267,
      trend: '+12%',
      isPositive: true
    },
    bounceRate: {
      total: '32%',
      trend: '-3%',
      isPositive: true
    }
  },
  traffic: {
    sources: [
      { name: 'Organic Search', value: 45 },
      { name: 'Direct', value: 25 },
      { name: 'Social Media', value: 15 },
      { name: 'Referral', value: 10 },
      { name: 'Email', value: 5 }
    ],
    devices: [
      { name: 'Mobile', value: 62 },
      { name: 'Desktop', value: 35 },
      { name: 'Tablet', value: 3 }
    ],
    countries: [
      { name: 'Nigeria', value: 28 },
      { name: 'Kenya', value: 22 },
      { name: 'South Africa', value: 18 },
      { name: 'Ghana', value: 12 },
      { name: 'Ethiopia', value: 8 },
      { name: 'Others', value: 12 }
    ]
  },
  content: {
    popularPages: [
      { path: '/', title: 'Home Page', views: 5842 },
      { path: '/services/ai-consulting', title: 'AI Consulting Services', views: 2341 },
      { path: '/services/data-analytics', title: 'Data Analytics Services', views: 1987 },
      { path: '/blog/leveraging-ai-for-african-business-growth', title: 'Leveraging AI for African Business Growth', views: 1654 },
      { path: '/contact', title: 'Contact Page', views: 1432 }
    ],
    engagementRate: {
      blog: '68%',
      services: '72%',
      about: '45%',
      contact: '83%'
    }
  },
  conversions: {
    contactSubmissions: [
      { month: 'Jan', value: 18 },
      { month: 'Feb', value: 22 },
      { month: 'Mar', value: 25 },
      { month: 'Apr', value: 30 },
      { month: 'May', value: 28 },
      { month: 'Jun', value: 35 },
      { month: 'Jul', value: 42 },
      { month: 'Aug', value: 45 }
    ],
    newsletterSignups: [
      { month: 'Jan', value: 65 },
      { month: 'Feb', value: 72 },
      { month: 'Mar', value: 85 },
      { month: 'Apr', value: 92 },
      { month: 'May', value: 104 },
      { month: 'Jun', value: 115 },
      { month: 'Jul', value: 125 },
      { month: 'Aug', value: 135 }
    ]
  }
};

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  
  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Monitor website performance and user engagement
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="relative inline-block">
              <label htmlFor="time-range-select" className="sr-only">Select time range</label>
              <select
                id="time-range-select"
                aria-label="Select time range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="block appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="12m">Last 12 months</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <FaDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Visitors Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                <FaUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Visitors
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(analyticsData.overview.visitors.total)}
                  </p>
                  <p className={`ml-2 text-sm font-medium ${
                    analyticsData.overview.visitors.isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {analyticsData.overview.visitors.trend}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscribers Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                <FaEnvelope className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Newsletter Subscribers
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(analyticsData.overview.subscribers.total)}
                  </p>
                  <p className={`ml-2 text-sm font-medium ${
                    analyticsData.overview.subscribers.isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {analyticsData.overview.subscribers.trend}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contacts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                <FaPhone className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact Submissions
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(analyticsData.overview.contacts.total)}
                  </p>
                  <p className={`ml-2 text-sm font-medium ${
                    analyticsData.overview.contacts.isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {analyticsData.overview.contacts.trend}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bounce Rate Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                <FaChartLine className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bounce Rate
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analyticsData.overview.bounceRate.total}
                  </p>
                  <p className={`ml-2 text-sm font-medium ${
                    analyticsData.overview.bounceRate.isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {analyticsData.overview.bounceRate.trend}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Traffic Sources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Traffic Sources
          </h3>
          
          <div className="space-y-4">
            {analyticsData.traffic.sources.map((source, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source.name}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source.value}%</span>
                </div>
                <ProgressBar 
                  value={source.value} 
                  className="bg-blue-600" 
                  ariaLabel={`${source.name} traffic source: ${source.value}%`} 
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Device Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Device Distribution
          </h3>
          
          <div className="flex items-center justify-around">
            {analyticsData.traffic.devices.map((device, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-2">
                  {device.name === 'Mobile' && <FaMobile className="h-8 w-8 text-blue-500" />}
                  {device.name === 'Desktop' && <FaDesktop className="h-8 w-8 text-green-500" />}
                  {device.name === 'Tablet' && <FaGlobe className="h-8 w-8 text-purple-500" />}
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{device.value}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{device.name}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Popular Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Popular Content
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Page
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Path
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analyticsData.content.popularPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {page.path}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      {formatNumber(page.views)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Conversion Trends Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Conversion Trends
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Submissions Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Contact Submissions
            </h3>
            
            <BarChart 
              data={analyticsData.conversions.contactSubmissions}
              maxValue={50}
              color="bg-blue-500"
              title="Contact Submissions"
            />
          </div>
          
          {/* Newsletter Signups Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Newsletter Signups
            </h3>
            
            <BarChart 
              data={analyticsData.conversions.newsletterSignups}
              maxValue={150}
              color="bg-green-500"
              title="Newsletter Signups"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
