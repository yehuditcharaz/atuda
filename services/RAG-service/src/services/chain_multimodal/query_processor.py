from langchain_google_vertexai import ChatVertexAI
from utils.config import ModelConfig
from utils.const import PromptConst
from utils.dictionary import dictionary
from utils.helpers import is_hebrew
from utils.logger import logger


def query_processing(conversation_history):
    try:
        query = conversation_history["messages"][-1]["content"]
        if not is_hebrew(query):
            return conversation_history

        prompt = f"{PromptConst.TRANSLATION}\n\nHebrew Question:\n{query}\n\nReference Dictionary (for technical terms only):\n{dictionary}"

        model = ChatVertexAI(
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT,
            temperature=ModelConfig.TRANSLATION_TEMPERATURE,
        )
        result = model.invoke(prompt)

        conversation_history["messages"][-1]["content"] = result.content.strip()
        logger.info("Successfully completed query processing")
        return conversation_history
    except Exception as error:
        error_log = f"Failed when translating the query: {error}"
        logger.error(error_log)
        raise Exception(error_log)
