
// Players in this context refer to non admins

function loadPlayerCharacters() {
    getAllPlayerCharacters().then((playerCharacters) => {

        joinAndSegregatePlayerCharactersWithPlayer(playerCharacters).then((segregatedPlayerCharacters) => {

            let approvingPlayerCharacters = segregatedPlayerCharacters.approvingPlayerCharacters;
            let unownedPlayerCharacters = segregatedPlayerCharacters.unownedPlayerCharacters;
            let validPlayerCharacters = segregatedPlayerCharacters.validPlayerCharacters;

            let approvingTable = document.querySelector("#player-characters-approval-table");
            let unownedTable = document.querySelector("#player-characters-unowned-table");
            let validTable = document.querySelector("#player-characters-valid-table");

            showTable(approvingTable, approvingPlayerCharacters, 0);
            showTable(unownedTable, unownedPlayerCharacters, 1);
            showTable(validTable, validPlayerCharacters, 2);

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
                    playerCharacter.tierID,
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
    });
}

function tableInserter(table, info) {

    let row = table.insertRow();

    for (let i = 0; i < info.length; i++) {
        let cell = row.insertCell(i);
        cell.innerHTML = info[i];
    };

}

// Firestore Read Get
function getAllPlayerCharacters() {
    return playerCharactersDB.get().then((playerCharacterDocs) => {

        let playerCharacters = [];
        playerCharacterDocs.forEach((playerCharacterDoc) => {
            let playerCharacterData = playerCharacterDoc.data();
            playerCharacterData.id = playerCharacterDoc.id;
            playerCharacters.push(playerCharacterData);
        });
        return playerCharacters;

    }).catch((error) => {
        console.error("Error getting player characters");
        console.error(error);
        return null;
    });
}

function joinAndSegregatePlayerCharactersWithPlayer(playerCharacters) {
    let allFirebaseQueries = [];

    let approvingPlayerCharacters = [], unownedPlayerCharacters = [], validPlayerCharacters = []

    playerCharacters.forEach((playerCharacter) => {

        if (playerCharacter.playerID) {
            let query = playersDB.doc(playerCharacter.playerID).get().then((playerDoc) => {


                if (playerDoc.exists) {
                    playerCharacter.player = playerDoc.data();
                }
                else {
                    playerCharacter.player = {
                        name: playerCharacter.playerID,
                    }
                    playerCharacter.additionalRemarks = "Player ID cannot be found!";
                }
                if (!playerCharacter.approved) {
                    approvingPlayerCharacters.push(playerCharacter);
                }
                else {
                    validPlayerCharacters.push(playerCharacter);
                }

            }).catch((error) => {
                console.error(`Error getting player ${playerCharacter.playerID} for player character ${playerCharacter.id}`);
                console.error(error);
            });

            allFirebaseQueries.push(query);
        }
        else {
            if (!playerCharacter.approved) {
                playerCharacter.additionalRemarks = "Unowned and Unapproved!";
                approvingPlayerCharacters.push(playerCharacter);
            }
            else {
                unownedPlayerCharacters.push(playerCharacter);
            }
        }

    });

    return Promise.all(allFirebaseQueries).then(() => {
        return {
            approvingPlayerCharacters: approvingPlayerCharacters,
            unownedPlayerCharacters: unownedPlayerCharacters,
            validPlayerCharacters: validPlayerCharacters
        };
    });
};

window.addEventListener('load', () => {
    loadPlayerCharacters();
});
