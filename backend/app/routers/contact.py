from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Form
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import os
import json
from datetime import datetime
import sqlite3
from pathlib import Path
from app.utils.email_sender import email_sender

# Initialize router
router = APIRouter()

# Create database directory if it doesn't exist
db_dir = Path("./data")
db_dir.mkdir(exist_ok=True)

# Database connection
def get_db_connection():
    conn = sqlite3.connect("./data/synapseiq.db")
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database tables
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create contact submissions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create newsletter subscriptions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
    )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models for request validation
class ContactFormSubmission(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class NewsletterSubscription(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# Send email notification for contact form submission
async def send_email_notification(submission):
    """Send email notification for contact form submission"""
    # Use the email_sender utility to send a real email
    success = email_sender.send_contact_notification(submission)
    
    # Log the result
    if success:
        print(f"Email notification sent successfully for submission from {submission.name} <{submission.email}>")
    else:
        print(f"Failed to send email notification for submission from {submission.name} <{submission.email}>")
    # For now, we'll just log it
    return True

# Contact form submission endpoint
@router.post("/submit", status_code=201)
async def submit_contact_form(
    submission: ContactFormSubmission, 
    background_tasks: BackgroundTasks
):
    try:
        # Store in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
            (submission.name, submission.email, submission.subject, submission.message)
        )
        conn.commit()
        conn.close()
        
        # Send email notification in the background
        background_tasks.add_task(
            send_email_notification, 
            submission
        )
        
        # Send confirmation email to the user
        try:
            email_sender.send_contact_confirmation(submission.email, submission.name, submission.subject, submission.message)
        except Exception as e:
            print(f"Error sending contact confirmation email: {str(e)}")
        
        return {"status": "success", "message": "Contact form submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process contact form: {str(e)}")

# Newsletter subscription endpoint
@router.post("/subscribe", status_code=201)
async def subscribe_to_newsletter(subscription: NewsletterSubscription):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT email FROM newsletter_subscriptions WHERE email = ?", (subscription.email,))
        existing = cursor.fetchone()
        
        if existing:
            # Update existing subscription to active if it exists
            cursor.execute(
                "UPDATE newsletter_subscriptions SET is_active = TRUE, name = ? WHERE email = ?",
                (subscription.name, subscription.email)
            )
            message = "Subscription updated successfully"
        else:
            # Add new subscription
            cursor.execute(
                "INSERT INTO newsletter_subscriptions (email, name) VALUES (?, ?)",
                (subscription.email, subscription.name)
            )
            message = "Subscribed to newsletter successfully"
        
        conn.commit()
        conn.close()
        
        # Send confirmation email to subscriber and notification to admin in background
        try:
            # Send confirmation to subscriber
            email_sender.send_subscription_confirmation(subscription.email, subscription.name)
            
            # Send notification to admin
            email_sender.send_subscription_notification(subscription.email, subscription.name)
        except Exception as e:
            print(f"Error sending subscription emails: {str(e)}")
        
        return {"status": "success", "message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process subscription: {str(e)}")

# Get all newsletter subscribers (admin endpoint)
@router.get("/subscribers", response_model=List[dict])
async def get_newsletter_subscribers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM newsletter_subscriptions WHERE is_active = TRUE")
        subscribers = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return subscribers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve subscribers: {str(e)}")

# Unsubscribe from newsletter
@router.post("/unsubscribe")
async def unsubscribe_from_newsletter(email: EmailStr = Form(...)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE newsletter_subscriptions SET is_active = FALSE WHERE email = ?",
            (email,)
        )
        conn.commit()
        conn.close()
        
        if cursor.rowcount > 0:
            return {"status": "success", "message": "Unsubscribed successfully"}
        else:
            return {"status": "not_found", "message": "Email not found in subscription list"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process unsubscription: {str(e)}")

# Get all contact form submissions (admin endpoint)
@router.get("/submissions", response_model=List[dict])
async def get_contact_submissions():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM contact_submissions ORDER BY created_at DESC")
        submissions = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return submissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve contact submissions: {str(e)}")
