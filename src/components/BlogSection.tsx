'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';

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

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    }
  ];

  // Fetch published blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/blog/posts?published=true&limit=3`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBlogPosts(data.posts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        // Use sample data if API fails
        console.log('Using sample blog posts instead');
        setBlogPosts(sampleBlogPosts);
        setError(null); // Clear error since we're showing sample data
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // If loading, show skeleton
  if (loading) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Insights</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Loading our latest blog posts...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
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
        </div>
      </section>
    );
  }

  // If error or no posts, show message
  if (error || blogPosts.length === 0) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Insights</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {error ? 'Unable to load blog posts at this time.' : 'No blog posts available yet. Check back soon!'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Insights</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Explore our latest thoughts on AI innovation, business transformation, and technology trends
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
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

        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Blog Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
