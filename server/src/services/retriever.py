from google.cloud import storage
from langchain.retrievers import EnsembleRetriever, MultiQueryRetriever
from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain_google_vertexai import (
    VectorSearchVectorStore,
    VertexAI,
    VertexAIEmbeddings,
)
from langchain_google_vertexai.vectorstores.document_storage import GCSDocumentStorage
from utils.config import GCPConfig, ModelConfig, UtilsConfig
from google.cloud import aiplatform
from google.oauth2 import service_account
import json


credentials_dict = json.loads(GCPConfig.GOOGLE_CREDENTIALS)
credentials = service_account.Credentials.from_service_account_info(
    credentials_dict)
aiplatform.init(project=GCPConfig.PROJECT_ID, location=GCPConfig.LOCATION,
                staging_bucket=GCPConfig.GCS_BUCKET_URI, credentials=credentials)


def initialize_ensemble_retriever():
    retriever = initialize_retriever()

    multi_query_retriever = MultiQueryRetriever.from_llm(
        retriever=retriever,
        llm=VertexAI(
            temperature=0,
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT
        )
    )

    ensemble_retriever = EnsembleRetriever(
        retrievers=[retriever,
                    multi_query_retriever],
        weights=[0.6, 0.4]
    )

    return ensemble_retriever


def initialize_retriever():
    return MultiVectorRetriever(
        vectorstore=get_vectorstore(),
        docstore=get_docstore(),
        id_key=UtilsConfig.ID_KEY,
        search_kwargs=ModelConfig.SEARCH_KWARGS
    )


def get_vectorstore():
    return VectorSearchVectorStore.from_components(
        project_id=GCPConfig.PROJECT_ID,
        region=GCPConfig.LOCATION,
        gcs_bucket_name=GCPConfig.GCS_BUCKET,
        index_id=GCPConfig.INDEX_ID,
        endpoint_id=GCPConfig.INDEX_ENDPOINT_ID,
        embedding=VertexAIEmbeddings(
            model_name=ModelConfig.EMBEDDING_MODEL_NAME),
        stream_update=True,
    )


def get_docstore():
    storage_client = storage.Client(GCPConfig.PROJECT_ID)
    bucket = storage_client.bucket(GCPConfig.GCS_BUCKET)
    return GCSDocumentStorage(bucket, GCPConfig.CHUNKS_FOLDER)


ensemble_retriever = initialize_ensemble_retriever()
