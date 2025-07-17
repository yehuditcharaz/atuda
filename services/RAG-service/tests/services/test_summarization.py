from services.summarization import (
    generate_image_summary,
    is_valid_summary,
    set_summaries,
)
from .stub import SummarizationChunks, Summarizes


def test_is_valid_summary(
    patch_services_retriever,
):
    assert is_valid_summary(Summarizes.DOC) is True
    assert is_valid_summary(Summarizes.ERROR_MESSAGE) is False
    assert is_valid_summary("") is False


def test_generate_image_summary(
    patch_services_retriever,
    patch_summarization_dependencies,
    mock_config_summarization,
    mock_models,
):
    result = generate_image_summary("base64string")
    assert result == "image summary result"


def test_set_summaries_valid_summary(
    patch_services_retriever,
    patch_summarization_dependencies,
    mock_config_summarization,
    mock_helpers,
    mock_generate_image_summary,
    mock_generate_document_summary,
    mock_is_valid_summary,
):
    chunks = [SummarizationChunks.TEXT, SummarizationChunks.IMAGE]
    set_summaries(chunks)

    assert chunks[0].summary == Summarizes.DOC
    assert chunks[1].summary == Summarizes.IMAGE


def test_set_summaries_fallback_to_original(
    patch_services_retriever,
    patch_summarization_dependencies,
    mock_config_summarization,
    mock_helpers,
    mock_generate_image_summary,
    mock_generate_document_summary,
    mock_is_valid_summary,
):
    chunks = [SummarizationChunks.TEXT, SummarizationChunks.IMAGE]
    set_summaries(chunks)

    assert chunks[0].summary == chunks[0].content
    assert chunks[1].summary == chunks[1].content
