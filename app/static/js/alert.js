
function alertSuccess(msg) {
    Swal.fire({
        title: 'Success!',
        text: msg,
        icon: 'success',
        timer: 1500,
    })
}

function alertError(msg) {
    Swal.fire({
        title: 'Erro!',
        text: msg,
        icon: 'error',
        timer: 1500,
    })
}

export { alertSuccess, alertError }