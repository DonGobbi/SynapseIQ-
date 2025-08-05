'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Mock data for blog posts
const initialBlogPosts = [
  {
    id: 1,
    title: 'Leveraging AI for African Business Growth',
    slug: 'leveraging-ai-for-african-business-growth',
    excerpt: 'How businesses across Africa are using artificial intelligence to overcome unique challenges and drive growth in various sectors.',
    content: '## Introduction\n\nAcross Africa, businesses are increasingly turning to artificial intelligence (AI) to solve unique challenges and drive growth. From agriculture to finance, healthcare to retail, AI is transforming how businesses operate and compete in the global marketplace.\n\n## Key Areas of Impact\n\n### Financial Inclusion\nAI-powered credit scoring systems are helping banks and fintech companies extend services to previously unbanked populations. By analyzing alternative data sources, these systems can assess creditworthiness even for individuals without traditional banking histories.\n\n### Agriculture\nPredictive analytics and machine learning are helping farmers optimize crop yields, predict weather patterns, and manage resources more efficiently. This is particularly important in regions where climate change is affecting traditional farming practices.\n\n### Healthcare\nAI diagnostic tools are extending the reach of limited healthcare resources, allowing for remote diagnosis and treatment recommendations in areas with few medical professionals.\n\n## Challenges and Opportunities\n\nWhile the potential is enormous, businesses implementing AI in Africa face unique challenges:\n\n- Limited access to reliable power and internet infrastructure\n- Shortage of local AI talent and expertise\n- Data privacy and regulatory concerns\n- Need for solutions tailored to local contexts\n\nHowever, these challenges also present opportunities for innovative approaches that could leapfrog traditional development paths.\n\n## Conclusion\n\nAs AI technology becomes more accessible and adaptable, African businesses that strategically implement these tools stand to gain significant competitive advantages. The key to success will be developing solutions that address specific local needs while building local capacity and expertise.',
    author: 'Dr. Amina Diallo',
    authorRole: 'Chief Data Scientist',
    category: 'Technology',
    tags: ['AI', 'Business Growth', 'African Tech', 'Innovation'],
    featuredImage: '/images/blog/ai-business-growth.jpg',
    published: true,
    publishedAt: '2025-07-15T10:30:00Z',
    updatedAt: '2025-07-16T14:20:00Z'
  },
  {
    id: 2,
    title: 'The Future of Natural Language Processing for African Languages',
    slug: 'future-of-nlp-for-african-languages',
    excerpt: 'Exploring how advances in NLP are being adapted to support the rich linguistic diversity of African languages.',
    content: '## The Language Diversity Challenge\n\nAfrica is home to over 2,000 languages, representing nearly a third of all languages spoken worldwide. This linguistic diversity presents both challenges and opportunities for natural language processing (NLP) technologies.\n\n## Current State of African Language NLP\n\nHistorically, NLP research and development has focused primarily on high-resource languages like English, Chinese, and Spanish. However, recent years have seen growing interest in extending these technologies to African languages.\n\nSeveral projects are making significant progress:\n\n- The Masakhane project, a grassroots organization focused on strengthening NLP research for African languages\n- Google Translate\'s expansion to include languages like Yoruba, Igbo, and Swahili\n- Local startups developing specialized solutions for specific language communities\n\n## Applications and Impact\n\nImproved NLP for African languages has far-reaching implications:\n\n### Education\nLanguage technologies can support mother-tongue education, helping students learn in their first language before transitioning to national or international languages.\n\n### Business\nCompanies can better serve customers in their preferred languages, opening up new markets and improving customer satisfaction.\n\n### Governance\nGovernment services can become more accessible when information is available in local languages.\n\n## Technical Approaches\n\nResearchers are exploring several approaches to overcome the data scarcity challenge:\n\n- Transfer learning from high-resource languages\n- Unsupervised and semi-supervised learning methods\n- Leveraging linguistic similarities between related languages\n- Community-driven data collection efforts\n\n## Looking Forward\n\nAs NLP technologies continue to evolve, we expect to see more inclusive solutions that embrace Africa\'s linguistic diversity rather than requiring adaptation to dominant global languages. This shift will not only preserve cultural heritage but also ensure that the benefits of AI and language technologies are accessible to all.',
    author: 'Dr. Kwame Osei',
    authorRole: 'Computational Linguist',
    category: 'Research',
    tags: ['NLP', 'African Languages', 'AI Research', 'Language Technology'],
    featuredImage: '/images/blog/nlp-african-languages.jpg',
    published: true,
    publishedAt: '2025-06-22T09:15:00Z',
    updatedAt: '2025-06-23T11:45:00Z'
  },
  {
    id: 3,
    title: 'Building Resilient AI Systems for Unstable Network Environments',
    slug: 'resilient-ai-systems-unstable-networks',
    excerpt: 'Strategies for designing AI solutions that perform reliably even in areas with limited or intermittent connectivity.',
    content: '## The Connectivity Challenge\n\nMany regions across Africa face challenges with reliable internet connectivity. This presents a significant hurdle for deploying AI systems that typically rely on cloud infrastructure and stable connections.\n\n## Offline-First Design\n\nTo address these challenges, developers are increasingly adopting an "offline-first" approach to AI system design. Key principles include:\n\n### Local Processing\nPerforming as much computation as possible on the device itself, reducing dependence on cloud services.\n\n### Intelligent Syncing\nPrioritizing which data needs to be synchronized when connectivity is available, and which can wait.\n\n### Graceful Degradation\nEnsuring systems continue to provide value, perhaps with reduced functionality, even when completely offline.\n\n## Technical Approaches\n\nSeveral technical strategies are proving effective:\n\n### Model Compression\nReducing the size of AI models to run efficiently on edge devices with limited processing power.\n\n### Federated Learning\nTraining models across distributed devices without requiring the raw data to leave the device.\n\n### Progressive Enhancement\nStarting with core functionality that works offline, then enhancing capabilities when connectivity is available.\n\n## Case Studies\n\n### Healthcare Diagnostics\nMobile applications that can perform preliminary medical diagnostics without requiring an internet connection, syncing with medical records systems when connectivity is restored.\n\n### Agricultural Advisory\nSystems that provide farming recommendations based on locally stored data, updating their models during periodic connectivity.\n\n### Educational Tools\nLearning applications that function fully offline but sync progress and receive updates when connected.\n\n## Future Directions\n\nAs edge computing capabilities continue to improve, we expect to see increasingly sophisticated AI applications that can operate in challenging connectivity environments. This approach not only addresses infrastructure limitations but also offers advantages in terms of reduced latency, enhanced privacy, and lower bandwidth costs.',
    author: 'Nala Mbeki',
    authorRole: 'Systems Architect',
    category: 'Engineering',
    tags: ['Edge Computing', 'Offline First', 'System Design', 'Connectivity'],
    featuredImage: '/images/blog/resilient-ai-systems.jpg',
    published: false,
    publishedAt: null,
    updatedAt: '2025-07-28T16:30:00Z'
  }
];

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  featuredImage: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export default function BlogPage() {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Post form state
  const [showPostForm, setShowPostForm] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    authorRole: string;
    category: string;
    tags: string;
    featuredImage: string;
    published: boolean;
  }>({ 
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    authorRole: '',
    category: '',
    tags: '',
    featuredImage: '',
    published: false
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Fetch blog posts from the API
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/blog/posts`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBlogPosts(data.posts);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
      // If API fails, use mock data for development
      setBlogPosts(initialBlogPosts);
    } finally {
      setLoading(false);
    }
  };
  
  // Load blog posts on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogPosts();
    }
  }, [isAuthenticated]);

  // Extract unique categories from blog posts
  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  // Filter blog posts based on search term, category, and status
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.published) ||
      (statusFilter === 'draft' && !post.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle post deletion
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        setIsSubmitting(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/blog/posts/${id}`, {
          method: 'DELETE',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete blog post: ${response.statusText}`);
        }
        
        // Update local state on successful deletion
        setBlogPosts(prev => prev.filter(post => post.id !== id));
      } catch (err) {
        console.error('Error deleting blog post:', err);
        alert(err instanceof Error ? err.message : 'Failed to delete blog post');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Toggle publish status
  const togglePublishStatus = async (id: number) => {
    try {
      setIsSubmitting(true);
      
      // Optimistically update UI
      const updatedPosts = blogPosts.map(post => {
        if (post.id === id) {
          const newStatus = !post.published;
          return {
            ...post,
            published: newStatus,
            publishedAt: newStatus ? (post.publishedAt || new Date().toISOString()) : null,
            updatedAt: new Date().toISOString()
          };
        }
        return post;
      });
      
      setBlogPosts(updatedPosts);
      
      // Call API to update status
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/blog/posts/${id}/toggle-publish`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update publish status: ${response.statusText}`);
      }
      
      const updatedPost = await response.json();
      
      // Update the post with server data
      setBlogPosts(prev =>
        prev.map(post => post.id === id ? updatedPost : post)
      );
    } catch (err) {
      console.error('Error toggling publish status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update publish status');
      
      // Revert optimistic update on error
      setBlogPosts(prev =>
        prev.map(post => {
          if (post.id === id) {
            return {
              ...post,
              published: !post.published,
              publishedAt: !post.published ? null : post.publishedAt,
              updatedAt: post.updatedAt
            };
          }
          return post;
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open post form for creating a new post
  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      authorRole: '',
      category: '',
      tags: '',
      featuredImage: '',
      published: false
    });
    setFormErrors({});
    setShowPostForm(true);
  };
  
  // Open post form for editing an existing post
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      authorRole: post.authorRole,
      category: post.category,
      tags: post.tags.join(', '),
      featuredImage: post.featuredImage,
      published: post.published
    });
    setFormErrors({});
    setShowPostForm(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    if (!formData.excerpt.trim()) errors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit form to create or update a post
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        author_role: formData.authorRole,
        category: formData.category,
        tags: tagsArray,
        featured_image: formData.featuredImage,
        published: formData.published
      };
      
      let response;
      
      if (editingPost) {
        // Update existing post
        response = await fetch(`${apiUrl}/blog/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
      } else {
        // Create new post
        response = await fetch(`${apiUrl}/blog/posts`, {
          method: 'POST',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to ${editingPost ? 'update' : 'create'} blog post`);
      }
      
      const savedPost = await response.json();
      
      if (editingPost) {
        // Update post in state
        setBlogPosts(prev => prev.map(post => post.id === editingPost.id ? savedPost : post));
      } else {
        // Add new post to state
        setBlogPosts(prev => [savedPost, ...prev]);
      }
      
      // Close form and reset state
      setShowPostForm(false);
      setEditingPost(null);
      
    } catch (err) {
      console.error(`Error ${editingPost ? 'updating' : 'creating'} blog post:`, err);
      alert(err instanceof Error ? err.message : `Failed to ${editingPost ? 'update' : 'create'} blog post`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // View a blog post
  const handleViewPost = (post: BlogPost) => {
    alert(`Viewing post: ${post.title}\n\n${post.content}`);
    // In a real app, this would navigate to the post view page
  };
  
  // Truncate text to a certain length
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Post Form Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={() => setShowPostForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close form"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitPost} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${formErrors.title ? 'border-red-500' : ''}`}
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                  </div>
                  
                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${formErrors.slug ? 'border-red-500' : ''}`}
                    />
                    {formErrors.slug && <p className="mt-1 text-sm text-red-500">{formErrors.slug}</p>}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">URL-friendly name (e.g., my-blog-post)</p>
                  </div>
                  
                  {/* Author */}
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${formErrors.author ? 'border-red-500' : ''}`}
                    />
                    {formErrors.author && <p className="mt-1 text-sm text-red-500">{formErrors.author}</p>}
                  </div>
                  
                  {/* Author Role */}
                  <div>
                    <label htmlFor="authorRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Author Role
                    </label>
                    <input
                      type="text"
                      id="authorRole"
                      name="authorRole"
                      value={formData.authorRole}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${formErrors.category ? 'border-red-500' : ''}`}
                    />
                    {formErrors.category && <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>}
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated list of tags</p>
                  </div>
                  
                  {/* Featured Image */}
                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured Image URL
                    </label>
                    <input
                      type="text"
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* Published Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Published
                    </label>
                  </div>
                </div>
                
                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${formErrors.excerpt ? 'border-red-500' : ''}`}
                  />
                  {formErrors.excerpt && <p className="mt-1 text-sm text-red-500">{formErrors.excerpt}</p>}
                </div>
                
                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={10}
                    value={formData.content}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${formErrors.content ? 'border-red-500' : ''}`}
                  />
                  {formErrors.content && <p className="mt-1 text-sm text-red-500">{formErrors.content}</p>}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Supports Markdown formatting</p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      `${editingPost ? 'Update' : 'Create'} Post`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Blog Management
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Create, edit, and manage blog posts for your website
        </p>
      </motion.div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <label htmlFor="blog-search" className="sr-only">Search blog posts</label>
            <input
              id="blog-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Search blog posts..."
              aria-label="Search blog posts"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <label htmlFor="category-filter" className="sr-only">Filter by category</label>
          <select
            id="category-filter"
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <label htmlFor="status-filter" className="sr-only">Filter by status</label>
          <select
            id="status-filter"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <button
          onClick={handleCreatePost}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="-ml-1 mr-2 h-5 w-5" />
          Create New Post
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No blog posts found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating a new blog post'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {post.title}
                      </h2>
                      <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaUser className="mr-1" />
                        <span>{post.author} • {post.authorRole}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        <FaTag className="mr-1 text-xs" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendarAlt className="mr-1" />
                      {post.published
                        ? `Published: ${formatDate(post.publishedAt)}`
                        : 'Not yet published'}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => togglePublishStatus(post.id)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md ${
                          post.published
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800'
                            : 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                        }`}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleViewPost(post)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                        aria-label={`View post: ${post.title}`}
                      >
                        <FaEye className="mr-1" />
                        View
                      </button>

                      <button
                        onClick={() => handleEditPost(post)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
                        aria-label={`Edit post: ${post.title}`}
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
