import socketio
from woo import woo

sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio)

@sio.event
def disconnect(sid):
    print(sid+' is disconnected')

@sio.event
def connect(sid, environ):
    print(sid+' is connected')

@sio.event
def start(sid, data):
    try:
        print(data)
        woo(data, sio, sid)
    finally:
        sio.disconnect(sid)
