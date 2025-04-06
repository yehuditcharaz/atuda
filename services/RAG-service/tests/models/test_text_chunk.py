from models.text_chunk import TextChunk

from .stub import Attributes


def test_text_chunk_initialization():
    text_chunk = TextChunk(Attributes.ID, Attributes.CONTENT, Attributes.METADATA)
    assert text_chunk.id == Attributes.ID
    assert text_chunk.content == Attributes.CONTENT
    assert text_chunk.metadata == Attributes.METADATA
