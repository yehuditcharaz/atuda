# from flask import Flask
# from flask_socketio import SocketIO, emit

# from services.chain_multimodal import chain_multimodal_rag
# from utils.config import UtilsConfig

# app = Flask(__name__)
# socketio = SocketIO(app)


# @app.route('/chat')
# @socketio.on('chat')
# def chat(query: str):
#     try:
#         result = chain_multimodal_rag.invoke(query)
#         response = {
#             'status_code': 200,
#             'answer': result['answer'],
#             'links': result['links'],
#             'imgs': result['imgs']
#         }
#     except Exception as e:
#         response = {
#             'status_code': 500,
#             'error': str(e)
#         }
#     emit('chat_answer', response)


# if __name__ == '__main__':
#     socketio.run(app, host=UtilsConfig.HOST, port=8080, allow_unsafe_werkzeug=True)

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
            'status_code':200,
            'answer': result['answer'],
            'links': result['links'],
            'images': result['imgs']
        }
    except Exception as e:
        response = {
            'status_code': 500,
            'error': str(e)
        }
    return jsonify(response)



if __name__ == '__main__':
    app.run(host=UtilsConfig.HOST, port=UtilsConfig.PORT)
