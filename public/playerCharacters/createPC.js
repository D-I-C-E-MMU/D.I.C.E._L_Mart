

function setCreatePCErrorText(error) {

    const createPCErrorText = document.querySelector("#create-pc-error-text");
    createPCErrorText.hidden = false;
    createPCErrorText.innerHTML = error;

}

function initCreatePCSubmitButton() {
    const createPCSubmitButton = document.querySelector("#create-pc-submit-btn");

    createPCSubmitButton.addEventListener("click", () => {

        const pcNameInput = document.querySelector("#pc-name-input");
        const pcTierSelect = document.querySelector("#pc-tier-select");

        let pcName = pcNameInput.value.trim();
        console.log(pcName);
        if (pcName.length < 4) {
            setCreatePCErrorText("*Character name must be at least 4 characters long.");
            return;
        }

        let pcTier = pcTierSelect.value;
        console.log(pcTier);
        if (pcTier == "invalid") {
            setCreatePCErrorText("*Please select a tier.");
            return;
        }

        let createCharacterData;
        if (!isAdmin()) {

            createCharacterData = {
                playerID: userUID,
                tierID: pcTier,
                name: pcName,
                createdTimestamp: firebase.firestore.Timestamp.now(),
            }

        }
        else {

            const pcPlayerInput = document.querySelector("#pc-player-select");
            const pcLevelInput = document.querySelector("#pc-level-input");
            const pcGoldInput = document.querySelector("#pc-gold-input");
            const pcCreatedTimestampInput = document.querySelector("#pc-created-timestamp-input");

            let pcPlayerID = pcPlayerInput.value;
            console.log(pcPlayerID);
            if (pcPlayerID == "none") {
                pcPlayerID = null;
            }

            let pcLevel = parseInt(pcLevelInput.value);
            console.log(pcLevel);

            let pcGold = Number(pcGoldInput.value);
            console.log(pcGold);

            let pcCreateTimestamp = Date.parse(pcCreatedTimestampInput.value);
            console.log(pcCreateTimestamp);

            createCharacterData = {
                playerID: pcPlayerID,
                tierID: pcTier,
                name: pcName,
                level: pcLevel,
                gold: pcGold,
                createdTimestamp: pcCreateTimestamp,
                approved: true,
            }
        }

        
        createPlayerCharacterFirestore(createCharacterData).then((characterData) => {
            if (!characterData) {
                alert("Failed to create Character!");
                return;
            }

            // Clear session storage so player characters are requested again
            sessionStorage.removeItem(storagePlayerCharactersID);

            if (isAdmin()) {
                // Returns to player characters list upon success
                window.location.href = playerCharactersURL;
                return;
            }
            // Returns home upon success
            window.location.href = homeURL;
        });

    });
}

function initPlayerCharacterTiers() {
    const pcTierSelect = document.querySelector("#pc-tier-select");

    getPlayerCharacterTiersFirestore().then((playerCharacterTiers) => {
        if (!playerCharacterTiers) {
            alert("Failed to retrieve player character tiers");
            return;
        }

        playerCharacterTiers.forEach((playerCharacterTier) => {
            let option = document.createElement("option");
            option.value = playerCharacterTier.id;
            option.innerHTML = playerCharacterTier.optionDescription;
            pcTierSelect.appendChild(option);
        });
    });
}


window.addEventListener("load", () => {
    initCreatePCSubmitButton();
    initPlayerCharacterTiers();
});
