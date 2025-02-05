from flask import Flask
from flask_socketio import SocketIO, emit

from services.chain_multimodal import initialize_chain


app = Flask(__name__)
socketio = SocketIO(app)
chain_multimodal_rag = initialize_chain()


@app.route('/chat')
@socketio.on('chat')
def answer(query: str):
    try:
        ans = chain_multimodal_rag.invoke(query)
        answer_markdown = ans['answer']
        answer_links = ans['links']
        answer_images = ans['img']
        response = {
            'status_code': 200,
            'markdown': answer_markdown,
            'links': answer_links,
            'img': answer_images
        }
    except Exception as e:
        response = {
            'status_code': 500,
            'error': str(e)
        }
    emit('answer_from_chat', response)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000)
