'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaTrash, FaCopy, FaImage, FaVideo, FaFile, FaSearch } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Mock data for media items as fallback
const initialMediaItems = [
  {
    id: 1,
    name: 'hero-image.png',
    type: 'image',
    url: '/images/hero-image.png',
    size: '245 KB',
    dimensions: '1200 x 800',
    uploadedAt: '2025-07-15T10:30:00Z',
    tags: ['hero', 'banner']
  },
  {
    id: 2,
    name: 'logo.png',
    type: 'image',
    url: '/images/logo.png',
    size: '32 KB',
    dimensions: '200 x 200',
    uploadedAt: '2025-07-10T14:20:00Z',
    tags: ['logo', 'branding']
  },
  {
    id: 3,
    name: 'team-collaboration.png',
    type: 'image',
    url: '/images/team-collaboration.png',
    size: '180 KB',
    dimensions: '800 x 600',
    uploadedAt: '2025-07-20T09:15:00Z',
    tags: ['team', 'collaboration']
  },
  {
    id: 4,
    name: 'consulting-team.png',
    type: 'image',
    url: '/images/consulting-team.png',
    size: '210 KB',
    dimensions: '900 x 600',
    uploadedAt: '2025-07-22T11:45:00Z',
    tags: ['consulting', 'team']
  },
  {
    id: 5,
    name: 'product-demo.mp4',
    type: 'video',
    url: '/videos/product-demo.mp4',
    size: '4.2 MB',
    dimensions: '1920 x 1080',
    uploadedAt: '2025-07-25T16:30:00Z',
    tags: ['product', 'demo', 'video']
  },
  {
    id: 6,
    name: 'annual-report.pdf',
    type: 'document',
    url: '/documents/annual-report.pdf',
    size: '1.8 MB',
    dimensions: 'N/A',
    uploadedAt: '2025-07-28T13:20:00Z',
    tags: ['report', 'annual', 'document']
  }
];

interface MediaItem {
  id: number;
  name: string;
  type: string; // Allow any string from backend, but we'll handle 'image', 'video', 'document'
  url: string;
  size: string;
  dimensions: string;
  uploadedAt: string;
  tags: string[];
}

export default function MediaLibraryPage() {
  const { isAuthenticated } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter media items based on search term and type filter
  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Fetch media items from the backend API
  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/media/items`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Media items response:', data);

      if (data.items && Array.isArray(data.items)) {
        setMediaItems(data.items);
      } else {
        // If no items are returned or the API is not yet implemented, use mock data
        setMediaItems(initialMediaItems);
        console.log('Using mock data as fallback');
      }
    } catch (err) {
      console.error('Failed to fetch media items:', err);
      setError('Failed to load media items. Using mock data as fallback.');
      // Use mock data as fallback
      setMediaItems(initialMediaItems);
    } finally {
      setLoading(false);
    }
  };

  // Fetch media items on component mount
  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('tags', JSON.stringify(['upload']));

      // Simulate progress (actual progress tracking would require custom implementation)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      setUploadProgress(100);

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.success && data.item) {
        // Add the new item to the list
        setMediaItems(prev => [data.item, ...prev]);
      }

      // Reset the file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Handle item deletion
  const handleDelete = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/media/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Delete response:', data);

      if (data.success) {
        setMediaItems(prev => prev.filter(item => item.id !== id));
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FaImage className="text-blue-500" />;
      case 'video':
        return <FaVideo className="text-purple-500" />;
      case 'document':
        return <FaFile className="text-yellow-500" />;
      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Media Library
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Manage your website images, videos, and documents
        </p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upload Media</h2>
            <div className="mb-4">
              <label htmlFor="file-upload" className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:opacity-50 cursor-pointer">
                <FaUpload className="mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleUpload}
                disabled={isUploading}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              {isUploading && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`py-2 px-3 text-sm font-medium rounded-md ${
                    filter === 'all'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  All Files
                </button>
                <button
                  onClick={() => setFilter('image')}
                  className={`py-2 px-3 text-sm font-medium rounded-md ${
                    filter === 'image'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setFilter('video')}
                  className={`py-2 px-3 text-sm font-medium rounded-md ${
                    filter === 'video'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setFilter('document')}
                  className={`py-2 px-3 text-sm font-medium rounded-md ${
                    filter === 'document'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Documents
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Files
              </label>
              <div className="relative">
                <label htmlFor="media-search" className="sr-only">Search media files</label>
                <input
                  id="media-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Search by name or tag..."
                  aria-label="Search media files"
                />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Storage</h2>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Used</span>
                <span className="text-gray-900 dark:text-gray-200">6.5 GB / 10 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              65% of your storage has been used. Consider upgrading your plan if you need more space.
            </p>
          </div>
        </motion.div>

        {/* Main Content - Media Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Media Files ({filteredItems.length})
              </h2>
            </div>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No media files found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`border rounded-lg overflow-hidden cursor-pointer ${selectedItem?.id === item.id ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}
                  >
                    {item.type === 'image' ? (
                      <div className="relative h-32 bg-gray-100 dark:bg-gray-700">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {item.type === 'video' ? (
                          <FaVideo className="h-12 w-12 text-gray-400" />
                        ) : (
                          <FaFile className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getFileIcon(item.type)}
                          <h3 className="ml-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Sidebar - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">File Details</h2>
            {selectedItem ? (
              <div>
                {selectedItem.type === 'image' && (
                  <div className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.name}
                      className="w-full h-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">File Name</h3>
                    <p className="text-base text-gray-900 dark:text-white break-all">{selectedItem.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
                    <p className="text-base text-gray-900 dark:text-white capitalize">{selectedItem.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dimensions</h3>
                    <p className="text-base text-gray-900 dark:text-white">{selectedItem.dimensions}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Size</h3>
                    <p className="text-base text-gray-900 dark:text-white">{selectedItem.size}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploaded</h3>
                    <p className="text-base text-gray-900 dark:text-white">{formatDate(selectedItem.uploadedAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedItem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col space-y-2">
                    <button
                      onClick={() => copyToClipboard(selectedItem.url)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaCopy className="mr-2" />
                      {copied ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedItem.id)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrash className="mr-2" />
                      Delete File
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No file selected</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a file to view its details
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
