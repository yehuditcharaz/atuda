from services.data_storage import store_data
from services.extraction import get_chunks
from services.summarization import set_summaries


def data_preparing(bucket_name, file_list, folder_name, local_directory):
    chunks = get_chunks()
    set_summaries(chunks)
    store_data(chunks)
