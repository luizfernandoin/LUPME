import { alertError } from "./modal.js";

import { 
  initializeApp
 } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";

import {
  getDatabase, 
  ref, 
  set, 
  update, 
  onValue, 
  child, 
  get, 
  push 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyB2HTw3pp2mYHOgMg6vukc0Ir7Bk_Q8UN8",
  authDomain: "lupme-b6c1a.firebaseapp.com",
  databaseURL: "https://lupme-b6c1a-default-rtdb.firebaseio.com",
  projectId: "lupme-b6c1a",
  storageBucket: "lupme-b6c1a.appspot.com",
  messagingSenderId: "730369566069",
  appId: "1:730369566069:web:f4915000514adc216b9f3c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


function createRoom(roomName, roomDescription, auth_info) {
  auth.currentUser = auth_info
  const roomsRef = ref(database, 'rooms')

  const newRoomRef = push(roomsRef);
  const roomId = newRoomRef.key;
  const roomRef = ref(database, `rooms/${roomId}`);
  const messagesRef = ref(database, `rooms/${roomId}/messages`);
  const usersRef = ref(database, `rooms/${roomId}/users`);
  const currentUser = auth.currentUser;


  if (currentUser) {
    const roomData = {
      name: roomName,
      description: roomDescription,
    };
    
    set(roomRef, roomData);
    set(usersRef, { [currentUser.localId]: true });

    return roomId;
  } else {
    alertError("Usuário não autenticado.");
  }
}

function getRooms() {
  return new Promise((resolve, reject) => {
    const db = ref(database);
    
    get(child(db, 'rooms'))
      .then((snapshot) => {
        resolve(snapshot.val());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function join(roomId) {
  return new Promise((resolve, reject) => {
    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    
    // Observador de mudança de valor para as mensagens da sala
    onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      resolve(messages);
    }, {
      onlyOnce: true
    });
  });

}

export { database, createRoom, getRooms, join }