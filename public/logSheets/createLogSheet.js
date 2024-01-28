
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
    
    let logSheetGold = Number(logGoldInput.value);

    let logSheetRemarks = logRemarksInput.value;

    let createLogSheetData = {
        playerCharacterID: logCharacterID,
        sessionDate: logSessionDate,
        leveL: logSheetLevel,
        gold: logSheetGold,
        createdTimestamp: firebase.firestore.Timestamp.now(),
        remarks: logSheetRemarks,
    }

    return createLogSheetData;
}

function initPlayerCharacters() {

    getPlayerOwnedPlayerCharactersFirestore(player.id).then((playerCharacters) => {
        if (!playerCharacters) {
            alert("Failed to retrieve player characters");
            return;
        }

        const logCharacterSelect = document.querySelector("#log-character-select");

        playerCharacters.forEach((playerCharacter) => {
            let option = document.createElement("option");
            option.value = playerCharacter.id;
            option.innerHTML = playerCharacter.name;
            logCharacterSelect.appendChild(option);
        });

    });
}


window.addEventListener("load", () => {
    initCreateLogSheetButton();
    initPlayerCharacters();
});
