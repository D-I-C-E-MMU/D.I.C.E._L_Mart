
const adminHomeURL = "/admin/home";
const adminManagementURL = "/admin/manage";

const playerCharactersURL = "/admin/playerCharacters";
const createPlayerCharacterURL = "/admin/playerCharacters/new";
const editPlayerCharacterURL = "/admin/playerCharacters/edit";

const logSheetsURL = "/admin/logSheets";
const editLogSheetURL = "/admin/logSheets/edit"

let onAdminUpdatedCallbacks = [];
let onAdminUpdatedCallbackEmitted = false;

function initAdminManagement() {
    const adminManagementBtn = document.querySelectorAll(".admin-management-btn");
    adminManagementBtn.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = adminManagementURL;
        });
    });
}

function initPlayerCharacters() {
    const playerCharacterBtn = document.querySelectorAll(".pc-btn");
    playerCharacterBtn.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = playerCharactersURL;
        });
    });

}

function initCreatePlayerCharacter() {
    const playerCharacterCreateBtn = document.querySelectorAll(".pc-create-btn");
    playerCharacterCreateBtn.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = createPlayerCharacterURL;
        });
    });
}

function initLogSheets() {
    const logSheetsBtn = document.querySelectorAll(".logs-btn");
    logSheetsBtn.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = logSheetsURL;
        });
    });
}

function onAdminUpdated(admin) {
    onAdminUpdatedCallbackEmitted = true;
    onAdminUpdatedCallbacks.forEach((callback) => {
        callback(admin);
    });
}

function addOnAdminUpdated(callback) {
    onAdminUpdatedCallbacks.push(callback);
    if (onAdminUpdatedCallbackEmitted) {
        callback(admin);
    }
}

window.addEventListener('load', () => {
    initAdminManagement();
    initPlayerCharacters();
    initCreatePlayerCharacter();
    initLogSheets();
});