
let playerCharacters = null;
let logSheets = null;

function setCreateLogSheetErrorText(error) {

    const createLogSheetErrorText = document.querySelector("#create-log-error-text");
    createLogSheetErrorText.hidden = false;
    createLogSheetErrorText.innerHTML = error;

}

function initCreateLogSheetButton() {
    const createLogSheetSubmitButton = document.querySelector("#create-log-submit-btn");

    if (!createLogSheetSubmitButton) {
        return;
    }

    createLogSheetSubmitButton.addEventListener("click", () => {

        let createLogSheetData = validateLogSheetData();
        if (createLogSheetData.error) {
            setCreateLogSheetErrorText(createLogSheetData.error);
            return;
        }

        createLogSheetFirestore(createLogSheetData).then((logSheetData) => {
            if (!logSheetData) {
                alert("Failed to create Log Sheet!");
                return;
            }

            // Returns to log sheets list upon success
            window.location.href = homeURL;
        });

    });
}

function validateLogSheetData() {

    const logCharacterSelect = document.querySelector("#log-character-select");
    const logSessionDateInput = document.querySelector("#log-session-date-input");
    const logLevelInput = document.querySelector("#log-level-input");
    const logGoldInput = document.querySelector("#log-gold-input");
    const logRemarksInput = document.querySelector("#log-remarks-input");

    let logCharacterID = logCharacterSelect.value;
    if (logCharacterID == "invalid") {
        return {
            error: "*Please select a character.",
        };
    }

    logSessionDate = logSessionDateInput.value;
    if (logSessionDate === "") {
        return {
            error: "*Please input a session date.",
        };
    }

    let logLevel = parseInt(logLevelInput.value);
    if (isNaN(logLevel) || logLevel <= 0 || logLevel > 20) {
        return {
            error: "*Level must be between 1 and 20.",
        };
    }

    let logGold = Number(logGoldInput.value);
    if (isNaN(logGold)) {
        return {
            error: "*Please input a valid gold amount.",
        };
    }

    let logSheetRemarks = logRemarksInput.value;

    let createLogSheetData = {
        playerCharacterID: logCharacterID,
        sessionDate: logSessionDate,
        level: logLevel,
        gold: logGold,
        createdTimestamp: firebase.firestore.Timestamp.now(),
        remarks: logSheetRemarks,
    }

    return createLogSheetData;
}

function initPlayerCharacters() {

    const logCharacterSelect = document.querySelector("#log-character-select");

    getPlayerOwnedApprovedPlayerCharactersFirestore(player.id).then((characters) => {
        if (!characters) {
            alert("Failed to retrieve player characters");
            return;
        }

        playerCharacters = {};
        characters.forEach((character) => {
            playerCharacters[character.id] = character;
            let option = document.createElement("option");
            option.value = character.id;
            option.innerHTML = character.name;
            logCharacterSelect.appendChild(option);
        });

        let playerCharacterIDs = Object.keys(playerCharacters);
        if (playerCharacterIDs.length == 0) {
            return;
        }

        getAllPlayerCharacterLogSheetsFirestore(playerCharacterIDs).then((logs) => {
            if (!logs) {
                alert("Failed to retrieve player character log sheets");
                return;
            }

            logSheets = logs;
            updateLogSheetStatus();
        });

    });

    logCharacterSelect.addEventListener("change", () => {

        const character = playerCharacters[logCharacterSelect.value];
        if (!character) {
            return;
        }

        const initialLevelText = document.querySelector("#initial-level-text");
        const logLevelInput = document.querySelector("#log-level-input");
        const initialGoldText = document.querySelector("#initial-gold-text");

        initialLevelText.innerHTML = character.level;
        logLevelInput.value = character.level;
        initialGoldText.innerHTML = `${character.gold}gp`;

        updateNettGold();
        updateLogSheetStatus();

    });

    const logGoldInput = document.querySelector("#log-gold-input");
    logGoldInput.addEventListener("change", () => {
        updateNettGold();
    });

}

function updateNettGold() {
    let character = getSelectedCharacter();
    if (!character) {
        return;
    }

    const nettGoldText = document.querySelector("#nett-gold-text");
    const logGoldInput = document.querySelector("#log-gold-input");

    nettGoldText.innerHTML = `${(Number(character.gold) + Number(logGoldInput.value))}gp`;
}

function updateLogSheetStatus() {

    let logStatusPCText = document.querySelector("#log-status-pc-text");
    let logStatusCountText = document.querySelector("#log-status-count-text");

    let character = getSelectedCharacter();
    if (!character) {
        logStatusPCText.innerHTML = "[Select a Character]";
        logStatusCountText.innerHTML = "[Select a Character]";
        return;
    }

    if (!logSheets) {
        logStatusPCText.innerHTML = character.name;
        logStatusCountText.innerHTML = "[Loading...]";
        return;
    }

    logStatusPCText.innerHTML = character.name;
    logStatusCountText.innerHTML = logSheets[character.id].length;

}

function getSelectedCharacter() {

    const logCharacterSelect = document.querySelector("#log-character-select");
    const character = playerCharacters[logCharacterSelect.value];

    return character;
}


window.addEventListener("load", () => {
    initCreateLogSheetButton();
    initPlayerCharacters();
});
