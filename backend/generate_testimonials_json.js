// Script to generate 100 testimonials and save them to a JSON file
const fs = require('fs');
const path = require('path');

// Sample African names for testimonials
const firstNames = [
  "Amara", "Kwame", "Zola", "Thabo", "Nia", "Kofi", "Amina", "Tendai", 
  "Makena", "Jabari", "Zuri", "Mandla", "Aisha", "Sefu", "Nala", "Kito",
  "Imani", "Jelani", "Safiya", "Tafari", "Asha", "Chike", "Dalila", "Faraji",
  "Eshe", "Gamba", "Hasina", "Kamau", "Layla", "Mosi", "Nia", "Odion",
  "Rehema", "Simba", "Taraji", "Uzoma", "Zalika", "Bakari", "Chioma", "Dayo"
];

const lastNames = [
  "Mensah", "Okafor", "Nkosi", "Diallo", "Abebe", "Mwangi", "Ibrahim", "Moyo",
  "Ndlovu", "Osei", "Kimani", "Dlamini", "Afolayan", "Banda", "Chukwu", "Diop",
  "Eze", "Gueye", "Hassan", "Jalloh", "Kone", "Lumumba", "Mutombo", "Nwosu",
  "Okoro", "Patel", "Ruto", "Sow", "Toure", "Usman", "Wanjiku", "Yeboah",
  "Zuma", "Addo", "Bello", "Cisse", "Dube", "Egwu", "Fofana", "Gicheru"
];

// African companies
const companies = [
  "Safaricom", "MTN Group", "Dangote Industries", "Ecobank", "Jumia", 
  "Naspers", "Sonangol", "Sasol", "Oando", "Equity Bank", "Zenith Bank",
  "Maroc Telecom", "Attijariwafa Bank", "Shoprite", "Massmart", "Nando's",
  "Guaranty Trust Bank", "Econet Wireless", "Sanlam", "Old Mutual"
];

// Job positions
const positions = [
  "CEO", "CFO", "CTO", "COO", "Marketing Director", "Sales Manager",
  "HR Director", "Operations Manager", "IT Manager", "Finance Director",
  "Business Development Manager", "Project Manager", "Product Manager",
  "Customer Success Manager", "Regional Director", "Branch Manager"
];

// Testimonial content templates
const contentTemplates = [
  "SynapseIQ has transformed our {department} operations. Their {service} solution helped us achieve {percentage}% improvement in {metric}. The team was professional and responsive throughout the implementation.",
  "Working with SynapseIQ was a game-changer for our business. Their {service} platform integrated seamlessly with our existing systems, and the results were immediate. We've seen {percentage}% increase in {metric} since implementation.",
  "I can't recommend SynapseIQ enough! Their {service} services have revolutionized how we approach {department} challenges in the African market. The ROI has been exceptional with {percentage}% boost in {metric}.",
  "SynapseIQ understood our unique challenges as an African business. Their {service} solution was tailored to our specific needs, resulting in {percentage}% improvement in {metric} within just {timeframe} months.",
  "The expertise that SynapseIQ brought to our {department} project was invaluable. Their {service} implementation exceeded our expectations, delivering a {percentage}% enhancement in {metric} and transforming our business processes.",
  "SynapseIQ's {service} platform has been instrumental in our digital transformation journey. We've experienced a {percentage}% increase in {metric}, and their support team has been exceptional throughout.",
  "As a growing business in {country}, we needed a partner who understood the local market. SynapseIQ delivered a {service} solution that addressed our specific challenges, resulting in {percentage}% improvement in {metric}.",
  "The team at SynapseIQ went above and beyond in implementing their {service} solution for our company. We've seen remarkable results - {percentage}% increase in {metric} and significant improvements in customer satisfaction.",
  "SynapseIQ's {service} platform has been a critical component of our success in the competitive {industry} sector. Their solution helped us achieve a {percentage}% boost in {metric} while reducing operational costs.",
  "I'm impressed by SynapseIQ's deep understanding of the African business landscape. Their {service} solution was perfectly aligned with our needs, helping us achieve {percentage}% growth in {metric} despite market challenges."
];

// Variables to fill in templates
const departments = ["marketing", "sales", "customer service", "operations", "finance", "IT", "supply chain", "HR", "R&D", "logistics"];
const services = ["AI-powered analytics", "machine learning", "natural language processing", "predictive analytics", "business intelligence", "chatbot", "data visualization", "automated reporting", "sentiment analysis", "recommendation engine"];
const metrics = ["productivity", "revenue", "customer satisfaction", "operational efficiency", "cost savings", "conversion rate", "customer retention", "market share", "ROI", "employee satisfaction"];
const countries = ["Kenya", "Nigeria", "South Africa", "Ghana", "Ethiopia", "Tanzania", "Egypt", "Morocco", "Rwanda", "Senegal"];
const industries = ["fintech", "agriculture", "healthcare", "retail", "telecommunications", "energy", "manufacturing", "education", "transportation", "hospitality"];
const timeframes = [3, 6, 9, 12];

// Helper function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to get random date within the last 2 years
const getRandomDate = () => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 730); // Up to 2 years ago
  const date = new Date(today);
  date.setDate(today.getDate() - daysAgo);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// Helper function to replace template placeholders
const fillTemplate = (template) => {
  return template
    .replace('{department}', getRandomItem(departments))
    .replace('{service}', getRandomItem(services))
    .replace('{percentage}', Math.floor(Math.random() * 75) + 20) // 20-95%
    .replace('{metric}', getRandomItem(metrics))
    .replace('{timeframe}', getRandomItem(timeframes))
    .replace('{country}', getRandomItem(countries))
    .replace('{industry}', getRandomItem(industries));
};

// Generate 100 testimonials
const generateTestimonials = (count) => {
  const testimonials = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    
    const testimonial = {
      name: `${firstName} ${lastName}`,
      company: getRandomItem(companies),
      position: getRandomItem(positions),
      rating: Math.random() > 0.2 ? 5 : 4, // 80% chance of 5-star rating
      content: fillTemplate(getRandomItem(contentTemplates)),
      image: `/static/images/testimonials/person_${(i % 10) + 1}.jpg`, // Cycle through 10 images
      featured: Math.random() < 0.2, // 20% chance to be featured
      date: getRandomDate()
    };
    
    testimonials.push(testimonial);
  }
  
  return testimonials;
};

// Generate 100 testimonials
const testimonials = generateTestimonials(100);

// Make sure at least 20 testimonials are featured for homepage display
let featuredCount = testimonials.filter(t => t.featured).length;
if (featuredCount < 20) {
  // Mark additional testimonials as featured to reach at least 20
  const nonFeatured = testimonials.filter(t => !t.featured);
  const needToAdd = 20 - featuredCount;
  
  for (let i = 0; i < Math.min(needToAdd, nonFeatured.length); i++) {
    nonFeatured[i].featured = true;
  }
}

// Save to JSON file
const outputPath = path.join(__dirname, 'testimonials_data.json');
fs.writeFileSync(outputPath, JSON.stringify(testimonials, null, 2));

console.log(`Successfully generated ${testimonials.length} testimonials!`);
console.log(`Featured testimonials: ${testimonials.filter(t => t.featured).length}`);
console.log(`Saved to: ${outputPath}`);
