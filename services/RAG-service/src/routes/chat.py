import grpc
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from services.chain_multimodal.chain import chain_multimodal_rag
from utils.config import UtilsConfig

import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()
logging.basicConfig(level=logging.INFO)

executor = ThreadPoolExecutor(max_workers=10)


@app.post("/chat")
async def chat(request: Request):
    try:
        query = await request.json()

        loop = asyncio.get_running_loop()

        result = await loop.run_in_executor(
            executor,
            lambda: chain_multimodal_rag.with_retry(
                stop_after_attempt=UtilsConfig.RETRY_AFTER_ATTEMPT,
                retry_if_exception_type=(grpc.RpcError,),
            ).invoke(query),
        )
    except Exception as e:
        logging.error(f"Error in /chat: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"answer": UtilsConfig.ERROR_MESSAGE},
        )

    return JSONResponse(status_code=200, content={"status_code": 200, **result})
