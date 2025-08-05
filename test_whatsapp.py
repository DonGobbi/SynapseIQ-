import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API base URL
API_URL = os.getenv("API_URL", "http://localhost:8000")

def test_send_whatsapp():
    """Test sending a WhatsApp message via the API"""
    print("Testing WhatsApp message sending...")
    
    # Endpoint URL
    url = f"{API_URL}/whatsapp/send"
    
    # Message data
    data = {
        "to_number": "+265996873573",  # Your WhatsApp number
        "message": "This is a test message from SynapseIQ API"
    }
    
    try:
        # Send request
        response = requests.post(url, json=data)
        
        # Check response
        if response.status_code == 200:
            print("Success! WhatsApp message sent.")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception: {str(e)}")

def test_bulk_whatsapp():
    """Test sending bulk WhatsApp messages via the API"""
    print("\nTesting bulk WhatsApp message sending...")
    
    # Endpoint URL
    url = f"{API_URL}/whatsapp/send-bulk"
    
    # Message data
    data = {
        "to_numbers": ["+265996873573"],  # Your WhatsApp number
        "message": "This is a bulk test message from SynapseIQ API"
    }
    
    try:
        # Send request
        response = requests.post(url, json=data)
        
        # Check response
        if response.status_code == 200:
            print("Success! Bulk WhatsApp messages sent.")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception: {str(e)}")

def check_twilio_config():
    """Check if Twilio is properly configured"""
    print("\nChecking Twilio configuration...")
    
    # Load Twilio credentials from .env file
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER")
    
    if not account_sid or account_sid == "your_twilio_account_sid":
        print("Warning: TWILIO_ACCOUNT_SID is not set or is using default value")
    else:
        print("TWILIO_ACCOUNT_SID is set")
    
    if not auth_token or auth_token == "your_twilio_auth_token":
        print("Warning: TWILIO_AUTH_TOKEN is not set or is using default value")
    else:
        print("TWILIO_AUTH_TOKEN is set")
    
    if not whatsapp_number or whatsapp_number == "+265996873573":
        print("Note: Using default WhatsApp number: +265996873573")
    else:
        print(f"Using WhatsApp number: {whatsapp_number}")
    
    # Check if all required credentials are set
    if (account_sid and account_sid != "your_twilio_account_sid" and 
        auth_token and auth_token != "your_twilio_auth_token" and
        whatsapp_number):
        print("Twilio appears to be properly configured!")
    else:
        print("\nTwilio is not fully configured. Please update your .env file with valid credentials.")
        print("Note: The WhatsApp tests will likely fail until Twilio is properly configured.")

if __name__ == "__main__":
    # Check Twilio configuration
    check_twilio_config()
    
    # Ask user if they want to proceed with tests
    proceed = input("\nDo you want to proceed with WhatsApp API tests? (y/n): ")
    
    if proceed.lower() == 'y':
        # Test sending a single WhatsApp message
        test_send_whatsapp()
        
        # Test sending bulk WhatsApp messages
        test_bulk_whatsapp()
    else:
        print("Tests skipped.")
