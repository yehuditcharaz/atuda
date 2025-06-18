from langchain.schema import HumanMessage, SystemMessage
from utils.const import PromptConst
from utils.logger import logger


def format_model_input(data_dict):
    try:
        formatted_chunks = str(data_dict["context"]["texts"])
        full_prompt = f"User-provided question: {data_dict['question']}\n conversation history:{data_dict['history']}\nText and / or tables:\n{formatted_chunks}"
        messages = [SystemMessage(content=PromptConst.SYSTEM_INSTRUCTIONS)]
        messages.append(HumanMessage(content=full_prompt))
        if data_dict["context"]["images"]:
            for image in data_dict["context"]["images"]:
                messages.append(
                    HumanMessage(
                        content=[
                            {"type": "text", "text": f"metadata:\n{image.metadata}"}
                        ]
                    )
                )
                messages.append(
                    HumanMessage(
                        content=[
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image.page_content}"
                                },
                            }
                        ]
                    )
                )
        logger.info("Successfully completed format model input")
        return messages
    except Exception as error:
        error_log = f"Failed at format_model_input function: {error}"
        logger.error(error_log)
        raise Exception(error_log)
