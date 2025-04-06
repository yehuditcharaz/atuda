from models.base_chunk import BaseChunk

from .stub import Attributes


def test_base_chunk_initialization():
    base_chunk = BaseChunk(Attributes.ID, Attributes.CONTENT)
    assert base_chunk.id == Attributes.ID
    assert base_chunk.content == Attributes.CONTENT
    assert base_chunk.summary == ""


def test_base_chunk_set_summary():
    base_chunk = BaseChunk(Attributes.ID, Attributes.CONTENT)
    base_chunk.set_summary(Attributes.SUMMARY)
    assert base_chunk.summary == Attributes.SUMMARY
