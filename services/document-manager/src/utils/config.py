import datetime
import os

from dotenv import load_dotenv


load_dotenv()


class APP:
    ERROR = 404
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    ACCESS_URL = os.getenv("ACCESS_URL")


class Errors:
    FEEDBACK_NOT_FOUND = "no feedback found"


class NUMBERS:
    ONE = 1
    ZERO = 0


class Paths:
    DB_FILE = "../app/backend/data/webui.db"
    DIRECTORY = "/app"
    EXCEL_FILE = "./output/feedback_report.xlsx"


class Routes:
    FEEDBACK_ROUTE = "/download/feedback-report"
    GET_IMAGE_ROUTE = "/sign_url/get_image"
    GET_LINK_ROUTE = "/sign_url/get_link"


class SqlQueries:
    FEEDBACK_TABLE = "SELECT * FROM feedback;"
    USERNAME = "SELECT name FROM user WHERE id = ?;"


class RECORDS:
    ASSISTANT_MESSAGE = "assistant_message"
    CHAT = "chat"
    COMMENT = "comment"
    CONTENT = "content"
    DETAILS = "details"
    DETAILS_RATING = "details_rating"
    EMPTY = ""
    HISTORY = "history"
    MESSAGES = "messages"
    MESSAGE_ID = "message_id"
    PARENT_ID = "parentId"
    RATING = "rating"
    REASON = "reason"
    TITLE = "title"
    USER_MESSAGE = "user_message"
    USER_NAME = "user_name"
    V = "V"
    X = "X"


class UtilsConfig:
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")


class SignUrlConfig:
    VERSION = "v4"
    EXPIRATION = datetime.timedelta(minutes=5)
