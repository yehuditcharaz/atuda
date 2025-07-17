import os
import requests
from flask import Flask, send_file, jsonify, request, redirect, Response
from utils.config import APP, Paths, Errors, Routes
from services.feedback.create_feedback import create_feedback_report_from_rows
from services.signed_url.signed_url_generator import generate_signed_url

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = APP.ACCESS_URL
    return response


@app.route(Routes.GET_IMAGE_ROUTE)
def get_image():
    url = request.args.get("url")

    try:
        signed_url = generate_signed_url(url)
        response = requests.get(signed_url, verify=False)
        return Response(response.content, mimetype=response.headers["Content-Type"])

    except Exception as e:
        response = {"status_code": 500, "error": str(e)}
    return response


@app.route(Routes.GET_LINK_ROUTE)
def get_link():
    url = request.args.get("url")
    page = request.args.get("page")

    try:
        signed_url = generate_signed_url(url)
        view_url = f"{signed_url}#page={page}"
        return redirect(view_url, code=302)

    except Exception as e:
        response = {"status_code": 500, "error": str(e)}
    return response


@app.route(Routes.FEEDBACK_ROUTE)
async def get_feedback_report():
    result = await create_feedback_report_from_rows(Paths.EXCEL_FILE)
    if result == Errors.FEEDBACK_NOT_FOUND:
        return jsonify({"error": Errors.FEEDBACK_NOT_FOUND}), 404

    file_path = os.path.join(Paths.DIRECTORY, Paths.EXCEL_FILE)
    if os.path.exists(file_path):
        return send_file(file_path)
    else:
        return jsonify({"error": result}), 500


if __name__ == "__main__":
    app.run(host=APP.HOST, port=APP.PORT)
