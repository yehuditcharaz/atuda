import os
from datetime import time
from dotenv import load_dotenv
from utils.const import SchemaDescription


load_dotenv()


class GCPConfig:
    PROJECT_ID = os.getenv("PROJECT_ID")
    LOCATION = os.getenv("LOCATION")
    GCS_BUCKET = os.getenv("GCS_BUCKET")
    GCS_BUCKET_URI = "gs://" + (os.getenv("GCS_BUCKET"))
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    INDEX_ID = os.getenv("INDEX_ID")
    INDEX_ENDPOINT_ID = os.getenv("INDEX_ENDPOINT_ID")
    CHUNKS_FOLDER = "chunks"
    GOOGLE_CREDENTIALS = os.getenv("GOOGLE_CREDENTIALS")
    CORPUS_FOLDER = "corpus"
    SIGN_SERVER_URL = os.getenv("SIGN_SERVER_URL")
    LINKS_SIGN_URL = "get_link"
    IMAGES_SIGN_URL = "get_image"
    REQUEST_PARAM = "?url="


class ModelConfig:
    MODEL_NAME = "gemini-2.0-flash-001"
    TOP_P = 0.1
    GEMINI_OUTPUT_TOKEN_LIMIT = 8192
    EMBEDDING_MODEL_NAME = "text-embedding-004"
    EMBEDDING_TOKEN_LIMIT = 4096
    TEMPERATURE = 0
    TOKEN_LIMIT = min(GEMINI_OUTPUT_TOKEN_LIMIT, EMBEDDING_TOKEN_LIMIT)
    TRANSLATION_TEMPERATURE = 0.2
    RESPONSE_SCHEMA = {
        "type": "object",
        "properties": {
            "markdown_answer_with_reasoning": {
                "type": "string",
                "description": SchemaDescription.ANSWER,
            },
            "doc_ids": {
                "type": "array",
                "items": {"type": "string"},
                "description": SchemaDescription.DOC_IDS,
            },
        },
        "required": ["markdown_answer_with_reasoning", "doc_ids"],
    }
    SEARCH_KWARGS = {"k": 24}


class UtilsConfig:
    DOCUMENTS_FOLDER_PATH = os.getenv("DOCUMENTS_FOLDER_PATH")
    IMAGES_FOLDER_PATH = os.getenv("IMAGES_FOLDER_PATH")
    BATCH_SIZE = 1000
    ID_KEY = "doc_id"
    MAX_TRIES = 6
    RETRY_AFTER_ATTEMPT = 4
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    ERROR_MESSAGE = "Something went wrong while generating the response, try again"


class LogsConfig:
    LOGS_PATH = os.getenv("LOGS_PATH")
    FILE_NAME = "chat_logs.log"
    WHEN = "midnight"
    AT_TIME = time(7, 0)
    INTERVAL = 1
    BACKUPCOUNT = 7
    ENCODING = "utf-8"
    FORMAT = 'time="%(asctime)s" level="%(levelname)s" source="%(module)s.%(funcName)s:%(lineno)d" thread=%(thread)d message="%(message)s"'


class LimitsConfig:
    MAX_IMAGES_LIMIT = 4
    MAX_LINKS_LIMIT = 5
