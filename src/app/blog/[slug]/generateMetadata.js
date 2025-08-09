import { generateStaticParams } from './staticParams';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  // You could fetch actual metadata from an API here
  // For now, we'll use a simple mapping
  const titleMap = {
    'ai-adoption-trends-african-financial-services': 'AI Adoption Trends in African Financial Services',
    'blockchain-impact-supply-chain-management': 'Blockchain Impact on Supply Chain Management',
    'digital-transformation-healthcare-africa': 'Digital Transformation in Healthcare Africa',
    'future-of-fintech-emerging-markets': 'Future of Fintech in Emerging Markets',
    'sustainable-tech-solutions-africa': 'Sustainable Tech Solutions for Africa'
  };

  return {
    title: titleMap[slug] || 'SynapseIQ Blog',
    description: `Read our blog post about ${titleMap[slug] || 'technology in Africa'}`,
  };
}

// Re-export generateStaticParams to make it available to Next.js
export { generateStaticParams };
