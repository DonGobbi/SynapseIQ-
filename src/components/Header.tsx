"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container-custom flex justify-between items-center py-4">
        <Link href="/" className="flex items-center">
          <div className="relative w-12 h-12 mr-2 bg-white rounded-full flex items-center justify-center border-2 border-primary shadow-sm">
            <div className="relative w-10 h-10">
              <Image 
                src="/images/logo.png" 
                alt="SynapseIQ Logo" 
                fill 
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-primary dark:text-blue-400">Synapse<span className="text-secondary dark:text-green-400">IQ</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className={`font-medium transition-colors ${pathname === '/' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}>
            Home
          </Link>
          <Link href="/services" className={`font-medium transition-colors ${pathname === '/services' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}>
            Services
          </Link>
          <Link href="/industries" className={`font-medium transition-colors ${pathname === '/industries' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}>
            Industries
          </Link>
          <Link href="/about" className={`font-medium transition-colors ${pathname === '/about' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}>
            About
          </Link>
          <Link href="/contact" className={`font-medium transition-colors ${pathname === '/contact' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}>
            Contact
          </Link>
          <Link href="/accessibility" className={`font-medium transition-colors ${pathname === '/accessibility' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}>
            Accessibility
          </Link>
          <Link href="/admin" className={`font-medium transition-colors ${pathname === '/admin' || pathname.startsWith('/admin/') ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}>
            Admin
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <DarkModeToggle />
          <Link href="/contact" className="btn-outline dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900">
            Request a Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-4 shadow-lg transition-colors duration-300">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${pathname === '/' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className={`font-medium transition-colors ${pathname === '/services' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/industries" 
              className={`font-medium transition-colors ${pathname === '/industries' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Industries
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors ${pathname === '/about' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium transition-colors ${pathname === '/contact' ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/admin" 
              className={`font-medium transition-colors ${pathname === '/admin' || pathname.startsWith('/admin/') ? 'text-primary font-bold' : 'text-gray-800 hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="flex items-center justify-between mt-4">
              <DarkModeToggle />
              <Link href="/contact" className="btn-outline dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                Request a Demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
