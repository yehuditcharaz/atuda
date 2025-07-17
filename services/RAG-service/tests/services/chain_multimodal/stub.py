class Types:
    RUNNABLE_SEQUENCE = "langchain_core.runnables.base.RunnableSequence"


class FakeDocuments:
    BASE64 = "aGVsbG8gd29ybGQ="
    DOC_ID = "doc123"
    QUESTION = "What is this?"
    TEXT_CONTENT = "some text"


class Questions:
    ENGLISH = "What is this?"
    HEBREW = "מה זה?"


class Answer:
    ANSWER_KEY = "answer"
    ANSWER_VALUE = "answer"
    DICT_ANSWER = {"doc_ids": ["doc1"], "markdown_answer_with_reasoning": "answer"}
    IMAGES_KEY = "images"
    IMAGES_VALUE = ["img1"]
    LINKS_KEY = "links"
    LINKS_VALUE = ["link1"]
    TEXT_KEY = "texts"


class GCPconfigValues:
    IMAGES_SIGN_URL = "img"
    REQUEST_PARAM = "?url="
    SIGN_SERVER_URL = "https://img.example.com"


class Documents:
    CHUNK_DICT_METADATA = {"filename": "doc.pdf", "page_number": 123}
    CHUNK_METADATA = ["filename", 123]
    IMAGE_FILE_CONTENT = "img"
    IMAGE_METADATA = {"url": "image.jpg"}
    METADATA = [{"doc_id": "1"}, {"doc_id": "2"}]
    PAGE_CONTENT = "xxxx"
    PAGE_NUMBER = 3
    PAGE_NUMBER_PREVIEW = "&page=3"


class URLs:
    SIGNED_IMAGE_URL = "https://img.example.com/img?url=image.jpg"
    SIGNED_LINK_URL = "https://sign.example.com/link?url=link-to-doc"


class Utils:
    LINK_PREVIEW = "filename P. 123"


class FilenamesWithPrefix:
    FILENAME = "try.txt"
    HEBREW_FILENAME = "נסיון.txt"
    FILENAME_WITH_TWO_PREFIX = "try.test.py"
    FILENAME_WITH_ONE_PREFIX = "try.test"
    FILENAME_WITH_SPECIAL_CHAR = "d%D%20.pdf"


class FilenameWithoutPrefix:
    FILENAME = "try"
    HEBREW_FILENAME = "נסיון"
    FILENAME_WITH_SPECIAL_CHAR = "d%D%20"


class Sources:
    SOURCE_DOCS = {"images": [], "texts": ["text1"]}


class Conversations:
    HISTORY = {"messages": [{"content": "Hi"}, {"content": "What is this?"}]}
    QUESTION_KEY = "question"
    CONTEXT_KEY = "context"
    HISTORY_KEY = "history"
    MESSAGES_KEY = "messages"
    QUESTION_VALUE = "What is this?"
    CONTEXT_VALUE = {"images": [], "texts": ["text1"]}


class Bases64:
    RESIZED = "resized_base64_string"
    SENTENCE = "aGVsbG8gd29ybGQ="
    TEXT_CONTENT = "some text"
