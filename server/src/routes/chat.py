from flask import Flask, request, jsonify
from services.chain_multimodal import chain_multimodal_rag
from utils.config import UtilsConfig

app = Flask(__name__)


@app.route('/chat')
def chat():
    query = request.args.get('query')
    try:
        result = chain_multimodal_rag.invoke(query)
        print(query)
        response = {
            'status_code': 200,
            'answer': result.answer,
            'links': result.referenced_chunks_filename_and_page_number,
        }
    except Exception as e:
        response = {
            'status_code': 500,
            'error': str(e)
        }
    return jsonify(response)


if __name__ == '__main__':
    app.run(host=UtilsConfig.HOST, port=UtilsConfig.PORT)
