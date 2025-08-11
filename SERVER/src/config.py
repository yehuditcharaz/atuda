from dotenv import load_dotenv
import os
load_dotenv()

class Config:
    # SQLALCHEMY_DATABASE_URI = f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('DB_SERVICE_NAME')}:{os.getenv('DB_PORT')}/{os.getenv('POSTGRES_DB')}"
    SQLALCHEMY_DATABASE_URI = f"{os.getenv('DATABASE_URL')}"
    # SQLALCHEMY_DATABASE_URI = "postgresql://root:1234@pgvector-service:5432/dbname"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class EmailConfig:
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    
class AIConfig:
    PROJECT_ID = "sublime-vine-445509-s8"
    LOCATION = "us-central1"
    MODEL_NAME = "gemini-1.5-flash-002"
    GEMINI_OUTPUT_TOKEN_LIMIT = 8192
    YOUR_API_KEY = "AIzaSyDjvu2wsUkuk8LZX7KUon1FB-5c9UsvsY8"
