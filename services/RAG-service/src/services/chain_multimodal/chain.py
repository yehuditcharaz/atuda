from langchain_google_vertexai import ChatVertexAI
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_core.runnables import RunnableLambda
from services.chain_multimodal.query_processor import query_processing
from services.chain_multimodal.source_retriever import sources_retrieval
from services.chain_multimodal.input_formatter import format_model_input
from services.chain_multimodal.link_formatter import set_links
from utils.config import ModelConfig
from utils.const import PromptConst


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


chain_multimodal_rag = initialize_chain()
