import pytest
import sys
from unittest.mock import patch, MagicMock

from .stub import (
    Bases64,
    Documents,
    FilenameWithoutPrefix,
    GCPconfigValues,
    Questions,
    Sources,
    URLs,
    Utils,
)


@pytest.fixture()
def patch_chain_module_dependencies(monkeypatch):
    monkeypatch.setitem(
        sys.modules, "services.chain_multimodal.query_processor", MagicMock()
    )
    monkeypatch.setitem(
        sys.modules, "services.chain_multimodal.source_retriever", MagicMock()
    )
    monkeypatch.setitem(
        sys.modules, "services.chain_multimodal.input_formatter", MagicMock()
    )
    monkeypatch.setitem(
        sys.modules, "services.chain_multimodal.link_formatter", MagicMock()
    )
    monkeypatch.setitem(sys.modules, "utils.config", MagicMock())
    monkeypatch.setitem(sys.modules, "utils.const", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain_google_vertexai", MagicMock())
    monkeypatch.setitem(sys.modules, "langchain_core.output_parsers.json", MagicMock())


@pytest.fixture
def mock_is_hebrew(request):
    with patch("services.chain_multimodal.query_processor.is_hebrew") as mock:
        if "test_query_processing_english_question" in request.node.name:
            mock.return_value = False
        elif "test_query_processing_hebrew_question" in request.node.name:
            mock.return_value = True
        yield mock


@pytest.fixture
def mock_translation_model():
    mock_model = MagicMock()
    mock_model.invoke.return_value.content = Questions.ENGLISH
    with patch(
        "services.chain_multimodal.query_processor.ChatVertexAI",
        return_value=mock_model,
    ):
        yield


@pytest.fixture
def mock_get_source():
    with patch(
        "services.chain_multimodal.link_formatter.get_sources",
        return_value={"images": ["img1"], "links": ["link1"]},
    ):
        yield


@pytest.fixture
def mock_get_chunks():
    with patch("services.chain_multimodal.link_formatter.get_chunks"):
        yield


@pytest.fixture
def mock_is_base64_link_formatter():
    with patch("services.chain_multimodal.link_formatter.is_base64"):
        yield


@pytest.fixture
def mock_get_link_preview():
    with patch(
        "services.chain_multimodal.link_formatter.get_link_preview",
        return_value=Utils.LINK_PREVIEW,
    ):
        yield


@pytest.fixture
def mock_get_document_link():
    with patch(
        "services.chain_multimodal.link_formatter.get_document_link",
        return_value=URLs.SIGNED_LINK_URL,
    ):
        yield


@pytest.fixture
def mock_GCPConfig():
    with patch("services.chain_multimodal.link_formatter.GCPConfig") as gcp_mock:
        gcp_mock.SIGN_SERVER_URL = GCPconfigValues.SIGN_SERVER_URL
        gcp_mock.IMAGES_SIGN_URL = GCPconfigValues.IMAGES_SIGN_URL
        gcp_mock.REQUEST_PARAM = GCPconfigValues.REQUEST_PARAM
        yield


@pytest.fixture
def mock_get_chunk_metadata():
    with patch(
        "services.chain_multimodal.link_formatter.get_chunk_metadata",
        return_value=Documents.CHUNK_METADATA,
    ):
        yield


@pytest.fixture
def mock_get_filename_without_prefix():
    with patch(
        "services.chain_multimodal.link_formatter.get_filename_without_prefix",
        return_value=FilenameWithoutPrefix.FILENAME,
    ):
        yield


@pytest.fixture
def mock_split_image_text_types():
    with patch(
        "services.chain_multimodal.source_retriever.split_image_text_types",
        return_value=Sources.SOURCE_DOCS,
    ):
        yield


@pytest.fixture
def mock_is_base64():
    with patch(
        "services.chain_multimodal.source_retriever.is_base64",
        side_effect=lambda x: x == Bases64.SENTENCE,
    ):
        yield


@pytest.fixture
def mock_resize_base64_image():
    with patch(
        "services.chain_multimodal.source_retriever.resize_base64_image",
        return_value=Bases64.RESIZED,
    ):
        yield
