import base64
import io
import pytest
from PIL import Image
from unittest.mock import patch

from models.image_chunk import ImageChunk
from utils.helpers import (
    resize_base64_image,
    is_image_chunk,
    encode_image,
    is_hebrew,
    is_base64,
)

from .stub import ImageUtils, Strings


def test_is_image_chunk():
    image_chunk_instance = ImageChunk(
        id=ImageUtils.CHUNK_ID,
        content=ImageUtils.CHUNK_CONTENT,
        url=ImageUtils.CHUNK_URL,
    )

    assert is_image_chunk(image_chunk_instance)
    assert not is_image_chunk(Strings.INVALID_BASE64)
    assert not is_image_chunk(None)


def test_encode_image_success(mock_open_image):
    m, mock_image_data = mock_open_image
    expected_encoded_data = base64.b64encode(mock_image_data).decode(
        Strings.ENCODING_UTF8
    )

    result = encode_image(Strings.TEST_IMAGE)

    assert result == expected_encoded_data


def test_encode_image_file_not_found():
    with pytest.raises(FileNotFoundError):
        encode_image(Strings.NON_EXISTENT_IMAGE)


def test_encode_image_invalid_file_type():
    with patch(Strings.BUILTINS_OPEN, side_effect=IOError(Strings.CANNOT_READ_FILE)):
        with pytest.raises(IOError):
            encode_image(Strings.INVALID_IMAGE_TXT)


def test_is_hebrew():
    assert is_hebrew(Strings.HEBREW)
    assert not is_hebrew(Strings.NOT_HEBREW)
    assert not is_hebrew(Strings.NUMERIC)
    assert is_hebrew(Strings.HEBREW_TEST)
    assert not is_hebrew(Strings.EMPTY)


def create_base64_image(size=ImageUtils.DEFUALT_SIZE, color=ImageUtils.RED_COLOR):
    img = Image.new(ImageUtils.COLOR_MODE_RGB, size, color=color)
    buffered = io.BytesIO()
    img.save(buffered, format=ImageUtils.FORMAT_PNG)
    return base64.b64encode(buffered.getvalue()).decode(Strings.ENCODING_UTF8)


def test_resize_base64_image():
    base64_image = create_base64_image()

    for expected_size in [ImageUtils.SIZE_1, ImageUtils.SIZE_2]:
        resized_image = resize_base64_image(base64_image, size=expected_size)
        img_data = base64.b64decode(resized_image)
        resized_img = Image.open(io.BytesIO(img_data))
        assert resized_img.size == expected_size

    for invalid_input in [Strings.INVALID_BASE64, Strings.EMPTY, None]:
        try:
            resize_base64_image(invalid_input)
            assert False
        except Exception:
            assert True


def test_is_base64():
    valid_base64 = base64.b64encode(Strings.BYTE_TEST).decode(Strings.ENCODING_UTF8)
    decoded_value = base64.b64decode(Strings.VALID_BASE64).decode(Strings.ENCODING_UTF8)

    assert is_base64(valid_base64)
    assert not is_base64(Strings.INVALID_BASE64)
    assert is_base64(Strings.VALID_BASE64)
    assert decoded_value == Strings.INVALID_DECODED_VALUE
