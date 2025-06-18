import logging
import pytest
from unittest.mock import mock_open, patch

from .stub import Strings


@pytest.fixture
def mock_open_image():
    mock_image_data = Strings.FAKE_IMAGE_DATA
    m = mock_open(read_data=mock_image_data)
    with patch(Strings.BUILTINS_OPEN, m):
        yield m, mock_image_data


@pytest.fixture
def mock_get_handler():
    with patch("utils.logger.get_handler") as mocked_handler:
        mocked_handler.return_value = logging.StreamHandler()
        yield mocked_handler
