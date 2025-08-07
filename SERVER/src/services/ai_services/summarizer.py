import time
from google import genai

from utils.config import Keys, ModelConfig
from utils.const import Prompt
from utils.logger import logger

genai_client = genai.Client(api_key=Keys.GOOGLE_API_KEY,)

def summarize_text(file_type, text: str) -> str:
    prompt="?"
    if(file_type=="resumes"):
        prompt = f"{Prompt.Resume.INSTRUCTION}\n\nקורות חיים:\n{text}"

    if(file_type=="jobs"):
       prompt = f"{Prompt.Job.INSTRUCTION}\n\nמשרה:\n{text}"

    time.sleep(1)

    response = generate_text(prompt)
    return response


def generate_text(prompt):
    try:
        response = genai_client.models.generate_content(
                model = ModelConfig.SUMMARIZING_MODEL,
                contents = prompt
            )
        return response.text
    except Exception as e:
        logger.error(f"Error generating text: {e}")
        return None
