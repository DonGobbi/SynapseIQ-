"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { 
  calculateContrastRatio, 
  meetsWCAGAA, 
  meetsWCAGAAA,
  checkAccessibilityIssues,
  testKeyboardNavigation,
  checkAriaLandmarks
} from '@/utils/accessibilityTester';

interface AccessibilityCheckerProps {
  onClose: () => void;
}

const AccessibilityChecker = ({ onClose }: AccessibilityCheckerProps) => {
  const [results, setResults] = useState<{
    contrastIssues: string[];
    domIssues: string[];
    keyboardNavigation: boolean;
    ariaLandmarks: boolean;
  }>({
    contrastIssues: [],
    domIssues: [],
    keyboardNavigation: false,
    ariaLandmarks: false,
  });

  const [isChecking, setIsChecking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const runAccessibilityTests = () => {
    setIsChecking(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const contrastIssues: string[] = [];
      const domIssues: string[] = [];
      
      // Check color contrast for text elements
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
      textElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const foregroundColor = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Convert RGB to HEX
        const rgbToHex = (rgb: string) => {
          const rgbValues = rgb.match(/\d+/g);
          if (!rgbValues || rgbValues.length < 3) return '#000000';
          
          const hex = rgbValues.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
          
          return `#${hex}`;
        };
        
        // Only check if both colors are defined and not transparent
        if (
          foregroundColor !== 'rgba(0, 0, 0, 0)' && 
          backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          backgroundColor !== 'transparent'
        ) {
          const fgHex = rgbToHex(foregroundColor);
          const bgHex = rgbToHex(backgroundColor);
          const ratio = calculateContrastRatio(fgHex, bgHex);
          
          const fontSize = parseInt(computedStyle.fontSize);
          const fontWeight = computedStyle.fontWeight;
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight === 'bold');
          
          if (!meetsWCAGAA(ratio, isLargeText)) {
            contrastIssues.push(
              `Low contrast (${ratio.toFixed(2)}:1) for element: ${element.tagName.toLowerCase()} with text "${element.textContent?.slice(0, 20)}..."`
            );
          }
        }
      });
      
      // Check DOM accessibility issues
      const domIssuesList = checkAccessibilityIssues(document.body);
      domIssues.push(...domIssuesList);
      
      // Check keyboard navigation
      const focusableElements = testKeyboardNavigation(document);
      const keyboardNavigationPassed = focusableElements.length > 0;
      
      // Check ARIA landmarks
      const ariaLandmarksPassed = checkAriaLandmarks(document);
      
      setResults({
        contrastIssues,
        domIssues,
        keyboardNavigation: keyboardNavigationPassed,
        ariaLandmarks: ariaLandmarksPassed,
      });
      
      setIsChecking(false);
      setIsComplete(true);
    }, 1000);
  };

  useEffect(() => {
    // Run tests when component mounts
    runAccessibilityTests();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary dark:text-blue-400">Accessibility Checker</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close accessibility checker"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {isChecking ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-lg">Running accessibility tests...</p>
            </div>
          ) : isComplete ? (
            <div className="space-y-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className={`mr-2 ${results.ariaLandmarks ? 'text-green-500' : 'text-red-500'}`}>
                    {results.ariaLandmarks ? <FaCheck /> : <FaTimes />}
                  </span>
                  ARIA Landmarks
                </h3>
                <p>
                  {results.ariaLandmarks 
                    ? 'All required ARIA landmarks are present (header, main, footer, navigation).' 
                    : 'Missing one or more required ARIA landmarks (header, main, footer, navigation).'}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className={`mr-2 ${results.keyboardNavigation ? 'text-green-500' : 'text-red-500'}`}>
                    {results.keyboardNavigation ? <FaCheck /> : <FaTimes />}
                  </span>
                  Keyboard Navigation
                </h3>
                <p>
                  {results.keyboardNavigation 
                    ? 'Keyboard navigation is properly implemented with focusable elements.' 
                    : 'Issues found with keyboard navigation. No focusable elements detected.'}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className={`mr-2 ${results.contrastIssues.length === 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {results.contrastIssues.length === 0 ? <FaCheck /> : <FaExclamationTriangle />}
                  </span>
                  Color Contrast
                </h3>
                {results.contrastIssues.length === 0 ? (
                  <p>No color contrast issues detected.</p>
                ) : (
                  <div>
                    <p className="mb-2">Found {results.contrastIssues.length} contrast issues:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm max-h-40 overflow-y-auto">
                      {results.contrastIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className={`mr-2 ${results.domIssues.length === 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {results.domIssues.length === 0 ? <FaCheck /> : <FaExclamationTriangle />}
                  </span>
                  DOM Accessibility
                </h3>
                {results.domIssues.length === 0 ? (
                  <p>No DOM accessibility issues detected.</p>
                ) : (
                  <div>
                    <p className="mb-2">Found {results.domIssues.length} DOM issues:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm max-h-40 overflow-y-auto">
                      {results.domIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={runAccessibilityTests}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Run Tests Again
                </button>
                <button
                  onClick={onClose}
                  className="border-2 border-primary text-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default AccessibilityChecker;
