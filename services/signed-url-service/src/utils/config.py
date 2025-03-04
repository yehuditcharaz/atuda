import os
from dotenv import load_dotenv


load_dotenv()


class UtilsConfig:
    HOST = os.getenv('HOST')
    PORT = os.getenv('PORT')
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
