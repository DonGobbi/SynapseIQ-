'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag, FaSearch } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageTransition from '../../components/PageTransition';

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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Sample blog posts for when API fails
  const sampleBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: "AI Adoption Trends in African Financial Services",
      slug: "ai-adoption-trends-african-financial-services",
      excerpt: "How banks and financial institutions across Africa are leveraging AI to improve customer service and reduce operational costs.",
      content: "Full content here...",
      author: "Amina Okafor",
      authorRole: "AI Strategy Consultant",
      category: "Finance",
      tags: ["AI", "Banking", "Financial Services", "Africa"],
      featuredImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Multilingual Chatbots: Bridging Language Barriers in African Business",
      slug: "multilingual-chatbots-african-business",
      excerpt: "How AI-powered chatbots that support local languages are transforming customer service across diverse African markets.",
      content: "Full content here...",
      author: "David Mensah",
      authorRole: "NLP Specialist",
      category: "Chatbots",
      tags: ["NLP", "Chatbots", "Languages", "Customer Service"],
      featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Data Privacy and AI Ethics in African Contexts",
      slug: "data-privacy-ai-ethics-african-contexts",
      excerpt: "Exploring the unique challenges and opportunities in implementing ethical AI practices while respecting data privacy in African markets.",
      content: "Full content here...",
      author: "Nala Diallo",
      authorRole: "AI Ethics Researcher",
      category: "Ethics",
      tags: ["Ethics", "Data Privacy", "Regulations", "Governance"],
      featuredImage: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      title: "AI-Powered Agriculture: Boosting Crop Yields Across Africa",
      slug: "ai-powered-agriculture-boosting-crop-yields",
      excerpt: "How machine learning and IoT sensors are helping farmers across the continent optimize irrigation, predict weather patterns, and increase productivity.",
      content: "Full content here...",
      author: "Emmanuel Osei",
      authorRole: "AgriTech Specialist",
      category: "Agriculture",
      tags: ["Agriculture", "IoT", "Machine Learning", "Sustainability"],
      featuredImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      title: "Building AI Solutions with Limited Data: Strategies for African Startups",
      slug: "building-ai-solutions-limited-data-african-startups",
      excerpt: "Practical approaches for developing effective AI models when working with small datasets - a common challenge for African tech startups.",
      content: "Full content here...",
      author: "Zainab Mwangi",
      authorRole: "Data Science Lead",
      category: "Startups",
      tags: ["Startups", "Data Science", "Small Data", "Innovation"],
      featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      title: "The Rise of Mobile AI: Applications for Africa's Mobile-First Economy",
      slug: "rise-of-mobile-ai-applications-africa",
      excerpt: "How lightweight AI models are being deployed on mobile devices to solve uniquely African challenges in regions with limited connectivity.",
      content: "Full content here...",
      author: "Thabo Ndlovu",
      authorRole: "Mobile AI Developer",
      category: "Mobile",
      tags: ["Mobile", "Edge AI", "Connectivity", "Innovation"],
      featuredImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Fetch published blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/blog/posts?published=true`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBlogPosts(data.posts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.posts.map((post: BlogPost) => post.category))) as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        // Use sample data if API fails
        console.log('Using sample blog posts instead');
        setBlogPosts(sampleBlogPosts);
        
        // Extract unique categories from sample data
        const uniqueCategories = Array.from(new Set(sampleBlogPosts.map(post => post.category))) as string[];
        setCategories(uniqueCategories);
        setError(null); // Clear error since we're showing sample data
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      <Header />
      <PageTransition>
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">SynapseIQ Blog</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Insights on AI innovation, business transformation, and technology trends
              </p>
            </motion.div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex-shrink-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300 dark:bg-gray-700" />
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error Loading Blog Posts</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredPosts.length === 0 && (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No blog posts found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Check back soon for new content!'}
                </p>
              </div>
            )}

            {/* Blog Post Grid */}
            {!loading && !error && filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {post.featuredImage && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <FaUser className="mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          >
                            <FaTag className="mr-1 text-xs" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
                        >
                          Read more
                          <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
