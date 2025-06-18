import pytest
from unittest.mock import patch, Mock

from pipelines import pipeline
from constants_utils import const
from .stub import (
    UtilsTest,
    SystemMessagesTest,
    Responses,
)


@pytest.fixture(autouse=True)
def patch_constants(monkeypatch):
    monkeypatch.setattr(const, "Utils", UtilsTest)
    monkeypatch.setattr(const, "SystemMessages", SystemMessagesTest)
    monkeypatch.setattr(pipeline, "SystemMessages", SystemMessagesTest)
    monkeypatch.setattr(pipeline, "Utils", UtilsTest)


@pytest.fixture
def mock_pipeline():
    class MockPipeline:
        class valves:
            SERVER_URL = UtilsTest.SERVER_URL

    return MockPipeline()


@pytest.fixture
def mock_requests_success():
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = Responses.SUCCESS_RESPONSE
    return mock_response


@pytest.fixture
def mock_requests_get(mock_requests_success):
    with patch(
        "pipelines.pipeline.requests.get", return_value=mock_requests_success
    ) as mock:
        yield mock


@pytest.fixture
def mock_get_chat_response_success():
    with patch("pipelines.pipeline.get_chat_response") as mock:
        mock.return_value = Responses.SUCCESS_RESPONSE
        yield mock


@pytest.fixture
def mock_get_chat_response_exception():
    with patch(
        "pipelines.pipeline.get_chat_response",
        side_effect=Exception("mocked error"),
    ) as mock:
        yield mock


@pytest.fixture
def mock_get_chat_response_server_failure():
    with patch("pipelines.pipeline.get_chat_response") as mock:
        mock.return_value = Responses.FAILURE_RESPONSE
        yield mock
