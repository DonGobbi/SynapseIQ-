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
    
    # Check if newsletter_subscriptions table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='newsletter_subscriptions'")
    if not cursor.fetchone():
        print("Newsletter subscribers table does not exist yet.")
        sys.exit(1)
    
    # Get all subscribers
    cursor.execute("SELECT id, email, name, subscribed_at, is_active FROM newsletter_subscriptions ORDER BY subscribed_at DESC")
    subscribers = cursor.fetchall()
    
    if not subscribers:
        print("No subscribers found in the database.")
    else:
        print(f"\nFound {len(subscribers)} subscribers:")
        print("-" * 80)
        print(f"{'ID':<5} {'Email':<30} {'Name':<20} {'Subscribed At':<25} {'Active':<6}")
        print("-" * 80)
        
        for sub in subscribers:
            sub_id, email, name, subscribed_at, is_active = sub
            # Format the timestamp for better readability
            if subscribed_at:
                try:
                    dt = datetime.fromisoformat(subscribed_at.replace('Z', '+00:00'))
                    formatted_time = dt.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    formatted_time = subscribed_at
            else:
                formatted_time = "N/A"
                
            active_status = "Yes" if is_active else "No"
            print(f"{sub_id:<5} {email:<30} {name or 'N/A':<20} {formatted_time:<25} {active_status:<6}")
    
    conn.close()
    
except Exception as e:
    print(f"Error accessing database: {e}")
