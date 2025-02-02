from langchain_core.documents import Document
from ..config import UtilsConfig
from ..utils.data_preparing import is_image_chunk
from .retriever import retriever_multi_vector_img


def create_document(chunk, is_summary=False):
    content = chunk.summary if is_summary else chunk.content
    metadata = {UtilsConfig.ID_KEY: chunk.id} if is_image_chunk(
        chunk) else {**chunk.metadata, UtilsConfig.ID_KEY: chunk.id}
    return Document(page_content=content, metadata=metadata)


def store_data(chunks):
    chunks_documents = [create_document(chunk) for chunk in chunks]
    doc_ids = [doc.metadata[UtilsConfig.ID_KEY] for doc in chunks_documents]

    retriever_multi_vector_img.docstore.mset(
        list(zip(doc_ids, chunks_documents)))

    summary_docs = [create_document(chunk, is_summary=True)
                    for chunk in chunks]

    batches = list(batch(summary_docs))

    for batch_docs in batches:
        retriever_multi_vector_img.vectorstore.add_documents(batch_docs)


def batch(iterable, batch_size=UtilsConfig.BATCH_SIZE):
    for i in range(0, len(iterable), batch_size):
        yield iterable[i:i + batch_size]
