import grpc
import json
from flask import Flask, request, jsonify

from services.chain_multimodal import chain_multimodal_rag
from utils.config import UtilsConfig

app = Flask(__name__)


@app.route("/chat")
def chat():
    query = request.args.get("query")
    try:
        result = chain_multimodal_rag.with_retry(
            stop_after_attempt=UtilsConfig.RETRY_AFTER_ATTEMPT,
            retry_if_exception_type=(grpc.RpcError,),
        ).invoke(json.loads(query))
    except Exception:
        result = {"answer": UtilsConfig.ERROR_MESSAGE}
    response = {"status_code": 200, **result}
    return jsonify(response)


if __name__ == "__main__":
    app.run(host=UtilsConfig.HOST, port=UtilsConfig.PORT)
