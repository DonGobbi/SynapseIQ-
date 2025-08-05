# SynapseIQ - AI Solutions for Africa

AI solutions for African businesses with FastAPI backend and Next.js frontend.

SynapseIQ is a Next.js website showcasing AI solutions tailored for African businesses, startups, NGOs, and governments.

## Project Overview

This website highlights SynapseIQ's AI services and solutions designed specifically for the African context, including:

- AI Chatbot Development in multiple African languages
- Business Process Automation for SACCOs and SMEs
- Machine Learning & Data Science solutions
- Natural Language Processing for African languages
- AI Consulting & Strategy for African markets

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, Framer Motion
- **Backend**: FastAPI, Python, Groq AI API
- **Styling**: Tailwind CSS for responsive design
- **Animation**: Framer Motion for smooth animations
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Python 3.8+ (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DonGobbi/SynapseIQ-.git
cd SynapseIQ-
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Run the development servers:

Frontend:
```bash
npm run dev
# or
yarn dev
```

Backend:
```bash
cd backend
python -m uvicorn app.main:app --reload
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the frontend and [http://localhost:8000/docs](http://localhost:8000/docs) for the API documentation.

## Project Structure

```
SynapseIQ/
├── public/            # Static files
│   └── images/        # Image assets
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── styles/        # CSS styles
│   └── utils/         # Utility functions
├── backend/           # FastAPI backend
│   ├── app/           # Backend application
│   │   ├── routers/   # API endpoints
│   │   └── utils/     # Backend utilities
│   └── requirements.txt # Backend dependencies
├── package.json       # Project dependencies
├── tailwind.config.js # Tailwind CSS configuration
└── README.md          # Project documentation
```

## Features

- Responsive design for mobile and desktop
- Modern UI with animations
- Sections highlighting services, industries, and testimonials
- Call-to-action elements for lead generation
- Blog with Markdown support
- Integration with Groq AI API for chatbot functionality

## Future Enhancements

- Multilingual support (English, French, Swahili, Chichewa, Lingala, Arabic)
- Enhanced backend services integration
- Expanded blog section for AI insights in Africa
- Case studies showcasing successful implementations
