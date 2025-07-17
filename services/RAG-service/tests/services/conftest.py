import pytest
import sys
from unittest.mock import patch, MagicMock

from .stub import (
    GCPValues,
    ImageChunks,
    ModelValues,
    Paths,
    PromptValues,
    Summarizes,
    TextChunks,
    Utils,
    UtilsKeys,
    UtilsValues,
)


@pytest.fixture
def patch_services_retriever():
    fake_retriever = MagicMock()
    fake_retriever.ensemble_retriever = MagicMock()
    fake_retriever.ensemble_retriever.retrievers[
        0
    ].docstore.mget.return_value = Utils.DOC_IDS
    fake_retriever.docstore.mset = MagicMock()
    fake_retriever.vectorstore.add_documents = MagicMock()
    sys.modules["services.retriever"] = fake_retriever
    yield fake_retriever


@pytest.fixture
def mock_get_chunks():
    with patch("services.data_preparation.get_chunks"):
        yield


@pytest.fixture
def mock_set_summaries():
    with patch("services.data_preparation.set_summaries"):
        yield


@pytest.fixture
def mock_store_data():
    with patch("services.data_preparation.store_data"):
        yield


@pytest.fixture
def mock_is_image_chunk():
    with patch("services.data_storage.is_image_chunk") as mock:
        mock.side_effect = lambda chunk: chunk.is_image
        yield mock


@pytest.fixture
def mock_utils_config():
    with patch("services.data_storage.UtilsConfig") as mock:
        mock.ID_KEY = UtilsKeys.ID_KEY
        mock.URL = UtilsKeys.URL
        mock.BATCH_SIZE = UtilsKeys.BATCH_SIZE
        yield mock


@pytest.fixture()
def patch_extraction_dependencies(monkeypatch):
    monkeypatch.setitem(sys.modules, "utils.logger", MagicMock())
    monkeypatch.setitem(sys.modules, "utils.helpers", MagicMock())
    monkeypatch.setitem(sys.modules, "models.text_chunk", MagicMock())
    monkeypatch.setitem(sys.modules, "models.image_chunk", MagicMock())
    monkeypatch.setitem(sys.modules, "unstructured.partition.pdf", MagicMock())
    monkeypatch.setitem(sys.modules, "utils.config", MagicMock())


@pytest.fixture
def mock_get_files_pathes(request):
    with patch("services.extraction.get_files_pathes") as mock:
        if "test_get_chunks_exception" in request.node.name:
            mock.side_effect = Exception("failure")
        else:
            mock.side_effect = lambda directory: (
                Paths.DOCUMENT_PATHS
                if directory == UtilsValues.DOCUMENTS_FOLDER_PATH
                else Paths.IMAGE_PATHS
            )
        yield mock


@pytest.fixture
def mock_partition_pdf():
    with patch("services.extraction.partition_pdf") as mock:
        mock.return_value = TextChunks.LIST
        yield mock


@pytest.fixture
def mock_encode_image():
    with patch(
        "services.extraction.encode_image", return_value=ImageChunks.ENCODED_IMAGE
    ):
        yield


@pytest.fixture
def mock_config_extraction(monkeypatch):
    from types import SimpleNamespace

    monkeypatch.setattr(
        "services.extraction.UtilsConfig",
        SimpleNamespace(
            DOCUMENTS_FOLDER_PATH=UtilsValues.DOCUMENTS_FOLDER_PATH,
            IMAGES_FOLDER_PATH=UtilsValues.IMAGES_FOLDER_PATH,
        ),
    )
    monkeypatch.setattr(
        "services.extraction.GCPConfig",
        SimpleNamespace(
            GCS_BUCKET=GCPValues.GCS_BUCKET,
        ),
    )


@pytest.fixture
def mock_chunks(monkeypatch):
    monkeypatch.setattr("services.extraction.TextChunk", TextChunks.MockTextChunk)
    monkeypatch.setattr("services.extraction.ImageChunk", ImageChunks.MockImageChunk)


@pytest.fixture
def mock_logger():
    with patch("services.extraction.logger") as mock:
        yield mock


@pytest.fixture()
def patch_retriever_dependencies(monkeypatch):
    monkeypatch.setitem(sys.modules, "google.cloud.storage", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain.chains", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain.retrievers", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain.retrievers.multi_vector", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain_google_vertexai", MagicMock())
    monkeypatch.setitem(
        sys.modules,
        "langchain_google_vertexai.vectorstores.document_storage",
        MagicMock(),
    )
    monkeypatch.setitem(sys.modules, "google.cloud.aiplatform", MagicMock())
    monkeypatch.setitem(sys.modules, "google.oauth2.service_account", MagicMock())
    monkeypatch.setitem(sys.modules, "json", MagicMock())
    monkeypatch.setitem(sys.modules, "utils.config", MagicMock())


