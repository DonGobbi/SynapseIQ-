"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SkeletonLoader from './SkeletonLoader';

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  circular?: boolean;
  withGradient?: boolean;
}

const ImageWithLoading = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  circular = false,
  withGradient = false,
}: ImageWithLoadingProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setImgSrc(src);
  }, [src]);

  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${src}`);
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsLoading(false);
    // You could set a fallback image here if needed
    // setImgSrc('/images/fallback.png');
  };

  const imageClasses = `
    ${className}
    ${circular ? 'rounded-full' : 'rounded-md'}
    ${withGradient ? 'gradient-border' : ''}
    transition-all duration-300
  `;

  return (
    <div className="relative w-full h-full">
      {/* Skeleton loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <SkeletonLoader 
            type={circular ? 'avatar' : 'image'} 
            className={`w-full h-full ${circular ? 'rounded-full' : 'rounded-md'}`} 
          />
        </div>
      )}

      {/* Actual image */}
      <div className={`w-full h-full ${isLoading ? 'invisible' : 'visible'}`}>
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={imageClasses}
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      {/* Gradient overlay if needed */}
      {withGradient && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 animate-pulse" />
      )}
    </div>
  );
};

export default ImageWithLoading;
