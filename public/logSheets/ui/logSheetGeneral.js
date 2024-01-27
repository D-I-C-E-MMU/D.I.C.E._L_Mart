
const createLogSheetURL = "/logSheets/new";

function initLogSheetButtons() {
    const createLogSheetButtons = document.querySelectorAll(".create-log-sheet-btn");
    createLogSheetButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = createLogSheetURL;
        })
    });
}

initLogSheetButtons();
