from langchain_core.documents import Document
from .stub import MockChunks, UtilsKeys


def test_create_document_text_chunk(
    patch_services_retriever, mock_is_image_chunk, mock_utils_config
):
    from services.data_storage import create_document

    chunk = MockChunks.CHUNK1
    doc = create_document(chunk)
    assert isinstance(doc, Document)
    assert doc.page_content == chunk.content
    assert doc.metadata[UtilsKeys.ID_KEY] == chunk.id
    assert doc.metadata["page"] == chunk.metadata["page"]


def test_create_document_image_chunk(
    patch_services_retriever, mock_is_image_chunk, mock_utils_config
):
    from services.data_storage import create_document

    chunk = MockChunks.CHUNK2
    doc = create_document(chunk)
    assert isinstance(doc, Document)
    assert doc.page_content == chunk.content
    assert doc.metadata[UtilsKeys.ID_KEY] == chunk.id
    assert doc.metadata[UtilsKeys.URL] == chunk.url


def test_create_summary_document_text_chunk(
    patch_services_retriever, mock_is_image_chunk, mock_utils_config
):
    from services.data_storage import create_document

    chunk = MockChunks.CHUNK1
    doc = create_document(chunk, is_summary=True)
    assert doc.page_content == chunk.summary


def test_store_data(
    patch_services_retriever,
    mock_is_image_chunk,
    mock_utils_config,
):
    from services.data_storage import store_data

    store_data(MockChunks.LIST)
    retriever = patch_services_retriever
    retriever.docstore.mset.assert_called
    retriever.vectorstore.add_documents.call_count == 1


def test_batch_function(patch_services_retriever, mock_utils_config):
    from services.data_storage import batch

    items = [1, 2, 3, 4, 5]
    batched = list(batch(items, batch_size=2))
    assert batched == [[1, 2], [3, 4], [5]]
