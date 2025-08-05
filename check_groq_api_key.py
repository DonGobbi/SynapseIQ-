import os
import sys
import groq
from dotenv import load_dotenv
import time

# Add the backend directory to the path so we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

def check_groq_api_key():
    """Check if the Groq API key is valid and working."""
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        print("❌ Error: GROQ_API_KEY not found in environment variables")
        return False
    
    # Check if the API key format is valid (starts with gsk_)
    if not api_key.startswith("gsk_"):
        print(f"❌ Error: Invalid API key format. Key should start with 'gsk_'")
        return False
    
    print(f"✅ API key format is valid: {api_key[:8]}...{api_key[-4:]}")
    
    # Try to make a simple API call to check if the key works
    client = groq.Client(api_key=api_key)
    
    try:
        print("🔄 Testing API connection with a simple completion request...")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, are you working?"}
            ],
            max_tokens=10
        )
        
        elapsed_time = time.time() - start_time
        
        print(f"✅ API connection successful! Response received in {elapsed_time:.2f}s")
        print(f"🤖 Response: {response.choices[0].message.content}")
        return True
    
    except Exception as e:
        print(f"❌ API connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("Checking Groq API key validity...")
    result = check_groq_api_key()
    
    if result:
        print("\n✅ SUCCESS: Groq API key is valid and working!")
    else:
        print("\n❌ FAILURE: Groq API key is invalid or not working properly.")
