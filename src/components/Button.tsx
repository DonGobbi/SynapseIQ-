"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  fullWidth = false,
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-md transition-all duration-300 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-opacity-90 dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary: 'bg-secondary text-white hover:bg-opacity-90 dark:bg-green-600 dark:hover:bg-green-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900',
  };
  
  const sizeClasses = {
    sm: 'py-1 px-4 text-sm',
    md: 'py-2 px-6 text-base',
    lg: 'py-3 px-8 text-lg',
  };
  
  const disabledClasses = disabled || isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <LoadingSpinner size="sm" color={variant === 'outline' ? 'primary' : 'white'} />
          <span className="ml-2">{children}</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
