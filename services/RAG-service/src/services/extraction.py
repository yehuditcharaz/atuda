import base64
import os
import urllib.parse
import uuid

from unstructured.partition.pdf import partition_pdf
from utils.logger import logger
from utils.config import GCPConfig, UtilsConfig
from models.image_chunk import ImageChunk
from models.text_chunk import TextChunk


def get_chunks():
    try:
        documents_pathes = get_files_pathes(UtilsConfig.DOCUMENTS_FOLDER_PATH)
        chunks = [
            TextChunk(
                document_chunk.id,
                document_chunk.text,
                document_chunk.metadata.to_dict(),
            )
            for document_path in documents_pathes
            for document_chunk in get_document_chunks(document_path)
        ]

        images_pathes = get_files_pathes(UtilsConfig.IMAGES_FOLDER_PATH)
        for image_path in images_pathes:
            local_path = os.path.relpath(image_path, UtilsConfig.IMAGES_FOLDER_PATH)
            chunks.append(
                ImageChunk(
                    str(uuid.uuid4()),
                    encode_image(image_path),
                    urllib.parse.quote(GCPConfig.GCS_BUCKET + "/" + local_path),
                )
            )

        return chunks
    except Exception as e:
        logger.error(e)


def get_files_pathes(directory):
    return [
        os.path.join(root, file)
        for root, _, filenames in os.walk(directory)
        for file in filenames
    ]


def get_document_chunks(document_path):
    return partition_pdf(
        filename=document_path,
        strategy="hi_res",
        extract_images_in_pdf=False,
        extract_image_block_to_payload=False,
        infer_table_structure=True,
        chunking_strategy="by_title",
        max_characters=4000,
        new_after_n_chars=3800,
        combine_text_under_n_chars=2000,
        unique_element_ids=True,
    )


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
