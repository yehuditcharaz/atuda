class UtilsTest:
    MODEL_NAME = "test-model"
    SERVER_URL = "http://my-server"
    RAG_SERVICE_PATH = "/chat"
    USER_MESSAGE = "מהם תפקידי ה-GCU?"
    HISTORY = [{"role": "user", "content": "hi"}]
    EMPTY_MESSAGES = []
    EMPTY_BODY = {}


class SystemMessagesTest:
    ERROR_MESSAGE = "Test error"
    SERVER_FAILURE_MESSAGE = "Test failure"
    ANSWER = "Test default answer"


class Responses:
    SUCCESS_RESPONSE = {
        "answer": "Answer",
        "links": ["https://link.com"],
        "images": ["https://image.com/image.png"],
        "status_code": 200,
    }

    FAILURE_RESPONSE = {"status_code": 500}
