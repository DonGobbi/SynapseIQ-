from fastapi import APIRouter, HTTPException, Depends, Request, Form, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List
import json
from datetime import datetime
import os
from app.utils.twilio_client import twilio_client
from app.utils.groq_client import GroqAIClient

# Initialize router
router = APIRouter()

# Initialize Groq client for AI responses
groq_client = GroqAIClient()

# Pydantic models for request validation
class WhatsAppMessage(BaseModel):
    to_number: str = Field(..., description="Recipient's WhatsApp number in international format (e.g., +265996873573)")
    message: str = Field(..., description="Message content to send")

class BulkWhatsAppMessage(BaseModel):
    to_numbers: List[str] = Field(..., description="List of recipient WhatsApp numbers")
    message: str = Field(..., description="Message content to send to all recipients")

# Send a single WhatsApp message
@router.post("/send")
async def send_whatsapp_message(message_data: WhatsAppMessage):
    """
    Send a WhatsApp message to a single recipient
    """
    result = twilio_client.send_whatsapp_message(
        message_data.to_number, 
        message_data.message
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result

# Send bulk WhatsApp messages
@router.post("/send-bulk")
async def send_bulk_whatsapp_messages(message_data: BulkWhatsAppMessage):
    """
    Send the same WhatsApp message to multiple recipients
    """
    results = twilio_client.send_bulk_whatsapp_messages(
        message_data.to_numbers,
        message_data.message
    )
    
    # Check if all messages failed
    all_failed = all(r["result"]["status"] == "error" for r in results)
    if all_failed:
        raise HTTPException(status_code=500, detail="All messages failed to send")
    
    return {
        "status": "completed",
        "total": len(message_data.to_numbers),
        "successful": sum(1 for r in results if r["result"]["status"] == "success"),
        "failed": sum(1 for r in results if r["result"]["status"] == "error"),
        "results": results
    }

# Webhook for incoming WhatsApp messages from Twilio
@router.post("/webhook")
async def twilio_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    From: str = Form(...),
    Body: str = Form(...),
    ProfileName: Optional[str] = Form(None),
    WaId: Optional[str] = Form(None)
):
    """
    Handle incoming WhatsApp messages from Twilio webhook
    """
    try:
        # Extract the actual phone number from the WhatsApp format
        from_number = From.replace("whatsapp:", "")
        
        # Log the incoming message
        print(f"Received WhatsApp message from {from_number} ({ProfileName}): {Body}")
        
        # Process the message with AI in the background
        background_tasks.add_task(process_incoming_message, from_number, Body, ProfileName)
        
        # Return 200 OK immediately to acknowledge receipt
        return {"status": "received"}
    except Exception as e:
        print(f"Error processing webhook: {str(e)}")
        # Still return 200 OK to Twilio to prevent retries
        return {"status": "error", "message": str(e)}

async def process_incoming_message(from_number: str, message_body: str, profile_name: Optional[str] = None):
    """
    Process an incoming WhatsApp message and send an AI response
    """
    try:
        # Get AI response using Groq client
        ai_response = groq_client.chat_completion(
            messages=[
                {"role": "system", "content": "You are SynapseIQ's AI assistant. Provide helpful, concise responses about SynapseIQ's AI services for African businesses. Keep responses under 3 paragraphs."},
                {"role": "user", "content": message_body}
            ]
        )
        
        # If AI response is available, send it back via WhatsApp
        if ai_response and "content" in ai_response:
            response_text = ai_response["content"]
            
            # Add personalized greeting if profile name is available
            if profile_name:
                response_text = f"Hello {profile_name},\n\n{response_text}"
            
            # Add signature
            response_text += "\n\n- SynapseIQ AI Assistant"
            
            # Send response via WhatsApp
            twilio_client.send_whatsapp_message(from_number, response_text)
        else:
            # Send fallback response if AI fails
            fallback_message = "Thank you for contacting SynapseIQ. Our team will get back to you shortly."
            twilio_client.send_whatsapp_message(from_number, fallback_message)
    
    except Exception as e:
        print(f"Error processing message: {str(e)}")
        # Send error message
        error_message = "Sorry, we're experiencing technical difficulties. Please try again later or contact us at dongobbinshombo@gmail.com."
        twilio_client.send_whatsapp_message(from_number, error_message)
