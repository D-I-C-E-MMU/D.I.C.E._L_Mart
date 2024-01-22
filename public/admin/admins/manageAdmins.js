
// Players in this context refer to non admins

function loadAdminsAndPlayers() {
    let getAdmins = getAllAdmins();
    let getPlayers = getAllPlayers();
    Promise.all([getAdmins, getPlayers]).then((pair) => {
        let admins = pair[0];
        let players = pair[1];
        if (admins == null || players == null) {
            console.error("Failed to load admins or players")
            return;
        }
        organizeAdminsAndPlayers(admins, players);
        let adminsTable = document.querySelector("#admins-table");
        let playersTable = document.querySelector("#players-table");
        showTable(adminsTable, admins, "Remove", (adminID) => {
            let name = admins[adminID].name;
            if (confirm(`Are you sure you want to remove an admin: ${name}(${adminID})?`)) {
                removeAdmin(adminID);
            }
        });
        showTable(playersTable, players, "Add", (playerID) => {
            let name = players[playerID].name;
            if (confirm(`Are you sure you want to add an admin: ${name}(${playerID})?`)) {
                addAdmin(playerID);
            }
        });
    });
}

function showTable(table, users, actionName, action) {
    for (let userID in users) {
        let row = table.insertRow(-1);
        let nameCell = row.insertCell(-1);
        let emailCell = row.insertCell(-1);
        let actionCell = row.insertCell(-1);
        nameCell.innerHTML = users[userID].name;
        emailCell.innerHTML = users[userID].email;
        let actionButton = document.createElement("button");
        actionButton.innerHTML = actionName;
        actionButton.addEventListener("click", () => {
            action(userID);
        });
        actionCell.appendChild(actionButton);
    }
}

function organizeAdminsAndPlayers(admins, players) {

    for (let adminID in admins) {
        let adminPlayer = players[adminID];
        if (adminPlayer) {
            admins[adminID].name = adminPlayer.name;
            admins[adminID].email = adminPlayer.email;
            // Remove admin from the players list
            delete players[adminID];
        }
        else {
            admins[adminID].player = {
                "name": adminID,
                "email": "Unknown"
            };
        }
    }

}

function getAllAdmins() {
    return getAdminsFirestore().then((admins) => {

        if (admins) {
            let adminsDict = {};
            admins.forEach((admin) => {
                adminsDict[admin.id] = admin;
            });
            return adminsDict;
        }

        return null;

    });
}

function getAllPlayers() {
    return getPlayersFirestore().then((players) => {
       
        if (players) {
            let playersDict = {};
            players.forEach((player) => {
                playersDict[player.id] = player;
            });
            return playersDict;
        }

        return null;
        
    });
}

function addAdmin(playerID) {
    createAdminFirestore(playerID).then((adminData) => {

        if (adminData) {
            // Refresh
            window.location.reload();
        }

    });
}

function removeAdmin(adminID) {
    deleteAdminFirestore(adminID).then((adminData) => {

        if (adminData) {
            if (adminData.id == admin.id) {
                localStorage.removeItem(storageAdminID);
            }
            // Refresh
            window.location.reload();
        }

    });
}

window.addEventListener('load', () => {
    loadAdminsAndPlayers();
});
