import base64
import re

from langchain_core.documents import Document
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_google_vertexai import (
    ChatVertexAI,
)
from utils.config import ModelConfig
from utils.const import PromptConst
from services.retriever import retriever_multi_vector_img


def initialize_chain():
    chain_multimodal_rag = (
        RunnablePassthrough()
        | RunnableLambda(query_processing)
        | RunnableLambda(sources_retrieval)
        | RunnableLambda(format_model_input)
        | ChatVertexAI(
            temperature=0,
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT,
        )
        | StrOutputParser()
    )
    return chain_multimodal_rag


def query_processing(query):
    model = ChatVertexAI(model_name=ModelConfig.MODEL_NAME,
                         max_output_tokens=ModelConfig.TOKEN_LIMIT)
    msg = model.invoke(PromptConst.PROCESS_USER_QUERY + "\n\n" + query)
    return msg.content


def sources_retrieval(query):
    docs = retriever_multi_vector_img.invoke(query, limit=10)
    source_docs = split_image_text_types(docs)
    input_data = {
        "context": source_docs,
        "question": query
    }
    return input_data


def split_image_text_types(docs):
    b64_images = []
    texts = []
    for doc in docs:
        if isinstance(doc, Document):
            doc = doc.page_content
        if looks_like_base64(doc) and is_image_data(doc):
            b64_images.append(doc)
        else:
            texts.append(doc)
    return {"images": b64_images, "texts": texts}


def looks_like_base64(sb):
    return re.match("^[A-Za-z0-9+/]+[=]{0,2}$", sb) is not None


def is_image_data(b64data):
    image_signatures = {
        b"\xFF\xD8\xFF": "jpg",
        b"\x89\x50\x4E\x47\x0D\x0A\x1A\x0A": "png",
        b"\xa47\x49\x46\x38": "gif",
        b"\x52\x49\x46\x46": "webp",
    }
    try:
        header = base64.b64decode(b64data)[:8]
        for sig, _ in image_signatures.items():
            if header.startswith(sig):
                return True
        return False
    except Exception:
        return False


def format_model_input(data_dict):
    formatted_texts = "\n".join(data_dict["context"]["texts"])
    messages = [
        {
            "type": "text",
            "text": (
                f"{PromptConst.GENERATION}"
                f"User-provided question: {data_dict['question']}\n\n"
                "Text and / or tables:\n"
                f"{formatted_texts}"
            ),
        }
    ]

    if data_dict["context"]["images"]:
        for image in data_dict["context"]["images"]:
            messages.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image}"},
                }
            )
    return [HumanMessage(content=messages)]
