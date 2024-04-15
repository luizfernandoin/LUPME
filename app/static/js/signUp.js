import { validateEmail, validatePassword } from './firebase.js'
import { alertSuccess, alertError } from "./modal.js";

function createUser() {
    const username = document.querySelector('[name="usuario"]').value;
    const email = document.querySelector('[name="email"]').value;
    const password = document.querySelector('[name="senha"]').value;

    if (validateEmail(email) === false || validatePassword(password) === false) {
        alertError("Email ou Senha inválidos!")
        fetch('/signup');
    } else {
        fetch('/cadastrar_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
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