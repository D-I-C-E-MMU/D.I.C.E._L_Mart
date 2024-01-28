
function loadLogSheets() {
    getLogSheetsFirestore().then((logSheets) => {

        joinAndSegregateLogSheetsWithPlayerAndCharacter(logSheets).then((segregatedLogSheets) => {

            let pendingLogSheets = segregatedLogSheets.pendingLogSheets;
            let pastLogSheets = segregatedLogSheets.pastLogSheets;

            let pendingTable = document.querySelector("#log-pending-table");
            let pastTable = document.querySelector("#log-past-table");

            showTable(pendingTable, pendingLogSheets, 0);
            showTable(pastTable, pastLogSheets, 1);

        });

    });

}

function showTable(table, logSheets, type) {
    logSheets.forEach((logSheet) => {
        switch (type) {
            case 0:
                // Pending Approval Table
                tableInserter(table, [
                    logSheet.sessionDate,
                    logSheet.playerCharacter.player.name,
                    logSheet.playerCharacter.name,
                    logSheet.gold,
                    logSheet.level,
                ]);
                break;

            case 1:
                // Past Table
                tableInserter(table, [
                    logSheet.sessionDate,
                    logSheet.playerCharacter.player.name,
                    logSheet.playerCharacter.name,
                    logSheet.gold,
                    logSheet.level,
                ]);
                break;
        }

        let row = table.rows[table.rows.length - 1];

        let editCell = row.insertCell(-1);

        if (logSheet.playerCharacter.playerID == player.id) {
            editCell.innerHTML = "Cannot Edit";
            return;
        }

        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.addEventListener("click", () => {
            window.location.href = `${editLogSheetURL}/${logSheet.id}`;
        });
        editCell.appendChild(editBtn);

    });
}

function joinAndSegregateLogSheetsWithPlayerAndCharacter(logSheets) {

    let pendingLogSheets = [], pastLogSheets = [];

    let playerCharacterIDs = {};
    let playerIDs = {};

    logSheets.forEach((logSheet) => {
        playerCharacterIDs[logSheet.playerCharacterID] = true;
    });

    let query = getPlayerCharactersInFirestore(Object.keys(playerCharacterIDs)).then((playerCharacters) => {

        for (let playerCharacterID in playerCharacters) {
            playerIDs[playerCharacters[playerCharacterID].playerID] = true;
        }

        return getPlayersInFirestore(Object.keys(playerIDs)).then((players) => {
            
            logSheets.forEach((logSheet) => {
                logSheet.playerCharacter = playerCharacters[logSheet.playerCharacterID];
                logSheet.playerCharacter.player = players[logSheet.playerCharacter.playerID];

                if (logSheet.approved) {
                    pastLogSheets.push(logSheet);
                }
                else {
                    pendingLogSheets.push(logSheet);
                }

            });

        });

    });

    return query.then(() => {
        return {
            pendingLogSheets: pendingLogSheets,
            pastLogSheets: pastLogSheets,
        };
    });
};

window.addEventListener('load', () => {
    loadLogSheets();
});
