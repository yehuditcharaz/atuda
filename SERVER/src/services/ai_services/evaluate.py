import ast
import time

from services.ai_services.summarizer import generate_text
from utils.const import LoggerMessage, Prompt
from utils.helpers import convert_inner_quotes
from utils.logger import logger


def evaluate_with_gemini(job_description, resume_summary, max_retries=3):
    prompt = Prompt.Evaluate.TEMPLATE.format(
        job_description = job_description,
        resume_summary = resume_summary
    )

    retries = 0
    while retries < max_retries:
        time.sleep(1)

        response_content = generate_text(prompt)
        try:
            response_fixed = convert_inner_quotes(response_content)
            gemini_evaluation = ast.literal_eval(response_fixed)
            return gemini_evaluation
        except (SyntaxError, ValueError):
            retries += 1
            logger.error(LoggerMessage.Error.GEMINI_RESPONSE_EVAL.format(retries=retries, max_retries=max_retries))

    return [0, 0, LoggerMessage.Error.GEMINI_RESPONSE_FAILED_AFTER_RETRIES]
