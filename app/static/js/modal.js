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
    Swal.fire({
        title: "<strong>ROOM</strong>",
        icon: "info",
        html: `
          You can use <b>bold text</b>,
          <a href="#">links</a>,
          and other HTML tags
        `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
          <i class="fa fa-thumbs-up"></i> Great!
        `,
        confirmButtonAriaLabel: "Thumbs up, great!",
        cancelButtonText: `
          <i class="fa fa-thumbs-down"></i>
        `,
        cancelButtonAriaLabel: "Thumbs down"
    });
}

function ModalDeleted() {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
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
        timer: 3000,
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

export { alertSuccess, alertError, ModalLogin }