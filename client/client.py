import socketio
import time

sio = socketio.Client()

@sio.event
def connect():
    print("Connected to server")

@sio.event
def answer_with_resources(answer):
    print(f'the answer is {answer}')

@sio.event
def disconnect():
    print("Disconnected from server")

sio.connect('https://server-199581308623.us-central1.run.app/chat')

sio.emit('chat',"here insert your question")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Client stopped")
finally:
    sio.disconnect()