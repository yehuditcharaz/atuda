from flask import Flask, request, redirect, Response
from flask_cors import CORS
import requests

from services.signed_url_generator import generate_signed_url
from utils.config import UtilsConfig

app = Flask(__name__)
CORS(app)


@app.route("/get_image")
def get_image():
    url = request.args.get("url")

    try:
        signed_url = generate_signed_url(url)
        response = requests.get(signed_url, verify=False)
        return Response(response.content, mimetype=response.headers["Content-Type"])

    except Exception as e:
        response = {"status_code": 500, "error": str(e)}
    return response


@app.route("/get_link")
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


if __name__ == "__main__":
    app.run(host=UtilsConfig.HOST, port=UtilsConfig.PORT, debug=True)
