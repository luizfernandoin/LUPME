from app import app, socketio, bd, auth, firebase
from flask import render_template, request, session, redirect, url_for, jsonify
from flask_socketio import emit, join_room


@app.route("/")
def home():
  if (auth.current_user):
    return render_template("chat.html", auth_info=auth.current_user)
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
    session['usuario_logado'] = email
    
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
    
    user = auth.create_user_with_email_and_password(email, password)
    
    db = firebase.database()
    db.child("users").child(user['localId']).set({
      "username": username,
      "email": email
    })


    user = auth.sign_in_with_email_and_password(email, password)
    session['usuario_logado'] = email
    
    return jsonify({'success': True, 'message': f'{username} cadastrado!'})

  except Exception as e:
    return jsonify({'success': False, 'message': 'Erro ao cadastrar!'})

#Função que recebe a mensagem enviada pelo usuario.
@socketio.on('sendMessage')
def send_message(data):
  print("sendMessage")
  if (auth.current_user):
    all_users = bd.child("users").get()
    if auth.current_user['localId'] in all_users.val():
      username = all_users.val()[auth.current_user['localId']]['username']
      room = data['room']
      message = data['message']
      
      messageData = {
        'message': message,
        'author': username,
      }
      
      bd.child(f'rooms/{room}/messages').push(messageData)
      emit('getMessage', messageData)

# Função que lida com o evento de entrada na sala
@socketio.on('join')
def handle_join(data):
  print("Chegou no join")
  if (auth.current_user):
    room = data['room']
    messages = data['messages']
    messages_data = []

    for message_id, message_content in messages.items():
      messages_data.append(message_content)

    emit('message', messages_data, room=request.sid)

@socketio.on('getRoom')
def create_room(id):
  roomData = bd.child(f'rooms/{id}').get().val()
  roomData = { 'name': roomData['name'], 'description': roomData['description'], 'id': id}
  emit('newRoom', roomData, broadcast=True)