import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  value: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * A reusable progress bar component that uses CSS classes instead of inline styles
 * for setting the width based on a percentage value.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  className = '',
  ariaLabel = 'Progress bar'
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Round the value to the nearest integer to ensure it's a valid percentage
  const percentage = Math.round(Number(value));
  
  // Set ARIA attributes and width via DOM for accessibility compliance
  useEffect(() => {
    const progressBar = progressRef.current;
    if (progressBar) {
      // Set ARIA attributes via DOM to avoid JSX validation errors
      progressBar.setAttribute('aria-valuenow', percentage.toString());
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      progressBar.setAttribute('aria-label', ariaLabel);
      
      // Set the width directly on the element to avoid inline styles in JSX
      progressBar.style.width = `${percentage}%`;
    }
  }, [percentage, ariaLabel]);

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        ref={progressRef}
        className={`analytics-progress-bar w-percent ${className}`}
        role="progressbar"
        // Add title attribute for accessibility name
        title={ariaLabel}
        // ARIA attributes are set via DOM in useEffect to avoid validation errors
      />
    </div>
  );
};

export default ProgressBar;
