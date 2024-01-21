

function setCreatePCErrorText(error) {

    const createPCErrorText = document.querySelector("#create-pc-error-text");
    createPCErrorText.hidden = false;
    createPCErrorText.innerHTML = error;

}

function initCreatePCSubmitButton() {
    const createPCSubmitButton = document.querySelector("#create-pc-submit-btn");

    const pcNameInput = document.querySelector("#pc-name-input");
    const pcTierSelect = document.querySelector("#pc-tier-select");

    createPCSubmitButton.addEventListener("click", () => {

        let pcName = pcNameInput.value.trim();
        if (pcName.length < 4) {
            setCreatePCErrorText("*Character name must be at least 4 characters long.");
            return;
        }

        let pcTier = pcTierSelect.value;
        if (pcTier == "invalid") {
            setCreatePCErrorText("*Please select a tier.");
            return;
        }

        createNewPlayerCharacterThroughFirebase(pcName, pcTier).then((characterData) => {
            if (!characterData) {
                alert("Failed to create Character!");
                return;
            }
            // Returns home upon success
            window.location.href = homeURL;
        });


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


// Firestore Write Create
function createNewPlayerCharacterThroughFirebase(name, tierID) {
    let characterData = {
        playerID: userUID,
        tierID: tierID,
        name: name,
        createdTimestamp: firebase.firestore.Timestamp.now(),
    }

    return playerCharactersDB.add(characterData).then(() => {
        // Clear local storage so player characters are requested again
        sessionStorage.removeItem(storagePlayerCharactersID);
        return characterData;
    }).catch((error) => {
        console.error("Failed to create new player character");
        console.error(error);
        return null;
    });
}

window.addEventListener("load", () => {
    initCreatePCSubmitButton();
    initPlayerCharacterTiers();
});
