
const createPCURL = "/playerCharacters/new";

function initCreatePCButtons() {
    const createPCButtons = document.querySelectorAll(".create-pc-btn");
    createPCButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = createPCURL;
        })
    });
}

initCreatePCButtons();
