from app import app, socketio, bd, auth, firebase
from flask import render_template, request, session, redirect, url_for, jsonify
from flask_socketio import emit, join_room

@app.route("/")
def home():  
  if ('usuario_logado' in session and 'auth_info' in session):
    return render_template("chat.html", auth_info=session['auth_info'])
  else:
    return redirect(url_for('login'))

@app.route('/signin')
def login():
  return render_template('sign_in.html', titulo='Sign-in')

@app.route('/signup')
def signup():
  return render_template('sign_up.html', titulo='Sign-up')

@app.route('/autenticar', methods=['POST',])
def autenticar():
  try:
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = auth.sign_in_with_email_and_password(email, password)
    session['usuario_logado'] = True
    session['auth_info'] = auth.current_user
    
    return jsonify({'success': True, 'message': 'Login bem-sucedido'})
  except Exception as e:
    return jsonify({'success': False, 'message': 'Erro ao autenticar'})

@app.route('/cadastrar_user', methods=['POST',])
def cadastrar_user():
  try:
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    color = data.get('color')
    
    user = auth.create_user_with_email_and_password(email, password)
    
    db = firebase.database()
    db.child("users").child(user['localId']).set({
      "username": username,
      "email": email,
      "color": color
    })


    user = auth.sign_in_with_email_and_password(email, password)
    session['usuario_logado'] = email
    
    return jsonify({'success': True, 'message': f'{username} cadastrado!'})

  except Exception as e:
    return jsonify({'success': False, 'message': 'Erro ao cadastrar!'})

#Função que recebe a mensagem enviada pelo usuario.
@socketio.on('sendMessage')
def send_message(data):
  if ("auth_info" in session):
    all_users = bd.child("users").get()
    auth_info = session['auth_info']
    
    if auth_info['localId'] in all_users.val():
      email = all_users.val()[auth_info['localId']]['email']
      username = all_users.val()[auth_info['localId']]['username']
      color = all_users.val()[auth_info['localId']]['color']
      room = data['room']
      message = data['message']
      
      messageData = {
        'message': message,
        'author': username,
        'email': email,
        'color': color
      }
      
      
      bd.child(f'rooms/{room}/messages').push(messageData)
      emit('getMessage', messageData, room=room)

# Função que lida com o evento de entrada na sala
@socketio.on('join')
def handle_join(data):
  if ("auth_info" in session):
    room = data['room']
    join_room(room)
    messagesData = []

    rooms = bd.child('rooms').get()
    # Enviar mensagens para o cliente recém-conectado
    if room in rooms.val() and 'messages' in rooms.val()[room]:
      messages = rooms.val()[room]['messages']
      for message in messages:
        message = {
          'message': messages[message]['message'],
          'author': messages[message]['author'],
          'email': messages[message]['email'],
          'color': messages[message]['color'],
        }
        messagesData.append(message)
      
      emit('message', messagesData, room=request.sid)

@socketio.on('getRoom')
def create_room(id):
  roomData = bd.child(f'rooms/{id}').get().val()
  print(roomData)
  roomData = { 'name': roomData['name'], 'description': roomData['description'], 'id': id, 'adm': roomData['adm']}
  emit('newRoom', roomData, broadcast=True)
  
@socketio.on('removeRoom')
def remove_room(roomId):
  emit('roomRemoved', roomId, broadcast=True)