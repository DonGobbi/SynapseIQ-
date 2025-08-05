"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type DarkModeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has previously set a preference
    const storedDarkMode = localStorage.getItem('darkMode');
    
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    } else {
      // Check if user prefers dark mode at the OS level
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  useEffect(() => {
    // Update the HTML class when dark mode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
