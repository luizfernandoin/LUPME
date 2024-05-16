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

function ModalCreateRoom() {
    return new Promise((resolve, reject) => {
        Swal.fire({
            position: "top",
            title: "Criar Sala",
            text: "A sala que estás prestes a criar será visível para outras pessoas, para que possam acessá-la e interagir.",
            showCloseButton: true,
            html: `
                <div>
                    <p>A sala que estás prestes a criar será visível para outras pessoas, para que possam acessá-la e interagir.</p>
                    <input type="text" class="swal2-input" id="title-input" placeholder="Título da sala" style="width: 80%; box-sizing: border-box;">
                    <textarea class="swal2-textarea" placeholder="Descrição da sala" style="width: 80%; box-sizing: border-box;"></textarea>
                </div>
            `,
            inputValidator: (value) => {
                if (!value) {
                    return "Você precisa fornecer uma descrição!";
                }
            },
            preConfirm: () => {
                const title = document.getElementById("title-input").value;
                const description = document.querySelector(".swal2-textarea").value;
                resolve({ title, description });
            }
        }).then(result => {
            // Se o usuário clicou em "Cancelar", rejeite a promessa
            if (result.dismiss === Swal.DismissReason.cancel) {
                reject('Operação cancelada pelo usuário');
            }
        });
    });
}


function ModalDeleted() {
    Swal.fire({
        title: "Você tem certeza?",
        text: "Você não poderá reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, exclua-o!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "Excluido!",
            text: "Seu arquivo foi excluído.",
            icon: "success"
            });
        }
    });
}

function ModalLogin() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "Login feito com sucesso!"
    });
}

export { alertSuccess, alertError, ModalLogin, ModalCreateRoom }