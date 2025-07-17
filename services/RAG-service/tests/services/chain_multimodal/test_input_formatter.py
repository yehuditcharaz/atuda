from langchain_core.documents import Document

from .stub import FakeDocuments
from services.chain_multimodal.input_formatter import format_model_input


def test_format_model_input():
    doc = Document(
        page_content=FakeDocuments.BASE64, metadata={"doc_id": FakeDocuments.DOC_ID}
    )
    data = {
        "context": {"texts": [FakeDocuments.TEXT_CONTENT], "images": [doc]},
        "question": FakeDocuments.QUESTION,
        "history": [],
    }
    result = format_model_input(data)
    assert isinstance(result, list)
    assert result[1].type == "human"
