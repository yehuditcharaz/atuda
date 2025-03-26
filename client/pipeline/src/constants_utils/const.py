import os
from datetime import time
from dotenv import load_dotenv

load_dotenv()


class UtilsConfig:
    MODEL_NAME = os.getenv("MODEL_NAME")
    SERVER_URL = os.getenv("SERVER_URL")
    RAG_SERVICE_PATH = "/chat"


class SystemMessages:
    ANSWER = "Something went wrong while generating the response, try again."


class LogsConfig:
    LOGS_PATH = os.getenv("LOGS_PATH")
    FILE_NAME = "pipe.log"
    WHEN = "midnight"
    AT_TIME = time(7, 0)
    INTERVAL = 1
    BACKUPCOUNT = 7
    ENCODING = "utf-8"
    FORMAT = 'time="%(asctime)s" level="%(levelname)s" source="%(module)s.%(funcName)s:%(lineno)d" thread=%(thread)d message="%(message)s"'
