
let playerCharacters = [];

function showPlayerCharacters(playerCharactersData) {

    const playerCharacterContainer = document.querySelector("#player-character-container");
    
    playerCharacterContainer.innerHTML = "";

    if (!playerCharactersData) {
        console.log("Failed to retrieve player character data!");
        return;
    }

    if (playerCharactersData.length == 0) {
        playerCharacterContainer.innerHTML = "No Player Characters";
        return;
    }

    for (let playerCharacterData of playerCharactersData) {
        let playerCharacterDiv = document.createElement("div");
        playerCharacterDiv.classList.add("player-character");

        // Name
        let playerCharacterName = document.createElement("p");
        playerCharacterName.innerHTML = playerCharacterData.name;
        playerCharacterDiv.appendChild(playerCharacterName);

        // Tier
        let playerCharacterTier = document.createElement("p");
        playerCharacterTier.innerHTML = playerCharacterData.tierID;
        playerCharacterDiv.appendChild(playerCharacterTier);

        // Level
        let playerCharacterLevel = document.createElement("p");
        playerCharacterLevel.innerHTML = playerCharacterData.level;
        playerCharacterDiv.appendChild(playerCharacterLevel);

        // Gold
        let playerCharacterGold = document.createElement("p");
        playerCharacterGold.innerHTML = playerCharacterData.gold;
        playerCharacterDiv.appendChild(playerCharacterGold);

        playerCharacterContainer.appendChild(playerCharacterDiv)
    }

}


function retrievePlayerCharactersFromStorage() {
    let playerCharactersStr = sessionStorage.getItem(storagePlayerCharactersID);
    if (!playerCharactersStr) {
        return null;
    }
    let playerCharactersData = JSON.parse(playerCharactersStr);
    if (playerCharactersData) {
        let allValid = true;
        // Check all player characters data
        for (let playerCharacterData of playerCharactersData) {
            if (!listHasAllElements(Object.keys(playerCharacterData), validPlayerCharacterKeys)) {
                allValid = false;
                break;
            }
        };
        // If all valid, return characters data
        if (allValid) {
            return playerCharactersData;
        }
        // Remove invalid data
        sessionStorage.removeItem(storagePlayerCharactersID);
    }
    return null;
}

// Firestore Read Get
function retrievePlayerCharactersThroughFirebase(playerID) {
    return playerCharactersDB.where("playerID", "==", playerID).get().then((playerCharacterDocs) => {

        let playerCharactersData = [];
        playerCharacterDocs.forEach((playerCharacterDoc) => {
            let playerCharacterData = playerCharacterDoc.data();
            playerCharacterData.id = playerCharacterDoc.id;
            playerCharactersData.push(playerCharacterData);
        });
        return playerCharactersData;

    }).catch((error) => {
        console.error(`Player Characters for ${playerID} failed to retrieve.`);
        console.error(error);
        return null;
    });
}

function savePlayerCharactersToStorage(playerCharactersData) {
    sessionStorage.setItem(storagePlayerCharactersID, JSON.stringify(playerCharactersData));
}

// Player characters data are cached in the session storage
function loadOwningPlayerCharacters(playerID, onSuccessCallback) {
    // Session Storage
    let playerCharactersData = retrievePlayerCharactersFromStorage();
    if (playerCharactersData) {
        playerCharacters = playerCharactersData;
        if (onSuccessCallback) onSuccessCallback(playerCharactersData);
        return;
    }
    // Firebase
    retrievePlayerCharactersThroughFirebase(playerID).then((playerCharactersData) => {
        if (playerCharactersData) {
            playerCharacters = playerCharactersData;
            savePlayerCharactersToStorage(playerCharactersData);
            if (onSuccessCallback) onSuccessCallback(playerCharactersData);
        }
    });
}


addOnPlayerUpdated((player) => {
    loadOwningPlayerCharacters(player.id, showPlayerCharacters);
})
