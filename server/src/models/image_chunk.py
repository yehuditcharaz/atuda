from .base_chunk import BaseChunk


class ImageChunk(BaseChunk):
    def __init__(self, id, content):
        super().__init__(id, content)
