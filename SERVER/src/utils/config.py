import os
from datetime import time

from dotenv import load_dotenv


load_dotenv()


class Keys:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    GOOGLE_API_KEY = "AIzaSyCl9hd8QF6mJxuHqw-RFYqyv2WSQs6qNGw"


class LogsParams:
    AT_TIME = time(7, 0)
    BACKUPCOUNT = 7
    ENCODING = "utf-8"
    FILE_NAME = "chat_logs.log"
    FORMAT = (
        'time="%(asctime)s" level="%(levelname)s" '
        'source="%(module)s.%(funcName)s:%(lineno)d" '
        'thread=%(thread)d message="%(message)s"'
    )
    INTERVAL = 1
    TIME_FORMAT = "%Y-%m-%d %H-%M-%S"
    WHEN = "midnight"


class ModelConfig:
    EMBEDDING_MODEL_PG_VECTOR = "text-embedding-ada-002"
    EMBEDDING_MODEL = "models/embedding-001"
    SUMMARIZING_MODEL = "gemini-2.5-flash-lite"


class Paths:
    LOGS_PATH = os.getenv("LOGS_PATH")


class PostgresConfig:
    POSTGRES_COLLECTION = os.getenv("POSTGRES_COLLECTION")
    POSTGRES_CONNECTION_STRING = (
        f"postgresql+psycopg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@"
        f"db:{os.getenv('DB_PORT')}/{os.getenv('POSTGRES_DB')}"
    )


class AIConfig:
    PROJECT_ID = "sublime-vine-445509-s8"
    LOCATION = "us-central1"
    MODEL_NAME = "gemini-1.5-flash-002"
    GEMINI_OUTPUT_TOKEN_LIMIT = 8192
    YOUR_API_KEY = "AIzaSyDjvu2wsUkuk8LZX7KUon1FB-5c9UsvsY8"


class QdrantConfig:
    HOST = "qdrant"
    PORT = 6333
    RESUME_COLLECTION = "resumes"
    JOB_COLLECTION = "jobs"
    VECTOR_SIZE = 768