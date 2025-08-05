'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  FaHome, 
  FaEnvelope, 
  FaUsers, 
  FaImage, 
  FaNewspaper, 
  FaComments, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <FaHome className="mr-2" /> },
    { name: 'Subscribers', href: '/admin/subscribers', icon: <FaEnvelope className="mr-2" /> },
    { name: 'Contacts', href: '/admin/contacts', icon: <FaUsers className="mr-2" /> },
    { name: 'Media Library', href: '/admin/media', icon: <FaImage className="mr-2" /> },
    { name: 'Blog Posts', href: '/admin/blog', icon: <FaNewspaper className="mr-2" /> },
    { name: 'Testimonials', href: '/admin/testimonials', icon: <FaComments className="mr-2" /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <FaChartBar className="mr-2" /> },
    { name: 'Settings', href: '/admin/security', icon: <FaCog className="mr-2" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:flex bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <div className="relative w-10 h-10 mr-2 bg-white rounded-full flex items-center justify-center border-2 border-primary shadow-sm">
                <div className="relative w-8 h-8">
                  <Image 
                    src="/images/logo.png" 
                    alt="SynapseIQ Logo" 
                    fill 
                    style={{ objectFit: 'contain' }} 
                  />
                </div>
              </div>
              <span className="text-xl font-bold text-primary dark:text-blue-400">Synapse<span className="text-secondary dark:text-green-400">IQ</span></span>
            </Link>
            
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              <span className="mr-2 text-gray-700 dark:text-white">{user}</span>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.charAt(0).toUpperCase()}
              </div>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navbar */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 mr-2 bg-white rounded-full flex items-center justify-center border-2 border-primary shadow-sm">
              <div className="relative w-6 h-6">
                <Image 
                  src="/images/logo.png" 
                  alt="SynapseIQ Logo" 
                  fill 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
            </div>
            <span className="text-lg font-bold text-primary dark:text-blue-400">Synapse<span className="text-secondary dark:text-green-400">IQ</span></span>
          </Link>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700 dark:text-white font-medium">{user}</span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="px-2 pt-2 pb-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <button
              onClick={logout}
              className="w-full mt-4 px-3 py-2 rounded-md text-base font-medium flex items-center text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <FaSignOutAlt className="mr-2" />
              Sign out
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
