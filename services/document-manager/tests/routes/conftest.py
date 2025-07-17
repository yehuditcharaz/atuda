import pytest
from unittest.mock import patch
from routes.app import app
from .stub import URLs, StatusCodes, Utils


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


@pytest.fixture
def mock_requests_get():
    with patch("requests.get") as mock:
        mock.return_value.status_code = StatusCodes.HTTP_STATUS_OK
        mock.return_value.content = Utils.FAKE_IMAGE_DATA
        mock.return_value.headers = {"Content-Type": Utils.CONTENT_TYPE_IMAGE_JPEG}
        yield mock


@pytest.fixture
def mock_generate_signed_url_success():
    with patch("routes.app.generate_signed_url") as mock:
        mock.side_effect = lambda url: (
            URLs.MOCK_IMAGE_URL
            if url == URLs.EXAMPLE_IMAGE_URL
            else URLs.MOCK_DOCUMENT_URL
            if url == URLs.MOCK_DOCUMENT_URL
            else None
        )
        yield mock


@pytest.fixture
def mock_generate_signed_url_failure():
    with patch("routes.app.generate_signed_url") as mock:
        mock.side_effect = Exception(Utils.ERROR_GENERATING_SIGNED_URL)
        yield mock
