'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaStar, FaStarHalfAlt, FaRegStar, FaUser, FaBuilding, FaUpload } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

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

export default function TestimonialsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    company: '',
    position: '',
    rating: 5,
    content: '',
    featured: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!isAuthenticated && !loading) return;
      
      setIsLoading(true);
      setError(null);
      try {
        // Request all testimonials by setting a high limit
        const response = await fetch(`${apiUrl}/testimonials?limit=1000&offset=0`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Handle the new API response format with testimonials and metadata
        if (data.testimonials && Array.isArray(data.testimonials)) {
          // New format with metadata
          setTestimonials(data.testimonials);
          console.log('Testimonials metadata:', data.metadata);
          console.log(`Loaded ${data.testimonials.length} testimonials out of ${data.metadata.total_count} total`);
        } else if (Array.isArray(data)) {
          // Old format (direct array)
          setTestimonials(data);
        } else {
          console.error('Unexpected API response format:', data);
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [isAuthenticated, loading, apiUrl]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterFeatured]);
  
  // Filter testimonials based on search term and featured filter
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = searchTerm === '' ? true : (
      testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      testimonial.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFeatured = filterFeatured ? testimonial.featured : true;
    
    return matchesSearch && matchesFeatured;
  });
  
  // Get current testimonials for pagination
  const parsedItemsPerPage = parseInt(String(itemsPerPage), 10);
  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / parsedItemsPerPage));
  
  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && filteredTestimonials.length > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, filteredTestimonials.length]);
  
  const indexOfFirstItem = (currentPage - 1) * parsedItemsPerPage;
  const indexOfLastItem = indexOfFirstItem + parsedItemsPerPage;
  
  // Debug pagination
  console.log('Pagination debug:', { 
    currentPage, 
    itemsPerPage,
    parsedItemsPerPage, 
    indexOfFirstItem, 
    indexOfLastItem, 
    filteredTotal: filteredTestimonials.length,
    totalPages
  });
  
  const currentTestimonials = filteredTestimonials.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber: number) => {
    console.log('Paginating to page:', pageNumber);
    setCurrentPage(pageNumber);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    console.log('Changing items per page to:', newItemsPerPage, 'Type:', typeof newItemsPerPage);
    
    // Directly set the new items per page value
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle opening the modal for adding a new testimonial
  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentTestimonial(null);
    setFormData({
      name: '',
      company: '',
      position: '',
      rating: 5,
      content: '',
      image: '',
      featured: false
    });
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setIsEditing(true);
    setCurrentTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      position: testimonial.position,
      rating: testimonial.rating,
      content: testimonial.content,
      image: testimonial.image,
      featured: testimonial.featured
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle rating selection
  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isEditing && currentTestimonial) {
        console.log('Updating testimonial:', currentTestimonial.id, formData);
        // Update existing testimonial
        const response = await fetch(`${apiUrl}/testimonials/${currentTestimonial.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const updatedTestimonial = await response.json();
        console.log('Testimonial updated successfully:', updatedTestimonial);
        
        // Update local state
        setTestimonials(prev => 
          prev.map(item => 
            item.id === currentTestimonial.id ? updatedTestimonial : item
          )
        );
        
        // Upload image if provided
        if (imageFile) {
          await uploadTestimonialImage(currentTestimonial.id, imageFile);
        }
      } else {
        console.log('Creating new testimonial:', formData);
        // Add new testimonial
        const response = await fetch(`${apiUrl}/testimonials/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const newTestimonial = await response.json();
        console.log('New testimonial created successfully:', newTestimonial);
        
        // Upload image if provided
        if (imageFile) {
          await uploadTestimonialImage(newTestimonial.id, imageFile);
        }
        
        // Update local state
        setTestimonials(prev => [newTestimonial, ...prev]);
      }
      
      // Reset form and close modal
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      
    } catch (err) {
      console.error('Failed to save testimonial:', err);
      setError(`Failed to save testimonial: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Upload testimonial image
  const uploadTestimonialImage = async (testimonialId: number, file: File) => {
    try {
      console.log('Uploading image for testimonial ID:', testimonialId);
      console.log('File:', file.name, file.type, file.size);
      
      const formData = new FormData();
      formData.append('file', file, file.name);
      
      const response = await fetch(`${apiUrl}/testimonials/${testimonialId}/image`, {
        method: 'POST',
        // Important: Don't set Content-Type header when sending FormData
        // The browser will set it automatically with the correct boundary
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const updatedTestimonial = await response.json();
      console.log('Image upload successful:', updatedTestimonial);
      
      // Update local state
      setTestimonials(prev => 
        prev.map(item => 
          item.id === testimonialId ? updatedTestimonial : item
        )
      );
      
      return updatedTestimonial;
    } catch (err) {
      console.error('Failed to upload image:', err);
      setError(`Failed to upload image: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  // Handle testimonial deletion confirmation
  const confirmDelete = () => {
    if (deleteId) {
      handleDeleteConfirmed(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  // Handle testimonial deletion
  const handleDeleteConfirmed = async (id: number) => {
    setError(null);
    try {
      console.log('Deleting testimonial:', id);
      // Delete testimonial from API
      const response = await fetch(`${apiUrl}/testimonials/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      console.log('Testimonial deleted successfully');
      // Update local state
      setTestimonials(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      setError(`Failed to delete testimonial: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: number) => {
    setError(null);
    try {
      const testimonial = testimonials.find(t => t.id === id);
      if (!testimonial) return;
      
      const newFeaturedStatus = !testimonial.featured;
      console.log('Toggling featured status:', id, newFeaturedStatus);
      
      const response = await fetch(`${apiUrl}/testimonials/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: newFeaturedStatus }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const updatedTestimonial = await response.json();
      console.log('Featured status updated successfully:', updatedTestimonial);
      
      // Update local state
      setTestimonials(prev => 
        prev.map(item => 
          item.id === id ? updatedTestimonial : item
        )
      );
    } catch (err) {
      console.error('Failed to update featured status:', err);
      setError(`Failed to update featured status: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  // Render editable star rating
  const renderEditableStarRating = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingChange(i)}
          className="focus:outline-none"
        >
          {i <= (formData.rating || 0) ? (
            <FaStar className="text-yellow-400 w-6 h-6" />
          ) : (
            <FaRegStar className="text-yellow-400 w-6 h-6" />
          )}
        </button>
      );
    }
    
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-200">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Testimonials Management
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Add, edit, and manage customer testimonials displayed on your website
        </p>
      </motion.div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white"
              placeholder="Search testimonials..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="featured-filter"
              type="checkbox"
              checked={filterFeatured}
              onChange={() => setFilterFeatured(!filterFeatured)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured-filter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Show featured only
            </label>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="items-per-page" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              Show:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="block w-20 pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white"
            >
              <option value="5" className="text-gray-900 dark:text-white">5</option>
              <option value="10" className="text-gray-900 dark:text-white">10</option>
              <option value="20" className="text-gray-900 dark:text-white">20</option>
              <option value="50" className="text-gray-900 dark:text-white">50</option>
              <option value="100" className="text-gray-900 dark:text-white">100</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="-ml-1 mr-2 h-5 w-5" />
          Add New Testimonial
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Testimonial
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTestimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No testimonials found</p>
                    </td>
                  </tr>
                ) : (
                  currentTestimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {testimonial.image ? (
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={testimonial.image.startsWith('http') 
                                  ? testimonial.image 
                                  : `${apiUrl}${testimonial.image}`} 
                                alt={testimonial.name}
                                onError={(e) => {
                                  console.error('Image failed to load in list:', testimonial.image);
                                  e.currentTarget.onerror = null; // Prevent infinite loop
                                  e.currentTarget.src = ''; // Clear the src
                                  // Replace with user icon
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="text-gray-500 dark:text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <FaUser className="text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {testimonial.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FaBuilding className="mr-1 text-xs" />
                              {testimonial.company} • {testimonial.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStarRating(testimonial.rating)}
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.rating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                          {testimonial.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(testimonial.id)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            testimonial.featured
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {testimonial.featured ? 'Featured' : 'Regular'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(testimonial.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <FaEdit className="inline" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(testimonial.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTrash className="inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{filteredTestimonials.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-medium">
              {Math.min(indexOfLastItem, filteredTestimonials.length)}
            </span> of <span className="font-medium">{filteredTestimonials.length}</span> testimonials
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
              aria-label="Previous page"
            >
              Previous
            </button>
            {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
              // Show pagination numbers around the current page
              let pageNum;
              
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else {
                // Complex pagination logic for many pages
                if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && deleteId && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-300 dark:border-gray-600">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Testimonial</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Are you sure you want to delete this testimonial? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteId(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding/editing testimonials */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-300 dark:border-gray-600">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        {isEditing ? 'Edit' : 'Add New'} Testimonial
                      </h3>
                      <div className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-base font-medium text-gray-700 dark:text-white">
                              Client Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter client name"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-gray-300 dark:border-blue-500 rounded-md bg-white dark:bg-gray-200 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="company" className="block text-base font-medium text-gray-700 dark:text-white">
                              Company
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="company"
                                id="company"
                                value={formData.company || ''}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter company name"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-gray-300 dark:border-blue-500 rounded-md bg-white dark:bg-gray-200 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="position" className="block text-base font-medium text-gray-700 dark:text-white">
                              Position
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="position"
                                id="position"
                                value={formData.position || ''}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter position/title"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-gray-300 dark:border-blue-500 rounded-md bg-white dark:bg-gray-200 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="image" className="block text-base font-medium text-gray-700 dark:text-white">
                              Profile Image
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                              <div className="flex-shrink-0 h-20 w-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 shadow-md">
                                {imagePreview ? (
                                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                ) : currentTestimonial?.image ? (
                                  <img 
                                    className="h-full w-full object-cover rounded-md" 
                                    src={currentTestimonial.image.startsWith('http') 
                                      ? currentTestimonial.image 
                                      : `${apiUrl}${currentTestimonial.image}`}
                                    alt={currentTestimonial.name}
                                    onError={(e) => {
                                      console.error('Image failed to load:', currentTestimonial.image);
                                      e.currentTarget.onerror = null; // Prevent infinite loop
                                      e.currentTarget.src = ''; // Clear the src
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        parent.innerHTML = '<div class="h-full w-full flex items-center justify-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="text-gray-500 dark:text-gray-300 text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></div>';
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                                    <FaUser className="text-gray-500 dark:text-gray-300 text-2xl" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-5">
                                <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center bg-blue-600 hover:bg-blue-700 py-3 px-5 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                  <FaUpload className="mr-2" /> Choose Image
                                </label>
                                <input
                                  id="image-upload"
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="sr-only"
                                  aria-label="Upload profile image"
                                />
                                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500">
                                  <p className="text-base font-medium text-gray-700 dark:text-white">
                                    {imageFile ? imageFile.name : 'No file selected'}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                                    PNG, JPG, or GIF up to 2MB
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <label htmlFor="rating" className="block text-base font-medium text-gray-700 dark:text-white">
                            Rating
                          </label>
                          <div className="mt-1">
                            {renderEditableStarRating()}
                          </div>
                        </div>

                        <div className="mt-6">
                          <label htmlFor="content" className="block text-base font-medium text-gray-700 dark:text-white">
                            Testimonial Content
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="content"
                              name="content"
                              rows={4}
                              value={formData.content || ''}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter testimonial content"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-gray-300 dark:border-blue-500 rounded-md bg-white dark:bg-gray-200 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="flex items-center">
                            <input
                              id="featured"
                              name="featured"
                              type="checkbox"
                              checked={formData.featured || false}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="featured" className="ml-2 block text-base text-gray-700 dark:text-white cursor-pointer">
                              Featured testimonial (displayed prominently on the website)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto"
                  >
                    {isEditing ? 'Update' : 'Add'} Testimonial
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-5 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
