import { alertSuccess, alertError, ModalLogin, ModalCreateRoom } from "./modal.js";
import { createRoom, getRooms, removeRoom } from './firebase.js'

const socket = io('http://127.0.0.1:5000/');
const authInfo = window.authInfo;
let activeRoom;
let roomContainer = document.querySelector(".rooms-room");


async function tratarRooms() {
    try {
        roomContainer.innerHTML = "";
        const roomsData = await getRooms();
        for (const child in roomsData) {
            renderRoom(roomsData[child].name, roomsData[child].description, child, roomsData[child].adm)
        }
    } catch (error) {
        alertError(error);
    }
}

function getMessages(id) {
    clearChatScreen();

    socket.emit('join', {
        room: activeRoom
    })

}
    
//Função que renderizará na tela a mensagem enviada pelo usuario.
function addToChat(data) {
    console.log(data)
    const chat = document.querySelector(".chat-messages");
    const messageDiv = document.createElement("div");
    const userName = document.createElement("span");
    userName.classList.add("user-name");

    if (data.email != authInfo.email) {
        messageDiv.classList.add("message-other");
        userName.classList.add("user-name");
        userName.textContent = data.author;
        userName.style.color = data.color;

        messageDiv.appendChild(userName);
    } else {
        messageDiv.classList.add("message-self");
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    messageDiv.innerHTML += data.message.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    chat.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chat = document.querySelector(".chat-messages");
    chat.scrollTop = chat.scrollHeight;
}

function clearChatScreen() {
    // Remover elementos HTML que representam as mensagens da sala atual
    const chat = document.querySelector(".chat-messages");
    chat.innerHTML = ""; // Isso remove todos os elementos filhos de .messages
}

function renderRoom(name, description, id, adm) {
    const container = document.querySelector(".rooms-room");

    var roomDiv = document.createElement("div");
    roomDiv.className = "room-rooms";

    var infoDiv = document.createElement("div");
    infoDiv.className = "info-div";

    roomDiv.setAttribute("data-room-id", id);
    roomDiv.addEventListener("click", () => {
        const messageForm = document.querySelector('.message-form');
        const lupmeDesc = document.querySelector('.lupme-desc');

        lupmeDesc.classList.add('hidden');
        messageForm.classList.remove('hidden');
        const mainRooms = document.querySelectorAll('.room-rooms');
        mainRooms.forEach(room => room.classList.remove("active"));
        const clickedRoom = document.querySelector(`.room-rooms[data-room-id="${id}"]`);
        if (clickedRoom) {
            clickedRoom.classList.add("active");
        }

        activeRoom = id;
        getMessages()
    });

    var imagemRoom = document.createElement("div");
    imagemRoom.className = "imagem-room";

    var img = document.createElement("img");
    img.src = "../static/src/hacker.png";
    img.alt = "";

    var descRoom = document.createElement("div");
    descRoom.className = description;

    var titleRoom = document.createElement("h2");
    titleRoom.className = "title-room";
    titleRoom.textContent = name;

    var statusRoom = document.createElement("p");
    statusRoom.className = "status-room";
    statusRoom.textContent = description;

    var trashIcon = document.createElement("i");
    trashIcon.className = "bi bi-trash3";

    // Adicionando elementos criados ao DOM
    imagemRoom.appendChild(img);
    descRoom.appendChild(titleRoom);
    descRoom.appendChild(statusRoom);

    infoDiv.appendChild(imagemRoom);
    infoDiv.appendChild(descRoom);
    roomDiv.appendChild(infoDiv)

    if (authInfo.localId == adm) {
        roomDiv.appendChild(trashIcon);

        trashIcon.addEventListener('click', () => {
            const roomId = trashIcon.parentElement.getAttribute('data-room-id');
            removeRoom(roomId);
            
            socket.emit('removeRoom', roomId);
        })
    }

    container.append(roomDiv);
}

socket.on('roomRemoved', (roomId) => {
    const roomToRemove = document.querySelector(`.room-rooms[data-room-id="${roomId}"]`);
    if (roomToRemove) {
        if (activeRoom === roomId) {
            clearChatScreen();
            const messageForm = document.querySelector('.message-form');
            const lupmeDesc = document.querySelector('.lupme-desc');

            lupmeDesc.classList.remove('hidden');
            messageForm.classList.add('hidden');
        }
        roomToRemove.remove();
    }
});

//Realiza uma coneção da nossa instancia socket, enviando a mensagem para o servidor que o usuario foi conectado. 
socket.on('connect', () => {
    tratarRooms();
});

//Cria um evento da instancia socket (getMessage), responsavel por receber a mensagem do backend. 
socket.on('getMessage', (data) => {
    addToChat(data) //Aciona a função addToChat enviando a mensagem como parametro.
})

//recebe do evento message todas as mensagens contidas no array ([{nome: , message: }])
socket.on('message', (msgs) => {
    msgs.forEach(msg => {
        addToChat(msg);
        // Adicione aqui a lógica necessária para processar cada mensagem
    });
})

socket.on('newRoom', (data) => {
    renderRoom(data.name, data.description, data.id, data.adm);
});




//Esta selecionando o primeiro form e manipulando o evento de submit através de uma callback(passando uma função como argumento).
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); //Impede que o evento siga seu fluxo normal, refresh.
    
    //Manda uma mensagem para o Backend, no qual sera recebida pela função sendMessage, contendo um objeto com as chaves nome e message.
    socket.emit('sendMessage', {
        message: event.target[0].value, 
        room: activeRoom
    })

    //Apos o envio os campos devem ser setados para vázio.
    event.target[0].value = "";
})

document.querySelector('.round-button').addEventListener('click', async () => {
    try {
        const roomData = await ModalCreateRoom();
        if (roomData && roomData.title && roomData.description) {
            const { title, description } = roomData;
            const id = createRoom(title, description, authInfo);

            // Emitir evento para o servidor informando sobre o novo room
            socket.emit('getRoom', id);
        } else {
            // Tratar o caso em que os dados da sala não estão disponíveis
            console.error('Os dados da sala não estão disponíveis.');
        }
    } catch (error) {
        // Tratar erros, se houver algum
        console.error('Erro ao criar sala:', error);
    }
});


