import { alertSuccess, alertError } from "./alert.js";

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

function validateEmail(email) {
  let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (regex.test(email)) {
    return true;
  } else {
    alert("Endereço de e-mail inválido");
    return false;
  }
}

function validatePassword(password) {
  return (password < 6) ? false : true;
}

function verificacao() {
  sendEmailVerification(auth.currentUser);
}

// function createUser() {
//   
//   if (validateEmail(email) === false || validatePassword(password) === false) {
//     alertError("Email ou Senha inválidos!")
//     fetch('/signup');
//   } else {
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         const user = userCredential.u
//         verificacao();
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         alertError("Mensagem de erro: ", + errorMessage)
//       });
//   }
// }

// function login(event) {
//   const email = document.querySelector('[name="email"]').value;
//   const password = document.querySelector('[name="senha"]').value;


//   if (validateEmail(email) === false || validatePassword(password) === false) {
//     alert("Email ou Senha inválidos!");
//     fetch('/login');
//   } else {
//     fetch('/autenticar', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     })

//     // signInWithEmailAndPassword(auth, email, password)
//     // .then((userCredential) => {
//     //   const user = userCredential.user;
//     // })
//     // .catch((error) => {
//     //   const errorCode = error.code;
//     //   const errorMessage = error.message;
//     //   alert("Mensagem de erro: " + errorMessage);
//     // });
//   }
// }

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

function getMessages(roomID) {
  return new Promise((resolve, reject) => {
    const db = ref(database);
    
    get(child(db, 'rooms/' + roomID))
      .then((snapshot) => {
        resolve(snapshot.val());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { database, createRoom, getRooms, getMessages, validateEmail, validatePassword }