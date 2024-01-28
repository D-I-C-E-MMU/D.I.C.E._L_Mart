
let playerCharacterTiersQuerying = false;
let playerCharacterTiers = null;

function loadPlayerCharacters() {
    getPlayerCharactersFirestore().then((playerCharacters) => {

        joinAndSegregateLogSheetsWithPlayerAndCharacter(playerCharacters).then((segregatedPCs) => {

            let pendingPCs = segregatedPCs.pendingPCs;
            let unownedPCs = segregatedPCs.unownedPCs;
            let validPCs = segregatedPCs.validPCs;

            let approvingTable = document.querySelector("#pc-pending-table");
            let unownedTable = document.querySelector("#pc-unowned-table");
            let validTable = document.querySelector("#pc-valid-table");

            showTable(approvingTable, pendingPCs, 0);
            showTable(unownedTable, unownedPCs, 1);
            showTable(validTable, validPCs, 2);

        });

    });

}

function showTable(table, playerCharacters, type) {
    playerCharacters.forEach((playerCharacter) => {
        let remarks = "";
        if (playerCharacter.remarks) {
            remarks = playerCharacter.remarks;
            if (playerCharacter.additionalRemarks) {
                remarks += "\n" + playerCharacter.additionalRemarks;
            }
        }
        else if (playerCharacter.additionalRemarks) {
            remarks = playerCharacter.additionalRemarks;
        }

        switch (type) {
            case 0:
                // Approving Table
                tableInserter(table, [
                    playerCharacter.player.name,
                    playerCharacter.name,
                    retrieveTierDescription(playerCharacter.tierID),
                    remarks,
                ]);
                break;

            case 1:
                // Unowned Table
                tableInserter(table, [
                    playerCharacter.name,
                    playerCharacter.level,
                    playerCharacter.gold,
                    remarks,
                ]);
                break;

            case 2:
                // Valid Table
                tableInserter(table, [
                    playerCharacter.player.name,
                    playerCharacter.name,
                    playerCharacter.level,
                    playerCharacter.gold,
                    remarks,
                ]);
                break;
        }

        let row = table.rows[table.rows.length - 1];

        let editCell = row.insertCell(-1);
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.addEventListener("click", () => {
            window.location.href = `${editPlayerCharacterURL}/${playerCharacter.id}`;
        });
        editCell.appendChild(editBtn);

    });
}

function retrieveTierDescription(tierID) {
    // Return Tier description if available
    if (playerCharacterTiers) {
        if (!playerCharacterTiers[tierID]) {
            return tierID;
        }
        return playerCharacterTiers[tierID].optionDescription;  // TODO Change to custom description for admin display?
    }

    // If is querying, skip
    if (playerCharacterTiersQuerying) {
        return tierID;
    }

    // Make tier query
    playerCharacterTiersQuerying = true;
    getPlayerCharacterTiersFirestore().then((tiers) => {
        playerCharacterTiers = {};
        tiers.forEach((tier) => {
            playerCharacterTiers[tier.id] = tier;
        });
        playerCharacterTiersQuerying = false;

        let pendingTable = document.querySelector("#pc-pending-table");
        for (let row of pendingTable.rows) {
            row.cells[2].innerHTML = retrieveTierDescription(row.cells[2].innerHTML);
        }
    });

    return tierID;
}

function joinAndSegregateLogSheetsWithPlayerAndCharacter(playerCharacters) {
    let pendingPCs = [], unownedPCs = [], validPCs = []

    let playerIDs = {};

    playerCharacters.forEach((playerCharacter) => {

        if (playerCharacter.playerID) {
            playerIDs[playerCharacter.playerID] = true;
        }

    });

    let query = getPlayersInFirestore(Object.keys(playerIDs)).then((players) => {

        playerCharacters.forEach((playerCharacter) => {

            if (!playerCharacter.playerID) {
                if (!playerCharacter.approved) {
                    playerCharacter.additionalRemarks = "Unowned and Unapproved!";
                    playerCharacter.player = {
                        name: "Unowned",
                    }
                    pendingPCs.push(playerCharacter);
                }
                else {
                    unownedPCs.push(playerCharacter);
                }

                return;
            }

            if (players[playerCharacter.playerID]) {
                playerCharacter.player = players[playerCharacter.playerID];
            }
            else {
                playerCharacter.player = {
                    name: playerCharacter.playerID,
                }
                playerCharacter.additionalRemarks = "Player ID cannot be found!";
            }
            if (!playerCharacter.approved) {
                pendingPCs.push(playerCharacter);
            }
            else {
                validPCs.push(playerCharacter);
            }
        });

    });

    return query.then(() => {
        return {
            pendingPCs: pendingPCs,
            unownedPCs: unownedPCs,
            validPCs: validPCs
        };
    });
};

window.addEventListener('load', () => {
    loadPlayerCharacters();
});
