import json
import requests

from pydantic import BaseModel
from src.constants_utils.const import UtilsConfig, SystemMessages
from src.constants_utils.logger import logger


class Pipeline:
    class Valves(BaseModel):
        SERVER_URL: str = UtilsConfig.SERVER_URL

    def __init__(self):
        self.name = UtilsConfig.MODEL_NAME
        self.valves = self.Valves()

    def pipe(self, user_message, model_id, messages, body):
        try:
            history = json.dumps({"messages": messages})
            response = get_chat_response(self, history)
            return convert_to_md(response)
        except Exception:
            return SystemMessages.ANSWER


def get_chat_response(self, history):
    try:
        response = requests.get(
            self.valves.SERVER_URL + UtilsConfig.RAG_SERVICE_PATH,
            params={"query": history},
        )
        json_response = response.json()
        logger.info(
            "Successfully completed receiving the chat response from chat server."
        )
        return json_response
    except Exception as error:
        error_log = f"Failed to receive response from chat server: {error}"
        logger.error(error_log)
        raise Exception(error_log)


def convert_to_md(response):
    try:
        md_output = []
        md_output = [response.get("answer", SystemMessages.ANSWER) + "\n"]
        links = response.get("links", [])
        images = response.get("images", [])
        if links:
            md_output.append("**Source:**")
            md_output.extend(links)
        if images:
            md_output.extend(images)
        logger.info("Successfully completed convert_to_md")
        return "\n\n".join(md_output)
    except Exception as error:
        error_log = f"Failed when convert to md: {error}"
        logger.error(error_log)
        raise Exception(error_log)
