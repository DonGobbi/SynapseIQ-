import sqlite3
import json
from datetime import datetime
import os

# Connect to the database
def get_db_connection():
    # Print the current working directory
    print(f"Current working directory: {os.getcwd()}")
    
    # Make sure the data directory exists
    data_dir = "./data"
    os.makedirs(data_dir, exist_ok=True)
    
    # Use the same database path as in simple_server.py
    db_path = "./data/synapseiq.db"
    if os.path.exists(db_path):
        print(f"Database file exists: {db_path}")
    else:
        print(f"Database file does not exist: {db_path} (will be created)")
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def import_subscribers():
    # Sample subscribers data
    sample_subscribers = [
        {"email": "john.doe@example.com", "name": "John Doe", "is_active": 1},
        {"email": "jane.smith@example.com", "name": "Jane Smith", "is_active": 1},
        {"email": "michael.brown@example.com", "name": "Michael Brown", "is_active": 1},
        {"email": "sarah.wilson@example.com", "name": "Sarah Wilson", "is_active": 0},
        {"email": "david.johnson@example.com", "name": "David Johnson", "is_active": 1},
        {"email": "emily.davis@example.com", "name": "Emily Davis", "is_active": 1},
        {"email": "robert.miller@example.com", "name": "Robert Miller", "is_active": 0},
        {"email": "lisa.taylor@example.com", "name": "Lisa Taylor", "is_active": 1},
        {"email": "james.anderson@example.com", "name": "James Anderson", "is_active": 1},
        {"email": "patricia.thomas@example.com", "name": "Patricia Thomas", "is_active": 1}
    ]
    
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
        
        # Insert sample subscribers
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        for subscriber in sample_subscribers:
            try:
                cursor.execute(
                    "INSERT OR IGNORE INTO subscribers (email, name, subscribed_at, is_active) VALUES (?, ?, ?, ?)",
                    (subscriber["email"], subscriber["name"], current_time, subscriber["is_active"])
                )
            except sqlite3.IntegrityError:
                print(f"Subscriber with email {subscriber['email']} already exists.")
        
        conn.commit()
        
        # Check how many were inserted
        cursor.execute("SELECT COUNT(*) as count FROM subscribers")
        count = cursor.fetchone()['count']
        print(f"Total subscribers in database: {count}")
        
        conn.close()
        print("Subscribers import completed successfully!")
        
    except Exception as e:
        print(f"Error importing subscribers: {str(e)}")

if __name__ == "__main__":
    import_subscribers()
