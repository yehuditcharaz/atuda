from langchain_core.documents import Document

from .stub import (
    Answer,
    Documents,
    FilenamesWithPrefix,
    FilenameWithoutPrefix,
    URLs,
    Utils,
)


def test_set_links(patch_services_retriever, mock_get_source):
    from services.chain_multimodal.link_formatter import set_links

    result = set_links(Answer.DICT_ANSWER)
    assert isinstance(result, dict)
    assert result[Answer.ANSWER_KEY] == Answer.ANSWER_VALUE
    assert result[Answer.IMAGES_KEY] == Answer.IMAGES_VALUE
    assert result[Answer.LINKS_KEY] == Answer.LINKS_VALUE


def test_get_sources(
    patch_services_retriever,
    mock_get_chunks,
    mock_is_base64_link_formatter,
    mock_get_link_preview,
    mock_get_document_link,
):
    from services.chain_multimodal.link_formatter import get_sources

    result = get_sources(Answer.DICT_ANSWER["doc_ids"])
    assert Answer.IMAGES_KEY in result
    assert Answer.LINKS_KEY in result
    assert isinstance(result[Answer.IMAGES_KEY], list)
    assert isinstance(result[Answer.LINKS_KEY], list)


def test_get_link(
    patch_services_retriever,
    mock_get_chunk_metadata,
    mock_get_link_preview,
    mock_get_document_link,
):
    from services.chain_multimodal.link_formatter import get_link

    doc = Document(
        page_content=Documents.PAGE_CONTENT, metadata=Documents.CHUNK_DICT_METADATA
    )
    result = get_link(doc)
    assert result == f"[{Utils.LINK_PREVIEW}]({URLs.SIGNED_LINK_URL})"


def test_get_chunk_metadata(
    patch_services_retriever,
):
    from services.chain_multimodal.link_formatter import get_chunk_metadata

    doc = Document(
        page_content=Documents.PAGE_CONTENT,
        metadata={
            "filename": FilenamesWithPrefix.FILENAME,
            "page_number": Documents.PAGE_NUMBER,
        },
    )
    assert get_chunk_metadata(doc) == [
        FilenamesWithPrefix.FILENAME,
        Documents.PAGE_NUMBER,
    ]


def test_get_link_preview(
    patch_services_retriever,
):
    from services.chain_multimodal.link_formatter import get_link_preview

    assert get_link_preview(Documents.CHUNK_METADATA) == Utils.LINK_PREVIEW


def test_get_document_link(
    patch_services_retriever, mock_get_filename_without_prefix, mock_GCPConfig
):
    from services.chain_multimodal.link_formatter import get_document_link

    link = get_document_link([FilenamesWithPrefix.FILENAME, Documents.PAGE_NUMBER])
    assert isinstance(link, str)
    assert Documents.PAGE_NUMBER_PREVIEW in link


def test_get_filename_without_prefix(
    patch_services_retriever,
):
    from services.chain_multimodal.link_formatter import get_filename_without_prefix

    assert (
        get_filename_without_prefix(FilenamesWithPrefix.FILENAME)
        == FilenameWithoutPrefix.FILENAME
    )
    assert (
        get_filename_without_prefix(FilenamesWithPrefix.HEBREW_FILENAME)
        == FilenameWithoutPrefix.HEBREW_FILENAME
    )
    assert (
        get_filename_without_prefix(FilenamesWithPrefix.FILENAME_WITH_TWO_PREFIX)
        == FilenamesWithPrefix.FILENAME_WITH_ONE_PREFIX
    )
    assert (
        get_filename_without_prefix(FilenamesWithPrefix.FILENAME_WITH_SPECIAL_CHAR)
        == FilenameWithoutPrefix.FILENAME_WITH_SPECIAL_CHAR
    )
