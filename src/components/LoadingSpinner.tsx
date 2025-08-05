"use client";

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}

const LoadingSpinner = ({ size = 'md', color = 'primary' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
  };

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
