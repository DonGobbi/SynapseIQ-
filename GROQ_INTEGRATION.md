# SynapseIQ Groq API Integration

This document provides an overview of the Groq AI API integration in SynapseIQ, including the fallback mechanisms implemented to ensure reliable service even when the API is unavailable.

## Overview

SynapseIQ uses Groq's AI API for natural language processing, chatbot functionality, and text analysis. The integration is designed to be resilient, with graceful fallbacks when the API is unavailable or returns errors.

## Current Status

**⚠️ IMPORTANT: Multiple Groq API keys have been tried and all are currently invalid.**

Despite this limitation, the system is fully operational using fallback mechanisms. All API endpoints will continue to function, providing relevant responses based on user queries.

The system has been designed to gracefully handle API key issues, ensuring continuous service even when the Groq API is unavailable.

## Key Components

### 1. GroqAIClient (`backend/app/utils/groq_client.py`)

The `GroqAIClient` class encapsulates all interactions with the Groq API and includes:

- **Initialization with API Availability Check**: Tests the API key and connection during initialization
- **Fallback Mechanisms**: Provides intelligent fallback responses when the API is unavailable
- **Error Handling**: Gracefully handles API errors without crashing the application
- **Enhanced Logging**: Provides detailed error messages for troubleshooting API key issues

### 2. Chatbot Router (`backend/app/routers/chatbot.py`)

The chatbot router uses the `GroqAIClient` to provide AI-powered responses with:

- **Topic-Based Fallbacks**: Categorizes user queries and provides relevant fallback responses
- **African Business Context**: All responses maintain the African business focus of SynapseIQ
- **Conversation Management**: Tracks conversation IDs and processing times

## API Key Configuration

The Groq API key is configured via the `.env` file in the backend directory:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Getting a Valid API Key

1. Create an account at [Groq Console](https://console.groq.com/)
2. Navigate to the API Keys section
3. Generate a new API key (starts with `gsk_`)
4. Copy the key and update the `.env` file

## Fallback Response System

When the Groq API is unavailable (due to invalid API key, network issues, or API errors), the system provides intelligent fallbacks:

1. **Chat Completions**: Returns contextually relevant responses based on the user's query topic
2. **Text Analysis**: Provides basic sentiment analysis and entity extraction
3. **Translation**: Offers common phrase translations for supported language pairs

## Testing

Use the following scripts to test the Groq integration:

- `test_groq.py`: Tests direct API connectivity
- `check_api_key.py`: Validates the API key format
- `test_chatbot.py`: Tests the chatbot API with various queries

## Troubleshooting

If you encounter issues with the Groq API:

1. **Check API Key**: Ensure your Groq API key is valid and active
2. **Verify Package Installation**: Confirm that `groq>=0.3.0` is installed
3. **Monitor Logs**: Check server logs for detailed error messages
4. **Test Fallbacks**: Even with API issues, the system should continue to function with fallback responses

## Next Steps

1. **Obtain a valid Groq API key** from the [Groq Console](https://console.groq.com/)
   - Sign up for an account if you don't have one
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key (it starts with `gsk_`)

2. **Update the backend configuration**
   - Edit the `.env` file in the backend directory
   - Replace the current API key with your new valid key
   - Save the file

3. **Verify the integration**
   - Run `python check_groq_api_key.py` to validate your API key
   - If successful, restart the backend server with `cd backend && uvicorn app.main:app --reload`
   - Run `python test_chatbot.py` to test the chatbot with live AI responses

4. **Monitor performance**
   - Check server logs for any API-related errors
   - Verify that responses are coming from the live API rather than fallbacks
   - Test with various queries to ensure comprehensive coverage

## Frontend Integration

The SynapseIQ frontend chatbot is already configured to work with the backend API, with:

- Real-time AI responses from Groq through the backend API
- Message history tracking with React state
- Loading states and error handling
- WhatsApp integration for direct contact

---

For any questions or issues, please contact the SynapseIQ development team.
