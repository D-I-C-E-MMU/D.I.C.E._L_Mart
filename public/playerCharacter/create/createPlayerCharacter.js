

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
        })


    });
}



// Firestore Write Create
function createNewPlayerCharacterThroughFirebase(name, tier) {
    let characterData = {
        playerID: userUID,
        name: name,
        tier: tier,
        createdTimestamp: firebase.firestore.Timestamp.now(),
    }

    return playerCharactersDB.add(characterData).then(() => {
        // Clear local storage so player characters are requested again
        localStorage.removeItem(storagePlayerCharactersID);
        return characterData;
    }).catch((error) => {
        console.error(error);
        console.error("Failed to create new player character");
        return null;
    })
}

window.addEventListener("load", () => {
    initCreatePCSubmitButton();
});
