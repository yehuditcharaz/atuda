from models.base_chunk import BaseChunk


class ImageChunk(BaseChunk):
    def __init__(self, id, content, url):
        super().__init__(id, content)
        self.url = url
