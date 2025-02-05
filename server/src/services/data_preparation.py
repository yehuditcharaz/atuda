from services.extraction import get_chunks
from services.summarization import set_summaries
from services.data_storage import store_data


def data_preparing():
    chunks = get_chunks()
    set_summaries(chunks)
    store_data(chunks)


data_preparing()
