class LogsTest:
    LOGGER_NAME = "test_logger"
    DEBUG_MESSAGE = "This is a debug message"
    LEN = 2
    LOGS_PATH = "/mock/path"
    FILE_NAME = "mock_log.log"
    WHEN = "MIDNIGHT"
    AT_TIME = None
    INTERVAL = 86400
    BACKUPCOUNT = 7
    ENCODING = "utf-8"
    FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"


class ImageUtils:
    CHUNK_ID = 1
    CHUNK_CONTENT = "your_image_content"
    CHUNK_URL = "http://example.com/image"
    SIZE_1 = (50, 50)
    SIZE_2 = (80, 80)
    DEFUALT_SIZE = (100, 100)
    FORMAT_PNG = "PNG"
    RED_COLOR = "red"
    COLOR_MODE_RGB = "RGB"


class Strings:
    VALID_BASE64 = "c29tZSBpbnZhbGlkIHN0cmluZw=="
    INVALID_BASE64 = "invalid_base64"
    HEBREW = "שלום"
    NOT_HEBREW = "hello"
    EMPTY = ""
    NUMERIC = "12345"
    INVALID_DECODED_VALUE = "some invalid string"
    ENCODING_UTF8 = "utf-8"
    BYTE_TEST = b"test"
    HEBREW_TEST = "בדיקה"
    TEST_IMAGE = "test_image.jpg"
    NON_EXISTENT_IMAGE = "non_existent_image.jpg"
    BUILTINS_OPEN = "builtins.open"
    CANNOT_READ_FILE = "Cannot read file"
    INVALID_IMAGE_TXT = "invalid_image.txt"
    FAKE_IMAGE_DATA = b"fake_image_data"


class Dictionary:
    EXPECTED_KEYS = [
        "ממסר אביזרים",
        "להתאים",
        "אחורי",
        "להחריף",
        "מדחס אוויר",
        "בערך",
        "מערכת אזהרה קולית",
        "טייס אוטומטי",
        "להמנע",
        "ציר",
    ]

    EXPECTED_VALUES = {
        "ממסר אביזרים": "accessory gearbox",
        "להתאים": "adjust",
        "אחורי": "aft",
    }

    NONE_EXISTENT_KEY = "non_existent_key"
