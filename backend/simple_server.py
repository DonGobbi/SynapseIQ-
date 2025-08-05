from fastapi import FastAPI, HTTPException, Query, Form, File, UploadFile, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import sqlite3
import os
import json
from datetime import datetime, timedelta
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
import shutil
import uvicorn
import secrets
import hashlib
import uuid
from jose import JWTError, jwt

# Initialize FastAPI app
app = FastAPI(
    title="SynapseIQ Testimonials API",
    description="Simplified backend API for SynapseIQ testimonials",
    version="0.1.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
uploads_dir = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

# Mount the uploads directory to serve files
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Ensure public directory exists
public_dir = Path("./public")
public_dir.mkdir(parents=True, exist_ok=True)

# Ensure testimonials images directory exists
testimonials_dir = Path("./public/images/testimonials")
testimonials_dir.mkdir(parents=True, exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory="public"), name="static")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "synapseiq_secret_key_change_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 password bearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Security-related Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: str
    is_active: bool = True
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: str
    last_login: Optional[str] = None

class UserInDB(User):
    password_hash: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class SecuritySetting(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    enabled: bool
    last_updated: Optional[str] = None

class SecuritySettingUpdate(BaseModel):
    enabled: bool

class ApiKey(BaseModel):
    id: str
    name: str
    key: str
    created: str
    last_used: Optional[str] = None
    permissions: List[str]

class ApiKeyCreate(BaseModel):
    name: str
    permissions: List[str] = ["read:data"]

# Blog post models
class BlogPostBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    author_role: str
    category: str
    tags: List[str]
    featured_image: str

class BlogPostCreate(BlogPostBase):
    published: bool = False

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    author_role: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    published: Optional[bool] = None

class BlogPost(BlogPostBase):
    id: int
    published: bool
    published_at: Optional[str] = None
    updated_at: str

# Database connection function
def get_db_connection():
    conn = sqlite3.connect("./data/synapseiq.db")
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database tables if they don't exist
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    )
    ''')
    
    # Create security_settings table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS security_settings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        enabled BOOLEAN DEFAULT FALSE,
        user_id INTEGER,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create api_keys table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP,
        permissions TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create security_logs table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event_type TEXT NOT NULL,
        description TEXT,
        ip_address TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create blog_posts table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        author_role TEXT,
        category TEXT,
        tags TEXT,
        featured_image TEXT,
        published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Insert default security settings if they don't exist
    default_settings = [
        ('two-factor', 'Two-Factor Authentication', 'Require a verification code in addition to your password when signing in', 0),
        ('login-alerts', 'Login Alerts', 'Receive email notifications for new sign-ins from unfamiliar devices', 1),
        ('session-timeout', 'Session Timeout', 'Automatically log out after 30 minutes of inactivity', 1),
        ('ip-restriction', 'IP Restriction', 'Limit access to specific IP addresses or ranges', 0)
    ]
    
    for setting in default_settings:
        cursor.execute(
            'INSERT OR IGNORE INTO security_settings (id, name, description, enabled) VALUES (?, ?, ?, ?)',
            setting
        )
    
    # Insert a default admin user if no users exist
    cursor.execute('SELECT COUNT(*) FROM users')
    user_count = cursor.fetchone()[0]
    
    if user_count == 0:
        # Create a default admin user with password 'admin123'
        password_hash = hashlib.sha256('admin123'.encode()).hexdigest()
        cursor.execute(
            'INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
            ('admin', 'admin@synapseiq.com', password_hash, True)
        )
    
    conn.commit()
    conn.close()

# Email sending function
def send_email(subject, recipient_email, recipient_name, message_body, is_html=False):
    # For development/testing, just log the email and return success
    # This avoids actual email sending during development
    print(f"\n==== EMAIL WOULD BE SENT ====")
    print(f"To: {recipient_name} <{recipient_email}>")
    print(f"Subject: {subject}")
    print(f"Body:\n{message_body}")
    print(f"==== END OF EMAIL ====\n")
    
    # In a development environment, we'll just pretend we sent the email
    # and return success without actually sending
    if os.environ.get('API_ENV') == 'development':
        print(f"DEBUG API - Development mode: Email not actually sent to {recipient_email}")
        return True
    
    # Email configuration from environment variables
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    sender_email = os.environ.get('SMTP_USERNAME', 'dongobbinshombo@gmail.com')
    sender_password = os.environ.get('SMTP_PASSWORD', '')
    from_email = os.environ.get('FROM_EMAIL', 'noreply@synapseiq.com')
    
    # For debugging
    print(f"Environment variables loaded:")
    print(f"SMTP_SERVER: {os.environ.get('SMTP_SERVER', 'Not set')}")
    print(f"SMTP_PORT: {os.environ.get('SMTP_PORT', 'Not set')}")
    print(f"SMTP_USERNAME: {os.environ.get('SMTP_USERNAME', 'Not set')}")
    print(f"SMTP_PASSWORD: {'Set' if os.environ.get('SMTP_PASSWORD') else 'Not set'}")
    print(f"FROM_EMAIL: {os.environ.get('FROM_EMAIL', 'Not set')}")
    print(f"ADMIN_EMAIL: {os.environ.get('ADMIN_EMAIL', 'Not set')}")
    print(f"API_ENV: {os.environ.get('API_ENV', 'Not set')}")
    
    
    print(f"DEBUG EMAIL - Using SMTP server: {smtp_server}:{smtp_port}")
    print(f"DEBUG EMAIL - Sender email: {sender_email}")
    print(f"DEBUG EMAIL - From email: {from_email}")
    print(f"DEBUG EMAIL - Password set: {'Yes' if sender_password else 'No'}")
    print(f"DEBUG EMAIL - Recipient: {recipient_name} <{recipient_email}>")
    
    # If no password is set, log a message and return without sending
    if not sender_password:
        print(f"DEBUG API - Email not sent: No email password configured. Would have sent to {recipient_email}")
        return False
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"SynapseIQ <{from_email}>"
    msg['To'] = f"{recipient_name} <{recipient_email}>" if recipient_name else recipient_email
    msg['Reply-To'] = sender_email
    
    # Attach message body
    content_type = 'html' if is_html else 'plain'
    msg.attach(MIMEText(message_body, content_type))
    
    try:
        print(f"DEBUG EMAIL - Connecting to SMTP server {smtp_server}:{smtp_port}...")
        # Connect to SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        print(f"DEBUG EMAIL - Connected to SMTP server")
        
        # Optional - set debug level for more verbose output
        server.set_debuglevel(1)
        
        print(f"DEBUG EMAIL - Starting TLS...")
        server.starttls()  # Secure the connection
        print(f"DEBUG EMAIL - TLS started")
        
        print(f"DEBUG EMAIL - Logging in with {sender_email}...")
        server.login(sender_email, sender_password)
        print(f"DEBUG EMAIL - Login successful")
        
        # Send email
        print(f"DEBUG EMAIL - Sending email to {recipient_email}...")
        server.sendmail(sender_email, recipient_email, msg.as_string())
        print(f"DEBUG EMAIL - Email sent")
        
        server.quit()
        print(f"DEBUG API - Email sent successfully to {recipient_email}")
        return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"DEBUG API - SMTP Authentication Error: {str(e)}")
        print("This usually means your password is incorrect or you need to use an App Password for Gmail.")
        print("For Gmail with 2FA enabled, generate an App Password at: https://myaccount.google.com/apppasswords")
        print("For Gmail without 2FA, you may need to allow less secure apps: https://myaccount.google.com/lesssecureapps")
        return False
    except smtplib.SMTPException as e:
        print(f"DEBUG API - SMTP Error: {str(e)}")
        return False
    except Exception as e:
        print(f"DEBUG API - Failed to send email: {str(e)}")
        return False

# Ensure database directory exists
db_dir = Path("./data")
db_dir.mkdir(parents=True, exist_ok=True)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to SynapseIQ Testimonials API",
        "status": "active",
        "version": "0.1.0"
    }

# Get all testimonials with pagination support
@app.get("/testimonials")
async def get_testimonials(
    featured_only: bool = False, 
    limit: int = 10, 
    offset: int = 0
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First get total count for pagination metadata
        if featured_only:
            cursor.execute("SELECT COUNT(*) as count FROM testimonials WHERE featured = TRUE")
        else:
            cursor.execute("SELECT COUNT(*) as count FROM testimonials")
            
        total_count = cursor.fetchone()['count']
        
        # Debug the pagination parameters
        print(f"DEBUG API - Pagination request: featured_only={featured_only}, limit={limit}, offset={offset}")
        
        # Then get the paginated results
        if featured_only:
            cursor.execute(
                "SELECT * FROM testimonials WHERE featured = TRUE ORDER BY date DESC LIMIT ? OFFSET ?", 
                (limit, offset)
            )
        else:
            cursor.execute(
                "SELECT * FROM testimonials ORDER BY date DESC LIMIT ? OFFSET ?", 
                (limit, offset)
            )
            
        testimonials = [dict(row) for row in cursor.fetchall()]
        
        # Debug the results
        print(f"DEBUG API - Fetched {len(testimonials)} testimonials. Total: {total_count}, Limit: {limit}, Offset: {offset}")
        if testimonials:
            print(f"DEBUG API - First ID: {testimonials[0]['id']}, Last ID: {testimonials[-1]['id']}")
        
        # Create a response with both testimonials and metadata
        response = {
            "testimonials": testimonials,
            "metadata": {
                "total_count": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": offset + len(testimonials) < total_count
            }
        }
        
        conn.close()
        return response
    except Exception as e:
        print(f"DEBUG API - Error retrieving testimonials: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve testimonials: {str(e)}")


# Get testimonial by ID
@app.get("/testimonials/{testimonial_id}")
async def get_testimonial(testimonial_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        conn.close()
        
        if testimonial is None:
            raise HTTPException(status_code=404, detail="Testimonial not found")
            
        return dict(testimonial)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve testimonial: {str(e)}")

# Create a new testimonial
@app.post("/testimonials/")
async def create_testimonial(testimonial: dict):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert new testimonial
        cursor.execute(
            "INSERT INTO testimonials (name, company, position, rating, content, featured, date, image) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)",
            (testimonial.get('name', ''), testimonial.get('company', ''), testimonial.get('position', ''), 
             testimonial.get('rating', 5), testimonial.get('content', ''), testimonial.get('featured', False), 
             testimonial.get('image', ''))
        )
        conn.commit()
        
        # Get the ID of the newly created testimonial
        testimonial_id = cursor.lastrowid
        
        # Fetch the created testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        new_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return new_testimonial
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create testimonial: {str(e)}")

# Update an existing testimonial
@app.put("/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: int, testimonial: dict):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        existing = cursor.fetchone()
        
        if existing is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Update testimonial
        cursor.execute(
            "UPDATE testimonials SET name = ?, company = ?, position = ?, rating = ?, content = ?, featured = ? WHERE id = ?",
            (testimonial.get('name', existing['name']), 
             testimonial.get('company', existing['company']), 
             testimonial.get('position', existing['position']), 
             testimonial.get('rating', existing['rating']), 
             testimonial.get('content', existing['content']), 
             testimonial.get('featured', existing['featured']), 
             testimonial_id)
        )
        conn.commit()
        
        # Fetch the updated testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        updated_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return updated_testimonial
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update testimonial: {str(e)}")

# Delete a testimonial
@app.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        
        if testimonial is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Delete image if exists
        if testimonial['image']:
            image_path = Path(f"./public{testimonial['image']}")
            if image_path.exists():
                image_path.unlink()
        
        # Delete testimonial
        cursor.execute("DELETE FROM testimonials WHERE id = ?", (testimonial_id,))
        conn.commit()
        conn.close()
        
        return {"message": f"Testimonial {testimonial_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete testimonial: {str(e)}")

# Update featured status
@app.patch("/testimonials/{testimonial_id}/featured")
async def update_featured_status(testimonial_id: int, featured_data: dict):
    try:
        featured = featured_data.get('featured', False)
        if isinstance(featured, str):
            featured = featured.lower() == 'true'
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        
        if testimonial is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Update featured status
        cursor.execute(
            "UPDATE testimonials SET featured = ? WHERE id = ?",
            (featured, testimonial_id)
        )
        conn.commit()
        
        # Fetch the updated testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        updated_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return updated_testimonial
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update featured status: {str(e)}")

# Upload testimonial image
@app.post("/testimonials/{testimonial_id}/image")
async def upload_testimonial_image(testimonial_id: int, file: UploadFile = File(...)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        
        if testimonial is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Check if file is an image
        if not file.content_type.startswith("image/"):
            conn.close()
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Delete old image if exists
        if testimonial['image']:
            old_image_path = Path(f"./public{testimonial['image']}")
            if old_image_path.exists():
                old_image_path.unlink()
        
        # Save new image
        file_extension = os.path.splitext(file.filename)[1]
        image_name = f"testimonial_{testimonial_id}{file_extension}"
        image_path = f"/static/images/testimonials/{image_name}"
        file_location = f"./public/images/testimonials/{image_name}"
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update testimonial with new image path
        cursor.execute(
            "UPDATE testimonials SET image = ? WHERE id = ?",
            (image_path, testimonial_id)
        )
        conn.commit()
        
        # Fetch the updated testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        updated_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return updated_testimonial
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

# Endpoint to get newsletter subscribers
@app.get("/contact/subscribers")
async def get_subscribers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Query to get all subscribers
        cursor.execute("SELECT * FROM subscribers ORDER BY subscribed_at DESC")
        subscribers = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return subscribers
    except Exception as e:
        print(f"DEBUG API - Error retrieving subscribers: {str(e)}")
        # Create the subscribers table if it doesn't exist
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Create subscribers table if it doesn't exist
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS subscribers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    name TEXT,
                    subscribed_at TEXT NOT NULL,
                    is_active INTEGER DEFAULT 1
                )
            """)
            conn.commit()
            conn.close()
            
            # Return empty array for now
            return []
        except Exception as create_err:
            print(f"DEBUG API - Error creating subscribers table: {str(create_err)}")
            raise HTTPException(status_code=500, detail=f"Failed to retrieve subscribers: {str(e)}")

# Request models for forms
class SubscriberRequest(BaseModel):
    email: str
    name: Optional[str] = None
    
class ContactFormRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# Endpoint to add a new newsletter subscriber
@app.post("/contact/subscribe")
async def add_subscriber(subscriber: SubscriberRequest):
    try:
        # Validate email format (basic check)
        email = subscriber.email
        name = subscriber.name
        
        if not "@" in email or not "." in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                name TEXT,
                subscribed_at TEXT NOT NULL,
                is_active INTEGER DEFAULT 1
            )
        """)
        
        # Insert new subscriber
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        is_new_subscriber = True
        try:
            cursor.execute(
                "INSERT INTO subscribers (email, name, subscribed_at, is_active) VALUES (?, ?, ?, ?)",
                (email, name, current_time, 1)
            )
            conn.commit()
            print(f"DEBUG API - Added new subscriber: {email}")
        except sqlite3.IntegrityError:
            # Email already exists, update the record instead
            cursor.execute(
                "UPDATE subscribers SET name = ?, subscribed_at = ?, is_active = 1 WHERE email = ?",
                (name, current_time, email)
            )
            conn.commit()
            print(f"DEBUG API - Updated existing subscriber: {email}")
            is_new_subscriber = False
            
        conn.close()
        
        # Send confirmation email to subscriber
        subscriber_name = name if name else "there"
        email_subject = "Welcome to SynapseIQ Newsletter" if is_new_subscriber else "SynapseIQ Newsletter Subscription Updated"
        email_body = f"""Hello {subscriber_name},

{'Thank you for subscribing to the SynapseIQ newsletter!' if is_new_subscriber else 'Your SynapseIQ newsletter subscription has been updated.'}

You will now receive the latest AI trends and SynapseIQ news for African businesses.

If you have any questions, feel free to contact us.

Best regards,
The SynapseIQ Team
"""
        send_email(email_subject, email, subscriber_name, email_body)
        
        # Send notification to admin
        admin_email = os.environ.get('ADMIN_EMAIL', 'dongobbinshombo@gmail.com')
        admin_subject = "New Newsletter Subscriber" if is_new_subscriber else "Updated Newsletter Subscription"
        admin_body = f"""{'A new user has subscribed' if is_new_subscriber else 'A user has updated their subscription'} to the SynapseIQ newsletter:

Email: {email}
Name: {name if name else 'Not provided'}
Date: {current_time}
"""
        send_email(admin_subject, admin_email, "SynapseIQ Admin", admin_body)
        
        return {"success": True, "message": "Subscription successful!"}
    except Exception as e:
        print(f"DEBUG API - Error adding subscriber: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to add subscriber: {str(e)}")

# Media Library API Endpoints

# Media item model
class MediaItem(BaseModel):
    id: Optional[int] = None
    name: str
    type: str
    url: str
    size: str
    dimensions: str
    uploadedAt: str
    tags: List[str]

# Endpoint to get all media items
@app.get("/media/items")
async def get_media_items():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS media_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                url TEXT NOT NULL,
                size TEXT NOT NULL,
                dimensions TEXT NOT NULL,
                uploaded_at TEXT NOT NULL,
                tags TEXT NOT NULL
            )
        """)
        
        # Fetch all media items
        cursor.execute(
            "SELECT id, name, type, url, size, dimensions, uploaded_at, tags FROM media_items ORDER BY uploaded_at DESC"
        )
        
        items = []
        for row in cursor.fetchall():
            items.append({
                "id": row[0],
                "name": row[1],
                "type": row[2],
                "url": row[3],
                "size": row[4],
                "dimensions": row[5],
                "uploadedAt": row[6],
                "tags": json.loads(row[7])
            })
        
        conn.close()
        return {"items": items, "metadata": {"total_count": len(items)}}
    except Exception as e:
        print(f"DEBUG API - Error fetching media items: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch media items: {str(e)}")

# Endpoint to upload a media file
@app.post("/media/upload")
async def upload_media_file(file: UploadFile = File(...), name: str = Form(None), tags: str = Form("[]")):
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), "uploads")
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        # Generate a unique filename if not provided
        if not name:
            name = file.filename
        
        # Determine file type
        file_extension = os.path.splitext(name)[1].lower()
        file_type = "document"
        if file_extension in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
            file_type = "image"
        elif file_extension in [".mp4", ".webm", ".avi", ".mov"]:
            file_type = "video"
        
        # Save the file
        file_path = os.path.join(upload_dir, name)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # Get file size
        file_size = os.path.getsize(file_path)
        size_str = f"{file_size / 1024:.1f} KB" if file_size < 1024 * 1024 else f"{file_size / (1024 * 1024):.1f} MB"
        
        # Get dimensions for images
        dimensions = "N/A"
        if file_type == "image":
            try:
                from PIL import Image
                img = Image.open(file_path)
                dimensions = f"{img.width} x {img.height}"
            except Exception as e:
                print(f"DEBUG API - Error getting image dimensions: {str(e)}")
        
        # Parse tags
        try:
            tags_list = json.loads(tags)
        except:
            tags_list = []
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS media_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                url TEXT NOT NULL,
                size TEXT NOT NULL,
                dimensions TEXT NOT NULL,
                uploaded_at TEXT NOT NULL,
                tags TEXT NOT NULL
            )
        """)
        
        # Insert new media item
        current_time = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        url = f"/uploads/{name}"
        
        cursor.execute(
            "INSERT INTO media_items (name, type, url, size, dimensions, uploaded_at, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (name, file_type, url, size_str, dimensions, current_time, json.dumps(tags_list))
        )
        
        # Get the inserted item ID
        item_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "item": {
                "id": item_id,
                "name": name,
                "type": file_type,
                "url": url,
                "size": size_str,
                "dimensions": dimensions,
                "uploadedAt": current_time,
                "tags": tags_list
            }
        }
    except Exception as e:
        print(f"DEBUG API - Error uploading media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload media: {str(e)}")

# Endpoint to delete a media item
@app.delete("/media/items/{item_id}")
async def delete_media_item(item_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get the item to delete
        cursor.execute("SELECT url FROM media_items WHERE id = ?", (item_id,))
        item = cursor.fetchone()
        
        if not item:
            raise HTTPException(status_code=404, detail="Media item not found")
        
        # Delete the file if it exists
        file_path = os.path.join(os.getcwd(), item[0].lstrip("/"))
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Delete from database
        cursor.execute("DELETE FROM media_items WHERE id = ?", (item_id,))
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Media item deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"DEBUG API - Error deleting media item: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete media item: {str(e)}")

# Blog Post API Endpoints

# Get all blog posts with optional filters
@app.get("/blog/posts")
async def get_blog_posts(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    published_only: bool = Query(False),
    category: Optional[str] = None,
    tag: Optional[str] = None,
    token: str = Depends(oauth2_scheme)
):
    try:
        # Verify token (will raise exception if invalid)
        verify_token(token)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM blog_posts"
        params = []
        
        # Apply filters
        conditions = []
        
        if published_only:
            conditions.append("published = 1")
        
        if category:
            conditions.append("category = ?")
            params.append(category)
        
        if tag:
            conditions.append("tags LIKE ?")
            params.append(f"%{tag}%")
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        posts = cursor.fetchall()
        
        # Get total count for pagination
        count_query = "SELECT COUNT(*) FROM blog_posts"
        if conditions:
            count_query += " WHERE " + " AND ".join(conditions)
        
        cursor.execute(count_query, params[:-2] if params else [])
        total_count = cursor.fetchone()[0]
        
        # Format the results
        result = []
        for post in posts:
            tags = json.loads(post['tags']) if post['tags'] else []
            result.append({
                "id": post['id'],
                "title": post['title'],
                "slug": post['slug'],
                "excerpt": post['excerpt'],
                "content": post['content'],
                "author": post['author'],
                "author_role": post['author_role'],
                "category": post['category'],
                "tags": tags,
                "featured_image": post['featured_image'],
                "published": bool(post['published']),
                "published_at": post['published_at'],
                "updated_at": post['updated_at']
            })
        
        conn.close()
        
        return {
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "posts": result
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"DEBUG API - Error fetching blog posts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog posts: {str(e)}")

# Get a single blog post by ID or slug
@app.get("/blog/posts/{post_identifier}")
async def get_blog_post(post_identifier: str, token: str = Depends(oauth2_scheme)):
    try:
        # Verify token (will raise exception if invalid)
        verify_token(token)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if the identifier is a numeric ID or a slug
        if post_identifier.isdigit():
            cursor.execute("SELECT * FROM blog_posts WHERE id = ?", (int(post_identifier),))
        else:
            cursor.execute("SELECT * FROM blog_posts WHERE slug = ?", (post_identifier,))
        
        post = cursor.fetchone()
        
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Format the result
        tags = json.loads(post['tags']) if post['tags'] else []
        result = {
            "id": post['id'],
            "title": post['title'],
            "slug": post['slug'],
            "excerpt": post['excerpt'],
            "content": post['content'],
            "author": post['author'],
            "author_role": post['author_role'],
            "category": post['category'],
            "tags": tags,
            "featured_image": post['featured_image'],
            "published": bool(post['published']),
            "published_at": post['published_at'],
            "updated_at": post['updated_at']
        }
        
        conn.close()
        
        return result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"DEBUG API - Error fetching blog post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog post: {str(e)}")

# Create a new blog post
@app.post("/blog/posts", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate, token: str = Depends(oauth2_scheme)):
    try:
        # Verify token (will raise exception if invalid)
        user_data = verify_token(token)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if slug already exists
        cursor.execute("SELECT id FROM blog_posts WHERE slug = ?", (post.slug,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Slug already exists")
        
        # Prepare data for insertion
        current_time = datetime.now().isoformat()
        published_at = current_time if post.published else None
        
        # Insert the new post
        cursor.execute(
            """INSERT INTO blog_posts 
            (title, slug, excerpt, content, author, author_role, category, tags, 
            featured_image, published, published_at, updated_at, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                post.title,
                post.slug,
                post.excerpt,
                post.content,
                post.author,
                post.author_role,
                post.category,
                json.dumps(post.tags),
                post.featured_image,
                post.published,
                published_at,
                current_time,
                user_data.get("sub")
            )
        )
        
        post_id = cursor.lastrowid
        conn.commit()
        
        # Fetch the created post
        cursor.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,))
        created_post = cursor.fetchone()
        
        # Format the result
        tags = json.loads(created_post['tags']) if created_post['tags'] else []
        result = {
            "id": created_post['id'],
            "title": created_post['title'],
            "slug": created_post['slug'],
            "excerpt": created_post['excerpt'],
            "content": created_post['content'],
            "author": created_post['author'],
            "author_role": created_post['author_role'],
            "category": created_post['category'],
            "tags": tags,
            "featured_image": created_post['featured_image'],
            "published": bool(created_post['published']),
            "published_at": created_post['published_at'],
            "updated_at": created_post['updated_at']
        }
        
        conn.close()
        
        return result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"DEBUG API - Error creating blog post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create blog post: {str(e)}")

# Update a blog post
@app.put("/blog/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: int, post_update: BlogPostUpdate, token: str = Depends(oauth2_scheme)):
    try:
        # Verify token (will raise exception if invalid)
        verify_token(token)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if post exists
        cursor.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,))
        existing_post = cursor.fetchone()
        
        if not existing_post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Check if slug is being updated and if it already exists
        if post_update.slug and post_update.slug != existing_post['slug']:
            cursor.execute("SELECT id FROM blog_posts WHERE slug = ? AND id != ?", (post_update.slug, post_id))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Slug already exists")
        
        # Prepare update data
        update_data = {}
        for field, value in post_update.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        if not update_data:
            # No fields to update
            conn.close()
            return get_blog_post(str(post_id), token)
        
        # Handle special fields
        if 'tags' in update_data:
            update_data['tags'] = json.dumps(update_data['tags'])
        
        # Update published_at if published status changes
        if 'published' in update_data:
            if update_data['published'] and not existing_post['published_at']:
                update_data['published_at'] = datetime.now().isoformat()
            elif not update_data['published']:
                update_data['published_at'] = None
        
        # Always update the updated_at timestamp
        update_data['updated_at'] = datetime.now().isoformat()
        
        # Build the update query
        set_clause = ", ".join([f"{field} = ?" for field in update_data.keys()])
        query = f"UPDATE blog_posts SET {set_clause} WHERE id = ?"
        
        # Execute the update
        cursor.execute(query, list(update_data.values()) + [post_id])
        conn.commit()
        
        # Fetch the updated post
        cursor.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,))
        updated_post = cursor.fetchone()
        
        # Format the result
        tags = json.loads(updated_post['tags']) if updated_post['tags'] else []
        result = {
            "id": updated_post['id'],
            "title": updated_post['title'],
            "slug": updated_post['slug'],
            "excerpt": updated_post['excerpt'],
            "content": updated_post['content'],
            "author": updated_post['author'],
            "author_role": updated_post['author_role'],
            "category": updated_post['category'],
            "tags": tags,
            "featured_image": updated_post['featured_image'],
            "published": bool(updated_post['published']),
            "published_at": updated_post['published_at'],
            "updated_at": updated_post['updated_at']
        }
        
        conn.close()
        
        return result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"DEBUG API - Error updating blog post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update blog post: {str(e)}")

# Delete a blog post
@app.delete("/blog/posts/{post_id}")
async def delete_blog_post(post_id: int, token: str = Depends(oauth2_scheme)):
    try:
        # Verify token (will raise exception if invalid)
        verify_token(token)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if post exists
        cursor.execute("SELECT id FROM blog_posts WHERE id = ?", (post_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Delete the post
        cursor.execute("DELETE FROM blog_posts WHERE id = ?", (post_id,))
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Blog post deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"DEBUG API - Error deleting blog post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete blog post: {str(e)}")

# Toggle blog post publish status
@app.put("/blog/posts/{post_id}/toggle-publish")
async def toggle_publish_status(post_id: int, token: str = Depends(oauth2_scheme)):
    try:
        # Verify token (will raise exception if invalid)
        verify_token(token)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if post exists and get current publish status
        cursor.execute("SELECT published, published_at FROM blog_posts WHERE id = ?", (post_id,))
        post = cursor.fetchone()
        
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Toggle publish status
        new_status = not bool(post['published'])
        published_at = datetime.now().isoformat() if new_status and not post['published_at'] else post['published_at']
        
        # Update the post
        cursor.execute(
            "UPDATE blog_posts SET published = ?, published_at = ?, updated_at = ? WHERE id = ?",
            (new_status, published_at, datetime.now().isoformat(), post_id)
        )
        conn.commit()
        
        # Fetch the updated post
        cursor.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,))
        updated_post = cursor.fetchone()
        
        # Format the result
        tags = json.loads(updated_post['tags']) if updated_post['tags'] else []
        result = {
            "id": updated_post['id'],
            "title": updated_post['title'],
            "slug": updated_post['slug'],
            "excerpt": updated_post['excerpt'],
            "content": updated_post['content'],
            "author": updated_post['author'],
            "author_role": updated_post['author_role'],
            "category": updated_post['category'],
            "tags": tags,
            "featured_image": updated_post['featured_image'],
            "published": bool(updated_post['published']),
            "published_at": updated_post['published_at'],
            "updated_at": updated_post['updated_at']
        }
        
        conn.close()
        
        return result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"DEBUG API - Error toggling blog post publish status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to toggle blog post publish status: {str(e)}")

# Endpoint to get contact form submissions
@app.get("/contact/submissions")
async def get_contact_submissions():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                submitted_at TEXT NOT NULL,
                is_read INTEGER DEFAULT 0
            )
        """)
        
        # Fetch all contact submissions
        cursor.execute(
            "SELECT id, name, email, subject, message, submitted_at, is_read FROM contact_messages ORDER BY submitted_at DESC"
        )
        
        submissions = []
        for row in cursor.fetchall():
            submissions.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "subject": row[3],
                "message": row[4],
                "submitted_at": row[5],
                "is_read": bool(row[6])
            })
        
        conn.close()
        return {"submissions": submissions, "metadata": {"total_count": len(submissions)}}
    except Exception as e:
        print(f"DEBUG API - Error fetching contact submissions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch contact submissions: {str(e)}")

# Endpoint to submit contact form
@app.post("/contact/submit")
async def submit_contact_form(form_data: ContactFormRequest):
    try:
        # Validate email format (basic check)
        if not "@" in form_data.email or not "." in form_data.email:
            raise HTTPException(status_code=400, detail="Invalid email format")
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                submitted_at TEXT NOT NULL,
                is_read INTEGER DEFAULT 0
            )
        """)
        
        # Insert new contact message
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO contact_messages (name, email, subject, message, submitted_at) VALUES (?, ?, ?, ?, ?)",
            (form_data.name, form_data.email, form_data.subject, form_data.message, current_time)
        )
        conn.commit()
        print(f"DEBUG API - Added new contact message from: {form_data.email}, Subject: {form_data.subject}")
            
        conn.close()
        
        # Send confirmation email to the sender
        confirmation_subject = "Thank you for contacting SynapseIQ"
        confirmation_body = f"""Hello {form_data.name},

Thank you for contacting SynapseIQ. We have received your message regarding "{form_data.subject}".

Our team will review your inquiry and get back to you as soon as possible.

Best regards,
The SynapseIQ Team
"""
        send_email(confirmation_subject, form_data.email, form_data.name, confirmation_body)
        
        # Send notification to admin
        admin_email = os.environ.get('ADMIN_EMAIL', 'dongobbinshombo@gmail.com')
        admin_subject = f"New Contact Form Submission: {form_data.subject}"
        admin_body = f"""A new contact form submission has been received:

Name: {form_data.name}
Email: {form_data.email}
Subject: {form_data.subject}
Date: {current_time}

Message:
{form_data.message}
"""
        send_email(admin_subject, admin_email, "SynapseIQ Admin", admin_body)
        
        return {"success": True, "message": "Your message has been sent successfully!"}
    except Exception as e:
        print(f"DEBUG API - Error submitting contact form: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to submit contact form: {str(e)}")

# Run the app
# Security-related helper functions
def verify_password(plain_password, hashed_password):
    """Verify a password against its hash"""
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password):
    """Generate a hash for a password"""
    return hashlib.sha256(password.encode()).hexdigest()

def authenticate_user(username, password):
    """Authenticate a user by username and password"""
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    
    if not user:
        return False
    
    if not verify_password(password, user['password_hash']):
        return False
    
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user from a JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (token_data.username,)).fetchone()
    conn.close()
    
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """Check if the current user is active"""
    if not current_user['is_active']:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def log_security_event(user_id, event_type, description, ip_address=None):
    """Log a security event to the database"""
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO security_logs (user_id, event_type, description, ip_address) VALUES (?, ?, ?, ?)',
        (user_id, event_type, description, ip_address)
    )
    conn.commit()
    conn.close()

# Authentication endpoints
@app.post("/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Generate a JWT token for authentication"""
    user = authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    conn = get_db_connection()
    conn.execute('UPDATE users SET last_login = ? WHERE id = ?', (datetime.utcnow().isoformat(), user['id']))
    conn.commit()
    conn.close()
    
    # Log the login event
    log_security_event(user['id'], "login", f"User {user['username']} logged in")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# Security settings endpoints
@app.get("/security/settings", response_model=List[SecuritySetting])
async def get_security_settings(current_user: dict = Depends(get_current_active_user)):
    """Get all security settings for the current user"""
    conn = get_db_connection()
    settings = conn.execute('SELECT * FROM security_settings').fetchall()
    conn.close()
    
    return [
        {
            "id": setting["id"],
            "name": setting["name"],
            "description": setting["description"],
            "enabled": bool(setting["enabled"]),
            "last_updated": setting["last_updated"]
        }
        for setting in settings
    ]

@app.put("/security/settings/{setting_id}", response_model=SecuritySetting)
async def update_security_setting(
    setting_id: str,
    setting_update: SecuritySettingUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    """Update a security setting"""
    conn = get_db_connection()
    
    # Check if setting exists
    setting = conn.execute('SELECT * FROM security_settings WHERE id = ?', (setting_id,)).fetchone()
    if not setting:
        conn.close()
        raise HTTPException(status_code=404, detail="Setting not found")
    
    # Update the setting
    now = datetime.utcnow().isoformat()
    conn.execute(
        'UPDATE security_settings SET enabled = ?, last_updated = ? WHERE id = ?',
        (setting_update.enabled, now, setting_id)
    )
    conn.commit()
    
    # Get the updated setting
    updated_setting = conn.execute('SELECT * FROM security_settings WHERE id = ?', (setting_id,)).fetchone()
    conn.close()
    
    # Log the event
    log_security_event(
        current_user['id'],
        "setting_update",
        f"Updated security setting {setting_id} to {setting_update.enabled}"
    )
    
    return {
        "id": updated_setting["id"],
        "name": updated_setting["name"],
        "description": updated_setting["description"],
        "enabled": bool(updated_setting["enabled"]),
        "last_updated": updated_setting["last_updated"]
    }

# Password change endpoint
@app.post("/auth/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: PasswordChange,
    current_user: dict = Depends(get_current_active_user)
):
    """Change the current user's password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    new_password_hash = get_password_hash(password_data.new_password)
    
    conn = get_db_connection()
    conn.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        (new_password_hash, current_user["id"])
    )
    conn.commit()
    conn.close()
    
    # Log the event
    log_security_event(current_user['id'], "password_change", "Password changed successfully")
    
    return {"message": "Password changed successfully"}

# API key endpoints
@app.get("/security/api-keys", response_model=List[ApiKey])
async def get_api_keys(current_user: dict = Depends(get_current_active_user)):
    """Get all API keys for the current user"""
    conn = get_db_connection()
    api_keys = conn.execute(
        'SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
        (current_user["id"],)
    ).fetchall()
    conn.close()
    
    return [
        {
            "id": key["id"],
            "name": key["name"],
            "key": f"sk_live_{'•' * 26}",  # Masked key
            "created": key["created_at"],
            "last_used": key["last_used"],
            "permissions": json.loads(key["permissions"])
        }
        for key in api_keys
    ]

@app.post("/security/api-keys", response_model=ApiKey, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    key_data: ApiKeyCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new API key"""
    # Generate a new API key
    api_key = f"sk_live_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()
    key_id = str(uuid.uuid4())
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO api_keys (id, name, key_hash, user_id, permissions) VALUES (?, ?, ?, ?, ?)',
        (key_id, key_data.name, key_hash, current_user["id"], json.dumps(key_data.permissions))
    )
    conn.commit()
    conn.close()
    
    # Log the event
    log_security_event(current_user['id'], "api_key_created", f"Created new API key: {key_data.name}")
    
    return {
        "id": key_id,
        "name": key_data.name,
        "key": api_key,  # Return the full key only once
        "created": datetime.utcnow().isoformat(),
        "permissions": key_data.permissions
    }

@app.delete("/security/api-keys/{key_id}", status_code=status.HTTP_200_OK)
async def delete_api_key(
    key_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Delete an API key"""
    conn = get_db_connection()
    
    # Check if the key exists and belongs to the user
    key = conn.execute(
        'SELECT * FROM api_keys WHERE id = ? AND user_id = ?',
        (key_id, current_user["id"])
    ).fetchone()
    
    if not key:
        conn.close()
        raise HTTPException(status_code=404, detail="API key not found")
    
    # Delete the key
    conn.execute('DELETE FROM api_keys WHERE id = ?', (key_id,))
    conn.commit()
    conn.close()
    
    # Log the event
    log_security_event(current_user['id'], "api_key_deleted", f"Deleted API key: {key['name']}")
    
    return {"message": "API key deleted successfully"}

# Security logs endpoint
@app.get("/security/logs")
async def get_security_logs(current_user: dict = Depends(get_current_active_user)):
    """Get security logs for the current user"""
    if not current_user["is_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to view security logs")
    
    conn = get_db_connection()
    logs = conn.execute(
        '''
        SELECT l.*, u.username 
        FROM security_logs l 
        LEFT JOIN users u ON l.user_id = u.id 
        ORDER BY l.timestamp DESC 
        LIMIT 100
        '''
    ).fetchall()
    conn.close()
    
    return [
        {
            "id": log["id"],
            "user_id": log["user_id"],
            "username": log["username"],
            "event_type": log["event_type"],
            "description": log["description"],
            "ip_address": log["ip_address"],
            "timestamp": log["timestamp"]
        }
        for log in logs
    ]

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    # Create data directory if it doesn't exist
    data_dir = Path("./data")
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Initialize database
    init_db()

# Database initialization function
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            is_admin INTEGER DEFAULT 0,
            last_login TEXT
        )
    """)
    
    # Create security settings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            enabled INTEGER DEFAULT 0,
            last_updated TEXT
        )
    """)
    
    # Create API keys table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS api_keys (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            key_hash TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            permissions TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_used TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Create security logs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            event_type TEXT NOT NULL,
            description TEXT NOT NULL,
            ip_address TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Check if default admin user exists
    cursor.execute("SELECT id FROM users WHERE username = 'admin'")
    admin_exists = cursor.fetchone()
    
    # Create default admin user if not exists
    if not admin_exists:
        admin_password_hash = get_password_hash("admin123")
        cursor.execute(
            "INSERT INTO users (username, password_hash, is_active, is_admin) VALUES (?, ?, 1, 1)",
            ("admin", admin_password_hash)
        )
        
    # Insert default security settings if table is empty
    cursor.execute("SELECT COUNT(*) FROM security_settings")
    settings_count = cursor.fetchone()[0]
    
    if settings_count == 0:
        default_settings = [
            ("two_factor_auth", "Require two-factor authentication for all logins", 0),
            ("login_alerts", "Send email alerts for new login attempts", 1),
            ("session_timeout", "Automatically log out inactive sessions after 30 minutes", 1),
            ("ip_restriction", "Restrict logins to whitelisted IP addresses", 0),
            ("password_expiry", "Require password change every 90 days", 0),
            ("failed_login_lockout", "Lock account after 5 failed login attempts", 1)
        ]
        
        for name, description, enabled in default_settings:
            cursor.execute(
                "INSERT INTO security_settings (name, description, enabled, last_updated) VALUES (?, ?, ?, ?)",
                (name, description, enabled, datetime.now().isoformat())
            )
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
