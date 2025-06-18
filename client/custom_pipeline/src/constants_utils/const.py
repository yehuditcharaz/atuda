import os
from dotenv import load_dotenv

load_dotenv()


class Utils:
    MODEL_NAME = os.getenv("MODEL_NAME")
    SERVER_URL = os.getenv("SERVER_URL")
    RAG_SERVICE_PATH = "/chat"


class SystemMessages:
    ERROR_MESSAGE = "Something went wrong while generating the response, try again."
    SERVER_FAILURE_MESSAGE = "Something went wrong, please try again."
