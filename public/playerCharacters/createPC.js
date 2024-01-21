

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

            const pcLevelInput = document.querySelector("#pc-level-input");
            const pcGoldInput = document.querySelector("#pc-gold-input");
            const pcCreatedTimestampInput = document.querySelector("#pc-created-timestamp-input");

            let pcLevel = parseInt(pcLevelInput.value);
            console.log(pcLevel);

            let pcGold = Number(pcGoldInput.value);
            console.log(pcGold);

            let pcCreateTimestamp = Date.parse(pcCreatedTimestampInput.value);
            console.log(pcCreateTimestamp);

            createCharacterData = {
                playerID: userUID,
                tierID: pcTier,
                name: pcName,
                level: pcLevel,
                gold: pcGold,
                createdTimestamp: pcCreateTimestamp,
                approved: true,
            }
        }

        createNewPlayerCharacterThroughFirebase(createCharacterData).then((characterData) => {
            if (!characterData) {
                alert("Failed to create Character!");
                return;
            }
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

// Firestore Write Create
function createNewPlayerCharacterThroughFirebase(characterData) {

    return playerCharactersDB.add(characterData).then(() => {
        // Clear session storage so player characters are requested again
        sessionStorage.removeItem(storagePlayerCharactersID);
        return characterData;
    }).catch((error) => {
        console.error("Failed to create new player character");
        console.error(error);
        return null;
    });

}

function initPlayerCharacterTiers() {
    const pcTierSelect = document.querySelector("#pc-tier-select");

    getPlayerCharacterTiersThroughFirebase().then((playerCharacterTiers) => {
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

// Firestore Read List
function getPlayerCharacterTiersThroughFirebase() {
    return playerCharacterTiersDB.get().then((playerCharacterTierDocs) => {
        let playerCharacterTiers = [];
        playerCharacterTierDocs.forEach((playerCharacterTierDoc) => {
            let playerCharacterTierData = playerCharacterTierDoc.data();
            playerCharacterTierData.id = playerCharacterTierDoc.id;
            playerCharacterTiers.push(playerCharacterTierData);
        });
        return playerCharacterTiers;
    }).catch((error) => {
        console.error("Failed to retrieve player character tiers");
        console.error(error);
        return null;
    });
}

window.addEventListener("load", () => {
    initCreatePCSubmitButton();
    initPlayerCharacterTiers();
});
