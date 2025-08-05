"use client";

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type: 'text' | 'image' | 'card' | 'avatar';
  count?: number;
  className?: string;
}

const SkeletonLoader = ({ type, count = 1, className = '' }: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded-md ${className}`} />
        );
      case 'image':
        return (
          <div className={`aspect-video bg-gray-200 dark:bg-gray-700 rounded-md ${className}`} />
        );
      case 'card':
        return (
          <div className={`w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md ${className}`} />
        );
      case 'avatar':
        return (
          <div className={`w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full ${className}`} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.8, 0.6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full"
          >
            {renderSkeleton()}
          </motion.div>
        ))}
    </>
  );
};

export default SkeletonLoader;
