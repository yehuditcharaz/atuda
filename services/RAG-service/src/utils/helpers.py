import base64
import io
from PIL import Image


def is_image_chunk(chunk):
    return "models.image_chunk.ImageChunk" in str(type(chunk))


def is_hebrew(text):
    return any("\u0590" <= letter <= "\u05ea" for letter in text)


def is_base64(str):
    try:
        return base64.b64encode(base64.b64decode(str)) == str.encode()
    except Exception:
        return False


def resize_base64_image(base64_string, size=(128, 128)):
    img_data = base64.b64decode(base64_string)
    img = Image.open(io.BytesIO(img_data))

    resized_img = img.resize(size, Image.LANCZOS)

    buffered = io.BytesIO()
    resized_img.save(buffered, format=img.format)

    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def trim_array(arr, max_length):
    return arr[:max_length] if len(arr) > max_length else arr
