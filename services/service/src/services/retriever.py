from google.cloud import storage
from langchain.chains import create_history_aware_retriever
from langchain.retrievers import EnsembleRetriever, MultiQueryRetriever
from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_vertexai import (
    VectorSearchVectorStore,
    VertexAI,
    VertexAIEmbeddings,
)
from langchain_google_vertexai.vectorstores.document_storage import GCSDocumentStorage
from utils.config import GCPConfig, ModelConfig, UtilsConfig
from utils.const import PromptConst
from google.cloud import aiplatform
from google.oauth2 import service_account
import json


credentials_dict = json.loads(GCPConfig.GOOGLE_CREDENTIALS)
credentials = service_account.Credentials.from_service_account_info(
    credentials_dict)
aiplatform.init(project=GCPConfig.PROJECT_ID, location=GCPConfig.LOCATION,
                staging_bucket=GCPConfig.GCS_BUCKET_URI, credentials=credentials)


def get_history_prompt():
    history_prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),  
        ("user", PromptConst.HISTORY_PROMPT)
    ])
    return history_prompt


def initialize_history_retriever():
    history_aware_retriever = create_history_aware_retriever(
        llm=VertexAI(
            temperature=ModelConfig.TEMPERATURE,
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT
        ),
        retriever=ensemble_retriever,  
        prompt=get_history_prompt()
    )
    return history_aware_retriever


def initialize_ensemble_retriever():
    retriever = initialize_retriever()

    multi_query_retriever = MultiQueryRetriever.from_llm(
        retriever=retriever,
        llm=VertexAI(
            temperature=ModelConfig.TEMPERATURE,
            model_name=ModelConfig.MODEL_NAME,
            max_output_tokens=ModelConfig.TOKEN_LIMIT
        )
    )

    ensemble_retriever = EnsembleRetriever(
        retrievers=[retriever,
                    multi_query_retriever],
        weights=[0.8, 0.2]
    )

    return ensemble_retriever


def initialize_retriever():
    return MultiVectorRetriever(
        temperature=ModelConfig.TEMPERATURE,
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
history_aware_retriever = initialize_history_retriever()
