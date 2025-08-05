'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaShare } from 'react-icons/fa';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PageTransition from '../../../components/PageTransition';
import StyledMarkdown from '../../../components/StyledMarkdown';

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

export default function BlogPostPage() {
  const { slug } = useParams();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

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

  // Share the current post
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.title || 'SynapseIQ Blog Post',
        text: blogPost?.excerpt || 'Check out this blog post from SynapseIQ',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Could not copy text: ', err));
    }
  };

  // Sample blog posts for when API fails
  const sampleBlogPosts: Record<string, BlogPost> = {
    'ai-adoption-trends-african-financial-services': {
      id: 1,
      title: "AI Adoption Trends in African Financial Services",
      slug: "ai-adoption-trends-african-financial-services",
      excerpt: "How banks and financial institutions across Africa are leveraging AI to improve customer service and reduce operational costs.",
      content: "# AI Adoption Trends in African Financial Services\n\n## Introduction\n\nAcross Africa, financial institutions are increasingly turning to artificial intelligence to transform their operations, enhance customer experiences, and expand financial inclusion. This trend is reshaping the banking landscape on the continent.\n\n## Key Adoption Areas\n\n### Customer Service Automation\n\nChatbots and virtual assistants are becoming commonplace in African banks, helping to serve customers in multiple languages and reducing the burden on call centers. These AI systems can handle routine inquiries, process basic transactions, and even assist with financial advice.\n\n### Fraud Detection and Prevention\n\nAI-powered systems are analyzing transaction patterns to identify potential fraud in real-time, helping financial institutions protect themselves and their customers. This is particularly important in markets where digital banking adoption is growing rapidly.\n\n### Credit Scoring and Risk Assessment\n\nTraditional credit scoring methods often exclude large portions of the population in African markets. AI models are now incorporating alternative data sources to assess creditworthiness, enabling financial institutions to extend services to previously underserved segments.\n\n## Challenges and Opportunities\n\n### Data Quality and Availability\n\nMany African financial institutions struggle with fragmented or incomplete data, making it challenging to train effective AI models. However, this is driving innovation in small data techniques and transfer learning approaches.\n\n### Regulatory Considerations\n\nRegulatory frameworks for AI in financial services are still evolving across African markets. Forward-thinking institutions are working closely with regulators to develop responsible AI practices.\n\n### Talent Development\n\nBuilding local AI expertise remains a priority. Several banks have established partnerships with universities and tech hubs to nurture homegrown talent in data science and machine learning.\n\n## Conclusion\n\nAI adoption in African financial services is not just about technological advancement—it's about creating more inclusive, efficient, and secure financial systems that can serve the continent's diverse population. As implementation costs decrease and expertise grows, we expect to see even more innovative applications emerge in the coming years.",
      author: "Amina Okafor",
      authorRole: "AI Strategy Consultant",
      category: "Finance",
      tags: ["AI", "Banking", "Financial Services", "Africa"],
      featuredImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'multilingual-chatbots-african-business': {
      id: 2,
      title: "Multilingual Chatbots: Bridging Language Barriers in African Business",
      slug: "multilingual-chatbots-african-business",
      excerpt: "How AI-powered chatbots that support local languages are transforming customer service across diverse African markets.",
      content: "# Multilingual Chatbots: Bridging Language Barriers in African Business\n\n## The Language Challenge in African Business\n\nWith over 2,000 languages spoken across the continent, language barriers represent a significant challenge for businesses operating in Africa. Traditional customer service approaches often fail to accommodate this linguistic diversity, leading to exclusion and missed opportunities.\n\n## The Rise of Multilingual AI Solutions\n\nAdvances in natural language processing (NLP) are making it possible to develop chatbots that can understand and respond in multiple African languages. These systems are helping businesses reach customers in their preferred language, building trust and improving engagement.\n\n## Implementation Success Stories\n\n### Banking Sector\n\nA major East African bank implemented a chatbot that supports Swahili, Amharic, English, and French, allowing customers to check balances, transfer money, and resolve common issues in their language of choice. Customer satisfaction scores increased by 45% within three months of deployment.\n\n### Telecommunications\n\nA pan-African telecom provider deployed a WhatsApp-based assistant that handles customer inquiries in 12 languages, including Yoruba, Zulu, Chichewa, and Lingala. The system now handles over 60% of all customer interactions, significantly reducing call center volume.\n\n### E-commerce\n\nAn online marketplace serving West Africa integrated a multilingual chatbot to help customers navigate products, track orders, and process returns in local languages. This led to a 30% increase in conversion rates among non-English speaking users.\n\n## Technical Approaches\n\n### Transfer Learning\n\nBy leveraging transfer learning techniques, developers can adapt large language models trained primarily on high-resource languages to work effectively with African languages that have less training data available.\n\n### Hybrid Models\n\nCombining rule-based systems with machine learning allows chatbots to handle the unique grammatical structures and contextual nuances of African languages more effectively.\n\n### Community Involvement\n\nSome of the most successful implementations have involved local language speakers in the development and training process, ensuring cultural relevance and linguistic accuracy.\n\n## Looking Ahead\n\nAs NLP capabilities continue to improve for African languages, we can expect to see even more sophisticated applications emerge. The future of customer service in Africa will likely be increasingly automated yet paradoxically more personal, as businesses can engage with customers in their mother tongue at scale.",
      author: "David Mensah",
      authorRole: "NLP Specialist",
      category: "Chatbots",
      tags: ["NLP", "Chatbots", "Languages", "Customer Service"],
      featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'data-privacy-ai-ethics-african-contexts': {
      id: 3,
      title: "Data Privacy and AI Ethics in African Contexts",
      slug: "data-privacy-ai-ethics-african-contexts",
      excerpt: "Exploring the unique challenges and opportunities in implementing ethical AI practices while respecting data privacy in African markets.",
      content: "# Data Privacy and AI Ethics in African Contexts\n\n## The Unique Landscape of Data Governance in Africa\n\nAs artificial intelligence transforms industries across Africa, questions of data privacy, ownership, and ethical use are becoming increasingly important. The continent presents unique considerations that differ from Western contexts, requiring thoughtful approaches to AI governance.\n\n## Current Regulatory Frameworks\n\nAfrican data protection regulations vary significantly by country:\n\n- **South Africa's POPIA** (Protection of Personal Information Act) represents one of the most comprehensive frameworks, similar to Europe's GDPR.\n- **Kenya's Data Protection Act** established a dedicated commissioner to oversee compliance.\n- **Nigeria's NDPR** (Nigeria Data Protection Regulation) focuses on consent and lawful processing.\n- Many countries are still developing their regulatory approaches, creating a complex patchwork for organizations operating across borders.\n\n## Cultural Dimensions of Data Privacy\n\nWestern concepts of individual data ownership don't always translate directly to African contexts, where communal approaches to information sharing may be more culturally aligned. AI ethics frameworks must consider these nuances rather than simply importing Western standards.\n\n## Practical Challenges\n\n### Informed Consent\n\nLow digital literacy rates in some regions make traditional informed consent models problematic. Innovative approaches using visual explanations and voice-based systems are showing promise.\n\n### Algorithmic Bias\n\nAI systems trained primarily on Western data often perform poorly when deployed in African contexts. Organizations are working to develop more representative training datasets and validation processes.\n\n### Data Sovereignty\n\nQuestions about where data is stored, who has access to it, and how it benefits local communities are central to ethical AI deployment in Africa.\n\n## Emerging Best Practices\n\n### Community Engagement\n\nInvolving local communities in decisions about data collection and AI applications helps ensure solutions are culturally appropriate and beneficial.\n\n### Transparency\n\nClear communication about how AI systems work, what data they use, and how decisions are made builds trust with users.\n\n### Capacity Building\n\nInvesting in local expertise ensures that Africans lead the conversation about appropriate AI use in their own contexts.\n\n## The Path Forward\n\nEthical AI in Africa requires balancing innovation with protection, respecting cultural contexts while upholding fundamental rights. By developing frameworks that center African perspectives and priorities, the continent has an opportunity to chart its own course in responsible AI development.",
      author: "Nala Diallo",
      authorRole: "AI Ethics Researcher",
      category: "Ethics",
      tags: ["Ethics", "Data Privacy", "Regulations", "Governance"],
      featuredImage: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'ai-powered-agriculture-boosting-crop-yields': {
      id: 4,
      title: "AI-Powered Agriculture: Boosting Crop Yields Across Africa",
      slug: "ai-powered-agriculture-boosting-crop-yields",
      excerpt: "How machine learning and IoT sensors are helping farmers across the continent optimize irrigation, predict weather patterns, and increase productivity.",
      content: "# AI-Powered Agriculture: Boosting Crop Yields Across Africa\n\nContent coming soon...",
      author: "Emmanuel Osei",
      authorRole: "AgriTech Specialist",
      category: "Agriculture",
      tags: ["Agriculture", "IoT", "Machine Learning", "Sustainability"],
      featuredImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'building-ai-solutions-limited-data-african-startups': {
      id: 5,
      title: "Building AI Solutions with Limited Data: Strategies for African Startups",
      slug: "building-ai-solutions-limited-data-african-startups",
      excerpt: "Practical approaches for developing effective AI models when working with small datasets - a common challenge for African tech startups.",
      content: "# Building AI Solutions with Limited Data: Strategies for African Startups\n\nContent coming soon...",
      author: "Zainab Mwangi",
      authorRole: "Data Science Lead",
      category: "Startups",
      tags: ["Startups", "Data Science", "Small Data", "Innovation"],
      featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'rise-of-mobile-ai-applications-africa': {
      id: 6,
      title: "The Rise of Mobile AI: Applications for Africa's Mobile-First Economy",
      slug: "rise-of-mobile-ai-applications-africa",
      excerpt: "How lightweight AI models are being deployed on mobile devices to solve uniquely African challenges in regions with limited connectivity.",
      content: "# The Rise of Mobile AI: Applications for Africa's Mobile-First Economy\n\nContent coming soon...",
      author: "Thabo Ndlovu",
      authorRole: "Mobile AI Developer",
      category: "Mobile",
      tags: ["Mobile", "Edge AI", "Connectivity", "Innovation"],
      featuredImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      published: true,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  // Sample related posts for each slug
  const sampleRelatedPostsMap: Record<string, BlogPost[]> = {
    'ai-adoption-trends-african-financial-services': [
      sampleBlogPosts['data-privacy-ai-ethics-african-contexts'],
      sampleBlogPosts['building-ai-solutions-limited-data-african-startups']
    ],
    'multilingual-chatbots-african-business': [
      sampleBlogPosts['rise-of-mobile-ai-applications-africa'],
      sampleBlogPosts['ai-adoption-trends-african-financial-services']
    ],
    'data-privacy-ai-ethics-african-contexts': [
      sampleBlogPosts['ai-adoption-trends-african-financial-services'],
      sampleBlogPosts['multilingual-chatbots-african-business']
    ],
    'ai-powered-agriculture-boosting-crop-yields': [
      sampleBlogPosts['building-ai-solutions-limited-data-african-startups'],
      sampleBlogPosts['data-privacy-ai-ethics-african-contexts']
    ],
    'building-ai-solutions-limited-data-african-startups': [
      sampleBlogPosts['ai-adoption-trends-african-financial-services'],
      sampleBlogPosts['rise-of-mobile-ai-applications-africa']
    ],
    'rise-of-mobile-ai-applications-africa': [
      sampleBlogPosts['multilingual-chatbots-african-business'],
      sampleBlogPosts['building-ai-solutions-limited-data-african-startups']
    ]
  };

  // Fetch blog post by slug
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/blog/posts/slug/${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog post: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBlogPost(data);
        
        // Fetch related posts (same category or shared tags)
        if (data) {
          const relatedResponse = await fetch(`${apiUrl}/blog/posts?category=${data.category}&published=true&limit=3`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out the current post and limit to 3 posts
            const filteredRelated = relatedData.posts
              .filter((post: BlogPost) => post.id !== data.id)
              .slice(0, 3);
            setRelatedPosts(filteredRelated);
          }
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        
        // Use sample data if API fails
        if (typeof slug === 'string' && sampleBlogPosts[slug]) {
          console.log('Using sample blog post data instead');
          setBlogPost(sampleBlogPosts[slug]);
          setRelatedPosts(sampleRelatedPostsMap[slug] || []);
          setError(null); // Clear error since we're showing sample data
        } else {
          setError('Blog post not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  return (
    <main>
      <Header />
      <PageTransition>
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            {/* Loading State */}
            {loading && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300 dark:bg-gray-700" />
                  <div className="p-8">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error Loading Blog Post</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
                  <div className="mt-6">
                    <Link 
                      href="/blog"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaArrowLeft className="mr-2" />
                      Back to Blog
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Post Content */}
            {!loading && !error && blogPost && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
              >
                {/* Back to Blog Link */}
                <div className="mb-6">
                  <Link 
                    href="/blog"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Blog
                  </Link>
                </div>

                {/* Featured Image */}
                {blogPost.featuredImage && (
                  <div className="relative h-64 md:h-96 w-full mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={blogPost.featuredImage}
                      alt={blogPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Post Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {blogPost.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatDate(blogPost.publishedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUser className="mr-1" />
                        <span>{blogPost.author} • {blogPost.authorRole}</span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {blogPost.category}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blogPost.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <FaTag className="mr-1 text-xs" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Post Content */}
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <StyledMarkdown content={blogPost.content} />
                    </div>

                    {/* Share Button */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleShare}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FaShare className="mr-2" />
                        Share this post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                          {post.featuredImage && (
                            <div className="relative h-40 w-full">
                              <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <Link href={`/blog/${post.slug}`}>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                                {post.title}
                              </h3>
                            </Link>
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <FaCalendarAlt className="inline mr-1" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
