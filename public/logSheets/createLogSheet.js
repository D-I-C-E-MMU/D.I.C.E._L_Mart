
let playerCharacters = null;

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

    let logSheetLevel = parseInt(logLevelInput.value);
    if (isNaN(pcLevel) || pcLevel <= 0 || pcLevel > 20) {
        return {
            error: "*Level must be between 1 and 20.",
        };
    }
    
    let logSheetGold = Number(logGoldInput.value);
    if (isNaN(pcGold)) {
        return {
            error: "*Please input a valid gold amount.",
        };
    }

    let logSheetRemarks = logRemarksInput.value;

    let createLogSheetData = {
        playerCharacterID: logCharacterID,
        sessionDate: logSessionDate,
        level: logSheetLevel,
        gold: logSheetGold,
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

    });

    logCharacterSelect.addEventListener("change", () => {
        console.log(logCharacterSelect.value);

        const character = playerCharacters[logCharacterSelect.value];
        if (!character) {
            return;
        }

        const logLevelInput = document.querySelector("#log-level-input");
        const logGoldInput = document.querySelector("#log-gold-input");

        logLevelInput.value = character.level;
        logGoldInput.value = character.gold;

    });

}


window.addEventListener("load", () => {
    initCreateLogSheetButton();
    initPlayerCharacters();
});
