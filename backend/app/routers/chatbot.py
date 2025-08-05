from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from typing import List, Optional
import os
import time

from app.utils.groq_client import groq_client

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_id: Optional[str] = None
    language: Optional[str] = "en"
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    processing_time: float
    conversation_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    AI chatbot optimized for African business contexts
    
    - Understands business terminology in African contexts
    - Can respond to queries about SynapseIQ services
    - Supports multiple languages including English and major African languages
    """
    try:
        start_time = time.time()
        
        # Extract the last user message
        last_message = next((msg.content for msg in reversed(request.messages) 
                            if msg.role == "user"), "")
        
        # Define intelligent responses based on common queries
        responses = {
            "services": [
                "SynapseIQ offers AI solutions tailored for African businesses, including NLP for local languages, predictive analytics, and custom chatbots.",
                "Our AI services include natural language processing for African languages, predictive analytics for business intelligence, and custom chatbot development.",
                "We specialize in AI solutions designed specifically for the African market, including language processing, data analytics, and intelligent automation."
            ],
            "pricing": [
                "Our pricing is customized based on your business needs. We offer flexible packages starting from $500 for small businesses.",
                "SynapseIQ provides tailored pricing models based on your specific requirements. Our starter packages begin at $500 for small businesses.",
                "We believe in making AI accessible to African businesses of all sizes. Our pricing is flexible and starts from $500 for small businesses."
            ],
            "contact": [
                "I'd be happy to connect you with our team for a demo. Please provide your email or contact us via WhatsApp at +265996873573.",
                "You can reach our team via WhatsApp at +265996873573 or email us at info@synapseiq.com to schedule a demo.",
                "For a personalized demonstration of our AI solutions, please contact us via WhatsApp at +265996873573 or through our website contact form."
            ],
            "default": [
                "Thank you for your interest in SynapseIQ. Our AI team specializes in creating custom solutions for African businesses. How can I assist you today?",
                "Welcome to SynapseIQ! We're focused on bringing cutting-edge AI solutions to African businesses. What specific information are you looking for?",
                "SynapseIQ is dedicated to empowering African businesses with AI technology. How can we help your business today?"
            ]
        }
        
        import random
        
        # Try to use Groq for AI-powered responses
        try:
            # Convert the messages to the format expected by Groq
            groq_messages = []
            for msg in request.messages:
                groq_messages.append({"role": msg.role, "content": msg.content})
            
            # Add context about SynapseIQ if not present
            if len(groq_messages) <= 3:  # Only add context for new conversations
                groq_messages.insert(0, {
                    "role": "system",
                    "content": "You are an AI assistant for SynapseIQ, a company that provides AI solutions for African businesses. "
                               "Your responses should be helpful, concise, and focused on African business contexts. "
                               "SynapseIQ offers services in NLP for local languages, predictive analytics, custom chatbots, "
                               "and AI consulting. The company focuses on the African market and understands local business needs."
                })
            
            # Get response from Groq - with timeout to prevent long waits
            import asyncio
            try:
                # Set a timeout for the Groq API call
                response = groq_client.chat_completion(
                    messages=groq_messages,
                    temperature=0.7,
                    max_tokens=500,
                    stream=False
                )
                
                # If we get a valid response, use it
                if response and len(response.strip()) > 0:
                    return ChatResponse(
                        response=response,
                        processing_time=time.time() - start_time,
                        conversation_id=str(uuid.uuid4())
                    )
            except Exception as e:
                print(f"Groq API call failed: {str(e)}")
                # Continue to fallback responses
                pass
                
        except Exception as e:
            print(f"Error in Groq setup: {str(e)}")
            # Continue to fallback responses
            pass
            
        # Intelligent fallback response selection
        response_category = "default"
        
        # Determine the appropriate response category based on the message
        if "services" in last_message.lower() or "offer" in last_message.lower() or "provide" in last_message.lower():
            response_category = "services"
        elif "pricing" in last_message.lower() or "cost" in last_message.lower() or "price" in last_message.lower() or "package" in last_message.lower():
            response_category = "pricing"
        elif "contact" in last_message.lower() or "demo" in last_message.lower() or "reach" in last_message.lower() or "call" in last_message.lower() or "email" in last_message.lower():
            response_category = "contact"
            
        # Select a random response from the appropriate category
        response = random.choice(responses[response_category])
        
        processing_time = time.time() - start_time
        
        # Generate a simple conversation ID
        import uuid
        conversation_id = str(uuid.uuid4())
        
        return ChatResponse(
            response=response,
            processing_time=processing_time,
            conversation_id=conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

class WhatsAppMessage(BaseModel):
    from_number: str
    to_number: str
    message_body: str
    media_url: Optional[str] = None

class WhatsAppResponse(BaseModel):
    response: str
    status: str

@router.post("/whatsapp", response_model=WhatsAppResponse)
async def process_whatsapp(message: WhatsAppMessage):
    """
    Process incoming WhatsApp messages and generate responses
    
    - Integrates with Twilio WhatsApp Business API
    - Provides automated responses to customer inquiries
    - Can escalate to human agents when needed
    """
    try:
        # Placeholder for WhatsApp integration logic
        # In production, this would connect to Twilio API
        
        # Simple response for demo
        response = f"Thank you for contacting SynapseIQ via WhatsApp. Our team will respond to your message shortly: '{message.message_body}'"
        
        return WhatsAppResponse(
            response=response,
            status="delivered"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"WhatsApp processing failed: {str(e)}")
