from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

from utils.config import Keys, ModelConfig, PostgresConfig
from utils.logger import logger
from utils.const import LoggerMessage


def init_vector_store():

    embedding_model = OpenAIEmbeddings(
        api_key=Keys.OPENAI_API_KEY, model=ModelConfig.EMBEDDING_MODEL
    )
    vector_store = PGVector(
        embeddings=embedding_model,
        collection_name=PostgresConfig.POSTGRES_COLLECTION,
        connection=PostgresConfig.POSTGRES_CONNECTION_STRING,
        use_jsonb=True,
    )

    return vector_store


def store_summary_in_vector(vector_store, summary):
    try:
        vector_store.add_documents([summary])
        logger.info(LoggerMessage.Success.STORING_DOCUMENT_SUMMARY)
    except Exception as e:
        logger.error(LoggerMessage.Error.STORING_DOCUMENT_SUMMARY.format(error=e))


vector_store = init_vector_store()
