import requests
import json
import time
import textwrap

# Test the chatbot API with various queries
def test_chatbot_api():
    """
    Test the chatbot API with various queries to verify fallback mechanisms
    """
    base_url = "http://localhost:8000"
    endpoint = f"{base_url}/chatbot/chat"  # The router is mounted at /chatbot prefix
    
    # Test cases with different types of queries
    test_cases = [
        {"message": "Tell me about your services", "expected_topic": "services"},
        {"message": "How much do you charge?", "expected_topic": "pricing"},
        {"message": "How can I contact you?", "expected_topic": "contact"},
        {"message": "What AI solutions do you offer?", "expected_topic": "services"},
        {"message": "Tell me about your company", "expected_topic": "general"}
    ]
    
    print("Testing SynapseIQ Chatbot API with fallback mechanisms...")
    print("-" * 60)
    
    for i, test in enumerate(test_cases, 1):
        message = test["message"]
        expected_topic = test["expected_topic"]
        
        print(f"\nTest {i}: '{message}' (Expected topic: {expected_topic})")
        
        # Prepare the request payload
        payload = {
            "messages": [
                {"role": "user", "content": message}
            ]
        }
        
        try:
            # Send the request
            start_time = time.time()
            response = requests.post(endpoint, json=payload)
            elapsed_time = time.time() - start_time
            
            # Process the response
            if response.status_code == 200:
                response_data = response.json()
                print(f"✅ Status: {response.status_code}")
                print(f"⏱️ Response time: {elapsed_time:.2f}s")
                
                # Extract the assistant message from the response
                assistant_message = response_data.get("response", "")
                print(f"🤖 Response:")
                wrapped_message = textwrap.fill(assistant_message, width=80)
                print(wrapped_message)
                
                # Print other response data
                print(f"Processing time: {response_data.get('processing_time', 0):.4f}s")
                print(f"Conversation ID: {response_data.get('conversation_id', '')}")
                print()
                
                # Check if response contains expected topic keywords
                topic_keywords = {
                    "services": ["service", "solution", "offer", "provide", "AI", "analytics"],
                    "pricing": ["price", "cost", "charge", "fee", "package", "subscription"],
                    "contact": ["contact", "email", "phone", "reach", "WhatsApp", "office"],
                    "general": ["company", "business", "SynapseIQ", "team", "mission"]
                }
                
                keywords = topic_keywords.get(expected_topic, [])
                found_keywords = [kw for kw in keywords if kw.lower() in assistant_message.lower()]
                
                if found_keywords:
                    print(f"✅ Found expected keywords: {', '.join(found_keywords)}")
                else:
                    print(f"⚠️ Did not find expected keywords for topic '{expected_topic}'")
                
            else:
                print(f"❌ Error: Status code {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
    
    print("\n" + "-" * 60)
    print("Chatbot API testing complete!")

if __name__ == "__main__":
    test_chatbot_api()
