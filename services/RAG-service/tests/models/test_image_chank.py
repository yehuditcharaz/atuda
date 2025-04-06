from models.image_chunk import ImageChunk

from .stub import Attributes


def test_image_chunk_initialization():
    image_chunk = ImageChunk(Attributes.ID, Attributes.CONTENT, Attributes.URL)
    assert image_chunk.id == Attributes.ID
    assert image_chunk.content == Attributes.CONTENT
    assert image_chunk.url == Attributes.URL
