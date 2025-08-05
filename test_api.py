import requests
import json

# API endpoint
url = "http://localhost:8000/chatbot/chat"

# Request payload
payload = {
    "messages": [
        {
            "role": "user",
            "content": "What AI services do you offer?"
        }
    ]
}

# Send POST request
headers = {"Content-Type": "application/json"}
response = requests.post(url, json=payload, headers=headers)

# Print response
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
