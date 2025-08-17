import pytest
from fastapi.testclient import TestClient
from src.routes.app import app
from unittest.mock import patch
from .stub import URLs, StatusCodes, Utils


@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client


@pytest.fixture
def mock_requests_get():
    with patch("httpx.AsyncClient.get") as mock:
        mock.return_value.status_code = StatusCodes.HTTP_STATUS_OK
        mock.return_value.content = Utils.FAKE_IMAGE_DATA
        mock.return_value.headers = {"Content-Type": Utils.CONTENT_TYPE_IMAGE_JPEG}
        yield mock


@pytest.fixture
def mock_generate_signed_url_success():
    with patch("src.routes.app.generate_signed_url") as mock:

        def side_effect(url):
            if url == URLs.EXAMPLE_IMAGE_URL:
                return URLs.MOCK_IMAGE_URL
            if url == URLs.MOCK_DOCUMENT_URL:
                return URLs.MOCK_DOCUMENT_URL
            return None

        mock.side_effect = side_effect
        yield mock


@pytest.fixture
def mock_generate_signed_url_failure():
    with patch("src.routes.app.generate_signed_url") as mock:
        mock.side_effect = Exception(Utils.ERROR_GENERATING_SIGNED_URL)
        yield mock
