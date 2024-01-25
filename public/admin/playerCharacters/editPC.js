
let playerCharacter = null;

function setEditPCErrorText(error) {

    const editPCErrorText = document.querySelector("#edit-pc-error-text");
    editPCErrorText.hidden = false;
    editPCErrorText.innerHTML = error;

}

function initEditPCSubmitButton() {
    const editPCSubmitButton = document.querySelector("#edit-pc-submit-btn");

    editPCSubmitButton.addEventListener("click", () => {

        let editCharacterData = validatePCData();
        if (editCharacterData.error) {
            setEditPCErrorText(editCharacterData.error);
            return;
        }

        updatePlayerCharacterFirestore(playerCharacter.id, editCharacterData).then((characterData) => {
            if (!characterData) {
                alert("Failed to edit Character!");
                return;
            }

            // Reloads the window upon success
            window.location.reload();
        });

    });
}

function initApplyTierBonusesButton() {
    const applyTierBonusesButton = document.querySelector("#pc-tier-apply-btn");

    applyTierBonusesButton.addEventListener("click", () => {
        let pcTierSelect = document.querySelector("#pc-tier-select");
        let tierID = pcTierSelect.value;
        if (playerCharacterTiers[tierID]) {
            let tier = playerCharacterTiers[tierID];

            let pcLevelInput = document.querySelector("#pc-level-input");
            let pcGoldInput = document.querySelector("#pc-gold-input");

            pcLevelInput.value = tier.level;
            pcGoldInput.value = tier.gold;

        }
    });
}

function tryGetPlayerCharacterIDFromURL() {

    let urlStack = window.location.href.split("/");
    let playerCharacterID = urlStack.pop();
    if (playerCharacterID == "manage") {
        window.location.href = playerCharactersURL;
        return null;
    }
    if (playerCharacterID.length == 0) {
        playerCharacterID = urlStack.pop();
    }
    if (playerCharacterID == "manage") {
        window.location.href = playerCharactersURL;
        return null;
    }

    return playerCharacterID;

}

function populatePlayerCharacterInfo(playerCharacter) {

    let pcNameText = document.querySelector("#pc-name-input");
    pcNameText.value = playerCharacter.name;

    playersPromise.then(() => {
        selectDropdown("#pc-player-select", playerCharacter.playerID);

    });

    playerCharacterTiersPromise.then(() => {
        selectDropdown("#pc-tier-select", playerCharacter.tierID);

    });

    if (playerCharacter.level || playerCharacter.level === 0) {
        let pcLevelInput = document.querySelector("#pc-level-input");
        pcLevelInput.value = playerCharacter.level;
    }

    if (playerCharacter.gold || playerCharacter.level === 0) {
        let pcGoldInput = document.querySelector("#pc-gold-input");
        pcGoldInput.value = playerCharacter.gold;
    }

    let timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    let pcCreatedTimestampInput = document.querySelector("#pc-created-timestamp-input");
    pcCreatedTimestampInput.value = (new Date(playerCharacter.createdTimestamp.toDate() - timezoneOffset)).toISOString().slice(0, -1);

    let pcApprovedInput = document.querySelector("#pc-approved-input");
    pcApprovedInput.checked = playerCharacter.approved ? true : false;

}

function selectDropdown(selectID, value) {
    let select = document.querySelector(selectID);

    if (value) {
        select.value = value;
        // Unknown value
        if (select.value == "") {
            let option = document.createElement("option");
            option.value = value;
            option.innerHTML = `Unknown - ${value}`;
            select.appendChild(option);
            select.value = value;
        }
    }
    else {
        // No value
        select.value = "none";
    }
}

function getEditingPlayerCharacter(playerCharacterID) {
    getPlayerCharacterFirestore(playerCharacterID).then((playerCharacterData) => {

        if (!playerCharacterData) {
            alert(`Failed to retrieve Player Character ${playerCharacterID}`);
            return;
        }

        playerCharacter = playerCharacterData;
        populatePlayerCharacterInfo(playerCharacterData);

    });

}

window.addEventListener('load', () => {
    let playerCharacterID = tryGetPlayerCharacterIDFromURL();
    if (!playerCharacterID) {
        return;
    }
    initEditPCSubmitButton();
    initApplyTierBonusesButton();
    getEditingPlayerCharacter(playerCharacterID);
});


