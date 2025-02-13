import base64
import os
from pathlib import Path
import re

from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableLambda
from langchain_google_vertexai import ChatVertexAI
from urllib.parse import quote

from models.answer_schema import AnswerSchema
from services.retriever import ensemble_retriever
from utils.config import GCPConfig, ModelConfig
from utils.const import PromptConst


def initialize_chain():
    chain_multimodal_rag = (
        RunnableLambda(query_processing)
        | RunnableLambda(sources_retrieval)
        | RunnableLambda(format_model_input)
        | ChatVertexAI(
            temperature=0,
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT,
        ).with_structured_output(AnswerSchema)
        | RunnableLambda(set_links)
    )
    return chain_multimodal_rag


def query_processing(query):
    model = ChatVertexAI(model_name=ModelConfig.MODEL_NAME,
                         max_output_tokens=ModelConfig.TOKEN_LIMIT)
    msg = model.invoke(PromptConst.PROCESS_USER_QUERY + "\n\n" + query)
    return msg.content


def sources_retrieval(query):
    docs = ensemble_retriever.invoke(query, limit=10)
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
        metadata = doc.metadata

        if looks_like_base64(doc.page_content) and is_image_data(doc.page_content):
            doc.metadata = {"doc_id": metadata['doc_id']}
            b64_images.append(doc)
        else:
            doc.metadata = {"filename": metadata['filename'],
                            "file_directory": metadata['file_directory'],
                            "page_number": metadata['page_number'],
                            "doc_id": metadata['doc_id']}
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
    formatted_chunks = str(data_dict["context"]["texts"])
    full_prompt = f"{PromptConst.ANSWER_GENERATION_INSTRUCTIONS}\nUser-provided question: {data_dict['question']}\n\nText and / or tables:\n{formatted_chunks}"
    messages = [
        {
            "type": "text",
            "text": (full_prompt),
        }
    ]
    if data_dict["context"]["images"]:
        for image in data_dict["context"]["images"]:
            messages.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image.page_content}"},
                }
            )
    return [HumanMessage(content=messages)]


def set_links(result):
    result.referenced_chunks_filename_and_page_number = get_links(
        result.referenced_chunks_filename_and_page_number)
    return result


def get_links(chunks_metadata):
    return [f"[{get_link_preview(chunk_metadata)}]({get_document_link(chunk_metadata)})"
            for chunk_metadata in chunks_metadata]


def get_document_link(chunk_metadata):
    filename = quote(chunk_metadata[0])
    return os.path.join('https://storage.cloud.google.com/',
                        GCPConfig.GCS_BUCKET,
                        GCPConfig.CORPUS_FOLDER,
                        get_filename_without_prefix(filename),
                        f"{filename}#page={chunk_metadata[1]}"
                        )


def get_filename_without_prefix(filename):
    return Path(filename).stem


def get_link_preview(chunk_metadata):
    return f"{chunk_metadata[0]} P. {chunk_metadata[1]}"


chain_multimodal_rag = initialize_chain()
