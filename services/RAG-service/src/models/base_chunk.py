from abc import ABC


class BaseChunk(ABC):
    def __init__(self, id, content) -> None:
        super().__init__()
        self.id = id
        self.content = content
        self.summary = ''

    def set_summary(self, summary):
        self.summary = summary
