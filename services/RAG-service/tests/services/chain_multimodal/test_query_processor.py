import pytest

from .stub import Questions
from services.chain_multimodal.query_processor import query_processing


@pytest.mark.usefixtures("mock_is_hebrew")
def test_query_processing_english_question():
    conversation_history = {
        "messages": [{"content": "hello"}, {"content": Questions.ENGLISH}]
    }
    result = query_processing(conversation_history)
    assert result["messages"][-1]["content"] == Questions.ENGLISH


@pytest.mark.usefixtures("mock_is_hebrew", "mock_translation_model")
def test_query_processing_hebrew_question():
    conversation_history = {
        "messages": [{"content": "hello"}, {"content": Questions.HEBREW}]
    }
    result = query_processing(conversation_history)
    assert result["messages"][-1]["content"] == Questions.ENGLISH
