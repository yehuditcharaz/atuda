from .extraction import get_chunks
from .summarization import set_summaries
from .data_storage import store_data
from .chain_multimodal import initialize_chain


chain_multimodal_rag = initialize_chain()


def data_preparing():
    chunks = get_chunks()
    set_summaries(chunks)
    store_data(chunks)


def chat(query):
    return chain_multimodal_rag.invoke(query)
