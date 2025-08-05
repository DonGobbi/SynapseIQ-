from twilio.rest import Client
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class TwilioClient:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER")
        
        # Check if credentials are available
        self.is_configured = all([self.account_sid, self.auth_token, self.whatsapp_number])
        
        if self.is_configured:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {str(e)}")
                self.is_configured = False
        else:
            logger.warning("Twilio credentials not found in environment variables")
    
    def send_whatsapp_message(self, to_number, message_body):
        """
        Send a WhatsApp message using Twilio API
        
        Args:
            to_number (str): Recipient's WhatsApp number in format: +1234567890
            message_body (str): Message content
            
        Returns:
            dict: Response with status and message
        """
        if not self.is_configured:
            logger.warning("Twilio not configured. Message not sent.")
            return {
                "status": "error",
                "message": "Twilio not configured. Please set up Twilio credentials."
            }
        
        try:
            # Format numbers for WhatsApp
            from_whatsapp = f"whatsapp:{self.whatsapp_number}"
            to_whatsapp = f"whatsapp:{to_number}"
            
            # Send message
            message = self.client.messages.create(
                from_=from_whatsapp,
                body=message_body,
                to=to_whatsapp
            )
            
            logger.info(f"WhatsApp message sent successfully. SID: {message.sid}")
            return {
                "status": "success",
                "message": "WhatsApp message sent successfully",
                "sid": message.sid
            }
        except Exception as e:
            logger.error(f"Failed to send WhatsApp message: {str(e)}")
            return {
                "status": "error",
                "message": f"Failed to send WhatsApp message: {str(e)}"
            }
    
    def send_bulk_whatsapp_messages(self, numbers, message_body):
        """
        Send the same WhatsApp message to multiple recipients
        
        Args:
            numbers (list): List of recipient WhatsApp numbers
            message_body (str): Message content
            
        Returns:
            list: List of responses for each recipient
        """
        results = []
        for number in numbers:
            result = self.send_whatsapp_message(number, message_body)
            results.append({"number": number, "result": result})
        
        return results


# Create a singleton instance
twilio_client = TwilioClient()
