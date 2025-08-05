import sqlite3
import os
import sys
from datetime import datetime

# Connect to the SQLite database
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'data', 'synapseiq.db')
print(f"Checking database at: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if contact_submissions table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='contact_submissions'")
    if not cursor.fetchone():
        print("Contact submissions table does not exist yet.")
        sys.exit(1)
    
    # Get all contact submissions
    cursor.execute("SELECT id, name, email, subject, message, created_at FROM contact_submissions ORDER BY created_at DESC")
    submissions = cursor.fetchall()
    
    if not submissions:
        print("No contact form submissions found in the database.")
    else:
        print(f"\nFound {len(submissions)} contact form submissions:")
        print("-" * 100)
        print(f"{'ID':<5} {'Name':<20} {'Email':<30} {'Subject':<20} {'Created At':<25}")
        print("-" * 100)
        
        for sub in submissions:
            sub_id, name, email, subject, message, created_at = sub
            # Format the timestamp for better readability
            if created_at:
                try:
                    dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    formatted_time = dt.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    formatted_time = created_at
            else:
                formatted_time = "N/A"
                
            # Truncate subject if too long
            truncated_subject = subject[:17] + "..." if len(subject) > 20 else subject
            
            print(f"{sub_id:<5} {name[:17]+'...' if len(name) > 20 else name:<20} {email:<30} {truncated_subject:<20} {formatted_time:<25}")
            
            # Ask if user wants to see message content
            if len(submissions) <= 5 or sub_id == submissions[0][0]:  # Show message for all if <= 5 submissions or just the latest one
                print(f"\nMessage from {name} (ID: {sub_id}):")
                print("-" * 80)
                print(message)
                print("-" * 80)
    
    conn.close()
    
except Exception as e:
    print(f"Error accessing database: {e}")
