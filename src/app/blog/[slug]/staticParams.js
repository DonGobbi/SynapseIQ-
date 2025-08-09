// This file contains the static parameters for the dynamic blog route

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Return an array of objects with the slug parameter
  // These are the slugs that will be pre-rendered at build time
  return [
    { slug: 'ai-adoption-trends-african-financial-services' },
    { slug: 'blockchain-impact-supply-chain-management' },
    { slug: 'digital-transformation-healthcare-africa' },
    { slug: 'future-of-fintech-emerging-markets' },
    { slug: 'sustainable-tech-solutions-africa' }
  ];
}

// Export the function to be imported in the page.tsx file
export default generateStaticParams;
