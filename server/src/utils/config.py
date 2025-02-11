import os
from dotenv import load_dotenv


load_dotenv()


class GCPConfig:
    PROJECT_ID = os.getenv("PROJECT_ID")
    LOCATION = os.getenv("LOCATION")
    GCS_BUCKET = os.getenv("GCS_BUCKET")
    GCS_BUCKET_URI = f"gs://" + (os.getenv("GCS_BUCKET"))
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    INDEX_ID = os.getenv("INDEX_ID")
    INDEX_ENDPOINT_ID = os.getenv("INDEX_ENDPOINT_ID")
    CHUNKS_FOLDER = "chunks",
    GOOGLE_CREDENTIALS = os.getenv("GOOGLE_CREDENTIALS")
    CORPUS_FOLDER = "corpus"


class ModelConfig:
    MODEL_NAME = "gemini-2.0-flash-exp"
    GEMINI_OUTPUT_TOKEN_LIMIT = 8192
    EMBEDDING_MODEL_NAME = "text-embedding-004"
    EMBEDDING_TOKEN_LIMIT = 4096
    TOKEN_LIMIT = min(GEMINI_OUTPUT_TOKEN_LIMIT, EMBEDDING_TOKEN_LIMIT)
    SEARCH_KWARGS = {"k": 10}


class UtilsConfig:
    DOCUMENTS_FOLDER_PATH = os.getenv("DOCUMENTS_FOLDER_PATH")
    IMAGES_FOLDER_PATH = os.getenv("IMAGES_FOLDER_PATH")
    BATCH_SIZE = 1000
    ID_KEY = "doc_id"
    MAX_TRIES = 6
    HOST = os.getenv('HOST')
