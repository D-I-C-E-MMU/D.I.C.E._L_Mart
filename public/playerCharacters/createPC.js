
let playerCharacterTiersPromise = null;
let playersPromise = null;

let players = null;
let playerCharacterTiers = null;

function setCreatePCErrorText(error) {

    const createPCErrorText = document.querySelector("#create-pc-error-text");
    createPCErrorText.hidden = false;
    createPCErrorText.innerHTML = error;

}

function initCreatePCSubmitButton() {
    const createPCSubmitButton = document.querySelector("#create-pc-submit-btn");

    if (!createPCSubmitButton) {
        return;
    }

    createPCSubmitButton.addEventListener("click", () => {

        let createCharacterData = validatePCData();
        if (createCharacterData.error) {
            setCreatePCErrorText(createCharacterData.error);
            return;
        }

        createPlayerCharacterFirestore(createCharacterData).then((characterData) => {
            if (!characterData) {
                alert("Failed to create Character!");
                return;
            }

            // Clear session storage so player characters are requested again
            // sessionStorage.removeItem(storagePlayerCharactersID);

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

function validatePCData() {

    const pcNameInput = document.querySelector("#pc-name-input");
    const pcTierSelect = document.querySelector("#pc-tier-select");

    let pcName = pcNameInput.value.trim();
    console.log(pcName);
    if (pcName.length < 4) {
        return {
            error: "*Character name must be at least 4 characters long."
        };
    }

    let pcTier = pcTierSelect.value;
    console.log(pcTier);
    if (pcTier == "invalid") {
        return {
            error: "*Please select a tier.",
        };
    }

    let createCharacterData = {
        tierID: pcTier,
        name: pcName,
    }

    if (isAdmin()) {
        const pcPlayerInput = document.querySelector("#pc-player-select");
        const pcLevelInput = document.querySelector("#pc-level-input");
        const pcGoldInput = document.querySelector("#pc-gold-input");
        const pcCreatedTimestampInput = document.querySelector("#pc-created-timestamp-input");
        let pcApprovedInput = document.querySelector("#pc-approved-input");

        let pcPlayerID = pcPlayerInput.value;
        if (pcPlayerID == "none") {
            pcPlayerID = null;
        }

        let pcLevel = parseInt(pcLevelInput.value);

        let pcGold = Number(pcGoldInput.value);

        if (pcCreatedTimestampInput.value === "" ) {
            return {
                error: "*Please input a creation date.",
            };
        }
        let pcCreateTimestamp = firebase.firestore.Timestamp.fromDate(new Date(pcCreatedTimestampInput.value));

        let pcApproved = pcApprovedInput.checked;

        createCharacterData.playerID = pcPlayerID;
        createCharacterData.level = pcLevel;
        createCharacterData.gold = pcGold;
        createCharacterData.createdTimestamp = pcCreateTimestamp;
        createCharacterData.approved = pcApproved;

    }
    else {
        createCharacterData.playerID = userUID;
        createCharacterData.createdTimestamp = firebase.firestore.Timestamp.now();
    }

    return createCharacterData;
}

function initPlayerCharacterTiers() {

    playerCharacterTiersPromise = getPlayerCharacterTiersFirestore().then((tiers) => {
        if (!tiers) {
            alert("Failed to retrieve player character tiers");
            return;
        }

        const pcTierSelect = document.querySelector("#pc-tier-select");

        playerCharacterTiers = {};
        tiers.forEach((tier) => {
            playerCharacterTiers[tier.id] = tier;
            let option = document.createElement("option");
            option.value = tier.id;
            option.innerHTML = tier.optionDescription;
            pcTierSelect.appendChild(option);
        });

        return playerCharacterTiers;

    });
}


function initPlayers() {

    playersPromise = getPlayersFirestore().then((_players) => {
        if (!_players) {
            alert("Failed to retrieve players");
            return;
        }

        const pcPlayerSelect = document.querySelector("#pc-player-select");

        players = {};
        _players.forEach((player) => {
            players[player.id] = player;
            let option = document.createElement("option");
            option.value = player.id;
            option.innerHTML = player.name;
            pcPlayerSelect.appendChild(option);
        });

        return players;

    });
}


window.addEventListener("load", () => {
    initCreatePCSubmitButton();
    initPlayerCharacterTiers();

    if (isAdmin()) {
        initPlayers();
    }
});
