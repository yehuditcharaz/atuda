from langchain.prompts import PromptTemplate
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
from langchain_google_vertexai import (
    ChatVertexAI,
    VertexAI,
)
from config import ModelConfig, PromptConfig, UtilsConfig
from utils.data_preparing import is_image_chunk


def set_summaries(chunks):
    for chunk in chunks:
        for _ in range(UtilsConfig.MAX_TRIES):
            if is_image_chunk(chunk):
                summary = generate_image_summary(chunk.content)
            else:
                summary = generate_document_summary(chunk.content)

            if is_valid_summary(summary):
                chunk.set_summary(summary)
                break
        else:
            chunk.set_summary(chunk.content)


def generate_document_summary(chunk_content: str) -> str:
    prompt = PromptTemplate.from_template(PromptConfig.TEXT_SUMMARIZATION)
    empty_response = RunnableLambda(
        lambda x: AIMessage(content="Error processing document")
    )
    model = VertexAI(
        temperature=0, model_name=ModelConfig.MODEL_NAME, max_output_tokens=ModelConfig.TOKEN_LIMIT
    ).with_fallbacks([empty_response])
    summarize_chain = {
        "element": lambda x: x} | prompt | model | StrOutputParser()

    return summarize_chain.invoke(chunk_content)


def generate_image_summary(base64_image: str) -> str:
    model = ChatVertexAI(model_name=ModelConfig.MODEL_NAME,
                         max_output_tokens=ModelConfig.TOKEN_LIMIT)
    msg = model.invoke(
        [
            HumanMessage(
                content=[
                    {"type": "text", "text": PromptConfig.IMAGE_SUMMARIZATION},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                    },
                ]
            )
        ]
    )
    return msg.content


def is_valid_summary(summary: str) -> bool:
    return len(summary) != 0 and summary != 'Error processing document'