@pytest.fixture
def mock_config_retriever(monkeypatch):
    from types import SimpleNamespace

    monkeypatch.setattr(
        "services.retriever.GCPConfig",
        SimpleNamespace(
            GOOGLE_CREDENTIALS=GCPValues.GOOGLE_CREDENTIALS,
            PROJECT_ID=GCPValues.PROJECT_ID,
            LOCATION=GCPValues.LOCATION,
            GCS_BUCKET=GCPValues.GCS_BUCKET,
            GCS_BUCKET_URI=GCPValues.GCS_BUCKET_URI,
            INDEX_ID=GCPValues.INDEX_ID,
            INDEX_ENDPOINT_ID=GCPValues.INDEX_ENDPOINT_ID,
            CHUNKS_FOLDER=GCPValues.CHUNKS_FOLDER,
        ),
    )
    monkeypatch.setattr(
        "services.retriever.ModelConfig",
        SimpleNamespace(
            TEMPERATURE=ModelValues.TEMPERATURE,
            MODEL_NAME=ModelValues.MODEL_NAME,
            TOKEN_LIMIT=ModelValues.TOKEN_LIMIT,
            EMBEDDING_MODEL_NAME=ModelValues.EMBEDDING_MODEL_NAME,
            SEARCH_KWARGS=ModelValues.SEARCH_KWARGS,
        ),
    )
    monkeypatch.setattr(
        "services.retriever.UtilsConfig",
        SimpleNamespace(
            ID_KEY=UtilsValues.ID_KEY,
        ),
    )


@pytest.fixture
def mock_initialize_ensemble_retriever():
    with patch("services.retriever.initialize_ensemble_retriever"):
        yield


@pytest.fixture
def mock_initialize_history_retriever():
    with patch("services.retriever.initialize_history_retriever"):
        yield


@pytest.fixture
def mock_dependencies():
    with patch(
        "services.retriever.service_account.Credentials.from_service_account_info"
    ):
        with patch("services.retriever.aiplatform.init"):
            yield


@pytest.fixture()
def patch_summarization_dependencies(monkeypatch):
    monkeypatch.setitem(sys.modules, "langchain.prompts", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain_core.messages", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain_core.output_parsers", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain_core.runnables", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain_google_vertexai", MagicMock())
    monkeypatch.setitem(sys.modules, "utils.config", MagicMock())
    monkeypatch.setitem(sys.modules, "utils.const", MagicMock())
    monkeypatch.setitem(sys.modules, "utils.helpers", MagicMock())


@pytest.fixture
def mock_config_summarization(monkeypatch):
    from types import SimpleNamespace

    monkeypatch.setattr(
        "services.summarization.ModelConfig",
        SimpleNamespace(
            MODEL_NAME=ModelValues.MODEL_NAME, TOKEN_LIMIT=ModelValues.TOKEN_LIMIT
        ),
    )
    monkeypatch.setattr(
        "services.summarization.UtilsConfig",
        SimpleNamespace(
            MAX_TRIES=UtilsValues.MAX_TRIES,
        ),
    )
    monkeypatch.setattr(
        "services.summarization.PromptConst",
        SimpleNamespace(
            TEXT_SUMMARIZATION=PromptValues.TEXT_SUMMARIZATION,
            IMAGE_SUMMARIZATION=PromptValues.IMAGE_SUMMARIZATION,
        ),
    )


@pytest.fixture
def mock_helpers(monkeypatch):
    monkeypatch.setattr("services.summarization.is_image_chunk", lambda c: c.is_image)


@pytest.fixture
def mock_models():
    with (
        patch("services.summarization.VertexAI") as mock_vertexai,
        patch("services.summarization.ChatVertexAI") as mock_chat,
    ):
        mock_instance_chat = mock_chat.return_value
        mock_instance_chat.invoke.return_value.content = "image summary result"

        mock_instance_vertex = mock_vertexai.return_value

        mock_chain = MagicMock()
        mock_chain.invoke.return_value = "document summary result"

        mock_instance_vertex.with_fallbacks.return_value = mock_chain
        yield mock_vertexai, mock_chat


@pytest.fixture
def patch_generate_document_summary_dependencies():
    with (
        patch(
            "services.summarization.PromptTemplate.from_template"
        ) as mock_prompt_template,
        patch("services.summarization.VertexAI") as mock_vertex_ai,
        patch("services.summarization.StrOutputParser") as mock_parser,
    ):
        final_chain = MagicMock()
        final_chain.invoke.return_value = Summarizes.AI_RESPONSE

        mock_prompt = MagicMock()
        mock_prompt.__or__.return_value = final_chain
        mock_prompt_template.return_value = mock_prompt

        mock_model = MagicMock()
        mock_model.with_fallbacks.return_value = mock_model
        mock_model.__or__.return_value = final_chain
        mock_vertex_ai.return_value = mock_model

        mock_parser_instance = MagicMock()
        mock_parser_instance.__or__.return_value = final_chain
        mock_parser.return_value = mock_parser_instance

        yield


@pytest.fixture
def mock_generate_image_summary():
    with patch(
        "services.summarization.generate_image_summary",
        side_effect=[Summarizes.IMAGE, ""],
    ):
        yield


@pytest.fixture
def mock_generate_document_summary():
    with patch(
        "services.summarization.generate_document_summary",
        side_effect=[Summarizes.DOC, Summarizes.ERROR_MESSAGE],
    ):
        yield


@pytest.fixture
def mock_is_valid_summary(request):
    with patch("services.summarization.is_valid_summary") as mock:
        if "test_set_summaries_valid_summary" in request.node.name:
            mock.return_value = True
        elif "test_set_summaries_fallback_to_original" in request.node.name:
            mock.return_value = False
        yield mock


@pytest.fixture
def mock_StrOutputParser():
    with patch("services.summarization.StrOutputParser", return_value=lambda x: x):
        yield
