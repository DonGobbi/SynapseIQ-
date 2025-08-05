import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv("backend/.env")

# Get API key from environment
api_key = os.getenv("GROQ_API_KEY")
print(f"API Key starts with: {api_key[:5]}... and ends with: ...{api_key[-5:]}")
print(f"API Key length: {len(api_key)}")

try:
    # Initialize Groq client with API key
    client = Groq(api_key=api_key)
    
    # Test a simple completion
    print("Testing Groq API with a simple completion...")
    completion = client.chat.completions.create(
        model="meta-llama/llama-guard-4-12b",
        messages=[
            {
                "role": "user",
                "content": "Tell me about SynapseIQ in one sentence."
            }
        ],
        temperature=0.7,
        max_completion_tokens=100,
        top_p=1,
        stream=False,
        stop=None,
    )
    
    # Print the response
    print("\nAPI Response:")
    print(completion.choices[0].message.content)
    print("\nGroq API is working correctly!")
    
except Exception as e:
    print(f"\nError: {str(e)}")
    print("\nTroubleshooting tips:")
    print("1. Check if the API key format is correct (should start with 'gsk_')")
    print("2. Verify the API key is active in your Groq account")
    print("3. Check if there are any network issues")
    print("4. Ensure you have the correct Groq Python package installed (pip install groq)")
