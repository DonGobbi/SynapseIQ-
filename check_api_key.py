import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv("backend/.env")

# Get API key from environment
api_key = os.getenv("GROQ_API_KEY")
print(f"API Key: {api_key}")
print(f"Length: {len(api_key)}")
print(f"First 5 chars: {api_key[:5]}")
print(f"Last 5 chars: {api_key[-5:]}")
print(f"ASCII values of first 10 chars: {[ord(c) for c in api_key[:10]]}")
