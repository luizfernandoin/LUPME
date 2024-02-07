from flask import Flask
from flask_socketio import SocketIO
import pyrebase

firebaseConfig = {
  "apiKey": "AIzaSyB2HTw3pp2mYHOgMg6vukc0Ir7Bk_Q8UN8",
  "authDomain": "lupme-b6c1a.firebaseapp.com",
  "databaseURL": "https://lupme-b6c1a-default-rtdb.firebaseio.com",
  "projectId": "lupme-b6c1a",
  "storageBucket": "lupme-b6c1a.appspot.com",
  "messagingSenderId": "730369566069",
  "appId": "1:730369566069:web:f4915000514adc216b9f3c"
}

firebase = pyrebase.initialize_app(firebaseConfig)
bd = firebase.database()
auth = firebase.auth()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'armandim2016'
socketio = SocketIO(app)

bd_messages = {}





from .controllers import default