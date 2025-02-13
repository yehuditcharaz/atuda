from pydantic import BaseModel


class AnswerSchema(BaseModel):
    answer: str
    referenced_chunks_filename_and_page_number: list[list[str]]
