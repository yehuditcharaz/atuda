from langchain_core.documents import Document
from langchain_core.messages import AIMessage


class Utils:
    BUCKET_NAME = "bucket_name"
    DOC_IDS = ["1", "2", None, "1"]
    FILE_LIST = []
    FOLDER_NAME = "folder name"
    LOCAL_DIRECTORY = "local dir"


class UtilsKeys:
    BATCH_SIZE = 2
    ID_KEY = "doc_id"
    URL = "url"


class ChunkStub:
    def __init__(self, id, content, summary, metadata=None, url=None, is_image=False):
        self.id = id
        self.content = content
        self.summary = summary
        self.metadata = metadata or {}
        self.url = url
        self.is_image = is_image


class MockChunks:
    CHUNK1 = ChunkStub(
        id="1",
        content="text1",
        summary="summary1",
        metadata={"page": 1},
        is_image=False,
    )
    CHUNK2 = ChunkStub(
        id="2",
        content="text2",
        summary="summary2",
        url="http://image.com/img.jpg",
        is_image=True,
    )
    LIST = [CHUNK1, CHUNK2]


class Documents:
    DOC1 = Document(page_content="text1", metadata={"page": 1, "doc_id": "1"})
    DOC2 = Document(
        page_content="text2",
        metadata={"doc_id": "2", "url": "http://image.com/img.jpg"},
    )
    SUMMARY_DOC1 = Document(
        page_content="summary1", metadata={"page": 1, "doc_id": "1"}
    )
    SUMMARY_DOC2 = Document(
        page_content="summary2",
        metadata={"doc_id": "2", "url": "http://image.com/img.jpg"},
    )


class Paths:
    DOCUMENT_PATHS = ["/docs/doc1.pdf", "/docs/doc2.pdf"]
    IMAGE_PATHS = ["/images/img1.png", "/images/img2.jpg"]


class UtilsValues:
    DOCUMENTS_FOLDER_PATH = "/docs"
    IMAGES_FOLDER_PATH = "/images"
    ID_KEY = "doc_id"
    MAX_TRIES = 1


class FakeMetadata:
    def __init__(self, meta):
        self.meta = meta

    def to_dict(self):
        return self.meta


class FakeDocumentChunk:
    def __init__(self, id, text, metadata):
        self.id = id
        self.text = text
        self.metadata = FakeMetadata(metadata)


class TextChunks:
    LIST = [
        FakeDocumentChunk("1", "text1", {"p": 1}),
        FakeDocumentChunk("2", "text2", {"p": 2}),
    ]

    class MockTextChunk:
        def __init__(self, id, text, metadata):
            self.id = id
            self.text = text
            self.metadata = metadata


class ImageChunks:
    ENCODED_IMAGE = "base64img=="

    class MockImageChunk:
        def __init__(self, id, image, url):
            self.id = id
            self.image = image
            self.url = url


class GCPValues:
    GOOGLE_CREDENTIALS = '{"type": "service_account"}'
    PROJECT_ID = "test-project"
    LOCATION = "us-central1"
    GCS_BUCKET = "test-bucket"
    GCS_BUCKET_URI = "gs://test-bucket"
    INDEX_ID = "index-id"
    INDEX_ENDPOINT_ID = "endpoint-id"
    CHUNKS_FOLDER = "chunks"


class ModelValues:
    TEMPERATURE = 0.3
    MODEL_NAME = "chat-model"
    TOKEN_LIMIT = 512
    EMBEDDING_MODEL_NAME = "embed-model"
    SEARCH_KWARGS = {"k": 3}


class PromptValues:
    TEXT_SUMMARIZATION = "Summarize the following document: {element}"
    IMAGE_SUMMARIZATION = "Describe this image."


class SummarizationChunks:
    class MockChunk:
        def __init__(self, content, is_image):
            self.content = content
            self.summary = None
            self.is_image = is_image

        def set_summary(self, summary):
            self.summary = summary

    IMAGE = MockChunk("base64string", True)
    TEXT = MockChunk("this is document content", False)


class Summarizes:
    DOC = "doc summary"
    AI_RESPONSE = AIMessage(content=DOC)
    ERROR_MESSAGE = "Error processing document"
    IMAGE = "image summary"
