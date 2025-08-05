import sqlite3
import random
from datetime import datetime, timedelta
from pathlib import Path

# Ensure database directory exists
db_dir = Path("./data")
db_dir.mkdir(parents=True, exist_ok=True)

# Connect to the database
conn = sqlite3.connect("./data/synapseiq.db")
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Create testimonials table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    rating INTEGER NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    featured BOOLEAN NOT NULL DEFAULT 0,
    date TEXT NOT NULL
)
''')
conn.commit()

# Sample African names for testimonials
first_names = [
    "Amara", "Kwame", "Zola", "Thabo", "Nia", "Kofi", "Amina", "Tendai", 
    "Makena", "Jabari", "Zuri", "Mandla", "Aisha", "Sefu", "Nala", "Kito",
    "Imani", "Jelani", "Safiya", "Tafari", "Asha", "Chike", "Dalila", "Faraji",
    "Eshe", "Gamba", "Hasina", "Kamau", "Layla", "Mosi", "Nia", "Odion",
    "Rehema", "Simba", "Taraji", "Uzoma", "Zalika", "Bakari", "Chioma", "Dayo"
]

last_names = [
    "Mensah", "Okafor", "Nkosi", "Diallo", "Abebe", "Mwangi", "Ibrahim", "Moyo",
    "Ndlovu", "Osei", "Kimani", "Dlamini", "Afolayan", "Banda", "Chukwu", "Diop",
    "Eze", "Gueye", "Hassan", "Jalloh", "Kone", "Lumumba", "Mutombo", "Nwosu",
    "Okoro", "Patel", "Ruto", "Sow", "Toure", "Usman", "Wanjiku", "Yeboah",
    "Zuma", "Addo", "Bello", "Cisse", "Dube", "Egwu", "Fofana", "Gicheru"
]

# African companies
companies = [
    "Safaricom", "MTN Group", "Dangote Industries", "Ecobank", "Jumia", 
    "Naspers", "Sonangol", "Sasol", "Oando", "Equity Bank", "Zenith Bank",
    "Maroc Telecom", "Attijariwafa Bank", "Shoprite", "Massmart", "Nando's",
    "Guaranty Trust Bank", "Econet Wireless", "Sanlam", "Old Mutual",
    "African Rainbow Minerals", "Woolworths Holdings", "Pick n Pay", 
    "Steinhoff International", "Vodacom", "Telkom SA", "Standard Bank",
    "FirstRand", "Barclays Africa", "Nedbank", "Mediclinic International",
    "Discovery Limited", "Aspen Pharmacare", "Life Healthcare", "Netcare",
    "Clicks Group", "Truworths", "Mr Price Group", "Foschini Group", "Massmart"
]

# Job positions
positions = [
    "CEO", "CFO", "CTO", "COO", "Marketing Director", "Sales Manager",
    "HR Director", "Operations Manager", "IT Manager", "Finance Director",
    "Business Development Manager", "Project Manager", "Product Manager",
    "Customer Success Manager", "Regional Director", "Branch Manager",
    "Department Head", "Team Lead", "Senior Analyst", "Research Director"
]

# Testimonial content templates
content_templates = [
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
]

# Variables to fill in templates
departments = ["marketing", "sales", "customer service", "operations", "finance", "IT", "supply chain", "HR", "R&D", "logistics"]
services = ["AI-powered analytics", "machine learning", "natural language processing", "predictive analytics", "business intelligence", "chatbot", "data visualization", "automated reporting", "sentiment analysis", "recommendation engine"]
metrics = ["productivity", "revenue", "customer satisfaction", "operational efficiency", "cost savings", "conversion rate", "customer retention", "market share", "ROI", "employee satisfaction"]
countries = ["Kenya", "Nigeria", "South Africa", "Ghana", "Ethiopia", "Tanzania", "Egypt", "Morocco", "Rwanda", "Senegal"]
industries = ["fintech", "agriculture", "healthcare", "retail", "telecommunications", "energy", "manufacturing", "education", "transportation", "hospitality"]
timeframes = [3, 6, 9, 12]

# Generate 100 testimonials
print("Generating 100 test testimonials...")

# First, clear existing testimonials if needed
cursor.execute("DELETE FROM testimonials")
conn.commit()

for i in range(1, 101):
    name = f"{random.choice(first_names)} {random.choice(last_names)}"
    company = random.choice(companies)
    position = random.choice(positions)
    rating = random.randint(4, 5)  # Mostly positive ratings
    
    # Generate content
    template = random.choice(content_templates)
    content = template.format(
        department=random.choice(departments),
        service=random.choice(services),
        percentage=random.randint(20, 95),
        metric=random.choice(metrics),
        timeframe=random.choice(timeframes),
        country=random.choice(countries),
        industry=random.choice(industries)
    )
    
    # Random date within the last 2 years
    days_ago = random.randint(1, 730)  # Up to 2 years ago
    date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
    
    # Image path (for some testimonials)
    image = ""
    if random.random() > 0.3:  # 70% chance to have an image
        image_number = random.randint(1, 10)  # Assuming we have 10 placeholder images
        image = f"/static/images/testimonials/person_{image_number}.jpg"
    
    # Featured status (make some testimonials featured)
    featured = 1 if random.random() < 0.2 else 0  # 20% chance to be featured
    
    # Insert testimonial
    cursor.execute(
        "INSERT INTO testimonials (name, company, position, rating, content, image, featured, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (name, company, position, rating, content, image, featured, date)
    )

# Commit changes and close connection
conn.commit()
print("Successfully generated 100 test testimonials!")

# Count featured testimonials
cursor.execute("SELECT COUNT(*) FROM testimonials WHERE featured = 1")
featured_count = cursor.fetchone()[0]
print(f"Featured testimonials: {featured_count}")

# Count total testimonials
cursor.execute("SELECT COUNT(*) FROM testimonials")
total_count = cursor.fetchone()[0]
print(f"Total testimonials: {total_count}")

conn.close()
