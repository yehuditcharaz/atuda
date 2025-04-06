from services.retriever import history_aware_retriever
from utils.helpers import is_base64, resize_base64_image
from utils.logger import logger


def sources_retrieval(conversation):
    try:
        chat_history = conversation["messages"]
        query = conversation["messages"][-1]["content"]
        history_docs = history_aware_retriever.invoke(
            {"input": query, "chat_history": chat_history}
        )
        source_docs = split_image_text_types(history_docs)
        input_data = {
            "context": source_docs,
            "question": query,
            "history": chat_history,
        }
        logger.info("Successfully completed sources retrieval")
        return input_data
    except Exception as error:
        error_log = f"Failed when retrieving sources: {error}"
        logger.error(error_log)
        raise Exception(error_log)


def split_image_text_types(docs):
    b64_images = []
    texts = []
    for doc in docs:
        metadata = doc.metadata
        doc.metadata = {"doc_id": metadata["doc_id"]}
        if is_base64(doc.page_content):
            doc.page_content = resize_base64_image(doc.page_content, size=(250, 250))
            b64_images.append(doc)
        else:
            texts.append(doc)
    return {"images": b64_images, "texts": texts}
