
let playerCharacters = [];

function retrievePlayerCharactersFromStorage() {
    let playerCharactersStr = localStorage.getItem(storagePlayerCharactersID);
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
        localStorage.removeItem(storagePlayerCharactersID);
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
    localStorage.setItem(storagePlayerCharactersID, JSON.stringify(playerCharactersData));
}

function loadOwningPlayerCharacters(playerID, onSuccessCallback) {
    // Local Storage
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
