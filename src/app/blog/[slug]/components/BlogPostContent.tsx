'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaShare } from 'react-icons/fa';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

// Define the BlogPost interface
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readTime: string;
}

// Sample blog post data
const sampleBlogPosts: Record<string, BlogPost> = {
  'ai-adoption-trends-african-financial-services': {
    id: '1',
    title: 'AI Adoption Trends in African Financial Services',
    slug: 'ai-adoption-trends-african-financial-services',
    author: 'Dr. Kwame Nkrumah',
    date: 'March 15, 2023',
    category: 'Artificial Intelligence',
    excerpt: 'Exploring how financial institutions across Africa are leveraging AI to improve services and reach underbanked populations.',
    content: `
      <p>The financial services sector in Africa is undergoing a significant transformation, with artificial intelligence (AI) playing a pivotal role in this evolution. From mobile banking solutions to credit scoring algorithms, AI technologies are helping financial institutions overcome traditional barriers to service delivery across the continent.</p>
      
      <h2>Mobile Banking Revolution</h2>
      <p>Mobile banking platforms enhanced with AI capabilities have become the primary channel for financial services in many African countries. These platforms use machine learning algorithms to analyze transaction patterns, detect fraud, and offer personalized financial advice to users who previously had limited access to banking services.</p>
      
      <h2>Credit Scoring Innovation</h2>
      <p>One of the most impactful applications of AI in African financial services has been in credit scoring. Traditional credit scoring methods often exclude large portions of the population who lack formal credit histories. AI-powered alternative credit scoring models analyze non-traditional data points such as mobile money transactions, utility bill payments, and even social media activity to assess creditworthiness.</p>
      
      <p>Companies like Jumo and Tala have pioneered these approaches, enabling millions of previously "unbanked" individuals to access loans and other financial products for the first time.</p>
      
      <h2>Challenges and Considerations</h2>
      <p>Despite the promising advancements, several challenges remain in the widespread adoption of AI in African financial services:</p>
      
      <ul>
        <li>Data quality and availability issues</li>
        <li>Regulatory frameworks that vary significantly across countries</li>
        <li>The need for AI solutions tailored to local contexts</li>
        <li>Digital literacy gaps among potential users</li>
      </ul>
      
      <h2>Looking Ahead</h2>
      <p>The future of AI in African financial services looks promising, with increasing investment in fintech startups and growing collaboration between traditional banks and technology companies. As connectivity improves and smartphone penetration increases across the continent, we can expect to see even more innovative applications of AI that address uniquely African financial challenges.</p>
      
      <p>For financial institutions looking to remain competitive in this rapidly evolving landscape, investing in AI capabilities is no longer optional—it's essential for long-term success and relevance.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    readTime: '6 min read'
  },
  'blockchain-impact-supply-chain-management': {
    id: '2',
    title: 'Blockchain Impact on Supply Chain Management',
    slug: 'blockchain-impact-supply-chain-management',
    author: 'Amina Diallo',
    date: 'April 22, 2023',
    category: 'Blockchain',
    excerpt: 'How blockchain technology is revolutionizing supply chain transparency and efficiency across African markets.',
    content: `
      <p>Blockchain technology is transforming supply chain management across Africa, offering unprecedented levels of transparency, security, and efficiency. From agricultural exports to pharmaceutical distribution, blockchain solutions are addressing longstanding challenges in African supply chains.</p>
      
      <h2>Traceability in Agricultural Exports</h2>
      <p>For agricultural products—a critical export sector for many African economies—blockchain provides end-to-end traceability from farm to consumer. This capability is particularly valuable for high-value exports like coffee, cocoa, and specialty crops where provenance and quality verification command premium prices in global markets.</p>
      
      <p>Farmers in countries like Ethiopia, Kenya, and Rwanda are now participating in blockchain-based systems that record every step of their products' journey, allowing them to prove sustainable and ethical production methods and gain better access to international markets.</p>
      
      <h2>Combating Counterfeit Goods</h2>
      <p>Counterfeit products, particularly medications, pose serious health risks and economic challenges across Africa. Blockchain-based verification systems enable consumers and regulatory authorities to authenticate products by scanning QR codes that reveal the complete chain of custody.</p>
      
      <p>In Nigeria and Ghana, pharmaceutical companies have implemented blockchain solutions that have significantly reduced the circulation of counterfeit drugs in local markets.</p>
      
      <h2>Streamlining Cross-Border Trade</h2>
      <p>The African Continental Free Trade Area (AfCFTA) aims to create the world's largest free trade area, but cross-border trade in Africa has historically been hampered by bureaucratic processes and paperwork. Blockchain-based documentation systems are now being piloted at several border crossings to:</p>
      
      <ul>
        <li>Digitize customs documentation</li>
        <li>Reduce processing times</li>
        <li>Minimize opportunities for corruption</li>
        <li>Lower transaction costs for traders</li>
      </ul>
      
      <h2>Implementation Challenges</h2>
      <p>Despite its potential, blockchain adoption in African supply chains faces several obstacles:</p>
      
      <ul>
        <li>Limited digital infrastructure in rural areas</li>
        <li>High initial implementation costs</li>
        <li>Need for technical expertise and training</li>
        <li>Regulatory uncertainty in many countries</li>
      </ul>
      
      <h2>Future Outlook</h2>
      <p>As technology costs decrease and digital literacy improves, blockchain adoption in African supply chains is expected to accelerate. Public-private partnerships and regional initiatives are emerging to create shared blockchain infrastructure that can benefit multiple industries and countries simultaneously.</p>
      
      <p>For businesses operating in Africa, exploring blockchain solutions for supply chain management represents not just an opportunity to improve operational efficiency, but also to contribute to economic development through increased transparency and reduced friction in trade.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    readTime: '7 min read'
  },
  'digital-transformation-healthcare-africa': {
    id: '3',
    title: 'Digital Transformation in Healthcare Africa',
    slug: 'digital-transformation-healthcare-africa',
    author: 'Dr. Ngozi Okonjo',
    date: 'May 10, 2023',
    category: 'Healthcare',
    excerpt: 'Examining how digital technologies are addressing healthcare challenges and improving patient outcomes across Africa.',
    content: `
      <p>Digital technologies are revolutionizing healthcare delivery across Africa, helping to overcome longstanding challenges such as limited access to medical facilities, shortage of healthcare professionals, and inadequate health information systems. From telemedicine to AI-powered diagnostics, digital solutions are extending the reach and quality of healthcare services.</p>
      
      <h2>Telemedicine: Bridging the Access Gap</h2>
      <p>In a continent where many communities are located far from healthcare facilities, telemedicine has emerged as a critical solution. Mobile health platforms connect patients in remote areas with doctors for virtual consultations, reducing the need for long and often difficult journeys to hospitals.</p>
      
      <p>In countries like Rwanda and Kenya, telemedicine services have seen rapid adoption, with some platforms reporting over 100,000 consultations monthly. These services are particularly valuable for follow-up care, chronic disease management, and initial triage of medical conditions.</p>
      
      <h2>AI-Powered Diagnostics</h2>
      <p>Artificial intelligence is enhancing diagnostic capabilities in resource-constrained settings. AI algorithms trained to analyze medical images can help detect conditions such as tuberculosis, malaria, and certain cancers, even in areas without specialist physicians.</p>
      
      <p>For example, a startup in Uganda has developed an AI tool that uses smartphone images to diagnose skin conditions, while another in Cameroon has created a device that uses AI to diagnose heart disease through sound analysis—innovations specifically designed for African healthcare contexts.</p>
      
      <h2>Digital Health Records</h2>
      <p>The transition from paper-based to electronic health records is improving continuity of care and enabling better health system planning. Several African countries have implemented national digital health record systems that:</p>
      
      <ul>
        <li>Ensure patient information is available across different facilities</li>
        <li>Reduce medication errors and duplicate tests</li>
        <li>Generate valuable data for public health surveillance</li>
        <li>Improve resource allocation based on actual health needs</li>
      </ul>
      
      <h2>Mobile Health Applications</h2>
      <p>With mobile phone penetration exceeding 80% in many African countries, health applications have become powerful tools for patient education, medication adherence, and disease management. Apps focusing on maternal health, HIV management, and non-communicable diseases have shown promising results in improving health outcomes.</p>
      
      <h2>Challenges to Digital Health Adoption</h2>
      <p>Despite significant progress, several challenges remain:</p>
      
      <ul>
        <li>Digital divide between urban and rural areas</li>
        <li>Concerns about data privacy and security</li>
        <li>Need for sustainable business models beyond donor funding</li>
        <li>Integration of various digital health solutions into cohesive systems</li>
      </ul>
      
      <h2>The Path Forward</h2>
      <p>The future of digital health in Africa depends on collaborative approaches involving governments, private sector, development partners, and communities. Policies that promote digital health innovation while ensuring appropriate regulation and data protection will be essential.</p>
      
      <p>As digital infrastructure continues to improve across the continent, we can expect to see increasingly sophisticated health technologies adapted to African contexts, ultimately contributing to the goal of universal health coverage.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    readTime: '8 min read'
  },
  'future-of-fintech-emerging-markets': {
    id: '4',
    title: 'Future of Fintech in Emerging Markets',
    slug: 'future-of-fintech-emerging-markets',
    author: 'Chijioke Dozie',
    date: 'June 5, 2023',
    category: 'Fintech',
    excerpt: 'Analyzing trends and opportunities in the rapidly evolving fintech landscape across African and other emerging markets.',
    content: `
      <p>Financial technology (fintech) is reshaping economic landscapes across emerging markets, with Africa at the forefront of this transformation. From mobile money platforms to embedded finance solutions, fintech innovations are addressing financial inclusion challenges and creating new economic opportunities.</p>
      
      <h2>Beyond Mobile Money</h2>
      <p>While mobile money services like M-Pesa pioneered fintech in Africa, the ecosystem has evolved far beyond basic payment and transfer services. Today's fintech landscape includes:</p>
      
      <ul>
        <li>Digital lending platforms using alternative data for credit decisions</li>
        <li>Insurtech solutions making insurance products accessible and affordable</li>
        <li>Investment apps democratizing access to local and global financial markets</li>
        <li>Blockchain-based remittance services reducing the cost of international transfers</li>
      </ul>
      
      <p>This diversification is creating a more comprehensive financial ecosystem that addresses various aspects of financial inclusion.</p>
      
      <h2>Embedded Finance: The Next Frontier</h2>
      <p>Embedded finance—the integration of financial services into non-financial platforms—is emerging as a powerful trend in African fintech. E-commerce marketplaces, ride-hailing apps, and even agricultural platforms are now offering seamless financial services within their ecosystems.</p>
      
      <p>This approach reduces friction in financial transactions and creates contextual financial services that are more relevant to users' immediate needs. For example, farmers can access crop insurance directly through the same platform they use to sell their produce.</p>
      
      <h2>Regulatory Innovation</h2>
      <p>Regulatory frameworks are evolving to accommodate fintech innovation while ensuring consumer protection and financial stability. Several African countries have implemented:</p>
      
      <ul>
        <li>Regulatory sandboxes to test innovative financial products</li>
        <li>Tiered KYC requirements that balance inclusion with compliance</li>
        <li>Open banking frameworks to promote competition and innovation</li>
        <li>Specialized licenses for digital banks and payment service providers</li>
      </ul>
      
      <p>These regulatory approaches are creating environments where fintech can flourish while maintaining appropriate oversight.</p>
      
      <h2>Cross-Border Fintech Expansion</h2>
      <p>As African fintech companies mature, many are expanding across borders, creating pan-African financial networks. This expansion is facilitated by:</p>
      
      <ul>
        <li>Regional economic communities harmonizing financial regulations</li>
        <li>Shared payment infrastructure initiatives</li>
        <li>Strategic partnerships between fintech companies in different markets</li>
        <li>Investment from global venture capital and strategic investors</li>
      </ul>
      
      <h2>Challenges and Opportunities</h2>
      <p>Despite significant progress, several challenges remain for fintech in emerging markets:</p>
      
      <ul>
        <li>Digital identity verification in countries with limited national ID systems</li>
        <li>Cybersecurity threats and data protection concerns</li>
        <li>Last-mile connectivity in rural areas</li>
        <li>Building consumer trust in digital financial services</li>
      </ul>
      
      <p>These challenges also represent opportunities for innovative solutions that can unlock further growth in the sector.</p>
      
      <h2>Looking Ahead</h2>
      <p>The future of fintech in emerging markets will likely be characterized by increased collaboration between traditional financial institutions and fintech innovators, greater emphasis on financial health and literacy alongside access, and the application of advanced technologies like AI and IoT to create even more personalized financial services.</p>
      
      <p>For investors, entrepreneurs, and policymakers, understanding these trends is essential for navigating the dynamic fintech landscape in Africa and other emerging markets.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    readTime: '7 min read'
  },
  'sustainable-tech-solutions-africa': {
    id: '5',
    title: 'Sustainable Tech Solutions for Africa',
    slug: 'sustainable-tech-solutions-africa',
    author: 'Fadji Maina',
    date: 'July 18, 2023',
    category: 'Sustainability',
    excerpt: 'How technology is addressing environmental challenges and promoting sustainable development across African countries.',
    content: `
      <p>Across Africa, innovative technology solutions are emerging to address pressing environmental challenges while supporting sustainable economic development. From renewable energy to climate-smart agriculture, these technologies are helping communities adapt to climate change and build resilience.</p>
      
      <h2>Decentralized Renewable Energy</h2>
      <p>Off-grid solar solutions have revolutionized energy access in rural Africa, leapfrogging traditional grid infrastructure. Pay-as-you-go solar home systems allow households to finance clean energy access over time, while mini-grids serve entire communities with reliable electricity.</p>
      
      <p>Companies like M-KOPA, Bboxx, and Zola Electric have connected millions of homes to solar power, enabling economic activities, improving education outcomes, and reducing reliance on kerosene lighting and diesel generators.</p>
      
      <h2>Climate-Smart Agriculture Technology</h2>
      <p>With agriculture employing over 60% of Africa's population, climate-smart agricultural technologies are critical for both food security and climate resilience. Digital platforms now provide:</p>
      
      <ul>
        <li>Precision agriculture advice based on satellite data and soil sensors</li>
        <li>Weather forecasts and climate information via SMS</li>
        <li>Marketplace connections that reduce post-harvest losses</li>
        <li>Micro-insurance products protecting against crop failure</li>
      </ul>
      
      <p>These solutions help smallholder farmers increase yields while adapting to changing climate conditions and practicing more sustainable farming methods.</p>
      
      <h2>Water Management Solutions</h2>
      <p>Water scarcity affects many African regions, making efficient water management essential. Technology innovations in this space include:</p>
      
      <ul>
        <li>IoT-enabled water monitoring systems that detect leaks and quality issues</li>
        <li>Digital payment systems for water services that improve sustainability</li>
        <li>Atmospheric water generators producing drinking water from air humidity</li>
        <li>Solar-powered desalination for coastal communities</li>
      </ul>
      
      <p>These technologies are helping communities secure reliable water access even in drought-prone areas.</p>
      
      <h2>Circular Economy Platforms</h2>
      <p>Digital platforms supporting circular economy principles are addressing waste management challenges in African cities. Mobile apps connect waste generators with recyclers, creating value from materials that would otherwise end up in landfills or waterways.</p>
      
      <p>In countries like Nigeria, Kenya, and South Africa, these platforms have created thousands of green jobs while significantly reducing plastic pollution and electronic waste.</p>
      
      <h2>Conservation Technology</h2>
      <p>Africa's rich biodiversity is being protected through innovative conservation technologies:</p>
      
      <ul>
        <li>AI-powered camera traps that monitor wildlife populations</li>
        <li>Drones that detect and prevent poaching</li>
        <li>Blockchain systems that ensure transparency in carbon credit programs</li>
        <li>Mobile apps that engage communities in conservation efforts</li>
      </ul>
      
      <p>These tools enable more effective protection of natural resources while creating sustainable livelihoods through ecotourism and conservation-based enterprises.</p>
      
      <h2>Challenges and Opportunities</h2>
      <p>Scaling sustainable technology solutions in Africa faces several challenges:</p>
      
      <ul>
        <li>Limited financing for green technology adoption</li>
        <li>Need for supportive policy frameworks</li>
        <li>Building technical capacity for maintenance and operation</li>
        <li>Ensuring solutions are culturally appropriate and locally owned</li>
      </ul>
      
      <h2>The Path Forward</h2>
      <p>The future of sustainable technology in Africa depends on collaborative approaches that combine local innovation with global expertise and financing. As climate change impacts intensify across the continent, these technologies will become increasingly vital for adaptation and resilience.</p>
      
      <p>For technology companies, impact investors, and development organizations, Africa presents a unique opportunity to deploy and scale solutions that address environmental challenges while contributing to economic development and improved quality of life.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    readTime: '8 min read'
  }
};

export default function BlogPostContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate API fetch with a timeout
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/blog/${slug}`);
        // const data = await response.json();
        
        // For now, we'll use our sample data
        setTimeout(() => {
          const postData = sampleBlogPosts[slug];
          if (postData) {
            setPost(postData);
            setError(null);
          } else {
            setError('Blog post not found');
          }
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load blog post');
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'SynapseIQ Blog Post',
        text: post?.excerpt || 'Check out this blog post from SynapseIQ',
        url: window.location.href,
      })
      .catch((err) => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy URL:', err));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="animate-pulse flex flex-col w-full max-w-4xl">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-8">{error || 'Blog post not found'}</p>
          <Link href="/blog" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
            <FaArrowLeft className="mr-2" /> Back to all articles
          </Link>
          
          {/* Hero section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-4">
              <div className="flex items-center">
                <FaUser className="mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <FaTag className="mr-2" />
                <span>{post.category}</span>
              </div>
              <div>
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
              <Image 
                src={post.coverImage} 
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="transition-transform hover:scale-105 duration-700"
              />
            </div>
          </motion.div>
          
          {/* Article content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Share button */}
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleShareClick}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              <FaShare className="mr-2" /> 
              {copied ? 'Link copied!' : 'Share this article'}
            </button>
          </div>
          
          {/* Related articles section could go here */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
