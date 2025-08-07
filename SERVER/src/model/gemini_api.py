import google.generativeai as genai
from config import AIConfig

genai.configure(api_key=AIConfig.YOUR_API_KEY)
model = genai.GenerativeModel(AIConfig.MODEL_NAME)

def generate_text(prompt):
    try:
        response = model.generate_content(prompt)
        print(f"Generating text with prompt: {response.text}")
        return response.text
    except Exception as e:
        print(f"Error generating text: {e}")
        return None