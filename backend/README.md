# SynapseIQ AI Backend

This is the FastAPI backend for SynapseIQ's AI services, designed to support African businesses with cutting-edge AI solutions.

## Features

- **Natural Language Processing (NLP)** - Text analysis and translation optimized for African languages
- **AI Chatbot** - Intelligent conversational agent with African business context awareness
- **Analytics** - Business intelligence and predictive analytics for African markets

## Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# API Configuration
API_ENV=development
API_DEBUG=true

# Groq API (for AI services)
GROQ_API_KEY=your_groq_api_key

# Twilio (for WhatsApp integration)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=+265996873573

# Email Configuration (for contact form and newsletter)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@synapseiq.com
ADMIN_EMAIL=admin@synapseiq.com
```

### Running the Server

Start the development server:

```
cd backend
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

API documentation will be available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### NLP Services

- `POST /nlp/analyze` - Analyze text (sentiment, entities, classification)
- `POST /nlp/translate` - Translate between English and African languages

### Chatbot

- `POST /chatbot/chat` - Interact with the AI chatbot

### Analytics

- `POST /analytics/analyze` - Analyze business data
- `POST /analytics/dashboard` - Generate business intelligence dashboards

### Contact Form

- `POST /contact/submit` - Submit contact form data
- `POST /contact/subscribe` - Subscribe to newsletter
- `GET /contact/subscribers` - Get list of active newsletter subscribers
- `POST /contact/unsubscribe` - Unsubscribe from newsletter

### WhatsApp Integration

- `POST /whatsapp/send` - Send a WhatsApp message
- `POST /whatsapp/send-bulk` - Send bulk WhatsApp messages
- `POST /whatsapp/webhook` - Receive and process incoming WhatsApp messages

## Integration with Frontend

The backend is designed to work with the SynapseIQ Next.js frontend. To connect them:

1. In your frontend environment variables, set the API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. Use the API endpoints in your frontend code to fetch AI services.

## Development

The project structure follows best practices for FastAPI applications:

```
backend/
├── app/
│   ├── routers/
│   │   ├── nlp.py
│   │   ├── chatbot.py
│   │   ├── analytics.py
│   │   ├── contact.py
│   │   └── whatsapp.py
│   ├── utils/
│   │   ├── groq_client.py
│   │   ├── twilio_client.py
│   │   └── email_sender.py
│   └── main.py
├── data/
│   └── synapseiq.db
├── requirements.txt
└── README.md
```

## Future Enhancements

- Add authentication and user management
- Implement rate limiting
- Add caching for improved performance
- Expand language support for more African languages
- Integrate with more AI models and services
- Enhance WhatsApp integration with more advanced features
- Add analytics for contact form submissions and newsletter subscriptions
- Implement email templates with better styling
- Add admin dashboard for managing contacts and subscribers
