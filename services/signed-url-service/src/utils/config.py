import os
from dotenv import load_dotenv


load_dotenv()


class UtilsConfig:
    HOST = os.getenv('HOST')
    PORT = os.getenv('PORT')
    GOOGLE_CREDENTIALS = os.getenv('GOOGLE_CREDENTIALS')
