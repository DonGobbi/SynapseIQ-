"use client";

import { FaSun, FaMoon } from 'react-icons/fa';
import { useDarkMode } from '@/context/DarkModeContext';
import { motion } from 'framer-motion';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ 
          scale: 1,
          rotate: darkMode ? 180 : 0 
        }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {darkMode ? (
          <FaSun className="text-yellow-400 text-xl" />
        ) : (
          <FaMoon className="text-primary text-xl" />
        )}
      </motion.div>
    </button>
  );
};

export default DarkModeToggle;
