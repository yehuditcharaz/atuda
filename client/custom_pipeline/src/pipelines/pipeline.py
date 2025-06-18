import json
import requests

from pydantic import BaseModel
from constants_utils.const import Utils, SystemMessages


class Pipeline:
    class Valves(BaseModel):
        SERVER_URL: str = Utils.SERVER_URL

    def __init__(self):
        self.name = Utils.MODEL_NAME
        self.valves = self.Valves()

    def pipe(self, user_message, model_id, messages, body):
        try:
            history = json.dumps({"messages": messages})
            response = get_chat_response(self, history)
            if response["status_code"] == 200:
                return convert_to_md(response)
            else:
                return SystemMessages.SERVER_FAILURE_MESSAGE
        except Exception:
            return SystemMessages.ERROR_MESSAGE


def get_chat_response(self, history):
    try:
        response = requests.get(
            self.valves.SERVER_URL + Utils.RAG_SERVICE_PATH,
            params={"query": history},
        )
        json_response = response.json()
        return json_response
    except Exception:
        return SystemMessages.ERROR_MESSAGE


def convert_to_md(response):
    try:
        md_output = []
        md_output = [response.get("answer", SystemMessages.ERROR_MESSAGE) + "\n"]
        links = response.get("links", [])
        images = response.get("images", [])
        if links:
            md_output.append("**Source:**")
            md_output.extend(links)
        if images:
            md_output.append("**Related Images:**")
            md_output.extend(images)
        return "\n\n".join(md_output)
    except Exception:
        return SystemMessages.ERROR_MESSAGE
