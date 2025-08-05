import sqlite3
import os
from pathlib import Path
import json
from datetime import datetime

# Create database directory if it doesn't exist
db_dir = Path("./data")
db_dir.mkdir(exist_ok=True)

# Database connection
def get_db_connection():
    conn = sqlite3.connect("./data/synapseiq.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database tables if they don't exist"""
    print("Initializing database...")
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
    print("Database initialized successfully!")

def add_test_data():
    """Add some test data to the database"""
    print("Adding test data...")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Add test contact submission
    try:
        cursor.execute(
            "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
            ("Test User", "test@example.com", "Test Subject", "This is a test message.")
        )
        print("Added test contact submission")
    except sqlite3.Error as e:
        print(f"Error adding test contact submission: {e}")
    
    # Add test newsletter subscription
    try:
        cursor.execute(
            "INSERT INTO newsletter_subscriptions (email, name) VALUES (?, ?)",
            ("newsletter@example.com", "Newsletter User")
        )
        print("Added test newsletter subscription")
    except sqlite3.Error as e:
        print(f"Error adding test newsletter subscription: {e}")
    
    conn.commit()
    conn.close()

def query_data():
    """Query and display data from the database"""
    print("\nQuerying database...")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query contact submissions
    cursor.execute("SELECT * FROM contact_submissions")
    submissions = [dict(row) for row in cursor.fetchall()]
    print("\nContact Submissions:")
    for submission in submissions:
        print(json.dumps(submission, indent=2, default=str))
    
    # Query newsletter subscriptions
    cursor.execute("SELECT * FROM newsletter_subscriptions")
    subscriptions = [dict(row) for row in cursor.fetchall()]
    print("\nNewsletter Subscriptions:")
    for subscription in subscriptions:
        print(json.dumps(subscription, indent=2, default=str))
    
    conn.close()

if __name__ == "__main__":
    # Initialize the database
    init_db()
    
    # Add test data
    add_test_data()
    
    # Query and display data
    query_data()
    
    print("\nDatabase test completed successfully!")
