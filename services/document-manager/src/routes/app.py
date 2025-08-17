import os

import httpx
import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse

from services.feedback.create_feedback import (
    create_feedback_report_from_rows,
)
from services.signed_url.signed_url_generator import generate_signed_url
from utils.config import APP, Errors, Paths, Routes

app = FastAPI(title="Document Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=APP.ACCESS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

async_client = httpx.AsyncClient(verify=False)


@app.get(Routes.GET_IMAGE_ROUTE)
async def get_image(url):
    try:
        signed_url = generate_signed_url(url)
        response = await async_client.get(signed_url)
        response.raise_for_status()
        return Response(
            content=response.content,
            media_type=response.headers.get("Content-Type", "application/octet-stream"),
        )
    except httpx.HTTPStatusError as e:
        return JSONResponse(
            status_code=e.response.status_code,
            content={
                "status_code": e.response.status_code,
                "error": str(e),
            },
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status_code": 500, "error": str(e)},
        )


@app.get(Routes.GET_LINK_ROUTE)
async def get_link(url, page):
    try:
        signed_url = generate_signed_url(url)
        view_url = f"{signed_url}#page={page}" if page else signed_url
        return RedirectResponse(url=view_url, status_code=302)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status_code": 500, "error": str(e)},
        )


@app.api_route(Routes.FEEDBACK_ROUTE, methods=["GET", "OPTIONS"])
async def get_feedback_report(request: Request):
    if request.method == "OPTIONS":
        return Response(status_code=200)

    result = await create_feedback_report_from_rows(Paths.EXCEL_FILE)
    if result == Errors.FEEDBACK_NOT_FOUND:
        return JSONResponse(
            status_code=404,
            content={"error": Errors.FEEDBACK_NOT_FOUND},
        )

    file_path = os.path.join(Paths.DIRECTORY, Paths.EXCEL_FILE)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return JSONResponse(status_code=500, content={"error": result})


if __name__ == "__main__":
    uvicorn.run("src.routes.app:app", host=APP.HOST, port=APP.PORT)
