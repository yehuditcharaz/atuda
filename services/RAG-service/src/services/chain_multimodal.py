import os
from pathlib import Path
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableLambda
from langchain_google_vertexai import ChatVertexAI
from utils.helpers import trim_array
from utils.logger import logger
from urllib.parse import quote
from services.retriever import ensemble_retriever, history_aware_retriever
from utils.config import GCPConfig, ModelConfig, LimitsConfig
from utils.const import PromptConst
from utils.helpers import is_hebrew, is_base64, resize_base64_image
from utils.dictionary import dictionary


def initialize_chain():
    chain_multimodal_rag = (
        RunnableLambda(query_processing)
        | RunnableLambda(sources_retrieval)
        | RunnableLambda(format_model_input)
        | ChatVertexAI(
            temperature=ModelConfig.TEMPERATURE,
            top_p=ModelConfig.TOP_P,
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT,
            response_mime_type="application/json",
            response_schema=ModelConfig.RESPONSE_SCHEMA,
            system_instruction=PromptConst.SYSTEM_INSTRUCTIONS,
        )
        | JsonOutputParser()
        | RunnableLambda(set_links)
    )
    return chain_multimodal_rag


def query_processing(conversation_history):
    try:
        query = conversation_history["messages"][-1]["content"]
        if not is_hebrew(query):
            return conversation_history

        prompt = f"{PromptConst.TRANSLATION}\n\nHebrew Question:\n{query}\n\nReference Dictionary (for technical terms only):\n{dictionary}"

        model = ChatVertexAI(
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT,
            temperature=ModelConfig.TRANSLATION_TEMPERATURE,
        )
        result = model.invoke(prompt)

        conversation_history["messages"][-1]["content"] = result.content.strip()
        logger.info("Successfully completed query processing")
        return conversation_history
    except Exception as error:
        error_log = f"Failed when translating the query: {error}"
        logger.error(error_log)
        raise Exception(error_log)


def sources_retrieval(conversation):
    try:
        chat_history = conversation["messages"]
        query = conversation["messages"][-1]["content"]
        history_docs = history_aware_retriever.invoke(
            {"input": query, "chat_history": chat_history}
        )[:30]
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


def format_model_input(data_dict):
    try:
        formatted_chunks = str(data_dict["context"]["texts"])
        full_prompt = f"User-provided question: {data_dict['question']}\n conversation history:{data_dict['history']}\nText and / or tables:\n{formatted_chunks}"
        messages = [
            {
                "type": "text",
                "text": (full_prompt),
            }
        ]
        if data_dict["context"]["images"]:
            for image in data_dict["context"]["images"]:
                messages.append(
                    {"type": "text", "text": f"metadata:\n{image.metadata}"}
                )
                messages.append(
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image.page_content}"
                        },
                    }
                )
        logger.info("Successfully completed format model input")
        return [HumanMessage(content=messages)]
    except Exception as error:
        error_log = f"Failed at format_model_input function: {error}"
        logger.error(error_log)
        raise Exception(error_log)


def set_links(result):
    try:
        sources_links = get_sources(result["doc_ids"])
        logger.info("Successfully completed set links")
        return {"answer": result["markdown_answer_with_reasoning"], **sources_links}
    except Exception as error:
        raise Exception(error)


def get_sources(doc_ids):
    try:
        chunks = get_chunks(doc_ids)
        result = {"images": [], "links": []}

        {
            (
                result["images"].append(get_image_path(chunk))
                if is_base64(chunk.page_content)
                else result["links"].append(get_link(chunk))
            )
            for chunk in chunks
        }
        result["images"] = trim_array(result["images"], LimitsConfig.MAX_IMAGES_LIMIT)
        result["links"] = trim_array(result["images"], LimitsConfig.MAX_LINKS_LIMIT)
        logger.info("Successfully completed get sources")
        return result

    except Exception as error:
        error_log = f"Failed when get sources: {error}"
        logger.error(error_log)
        raise Exception(error_log)


def get_chunks(docs_ids):
    chunks = ensemble_retriever.retrievers[0].docstore.mget(docs_ids)
    validate_chunks = [chunk for chunk in chunks if chunk is not None]
    return validate_chunks


def get_image_path(image_chunk):
    sign_server_url = os.path.join(GCPConfig.SIGN_SERVER_URL, GCPConfig.IMAGES_SIGN_URL)
    link = image_chunk.metadata["url"]
    return f"![]({sign_server_url}{GCPConfig.REQUEST_PARAM}{link})".replace("\\", "/")


def get_link(chunk):
    chunk_metadata = get_chunk_metadata(chunk)
    return f"[{get_link_preview(chunk_metadata)}]({get_document_link(chunk_metadata)})"


def get_chunk_metadata(chunk):
    return [chunk.metadata["filename"], chunk.metadata["page_number"]]


def get_link_preview(chunk_metadata):
    return f"{chunk_metadata[0]} P. {chunk_metadata[1]}"


def get_document_link(chunk_metadata):
    filename = quote(chunk_metadata[0])
    sign_server_url = os.path.join(GCPConfig.SIGN_SERVER_URL, GCPConfig.LINKS_SIGN_URL)
    link = os.path.join(
        GCPConfig.GCS_BUCKET,
        GCPConfig.CORPUS_FOLDER,
        get_filename_without_prefix(filename),
        f"{filename}&page={chunk_metadata[1]}",
    )
    return f"{sign_server_url}{GCPConfig.REQUEST_PARAM}{link}".replace("\\", "/")


def get_filename_without_prefix(filename):
    return Path(filename).stem


chain_multimodal_rag = initialize_chain()
