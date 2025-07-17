from langchain_core.documents import Document

from .stub import (
    Answer,
    Bases64,
    Conversations,
    Documents,
)


def test_sources_retrieval(patch_services_retriever, mock_split_image_text_types):
    from services.chain_multimodal.source_retriever import sources_retrieval

    result = sources_retrieval(Conversations.HISTORY)
    assert result[Conversations.QUESTION_KEY] == Conversations.QUESTION_VALUE
    assert result[Conversations.CONTEXT_KEY] == Conversations.CONTEXT_VALUE
    assert (
        result[Conversations.HISTORY_KEY]
        == Conversations.HISTORY[Conversations.MESSAGES_KEY]
    )


def test_split_image_text_types(
    patch_services_retriever,
    mock_is_base64,
    mock_resize_base64_image,
):
    from services.chain_multimodal.source_retriever import split_image_text_types

    doc1 = Document(page_content=Bases64.SENTENCE, metadata=Documents.METADATA[0])
    doc2 = Document(page_content=Bases64.TEXT_CONTENT, metadata=Documents.METADATA[1])
    result = split_image_text_types([doc1, doc2])
    assert len(result[Answer.IMAGES_KEY]) == 1
    assert len(result[Answer.TEXT_KEY]) == 1
    assert result[Answer.IMAGES_KEY][0].page_content == Bases64.RESIZED
