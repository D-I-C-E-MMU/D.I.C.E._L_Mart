

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
        playerCharacterTier.innerHTML = playerCharacterData.tier;
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


addOnPlayerUpdated((player) => {
    loadOwningPlayerCharacters(player.id, showPlayerCharacters);
})
