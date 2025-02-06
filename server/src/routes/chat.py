from flask import Flask
from flask_socketio import SocketIO, emit

from services.chain_multimodal import initialize_chain
from utils.config import UtilsConfig

app = Flask(__name__)
socketio = SocketIO(app)
chain_multimodal_rag = initialize_chain()


@app.route('/chat')
@socketio.on('chat')
def chat(query: str):
    try:
        result = chain_multimodal_rag.invoke(query)
        response = {
            'status_code': 200,
            'markdown': result['answer'],
            'links': result['links'],
            'img': result['img']
        }
    except Exception as e:
        response = {
            'status_code': 500,
            'error': str(e)
        }
    emit('chat_answer', response)


if __name__ == '__main__':
    socketio.run(app, host=UtilsConfig.HOST, port=8000)
