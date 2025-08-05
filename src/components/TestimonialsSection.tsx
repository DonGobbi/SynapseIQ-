"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import '../styles/testimonials.css';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  position: string;
  rating: number;
  content: string;
  image: string;
  featured: boolean;
  date: string;
}

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Make sure we're using the correct API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  console.log('Using API URL:', apiUrl);
  
  // State for pagination when we have many testimonials
  const [displayCount, setDisplayCount] = useState(10); // Default to showing 10 testimonials
  const [hasMoreToLoad, setHasMoreToLoad] = useState(false);
  
  // State for pagination
  const [offset, setOffset] = useState(0);
  const [totalTestimonials, setTotalTestimonials] = useState(0); // Will be updated from API
  
  // This function is no longer used as we're making direct API calls
  // Keeping it for reference but it's not called anywhere
  const fetchTestimonials = async (limit = displayCount, currentOffset = offset, append = false) => {
    setIsLoading(true);
    try {
      // Use the API to fetch testimonials with pagination
      const url = `${apiUrl}/testimonials?featured_only=true&limit=${limit}&offset=${currentOffset}`;
      console.log('DEBUG - Fetching testimonials from:', url);
      
      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const { testimonials: fetchedTestimonials, metadata } = data;
      
      // Update total count from metadata
      setTotalTestimonials(metadata.total_count);
      
      // Show load more button if there are more testimonials to load
      setHasMoreToLoad(metadata.has_more);
      
      // If appending, combine with existing testimonials
      if (append && testimonials.length > 0) {
        setTestimonials(prevTestimonials => [
          ...prevTestimonials,
          ...fetchedTestimonials
        ]);
      } else {
        setTestimonials(fetchedTestimonials);
      }
      
      // Reset current index if needed
      if (currentIndex >= fetchedTestimonials.length && fetchedTestimonials.length > 0) {
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setError('Failed to load testimonials. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch testimonials when component mounts
  useEffect(() => {
    const loadInitialTestimonials = async () => {
      try {
        // Fetch all testimonials by setting a high limit
        const url = `${apiUrl}/testimonials?featured_only=true&limit=1000&offset=0`;
        console.log('DEBUG - Initial fetch from:', url);
        
        const response = await fetch(url, {
          mode: 'cors',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // The API now returns an object with testimonials and metadata
        const { testimonials: fetchedTestimonials, metadata } = data;
        
        console.log(`DEBUG - Initial load: ${fetchedTestimonials.length} testimonials out of ${metadata.total_count} total`);
        console.log('DEBUG - Metadata:', metadata);
        
        // Set initial testimonials
        setTestimonials(fetchedTestimonials);
        
        // Update total count from metadata
        setTotalTestimonials(metadata.total_count);
        
        // If we've loaded all testimonials, set hasMoreToLoad to false
        setHasMoreToLoad(metadata.has_more);
        
        // Reset pagination state
        setOffset(0);
        setDisplayCount(fetchedTestimonials.length);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load initial testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
        setIsLoading(false);
      }
    };
    
    // Start loading
    setIsLoading(true);
    loadInitialTestimonials();
  }, [apiUrl]);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  const loadMoreTestimonials = async () => {
    // Disable the button while loading
    setIsLoading(true);
    
    try {
      // We want to load 10 more testimonials
      const fetchLimit = 10;
      
      // Calculate the new offset based on the current number of testimonials
      const newOffset = testimonials.length;
      
      console.log('DEBUG - loadMoreTestimonials called');
      console.log('DEBUG - Current testimonials:', testimonials.length);
      console.log('DEBUG - New offset:', newOffset);
      console.log('DEBUG - Total testimonials:', totalTestimonials);
      
      // Make the API call directly here instead of using fetchTestimonials
      const url = `${apiUrl}/testimonials?featured_only=true&limit=${fetchLimit}&offset=${newOffset}`;
      console.log('DEBUG - Direct API call to:', url);
      
      const response = await fetch(url, {
        mode: 'cors',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const { testimonials: newTestimonials, metadata } = data;
      
      console.log(`DEBUG - Received ${newTestimonials.length} new testimonials`);
      console.log('DEBUG - Updated metadata:', metadata);
      
      // Update testimonials by appending the new data
      setTestimonials(prevTestimonials => {
        const updatedTestimonials = [...prevTestimonials, ...newTestimonials];
        console.log('DEBUG - Updated testimonials length:', updatedTestimonials.length);
        return updatedTestimonials;
      });
      
      // Update total count from metadata (in case it changed)
      setTotalTestimonials(metadata.total_count);
      
      // Update has more flag from metadata
      setHasMoreToLoad(metadata.has_more);
      
      // Update offset for next load
      setOffset(newOffset + newTestimonials.length);
    } catch (err) {
      console.error('Failed to load more testimonials:', err);
      setError('Failed to load more testimonials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-padding bg-primary text-white">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg mb-4">What Our Clients Say</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-4xl text-white" />
              <span className="ml-2 text-white">Loading testimonials...</span>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 text-dark dark:text-white p-8 rounded-lg shadow-lg text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 text-dark dark:text-white p-8 rounded-lg shadow-lg text-center">
              <p>No testimonials available at the moment.</p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 text-dark dark:text-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-8"
                >
                  <div className="md:w-2/5 relative h-[250px] md:h-auto rounded-lg overflow-hidden">
                    {testimonials[currentIndex].image ? (
                      <div className="relative w-full h-full">
                        {/* Use regular img tag instead of Next.js Image to avoid domain restrictions */}
                        <img 
                          src={testimonials[currentIndex].image.startsWith('http') 
                            ? testimonials[currentIndex].image 
                            : `${apiUrl}${testimonials[currentIndex].image}`} 
                          alt={`${testimonials[currentIndex].name} from ${testimonials[currentIndex].company}`} 
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', testimonials[currentIndex].image);
                            e.currentTarget.onerror = null; // Prevent infinite loop
                            e.currentTarget.src = '/images/team-collaboration.png'; // Fallback image
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img 
                          src="/images/team-collaboration.png" 
                          alt="African business professionals collaborating" 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:w-3/5">
                    <FaQuoteLeft className="text-4xl text-primary mb-6 opacity-20" />
                    <p className="text-lg md:text-xl mb-6 italic">
                      {testimonials[currentIndex].content}
                    </p>
                    <div>
                      <p className="font-bold">{testimonials[currentIndex].name}</p>
                      <p className="text-gray-600 dark:text-gray-300">{testimonials[currentIndex].position}, {testimonials[currentIndex].company}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col items-center mt-8 space-y-4">
                {/* Testimonial counter */}
                <div className="text-white text-sm font-medium">
                  {currentIndex + 1} / {testimonials.length}
                </div>
                
                {/* Navigation controls */}
                <div className="flex items-center space-x-6">
                  <motion.button 
                    onClick={prevTestimonial}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
                    aria-label="Previous testimonial"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading || testimonials.length <= 1}
                  >
                    <FaChevronLeft className="text-lg" />
                  </motion.button>
                  
                  <div className="flex items-center h-2">
                    {/* Modern progress indicator */}
                    {testimonials.length <= 8 ? (
                      // If 8 or fewer testimonials, show a modern indicator for each
                      <div className="flex space-x-2">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 transition-all duration-300 ${index === currentIndex 
                              ? 'w-8 bg-white rounded-full' 
                              : 'w-2 bg-white/40 rounded-full hover:bg-white/60'}`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          />
                        ))}
                      </div>
                    ) : (
                      // If more than 8 testimonials, show a modern progress bar
                      <div className="flex items-center space-x-2 w-64">
                        {/* Progress bar background */}
                        <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden">
                          {/* Progress indicator */}
                          <div 
                            className={`absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-500 ease-out progress-width-${Math.round((currentIndex / (testimonials.length - 1)) * 100)}`}
                          />
                        </div>
                        
                        {/* First and last indicators */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setCurrentIndex(0)}
                            className={`h-2 w-2 rounded-full transition-all ${currentIndex === 0 ? 'bg-white scale-125' : 'bg-white/40'}`}
                            aria-label="Go to first testimonial"
                          />
                          
                          {/* Middle indicator - only show if we have many testimonials */}
                          {testimonials.length > 15 && (
                            <button
                              onClick={() => setCurrentIndex(Math.floor(testimonials.length / 2))}
                              className={`h-2 w-2 rounded-full transition-all ${currentIndex === Math.floor(testimonials.length / 2) ? 'bg-white scale-125' : 'bg-white/40'}`}
                              aria-label="Go to middle testimonial"
                            />
                          )}
                          
                          <button
                            onClick={() => setCurrentIndex(testimonials.length - 1)}
                            className={`h-2 w-2 rounded-full transition-all ${currentIndex === testimonials.length - 1 ? 'bg-white scale-125' : 'bg-white/40'}`}
                            aria-label="Go to last testimonial"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <motion.button 
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
                    aria-label="Next testimonial"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading || testimonials.length <= 1}
                  >
                    <FaChevronRight className="text-lg" />
                  </motion.button>
                </div>
              </div>
              
              {/* Testimonial count display */}
              <div className="mt-4 text-center text-white/80 text-sm">
                <p>Showing {testimonials.length} of {totalTestimonials} testimonials {testimonials.length === totalTestimonials && '(All loaded)'}</p>
                {testimonials.length === totalTestimonials && totalTestimonials > 0 && (
                  <p className="text-green-400 mt-1">✓ All testimonials loaded successfully!</p>
                )}
              </div>
              
              {/* Show load more button if there are potentially more testimonials */}
              {hasMoreToLoad && (
                <div className="mt-4 flex justify-center w-full">
                  <motion.button
                    onClick={loadMoreTestimonials}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all shadow-lg flex items-center justify-center space-x-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More Testimonials</span>
                    )}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
