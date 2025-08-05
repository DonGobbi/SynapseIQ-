import os
import sys
from dotenv import load_dotenv

# Add the correct path to the backend directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', '.env'))

# Import the email sender after setting up paths
from backend.app.utils.email_sender import email_sender

def check_email_config():
    """Check if email is properly configured"""
    print("Checking email configuration...")
    
    # Load email credentials from .env file
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL")
    admin_email = os.getenv("ADMIN_EMAIL")
    
    print(f"SMTP Server: {smtp_server}")
    print(f"SMTP Port: {smtp_port}")
    
    if not smtp_username or smtp_username == "your_smtp_username":
        print("Warning: SMTP_USERNAME is not set or is using default value")
    else:
        print("SMTP_USERNAME is set")
    
    if not smtp_password or smtp_password == "your_smtp_password":
        print("Warning: SMTP_PASSWORD is not set or is using default value")
    else:
        print("SMTP_PASSWORD is set")
    
    if not from_email:
        print("Warning: FROM_EMAIL is not set")
    else:
        print(f"FROM_EMAIL: {from_email}")
    
    if not admin_email:
        print("Warning: ADMIN_EMAIL is not set")
    else:
        print(f"ADMIN_EMAIL: {admin_email}")
    
    # Check if all required credentials are set
    if (smtp_username and smtp_username != "your_smtp_username" and 
        smtp_password and smtp_password != "your_smtp_password" and
        from_email and admin_email):
        print("Email appears to be properly configured!")
        return True
    else:
        print("\nEmail is not fully configured. Please update your .env file with valid credentials.")
        print("Note: The email tests will likely fail until email is properly configured.")
        return False

def test_contact_notification():
    """Test sending a contact form notification email"""
    print("\nTesting contact form notification email...")
    
    # Create a mock submission object
    class MockSubmission:
        def __init__(self):
            self.name = "Test User"
            self.email = "test@example.com"
            self.subject = "Test Subject"
            self.message = "This is a test message from the SynapseIQ contact form."
    
    submission = MockSubmission()
    
    # Send test email
    success = email_sender.send_contact_notification(submission)
    
    if success:
        print("Success! Contact notification email sent.")
    else:
        print("Failed to send contact notification email.")

def test_subscription_confirmation():
    """Test sending a newsletter subscription confirmation email"""
    print("\nTesting newsletter subscription confirmation email...")
    
    # Send test email
    success = email_sender.send_subscription_confirmation(
        "test@example.com", 
        "Test User"
    )
    
    if success:
        print("Success! Subscription confirmation email sent.")
    else:
        print("Failed to send subscription confirmation email.")

def test_contact_confirmation():
    """Test sending a contact form confirmation email"""
    print("\nTesting contact form confirmation email...")
    
    # Send test email
    success = email_sender.send_contact_confirmation(
        "test@example.com",
        "Test User",
        "Test Subject",
        "This is a test message from the SynapseIQ contact form."
    )
    
    if success:
        print("Success! Contact confirmation email sent.")
    else:
        print("Failed to send contact confirmation email.")

if __name__ == "__main__":
    # Check email configuration
    config_ok = check_email_config()
    
    if not config_ok:
        proceed = input("\nDo you want to proceed with email tests anyway? (y/n): ")
        if proceed.lower() != 'y':
            print("Tests skipped.")
            sys.exit(0)
    
    # Test sending a contact form notification email
    test_contact_notification()
    
    # Test sending a newsletter subscription confirmation email
    test_subscription_confirmation()
    
    # Test sending a contact form confirmation email
    test_contact_confirmation()
