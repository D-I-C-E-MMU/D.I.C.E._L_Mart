
let playerCharacter = null;

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
    let pcNameText = document.querySelector("#pc-name-text");
    pcNameText.innerHTML += playerCharacter.name;
    
    let pcPlayerNameText = document.querySelector("#pc-player-name-text");

    if (playerCharacter.player) {
        pcPlayerNameText.innerHTML += playerCharacter.player.name;
    }
    else {
        pcPlayerNameText.innerHTML += "Not Owned";
    }
}

function getManagingPlayerCharacter(playerCharacterID) {
    getPlayerCharacterFirestore(playerCharacterID).then((playerCharacterData) => {

        if (!playerCharacterData) {
            alert(`Failed to retrieve Player Character ${playerCharacterID}`);
            return;
        }

        playerCharacter = playerCharacterData;
        let promise = appendPlayerToPlayerCharacter(playerCharacterData);

        if (promise) {
            promise.then(() => {
                populatePlayerCharacterInfo(playerCharacterData);
            })
        }
        else {
            populatePlayerCharacterInfo(playerCharacterData);
        }

    });
}

function appendPlayerToPlayerCharacter(playerCharacter) {
    if (!playerCharacter.playerID) {
        return null;
    }

    return getPlayerFirestore(playerCharacter.playerID).then((player) => {
        if (player) {
            playerCharacter.player = player;
            return playerCharacter;
        }
        return null;
    });
}

window.addEventListener('load', () => {
    let playerCharacterID = tryGetPlayerCharacterIDFromURL();
    if (!playerCharacterID) {
        return;
    }
    getManagingPlayerCharacter(playerCharacterID);
});


