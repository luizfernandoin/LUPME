import { validateEmail, validatePassword } from './firebase.js'
import { alertSuccess, alertError } from "./alert.js";


function login() {
    const email = document.querySelector('[name="email"]').value;
    const password = document.querySelector('[name="senha"]').value;
  
    if (validateEmail(email) === false || validatePassword(password) === false) {
        alert("Email ou Senha inválidos!");
        return;
    }
  
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
        window.location.href = '/';
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

document.getElementById('').addEventListener('')