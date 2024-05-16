const menuToggle = document.querySelector(".menu-toggle");
const containerRooms = document.querySelector(".container-rooms");

menuToggle.addEventListener("click", function() {
    containerRooms.classList.toggle("visible");
    menuToggle.classList.toggle("visible");
});