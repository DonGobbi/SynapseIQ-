import os
import logging
import random
import time
from typing import List, Dict, Optional, Union, Any
from dotenv import load_dotenv

# Import Groq for AI capabilities
GROQ_AVAILABLE = True
try:
    from groq import Groq
except ImportError:
    GROQ_AVAILABLE = False

# Load environment variables
load_dotenv()

# Get API key from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class GroqAIClient:
    """Client for interacting with Groq AI API with fallback mechanisms"""
    
    def __init__(self):
        """Initialize the Groq AI client with fallback capabilities"""
        self.api_key = os.getenv("GROQ_API_KEY")
        self.api_available = False
        
        # Default models
        self.chat_model = "meta-llama/llama-guard-4-12b"  # Default chat model
        self.analysis_model = "meta-llama/llama-guard-4-12b"  # Default analysis model
        self.translation_model = "meta-llama/llama-guard-4-12b"  # Default translation model
        
        # Initialize client if possible
        if GROQ_AVAILABLE and self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
                # Test the API with a simple request
                self._test_api_connection()
            except Exception as e:
                print(f"Failed to initialize Groq client: {str(e)}")
                self.client = None
        else:
            logging.error("Groq package not available or API key not set. Using fallback responses.")
            self.client = None
    
    def _test_api_connection(self):
        """Test the API connection with a minimal request"""
        self.groq_available = False
        try:
            # Try a simple API call to check if the key is valid
            response = self.client.chat.completions.create(
                model=self.chat_model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Hello"}
                ],
                max_tokens=5
            )
            self.groq_available = True
            logging.info("Groq API connection successful")
        except Exception as e:
            error_message = str(e)
            if "401" in error_message and "Invalid API Key" in error_message:
                logging.error(f"Groq API key validation failed: The API key appears to be invalid or expired. Please check your API key in the .env file.")
                # Get API key from environment
                api_key = os.getenv("GROQ_API_KEY", "")
                if api_key:
                    logging.error(f"API Key format: {api_key[:8]}...{api_key[-4:] if len(api_key) > 12 else ''}")
                else:
                    logging.error("API Key not found in environment variables")
            elif "404" in error_message:
                logging.error(f"Groq API endpoint not found. The API endpoint might have changed.")
            elif "429" in error_message:
                logging.error(f"Groq API rate limit exceeded. Please try again later.")
            else:
                logging.error(f"Groq API connection failed: {error_message}.")
                
            logging.info("Using fallback responses for all AI operations.")
            self.groq_available = False
    
    def chat_completion(
        self, 
        messages: List[Dict[str, str]], 
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        stream: bool = False
    ):
        """
        Generate a chat completion using Groq API with fallback responses
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            model: Model to use (defaults to self.chat_model)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            stream: Whether to stream the response
            
        Returns:
            Chat completion response or fallback response if API fails
        """
        # Define fallback responses for different topics
        fallback_responses = {
            "services": [
                "SynapseIQ offers AI solutions tailored for African businesses, including NLP for local languages, predictive analytics, and custom chatbots.",
                "Our AI services include natural language processing for African languages, predictive analytics for business intelligence, and custom chatbot development.",
                "We specialize in AI solutions designed specifically for the African market, including language processing, data analytics, and intelligent automation."
            ],
            "pricing": [
                "Our pricing is customized based on your business needs. We offer flexible packages starting from $500 for small businesses.",
                "SynapseIQ provides tailored pricing models based on your specific requirements. Our starter packages begin at $500 for small businesses.",
                "We believe in making AI accessible to African businesses of all sizes. Our pricing is flexible and starts from $500 for small businesses."
            ],
            "contact": [
                "I'd be happy to connect you with our team for a demo. Please provide your email or contact us via WhatsApp at +265996873573.",
                "You can reach our team via WhatsApp at +265996873573 or email us at info@synapseiq.com to schedule a demo.",
                "For a personalized demonstration of our AI solutions, please contact us via WhatsApp at +265996873573 or through our website contact form."
            ],
            "default": [
                "Thank you for your interest in SynapseIQ. Our AI team specializes in creating custom solutions for African businesses. How can I assist you today?",
                "Welcome to SynapseIQ! We're focused on bringing cutting-edge AI solutions to African businesses. What specific information are you looking for?",
                "SynapseIQ is dedicated to empowering African businesses with AI technology. How can we help your business today?"
            ]
        }
        
        # If streaming is requested but API is not available, we can't provide a stream
        if stream and not self.api_available:
            print("Streaming requested but API not available. Returning None.")
            return None
        
        # Try to use the API if it's available
        if self.client and self.api_available:
            try:
                print(f"Attempting Groq API call with model: {model or self.chat_model}")
                
                completion = self.client.chat.completions.create(
                    model=model or self.chat_model,
                    messages=messages,
                    temperature=temperature,
                    max_completion_tokens=max_tokens,
                    top_p=1,
                    stream=stream,
                    stop=None,
                )
                
                print("Groq API call successful!")
                
                if stream:
                    return completion  # Return the stream object
                else:
                    return completion.choices[0].message.content
                    
            except Exception as e:
                print(f"Error in chat completion: {str(e)}")
                # Continue to fallback responses
        else:
            print("Groq API not available. Using fallback responses.")
        
        # Extract the last user message to determine the appropriate fallback response
        last_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                last_message = msg.get("content", "").lower()
                break
        
        # Select an appropriate fallback response category
        response_category = "default"
        if any(keyword in last_message for keyword in ["services", "offer", "provide", "what do you do"]):
            response_category = "services"
        elif any(keyword in last_message for keyword in ["pricing", "cost", "price", "package", "how much"]):
            response_category = "pricing"
        elif any(keyword in last_message for keyword in ["contact", "demo", "reach", "call", "email", "phone"]):
            response_category = "contact"
        
        # Return a random response from the selected category
        import random
        return random.choice(fallback_responses[response_category])
    
    def analyze_text(
        self,
        text: str,
        analysis_type: str = "sentiment",
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze text using Groq AI with fallback responses
        
        Args:
            text: Text to analyze
            analysis_type: Type of analysis (sentiment, entities, keywords)
            model: Model to use (defaults to self.analysis_model)
            
        Returns:
            Dictionary with analysis results
        """
        # Create prompt based on analysis type
        if analysis_type == "sentiment":
            prompt = f"Analyze the sentiment of the following text. Return a JSON with 'sentiment' (positive, negative, or neutral) and 'confidence' (0-1). Text: {text}"
            fallback = {"sentiment": "neutral", "confidence": 0.7}
        elif analysis_type == "entities":
            prompt = f"Extract named entities from the following text. Return a JSON with 'entities' as a list of objects with 'text', 'type', and 'relevance'. Text: {text}"
            fallback = {"entities": []}
        elif analysis_type == "keywords":
            prompt = f"Extract keywords from the following text. Return a JSON with 'keywords' as a list of objects with 'text' and 'relevance'. Text: {text}"
            fallback = {"keywords": []}
        else:
            prompt = f"Analyze the following text and provide insights. Return a JSON with your analysis. Text: {text}"
            fallback = {"analysis": "Analysis not available"}
        
        # Try to use the API if it's available
        if self.client and self.api_available:
            try:
                result = self.client.chat.completions.create(
                    model=model or self.analysis_model,
                    messages=[
                        {"role": "system", "content": "You are an AI assistant that analyzes text and returns JSON results."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.1,  # Low temperature for more deterministic results
                    max_completion_tokens=500,
                    stream=False
                )
                
                # Parse JSON response
                import json
                response_text = result.choices[0].message.content
                
                # Extract JSON part if there's any text around it
                import re
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    response_text = json_match.group(0)
                    
                try:
                    return json.loads(response_text)
                except json.JSONDecodeError:
                    return {"error": "Failed to parse JSON response", "raw_response": response_text}
                    
            except Exception as e:
                print(f"Error in text analysis: {str(e)}")
                # Continue to fallback response
        else:
            print("Groq API not available for text analysis. Using fallback response.")
            
        # Generate a simple fallback response based on the text
        # For sentiment analysis, try to determine sentiment based on keywords
        if analysis_type == "sentiment":
            # Very basic sentiment analysis based on keywords
            positive_words = ["good", "great", "excellent", "amazing", "wonderful", "happy", "positive"]
            negative_words = ["bad", "terrible", "awful", "horrible", "sad", "negative", "poor"]
            
            text_lower = text.lower()
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            if positive_count > negative_count:
                return {"sentiment": "positive", "confidence": 0.6, "note": "Fallback analysis"}
            elif negative_count > positive_count:
                return {"sentiment": "negative", "confidence": 0.6, "note": "Fallback analysis"}
            
        # Return the fallback response with a note
        fallback["note"] = "Fallback analysis due to API unavailability"
        return fallback
    
    def translate_text(
        self,
        text: str,
        source_language: str,
        target_language: str,
        model: Optional[str] = None
    ) -> str:
        """
        Translate text using Groq AI with fallback mechanisms
        
        Args:
            text: Text to translate
            source_language: Source language code (e.g., 'en', 'fr')
            target_language: Target language code
            model: Model to use (defaults to self.translation_model)
            
        Returns:
            Translated text or fallback message
        """
        # Create a prompt for translation
        prompt = f"Translate the following text from {source_language} to {target_language}: \n\n{text}"
        
        # Use chat completion for translation if API is available
        if self.client and self.api_available:
            try:
                messages = [
                    {"role": "system", "content": "You are a helpful translation assistant that translates text accurately."},
                    {"role": "user", "content": prompt}
                ]
                
                response = self.client.chat.completions.create(
                    model=model or self.translation_model,
                    messages=messages,
                    temperature=0.3,  # Lower temperature for more accurate translations
                    max_completion_tokens=1024,
                    stream=False
                )
                
                return response.choices[0].message.content
                
            except Exception as e:
                print(f"Error in translation: {str(e)}")
                # Continue to fallback response
        else:
            print("Groq API not available for translation. Using fallback response.")
        
        # Fallback response for common African languages
        common_translations = {
            # English to Swahili common phrases
            ("en", "sw"): {
                "hello": "jambo",
                "thank you": "asante",
                "welcome": "karibu",
                "how are you": "habari gani",
                "good": "nzuri",
                "yes": "ndio",
                "no": "hapana"
            },
            # Swahili to English common phrases
            ("sw", "en"): {
                "jambo": "hello",
                "asante": "thank you",
                "karibu": "welcome",
                "habari gani": "how are you",
                "nzuri": "good",
                "ndio": "yes",
                "hapana": "no"
            },
            # French to English common phrases
            ("fr", "en"): {
                "bonjour": "hello",
                "merci": "thank you",
                "bienvenue": "welcome",
                "comment allez-vous": "how are you",
                "bon": "good",
                "oui": "yes",
                "non": "no"
            }
        }
        
        # Check if we have a simple translation for the text
        lang_pair = (source_language.lower(), target_language.lower())
        if lang_pair in common_translations and text.lower() in common_translations[lang_pair]:
            return common_translations[lang_pair][text.lower()]
        
        # Return a fallback message
        return f"[Translation from {source_language} to {target_language} is not available. Please try again later.]"

# Create a singleton instance for easy import
groq_client = GroqAIClient()

# Example usage
if __name__ == "__main__":
    # This will only run if the file is executed directly
    client = GroqAIClient()
    
    # Example chat
    response = client.chat_completion([
        {"role": "user", "content": "How can AI help businesses in Africa?"}
    ])
    print(f"Chat response: {response}")
    
    # Example sentiment analysis
    sentiment = client.analyze_text(
        "SynapseIQ has transformed our business operations with their AI solutions.",
        analysis_type="sentiment"
    )
    print(f"Sentiment analysis: {sentiment}")
