from models.base_chunk import BaseChunk


class TextChunk(BaseChunk):
    def __init__(self, id, content, metadata):
        super().__init__(id, content)
        self.metadata = metadata
