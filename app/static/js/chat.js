import { alertSuccess, alertError, ModalLogin } from "./modal.js";
import { createRoom, getRooms, getMessages } from './firebase.js'

const socket = io('http://127.0.0.1:5000');
const authInfo = window.authInfo;
let activeRoom;


window.onload = function() {
    ModalLogin();
    let roomContainer = document.querySelector(".main-rooms");

    async function tratarRooms() {
        try {
            roomContainer.innerHTML = "";
            const roomsData = await getRooms();
            for (const child in roomsData) {
                renderRoom(roomsData[child].name, roomsData[child].description, child)
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
        const chat = document.querySelector(".messages");
    
        var messageDiv = document.createElement("div");
        messageDiv.className = "message";
    
        var userImage = document.createElement("img");
        userImage.src = "../static/src/hacker.png";
        userImage.alt = "User Image";
        userImage.className = "user-image";
    
        var messageContent = document.createElement("div");
        messageContent.className = "message-content";
    
        var userName = document.createElement("div");
        userName.className = "user-name";
        userName.textContent = data.author;

        var userMessage = document.createElement("div");
        userMessage.className = "user-message";
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        userMessage.innerHTML = data.message.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    
        // Adicionando elementos criados ao DOM
        messageContent.appendChild(userName);
        messageContent.appendChild(userMessage);
    
        messageDiv.appendChild(userImage);
        messageDiv.appendChild(messageContent);
    
        chat.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        const chat = document.querySelector(".messages");
        chat.scrollTop = chat.scrollHeight;
    }
    

    function clearChatScreen() {
        // Remover elementos HTML que representam as mensagens da sala atual
        const chat = document.querySelector(".messages");
        chat.innerHTML = ""; // Isso remove todos os elementos filhos de .messages
    }
    

    function renderRoom(name, description, id) {
        const container = document.querySelector(".main-rooms");
    
        var roomDiv = document.createElement("div");
        roomDiv.className = "room-rooms";

        roomDiv.setAttribute("data-room-id", id);
        roomDiv.addEventListener("click", () => {
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
        statusRoom.textContent = name;
    
        // Adicionando elementos criados ao DOM
        imagemRoom.appendChild(img);
        descRoom.appendChild(titleRoom);
        descRoom.appendChild(statusRoom);
    
        roomDiv.appendChild(imagemRoom);
        roomDiv.appendChild(descRoom);
    
        container.append(roomDiv);
    }
    
    //Realiza uma coneção da nossa instancia socket, enviando a mensagem para o servidor que o usuario foi conectado. 
    socket.on('connect', () => {
        tratarRooms();
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
        renderRoom(data.name, data.description, data.id);
    });
}


document.querySelector('.round-button').addEventListener('click', () => {
    const roomName = prompt('Digite o nome da sala:');
    const id = createRoom(roomName, "teste", authInfo);

    // Emitir evento para o servidor informando sobre o novo room
    socket.emit('getRoom', id);
})
