import os
from pathlib import Path
from urllib.parse import quote
from services.retriever import ensemble_retriever
from utils.config import GCPConfig, LimitsConfig
from utils.helpers import is_base64
from utils.logger import logger


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
        result["images"] = result["images"][: LimitsConfig.MAX_IMAGES_LIMIT]
        result["links"] = list(dict.fromkeys(result["links"]))[
            : LimitsConfig.MAX_LINKS_LIMIT
        ]

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
