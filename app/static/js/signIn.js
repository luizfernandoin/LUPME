import {  } from './firebase.js'
import { alertSuccess, alertError, ModalLogin } from "./modal.js";


function login() {
    const email = document.querySelector('[name="email"]').value;
    const password = document.querySelector('[name="senha"]').value;
  
    fetch('/autenticar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        ModalLogin();
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    } else {
        alertError('E-mail ou senha inválidos!')
    }
    })
    .catch(error => {
        alertError('E-mail ou senha inválidos!')
    });
}

document.getElementById('btn-login').addEventListener('click', () => {
    login()
});
