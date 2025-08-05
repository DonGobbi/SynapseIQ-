import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailSender:
    """Utility class for sending emails"""
    
    def __init__(self):
        """Initialize email sender with environment variables"""
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@synapseiq.com")
        self.admin_email = os.getenv("ADMIN_EMAIL", "admin@synapseiq.com")
        
        # Check if email is properly configured
        self.is_configured = (
            self.smtp_username and 
            self.smtp_password and 
            self.smtp_username != "your_smtp_username" and
            self.smtp_password != "your_smtp_password"
        )
        
        if not self.is_configured:
            logger.warning("Email is not properly configured. Check environment variables.")
    
    def send_email(self, to_email, subject, html_content, text_content=None):
        """
        Send an email with both HTML and plain text content
        
        Args:
            to_email (str): Recipient email address
            subject (str): Email subject
            html_content (str): HTML content of the email
            text_content (str, optional): Plain text content of the email
        
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        if not self.is_configured:
            logger.warning("Email sending skipped: Not properly configured")
            return False
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.from_email
        msg['To'] = to_email
        
        # Add plain text version (fallback)
        if text_content is None:
            # Create a simple text version from HTML if not provided
            text_content = html_content.replace('<br>', '\n').replace('</p><p>', '\n\n')
            # Remove any remaining HTML tags
            import re
            text_content = re.sub('<.*?>', '', text_content)
        
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        try:
            # Connect to SMTP server
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            
            # Send email
            server.sendmail(self.from_email, to_email, msg.as_string())
            server.quit()
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False
    
    def send_contact_notification(self, submission):
        """
        Send notification email to admin when a new contact form is submitted
        
        Args:
            submission: Contact form submission data
        
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        subject = f"New Contact Form Submission: {submission.subject}"
        
        html_content = f"""
        <html>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {submission.name}</p>
            <p><strong>Email:</strong> {submission.email}</p>
            <p><strong>Subject:</strong> {submission.subject}</p>
            <p><strong>Message:</strong></p>
            <p>{submission.message}</p>
            <hr>
            <p><small>This is an automated notification from SynapseIQ.</small></p>
        </body>
        </html>
        """
        
        return self.send_email(self.admin_email, subject, html_content)
    
    def send_subscription_confirmation(self, email, name=None):
        """
        Send confirmation email when a user subscribes to the newsletter
        
        Args:
            email (str): Subscriber's email address
            name (str, optional): Subscriber's name
        
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        greeting = f"Hi {name}" if name else "Hi there"
        subject = "Welcome to SynapseIQ Newsletter"
        
        html_content = f"""
        <html>
        <body>
            <h2>Thank You for Subscribing!</h2>
            <p>{greeting},</p>
            <p>Thank you for subscribing to the SynapseIQ newsletter. You'll now receive updates on the latest AI trends and innovations for African businesses.</p>
            <p>If you didn't subscribe to our newsletter, please ignore this email or contact us to remove your email from our list.</p>
            <hr>
            <p><small>© 2025 SynapseIQ. All rights reserved.</small></p>
            <p><small>To unsubscribe, <a href="https://synapseiq.com/unsubscribe?email={email}">click here</a>.</small></p>
        </body>
        </html>
        """
        
        return self.send_email(email, subject, html_content)
        
    def send_subscription_notification(self, email, name=None):
        """
        Send notification to admin when a new user subscribes to the newsletter
        
        Args:
            email (str): Subscriber's email address
            name (str, optional): Subscriber's name
        
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        subscriber_name = name if name else "Anonymous"
        subject = "New Newsletter Subscription"
        
        html_content = f"""
        <html>
        <body>
            <h2>New Newsletter Subscription</h2>
            <p>A new user has subscribed to the SynapseIQ newsletter:</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Name:</strong> {subscriber_name}</p>
            <p><strong>Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <hr>
            <p><small>This is an automated notification from SynapseIQ.</small></p>
        </body>
        </html>
        """
        
        return self.send_email(self.admin_email, subject, html_content)
        
    def send_contact_confirmation(self, email, name, subject, message):
        """
        Send confirmation email to user who submitted a contact form
        
        Args:
            email (str): User's email address
            name (str): User's name
            subject (str): Original contact form subject
            message (str): Original contact form message
        
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        subject = "Thank you for contacting SynapseIQ"
        
        html_content = f"""
        <html>
        <body>
            <h2>Thank You for Contacting Us</h2>
            <p>Dear {name},</p>
            <p>Thank you for reaching out to SynapseIQ. We have received your message regarding <strong>"{subject}"</strong> and will get back to you shortly.</p>
            <p>Our team typically responds within 24-48 business hours.</p>
            <p>For your reference, here is a copy of your message:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #0066cc;">
                <p>{message}</p>
            </div>
            <p>If you have any additional information to provide, please feel free to reply to this email.</p>
            <p>Best regards,<br>The SynapseIQ Team</p>
            <hr>
            <p><small>© 2025 SynapseIQ. All rights reserved.</small></p>
        </body>
        </html>
        """
        
        return self.send_email(email, subject, html_content)

# Create a singleton instance
email_sender = EmailSender()
