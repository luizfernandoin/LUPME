import {  } from './firebase.js'
import { alertSuccess, alertError } from "./modal.js";

const colors = [
    'cadetblue',
    'darkgoldenrod',
    'cornflowerblue',
    'darkkhaki',
    'hotpink',
    'gold'
]

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    
    return colors[randomIndex];
}

function validatePassword(password) {
    return (password < 6) ? false : true;
}

function validateEmail(email) {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (regex.test(email)) {
      return true;
    } else {
      alert("Endereço de e-mail inválido");
      return false;
    }
}

function createUser() {
    const username = document.querySelector('[name="usuario"]').value;
    const email = document.querySelector('[name="email"]').value;
    const password = document.querySelector('[name="senha"]').value;
    const color = getRandomColor();

    if (validateEmail(email) === false || validatePassword(password) === false) {
        alertError("Email ou Senha inválidos!")
        fetch('/signup');
    } else {
        fetch('/cadastrar_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, color }),
        })
        .then(response => response.json())
        .then(data => {
        if (data.success) {
            window.location.href = '/';
        } else {
            alertError(data.message)
        }
        })
        .catch(error => {
            alertError(data.message)
        });
    }
}


document.getElementById('btn-cadastro').addEventListener('click', () => {
    createUser()
});